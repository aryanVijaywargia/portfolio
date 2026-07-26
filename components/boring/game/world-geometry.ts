import type { BhopalMapData, DistrictId, MapFeatureLine, MapFeaturePolygon, NavigationGraph, Point2 } from "lib/boring/map/types";
import { createSeededRandom } from "lib/boring/simulation/fixed-step";
import * as THREE from "three";

export type BuildingSpec = {
  id: string;
  districtId: DistrictId;
  position: Point2;
  size: [number, number, number];
  color: string;
  rotation: number;
};

const ROAD_COLORS: Record<string, THREE.Color> = {
  motorway: new THREE.Color("#48464a"),
  trunk: new THREE.Color("#414045"),
  primary: new THREE.Color("#38383e"),
  secondary: new THREE.Color("#35353b"),
  tertiary: new THREE.Color("#323238"),
  residential: new THREE.Color("#39373a"),
  service: new THREE.Color("#403d3d"),
  railway: new THREE.Color("#26272b"),
};

const DISTRICT_BUILDING_COLORS: Record<DistrictId, string[]> = {
  lakefront: ["#d8c6a2", "#c9b58e", "#e0d0ae", "#b8a889"],
  "old-city": ["#c98264", "#d69b70", "#b86d57", "#d3ad7d", "#a95e50"],
  "shyamla-hills": ["#a7a17c", "#c2ad83", "#8e956d", "#d0bb91"],
  "new-bhopal": ["#aaa28e", "#c0b7a0", "#918b7e", "#c8bea7", "#9d927d"],
};

export const pointInPolygon = ([x, z]: Point2, polygon: Point2[]) => {
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
    const [xi, zi] = polygon[index];
    const [xj, zj] = polygon[previous];
    const crosses = zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi || 1e-9) + xi;
    if (crosses) inside = !inside;
  }
  return inside;
};

export const createStripGeometry = (
  lines: MapFeatureLine[],
  options: { widthScale?: number; y?: number; singleColor?: string } = {}
) => {
  const positions: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const widthScale = options.widthScale ?? 1;
  const y = options.y ?? 0;
  const fixedColor = options.singleColor ? new THREE.Color(options.singleColor) : null;

  lines.forEach((line) => {
    const color = fixedColor ?? ROAD_COLORS[line.className] ?? ROAD_COLORS.residential;
    for (let index = 1; index < line.points.length; index += 1) {
      const [ax, az] = line.points[index - 1];
      const [bx, bz] = line.points[index];
      const dx = bx - ax;
      const dz = bz - az;
      const length = Math.hypot(dx, dz);
      if (length < 0.001) continue;
      const halfWidth = (line.width * widthScale) / 2;
      const px = (-dz / length) * halfWidth;
      const pz = (dx / length) * halfWidth;
      const vertex = positions.length / 3;
      positions.push(
        ax + px,
        y,
        az + pz,
        ax - px,
        y,
        az - pz,
        bx + px,
        y,
        bz + pz,
        bx - px,
        y,
        bz - pz
      );
      for (let count = 0; count < 4; count += 1) {
        normals.push(0, 1, 0);
        colors.push(color.r, color.g, color.b);
      }
      // Keep the strip front-facing from the overhead game camera.
      indices.push(vertex, vertex + 2, vertex + 1, vertex + 2, vertex + 3, vertex + 1);
    }
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  return geometry;
};

export const createPolygonGeometry = (polygons: MapFeaturePolygon[], y = 0) => {
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  polygons.forEach((polygon) => {
    const points = polygon.points.slice(0, -1);
    if (points.length < 3) return;
    const offset = positions.length / 3;
    points.forEach(([x, z]) => {
      positions.push(x, y, z);
      normals.push(0, 1, 0);
    });
    THREE.ShapeUtils.triangulateShape(
      points.map(([x, z]) => new THREE.Vector2(x, z)),
      []
    ).forEach((triangle) => indices.push(...triangle.map((index) => offset + index)));
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  return geometry;
};

const nearestDistrict = (map: BhopalMapData, point: Point2) =>
  map.districts.reduce(
    (nearest, district) => {
      const distance = Math.hypot(point[0] - district.center[0], point[1] - district.center[1]);
      return distance < nearest.distance ? { district, distance } : nearest;
    },
    { district: map.districts[0], distance: Number.POSITIVE_INFINITY }
  ).district;

export const generateBuildings = (map: BhopalMapData): BuildingSpec[] => {
  const random = createSeededRandom(`bhopal-buildings:${map.metadata.sourceChecksum}`);
  const cellSize = 4;
  const occupied = new Map<string, Point2[]>();
  const addRoadPoint = (point: Point2) => {
    const key = `${Math.floor(point[0] / cellSize)}:${Math.floor(point[1] / cellSize)}`;
    const bucket = occupied.get(key) ?? [];
    bucket.push(point);
    occupied.set(key, bucket);
  };
  map.roads.forEach((road) => {
    for (let index = 1; index < road.points.length; index += 1) {
      const start = road.points[index - 1];
      const end = road.points[index];
      const steps = Math.max(1, Math.ceil(Math.hypot(end[0] - start[0], end[1] - start[1]) / 2));
      for (let step = 0; step <= steps; step += 1) {
        const t = step / steps;
        addRoadPoint([start[0] + (end[0] - start[0]) * t, start[1] + (end[1] - start[1]) * t]);
      }
    }
  });

  const nearRoad = (point: Point2, clearance: number) => {
    const cellX = Math.floor(point[0] / cellSize);
    const cellZ = Math.floor(point[1] / cellSize);
    for (let x = cellX - 1; x <= cellX + 1; x += 1) {
      for (let z = cellZ - 1; z <= cellZ + 1; z += 1) {
        const bucket = occupied.get(`${x}:${z}`) ?? [];
        if (
          bucket.some(
            (roadPoint) => Math.hypot(point[0] - roadPoint[0], point[1] - roadPoint[1]) < clearance
          )
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const { minX, maxX, minZ, maxZ } = map.metadata.worldBounds;
  const buildings: BuildingSpec[] = [];
  let index = 0;
  for (let x = minX + 3; x < maxX - 3; x += 5.1) {
    for (let z = minZ + 3; z < maxZ - 3; z += 5.1) {
      const district = nearestDistrict(map, [x, z]);
      const point: Point2 = [x + (random() - 0.5) * 1.5, z + (random() - 0.5) * 1.5];
      const water = map.waters.some((polygon) => pointInPolygon(point, polygon.points));
      const nearLandmark = map.landmarks.some(
        (landmark) =>
          Math.hypot(point[0] - landmark.position[0], point[1] - landmark.position[1]) < 4.5
      );
      const skipChance = {
        lakefront: 0.32,
        "old-city": 0.04,
        "shyamla-hills": 0.4,
        "new-bhopal": 0.12,
      }[district.id];
      const clearance =
        district.id === "old-city" ? 1.8 : district.id === "new-bhopal" ? 2.35 : 2.1;
      if (water || nearLandmark || nearRoad(point, clearance) || random() < skipChance) continue;

      const sizing = {
        lakefront: { width: [2.8, 4.5], depth: [2.8, 4.4], height: [2.6, 6] },
        "old-city": { width: [2.4, 4], depth: [2.4, 3.9], height: [3, 7.2] },
        "shyamla-hills": { width: [3.2, 4.8], depth: [3, 4.6], height: [2.2, 5] },
        "new-bhopal": { width: [3.8, 6.2], depth: [3.6, 5.6], height: [4.5, 9.5] },
      }[district.id];
      const between = ([minimum, maximum]: number[]) => minimum + random() * (maximum - minimum);
      const colors = DISTRICT_BUILDING_COLORS[district.id];
      buildings.push({
        id: `block-${index++}`,
        districtId: district.id,
        position: point,
        size: [between(sizing.width), between(sizing.height), between(sizing.depth)],
        color: colors[Math.floor(random() * colors.length)],
        rotation: (random() - 0.5) * (district.id === "old-city" ? 0.32 : 0.12),
      });
    }
  }
  return buildings;
};

export const collidesWithBuildings = (point: Point2, buildings: BuildingSpec[], padding = 0.45) =>
  buildings.some((building) => {
    const [width, , depth] = building.size;
    return (
      Math.abs(point[0] - building.position[0]) < width / 2 + padding &&
      Math.abs(point[1] - building.position[1]) < depth / 2 + padding
    );
  });

export const createGraphGeometry = (graph: NavigationGraph, y: number) => {
  const nodes = new Map(graph.nodes.map((node) => [node.id, node.position]));
  const positions: number[] = [];
  graph.edges.forEach((edge) => {
    const from = nodes.get(edge.from);
    const to = nodes.get(edge.to);
    if (from && to) positions.push(from[0], y, from[1], to[0], y, to[1]);
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
};

export const createBoundsGeometry = (polygons: Point2[][], y: number) => {
  const positions: number[] = [];
  polygons.forEach((polygon) => {
    for (let index = 1; index < polygon.length; index += 1) {
      positions.push(
        polygon[index - 1][0],
        y,
        polygon[index - 1][1],
        polygon[index][0],
        y,
        polygon[index][1]
      );
    }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
};
