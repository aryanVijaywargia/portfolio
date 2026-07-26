import { createHash } from "node:crypto";

import type { BhopalMapData, GraphEdge, GraphNode, MapAnchor, MapFeatureLine, MapFeaturePolygon, MapLandmark, Point2 } from "lib/boring/map/types";

import { BHOPAL_MAP_CONFIG, DISTRICT_CONFIG, LANDMARK_CONFIG } from "./bhopal.config";

type OsmGeometryPoint = { lat: number; lon: number };
type OsmElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: OsmGeometryPoint;
  geometry?: OsmGeometryPoint[];
  tags?: Record<string, string>;
  members?: Array<{
    type: string;
    ref: number;
    role: string;
    geometry?: OsmGeometryPoint[];
  }>;
};

export type OsmSnapshot = {
  version: number;
  generator: string;
  osm3s?: { timestamp_osm_base?: string; copyright?: string };
  elements: OsmElement[];
};

const metersPerLongitudeDegree =
  111_320 * Math.cos((BHOPAL_MAP_CONFIG.origin.latitude * Math.PI) / 180);
const metersPerLatitudeDegree = 110_540;

export const projectCoordinate = (latitude: number, longitude: number): Point2 => [
  (longitude - BHOPAL_MAP_CONFIG.origin.longitude) *
    metersPerLongitudeDegree *
    BHOPAL_MAP_CONFIG.worldScale,
  -(latitude - BHOPAL_MAP_CONFIG.origin.latitude) *
    metersPerLatitudeDegree *
    BHOPAL_MAP_CONFIG.worldScale,
];

const quantize = (value: number) =>
  Math.round(value / BHOPAL_MAP_CONFIG.quantization) * BHOPAL_MAP_CONFIG.quantization;

const quantizePoint = (point: Point2): Point2 => [quantize(point[0]), quantize(point[1])];

const pointDistanceToSegment = (point: Point2, start: Point2, end: Point2) => {
  const dx = end[0] - start[0];
  const dz = end[1] - start[1];
  if (dx === 0 && dz === 0) return Math.hypot(point[0] - start[0], point[1] - start[1]);
  const t = Math.max(
    0,
    Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dz) / (dx * dx + dz * dz))
  );
  return Math.hypot(point[0] - (start[0] + t * dx), point[1] - (start[1] + t * dz));
};

export const simplifyLine = (points: Point2[], tolerance: number): Point2[] => {
  if (points.length <= 2) return points;
  let farthestDistance = 0;
  let farthestIndex = 0;
  for (let index = 1; index < points.length - 1; index += 1) {
    const distance = pointDistanceToSegment(points[index], points[0], points[points.length - 1]);
    if (distance > farthestDistance) {
      farthestDistance = distance;
      farthestIndex = index;
    }
  }
  if (farthestDistance <= tolerance) return [points[0], points[points.length - 1]];
  const left = simplifyLine(points.slice(0, farthestIndex + 1), tolerance);
  const right = simplifyLine(points.slice(farthestIndex), tolerance);
  return [...left.slice(0, -1), ...right];
};

const geometryToPoints = (
  geometry: OsmGeometryPoint[] | undefined,
  toleranceMeters: number,
  preservedPointKeys?: ReadonlySet<string>
) => {
  if (!geometry || geometry.length < 2) return [];
  const projected: Point2[] = [];
  geometry.forEach(({ lat, lon }) => {
    const point = quantizePoint(projectCoordinate(lat, lon));
    const previous = projected[projected.length - 1];
    if (!previous || previous[0] !== point[0] || previous[1] !== point[1]) projected.push(point);
  });
  if (projected.length < 2) return [];

  const splitIndices = preservedPointKeys
    ? projected
        .map((point, index) => (preservedPointKeys.has(pointKey(point)) ? index : -1))
        .filter((index) => index >= 0)
    : [];
  const stops = [...new Set([0, ...splitIndices, projected.length - 1])].sort((a, b) => a - b);
  const simplified: Point2[] = [];
  for (let index = 1; index < stops.length; index += 1) {
    const segment = simplifyLine(
      projected.slice(stops[index - 1], stops[index] + 1),
      toleranceMeters * BHOPAL_MAP_CONFIG.worldScale
    );
    simplified.push(...(simplified.length ? segment.slice(1) : segment));
  }
  const result: Point2[] = [];
  simplified.forEach((point) => {
    const next = quantizePoint(point);
    const previous = result[result.length - 1];
    if (!previous || previous[0] !== next[0] || previous[1] !== next[1]) result.push(next);
  });
  return result;
};

const signedArea = (points: Point2[]) => {
  let area = 0;
  for (let index = 0; index < points.length - 1; index += 1) {
    area += points[index][0] * points[index + 1][1] - points[index + 1][0] * points[index][1];
  }
  return area / 2;
};

const ensureClosedValidPolygon = (points: Point2[]) => {
  if (points.length < 3) return [];
  const first = points[0];
  const last = points[points.length - 1];
  const closed = first[0] === last[0] && first[1] === last[1] ? points : [...points, first];
  if (closed.length < 4 || Math.abs(signedArea(closed)) < 0.02) return [];
  return closed;
};

const clipPolygonToPlayableBounds = (points: Point2[]) => {
  const [south, west, north, east] = BHOPAL_MAP_CONFIG.bbox;
  const northWest = projectCoordinate(north, west);
  const southEast = projectCoordinate(south, east);
  const bounds = {
    minX: Math.min(northWest[0], southEast[0]),
    maxX: Math.max(northWest[0], southEast[0]),
    minZ: Math.min(northWest[1], southEast[1]),
    maxZ: Math.max(northWest[1], southEast[1]),
  };
  type Boundary = {
    inside: (point: Point2) => boolean;
    intersect: (start: Point2, end: Point2) => Point2;
  };
  const verticalIntersection = (x: number, start: Point2, end: Point2): Point2 => {
    const ratio = (x - start[0]) / (end[0] - start[0] || 1e-9);
    return quantizePoint([x, start[1] + (end[1] - start[1]) * ratio]);
  };
  const horizontalIntersection = (z: number, start: Point2, end: Point2): Point2 => {
    const ratio = (z - start[1]) / (end[1] - start[1] || 1e-9);
    return quantizePoint([start[0] + (end[0] - start[0]) * ratio, z]);
  };
  const boundaries: Boundary[] = [
    {
      inside: ([x]) => x >= bounds.minX,
      intersect: (start, end) => verticalIntersection(bounds.minX, start, end),
    },
    {
      inside: ([x]) => x <= bounds.maxX,
      intersect: (start, end) => verticalIntersection(bounds.maxX, start, end),
    },
    {
      inside: ([, z]) => z >= bounds.minZ,
      intersect: (start, end) => horizontalIntersection(bounds.minZ, start, end),
    },
    {
      inside: ([, z]) => z <= bounds.maxZ,
      intersect: (start, end) => horizontalIntersection(bounds.maxZ, start, end),
    },
  ];
  let output = points.slice(0, -1);
  boundaries.forEach((boundary) => {
    const input = output;
    output = [];
    if (!input.length) return;
    let start = input[input.length - 1];
    input.forEach((end) => {
      const startInside = boundary.inside(start);
      const endInside = boundary.inside(end);
      if (endInside) {
        if (!startInside) output.push(boundary.intersect(start, end));
        output.push(end);
      } else if (startInside) {
        output.push(boundary.intersect(start, end));
      }
      start = end;
    });
  });
  return ensureClosedValidPolygon(output);
};

const endpointKey = (point: OsmGeometryPoint) => `${point.lat.toFixed(7)},${point.lon.toFixed(7)}`;

const joinGeometryParts = (parts: OsmGeometryPoint[][]) => {
  const pending = parts.filter((part) => part.length >= 2).map((part) => [...part]);
  const rings: OsmGeometryPoint[][] = [];
  while (pending.length) {
    const ring = pending.shift()!;
    let changed = true;
    while (changed && endpointKey(ring[0]) !== endpointKey(ring[ring.length - 1])) {
      changed = false;
      for (let index = 0; index < pending.length; index += 1) {
        const candidate = pending[index];
        const start = endpointKey(ring[0]);
        const end = endpointKey(ring[ring.length - 1]);
        const candidateStart = endpointKey(candidate[0]);
        const candidateEnd = endpointKey(candidate[candidate.length - 1]);
        if (end === candidateStart) ring.push(...candidate.slice(1));
        else if (end === candidateEnd) ring.push(...candidate.slice(0, -1).reverse());
        else if (start === candidateEnd) ring.unshift(...candidate.slice(0, -1));
        else if (start === candidateStart) ring.unshift(...candidate.slice(1).reverse());
        else continue;
        pending.splice(index, 1);
        changed = true;
        break;
      }
    }
    rings.push(ring);
  }
  return rings;
};

const elementName = (element: OsmElement) =>
  [element.tags?.name, element.tags?.["name:en"], element.tags?.alt_name]
    .filter(Boolean)
    .join(" / ")
    .toLowerCase();

const elementCenter = (element: OsmElement): [number, number] | null => {
  if (typeof element.lat === "number" && typeof element.lon === "number")
    return [element.lat, element.lon];
  if (element.center) return [element.center.lat, element.center.lon];
  const geometry =
    element.geometry ?? element.members?.flatMap((member) => member.geometry ?? []) ?? [];
  if (!geometry.length) return null;
  const latitude = geometry.reduce((sum, point) => sum + point.lat, 0) / geometry.length;
  const longitude = geometry.reduce((sum, point) => sum + point.lon, 0) / geometry.length;
  return [latitude, longitude];
};

const makeLandmarks = (elements: OsmElement[]): MapLandmark[] =>
  LANDMARK_CONFIG.map((config) => {
    const match = elements.find((element) => {
      const name = elementName(element);
      return name && config.patterns.some((pattern) => name.includes(pattern));
    });
    const center = (match && elementCenter(match)) ?? config.fallback;
    return {
      id: config.id,
      name: config.name,
      kind: config.kind,
      districtId: config.districtId,
      position: quantizePoint(projectCoordinate(center[0], center[1])),
      sensitive: config.sensitive,
      source: match ? "osm" : "curated-osm-anchor",
    };
  });

const polygonElements = (elements: OsmElement[], predicate: (element: OsmElement) => boolean) => {
  const output: Array<{ id: string; name?: string; points: Point2[] }> = [];
  elements.filter(predicate).forEach((element) => {
    const geometries =
      element.type === "relation"
        ? joinGeometryParts(
            (element.members ?? [])
              .filter((member) => member.role === "outer" && member.geometry)
              .map((member) => member.geometry!)
          )
        : element.geometry
        ? [element.geometry]
        : [];
    geometries.forEach((geometry, index) => {
      const points = clipPolygonToPlayableBounds(
        ensureClosedValidPolygon(
          geometryToPoints(geometry, BHOPAL_MAP_CONFIG.simplificationMeters.polygon)
        )
      );
      if (points.length) {
        output.push({
          id: `osm-${element.type}-${element.id}${geometries.length > 1 ? `-${index}` : ""}`,
          name: element.tags?.name ?? element.tags?.["name:en"],
          points,
        });
      }
    });
  });
  return output;
};

const pointKey = ([x, z]: Point2) => `${x.toFixed(2)}:${z.toFixed(2)}`;

const sharedRoadPointKeys = (elements: OsmElement[]) => {
  const appearances = new Map<string, number>();
  elements.forEach((element) => {
    const keys = new Set(
      (element.geometry ?? []).map(({ lat, lon }) =>
        pointKey(quantizePoint(projectCoordinate(lat, lon)))
      )
    );
    keys.forEach((key) => appearances.set(key, (appearances.get(key) ?? 0) + 1));
  });
  return new Set([...appearances.entries()].filter(([, count]) => count > 1).map(([key]) => key));
};

const buildGraph = (lines: MapFeatureLine[]) => {
  const nodeMap = new Map<string, GraphNode>();
  const edgeMap = new Map<string, GraphEdge>();
  lines.forEach((line) => {
    line.points.forEach((point) => {
      const key = pointKey(point);
      if (!nodeMap.has(key)) nodeMap.set(key, { id: `n-${key}`, position: point });
    });
    for (let index = 1; index < line.points.length; index += 1) {
      const fromKey = pointKey(line.points[index - 1]);
      const toKey = pointKey(line.points[index]);
      if (fromKey === toKey) continue;
      const ordered = [fromKey, toKey].sort();
      const edgeKey = `${ordered[0]}~${ordered[1]}`;
      if (!edgeMap.has(edgeKey)) {
        edgeMap.set(edgeKey, {
          id: `e-${edgeKey}`,
          from: `n-${fromKey}`,
          to: `n-${toKey}`,
          width: line.width,
        });
      }
    }
  });
  return {
    nodes: [...nodeMap.values()].sort((a, b) => a.id.localeCompare(b.id)),
    edges: [...edgeMap.values()].sort((a, b) => a.id.localeCompare(b.id)),
  };
};

const largestGraphComponent = (graph: ReturnType<typeof buildGraph>) => {
  const adjacency = new Map(graph.nodes.map((node) => [node.id, [] as string[]]));
  graph.edges.forEach((edge) => {
    adjacency.get(edge.from)?.push(edge.to);
    adjacency.get(edge.to)?.push(edge.from);
  });
  const visited = new Set<string>();
  let largest = new Set<string>();
  graph.nodes.forEach((node) => {
    if (visited.has(node.id)) return;
    const component = new Set<string>([node.id]);
    const queue = [node.id];
    visited.add(node.id);
    while (queue.length) {
      const current = queue.pop()!;
      (adjacency.get(current) ?? []).forEach((neighbor) => {
        if (visited.has(neighbor)) return;
        visited.add(neighbor);
        component.add(neighbor);
        queue.push(neighbor);
      });
    }
    if (component.size > largest.size) largest = component;
  });
  return largest;
};

const snapAnchorsToMainRoads = (
  anchors: MapAnchor[],
  graph: ReturnType<typeof buildGraph>
): MapAnchor[] => {
  const mainComponent = largestGraphComponent(graph);
  const candidates = graph.nodes.filter((node) => mainComponent.has(node.id));
  if (!candidates.length) throw new Error("Cannot place anchors: vehicle graph is empty");
  return anchors.map((anchor) => {
    let nearest = candidates[0];
    let nearestDistance = Infinity;
    candidates.forEach((node) => {
      const distance = Math.hypot(
        anchor.position[0] - node.position[0],
        anchor.position[1] - node.position[1]
      );
      if (distance < nearestDistance) {
        nearest = node;
        nearestDistance = distance;
      }
    });
    return { ...anchor, position: nearest.position };
  });
};

const nearestLandmark = (landmarks: MapLandmark[], id: string) => {
  const landmark = landmarks.find((entry) => entry.id === id);
  if (!landmark) throw new Error(`Missing required landmark: ${id}`);
  return landmark;
};

const offsetPoint = ([x, z]: Point2, dx: number, dz: number): Point2 =>
  quantizePoint([x + dx, z + dz]);

const makeAnchors = (landmarks: MapLandmark[]): MapAnchor[] => [
  {
    id: "spawn-kamla-park",
    label: "Portfolio Dispatch curb",
    kind: "spawn",
    districtId: "lakefront",
    position: offsetPoint(nearestLandmark(landmarks, "kamla-park").position, 1.8, 1.6),
  },
  {
    id: "mission-home-circuit",
    label: "Home Circuit dispatch",
    kind: "mission",
    districtId: "lakefront",
    position: offsetPoint(nearestLandmark(landmarks, "kamla-park").position, -1.5, 2.2),
  },
  {
    id: "mission-runtime-relay",
    label: "Runtime relay forecourt",
    kind: "mission",
    districtId: "new-bhopal",
    position: offsetPoint(nearestLandmark(landmarks, "db-mall").position, 2.4, 1.6),
  },
  {
    id: "mission-continue-long-run",
    label: "Workflow Studio road anchor",
    kind: "mission",
    districtId: "shyamla-hills",
    position: offsetPoint(nearestLandmark(landmarks, "bharat-bhavan").position, -2.2, 2),
  },
  {
    id: "lake-overlook-finale",
    label: "Lake overlook",
    kind: "overlook",
    districtId: "lakefront",
    position: offsetPoint(nearestLandmark(landmarks, "kamla-park").position, -4, -2),
  },
  {
    id: "recovery-old-city",
    label: "Old City safe road",
    kind: "recovery",
    districtId: "old-city",
    position: offsetPoint(nearestLandmark(landmarks, "chowk-bazaar").position, 2, 2),
  },
  {
    id: "recovery-shyamla-hills",
    label: "Shyamla Hills safe road",
    kind: "recovery",
    districtId: "shyamla-hills",
    position: offsetPoint(nearestLandmark(landmarks, "tribal-museum").position, 2, 2),
  },
  {
    id: "recovery-new-bhopal",
    label: "New Bhopal safe road",
    kind: "recovery",
    districtId: "new-bhopal",
    position: offsetPoint(nearestLandmark(landmarks, "new-market").position, 2, 2),
  },
];

export const sha256 = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");

export const buildBhopalMap = (
  snapshot: OsmSnapshot,
  sourceChecksum: string,
  generatedAt: string
): BhopalMapData => {
  const elements = [...snapshot.elements].sort((a, b) =>
    a.type === b.type ? a.id - b.id : a.type.localeCompare(b.type)
  );

  const roadElements = elements.filter(
    (element) =>
      element.type === "way" &&
      element.tags?.highway &&
      (BHOPAL_MAP_CONFIG.includedHighways as readonly string[]).includes(element.tags.highway)
  );
  const preservedRoadPoints = sharedRoadPointKeys(roadElements);
  const roads: MapFeatureLine[] = roadElements
    .map((element) => {
      const className = element.tags!.highway as keyof typeof BHOPAL_MAP_CONFIG.roadWidths;
      return {
        id: `osm-way-${element.id}`,
        name: element.tags?.name,
        className,
        width: BHOPAL_MAP_CONFIG.roadWidths[className],
        points: geometryToPoints(
          element.geometry,
          BHOPAL_MAP_CONFIG.simplificationMeters[className],
          preservedRoadPoints
        ),
      };
    })
    .filter((road) => road.points.length >= 2);

  const railways: MapFeatureLine[] = elements
    .filter((element) => element.type === "way" && element.tags?.railway === "rail")
    .map((element) => ({
      id: `osm-way-${element.id}`,
      name: element.tags?.name,
      className: "railway",
      width: 0.55,
      points: geometryToPoints(element.geometry, BHOPAL_MAP_CONFIG.simplificationMeters.railway),
    }))
    .filter((railway) => railway.points.length >= 2);

  const waterSource = polygonElements(
    elements,
    (element) =>
      element.tags?.natural === "water" ||
      Boolean(element.tags?.water) ||
      element.tags?.waterway === "riverbank"
  );
  const waters: MapFeaturePolygon[] = waterSource.map((entry) => ({
    ...entry,
    className: "water",
  }));

  const greenSource = polygonElements(
    elements,
    (element) =>
      ["park", "nature_reserve", "garden"].includes(element.tags?.leisure ?? "") ||
      ["forest", "grass", "recreation_ground", "meadow"].includes(element.tags?.landuse ?? "")
  );
  const greenAreas: MapFeaturePolygon[] = greenSource.map((entry) => ({
    ...entry,
    className: "green",
  }));

  const landmarks = makeLandmarks(elements);
  const draftAnchors = makeAnchors(landmarks);
  const districts = DISTRICT_CONFIG.map((district) => {
    const [south, west, north, east] = district.bbox;
    const bounds = [
      projectCoordinate(north, west),
      projectCoordinate(north, east),
      projectCoordinate(south, east),
      projectCoordinate(south, west),
      projectCoordinate(north, west),
    ].map(quantizePoint);
    return {
      id: district.id,
      name: district.name,
      shortName: district.shortName,
      accent: district.accent,
      center: quantizePoint(projectCoordinate((south + north) / 2, (west + east) / 2)),
      bounds,
    };
  });

  const [south, west, north, east] = BHOPAL_MAP_CONFIG.bbox;
  const northWest = projectCoordinate(north, west);
  const southEast = projectCoordinate(south, east);
  const vehicleGraph = buildGraph(roads);
  const anchors = snapAnchorsToMainRoads(draftAnchors, vehicleGraph);
  const pedestrianGraph = buildGraph(
    roads
      .filter((road) => !["motorway", "trunk"].includes(road.className))
      .map((road) => ({ ...road, points: [road.points[0], road.points[road.points.length - 1]] }))
  );

  return {
    metadata: {
      schemaVersion: 1,
      generatedAt,
      sourceDate: snapshot.osm3s?.timestamp_osm_base ?? "unknown",
      sourceChecksum,
      sourceUrl: "https://overpass-api.de/api/interpreter",
      bbox: BHOPAL_MAP_CONFIG.bbox,
      origin: BHOPAL_MAP_CONFIG.origin,
      worldScale: BHOPAL_MAP_CONFIG.worldScale,
      worldBounds: {
        minX: quantize(northWest[0]),
        maxX: quantize(southEast[0]),
        minZ: quantize(northWest[1]),
        maxZ: quantize(southEast[1]),
      },
      attribution: "© OpenStreetMap contributors",
      licenseUrl: "https://www.openstreetmap.org/copyright",
    },
    roads,
    railways,
    waters,
    greenAreas,
    districts,
    landmarks,
    anchors,
    vehicleGraph,
    pedestrianGraph,
  };
};

export const validateBhopalMap = (map: BhopalMapData) => {
  const errors: string[] = [];
  if (map.metadata.schemaVersion !== 1) errors.push("Unsupported schema version");
  if (!map.roads.length) errors.push("No roads generated");
  if (!map.railways.length) errors.push("No railway context generated");
  if (map.waters.length < 2) errors.push("Expected at least two water polygons");
  if (map.districts.length !== 4) errors.push("Expected four playable districts");
  const requiredLandmarks = LANDMARK_CONFIG.map((landmark) => landmark.id);
  requiredLandmarks.forEach((id) => {
    if (!map.landmarks.some((landmark) => landmark.id === id))
      errors.push(`Missing landmark ${id}`);
  });
  ["mission-home-circuit", "mission-runtime-relay", "mission-continue-long-run"].forEach((id) => {
    if (!map.anchors.some((anchor) => anchor.id === id)) errors.push(`Missing anchor ${id}`);
  });
  [...map.waters, ...map.greenAreas].forEach((polygon) => {
    const first = polygon.points[0];
    const last = polygon.points[polygon.points.length - 1];
    if (polygon.points.length < 4 || first[0] !== last[0] || first[1] !== last[1]) {
      errors.push(`Invalid polygon ${polygon.id}`);
    }
  });
  map.roads.forEach((road) => {
    for (let index = 1; index < road.points.length; index += 1) {
      if (pointKey(road.points[index - 1]) === pointKey(road.points[index])) {
        errors.push(`Zero-length segment in ${road.id}`);
      }
    }
  });
  if (map.vehicleGraph.edges.length < Math.max(1, map.roads.length / 2)) {
    errors.push("Vehicle graph is unexpectedly sparse");
  }
  const graphPositions = new Set(map.vehicleGraph.nodes.map((node) => pointKey(node.position)));
  map.anchors.forEach((anchor) => {
    if (!graphPositions.has(pointKey(anchor.position))) {
      errors.push(`Anchor ${anchor.id} is not snapped to the vehicle graph`);
    }
  });
  const mainComponent = largestGraphComponent(map.vehicleGraph);
  map.anchors.forEach((anchor) => {
    if (!mainComponent.has(`n-${pointKey(anchor.position)}`)) {
      errors.push(`Anchor ${anchor.id} is disconnected from the critical mission route`);
    }
  });
  return errors;
};
