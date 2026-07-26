import { Edges, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { BhopalMapData, MapLandmark, Point2 } from "lib/boring/map/types";
import type { DebugLayers, QualityLevel } from "lib/boring/state/game-store";
import { createSeededRandom } from "lib/boring/simulation/fixed-step";
import { FC, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { BuildingSpec, collidesWithBuildings, createBoundsGeometry, createGraphGeometry, createPolygonGeometry, createStripGeometry, pointInPolygon } from "./world-geometry";
import { BhopalStreetProps } from "./street-life";

const INK = "#17181d";

const useToonGradient = () => {
  const texture = useMemo(() => {
    const data = new Uint8Array([42, 154, 255]);
    const value = new THREE.DataTexture(data, 3, 1, THREE.RedFormat);
    value.minFilter = THREE.NearestFilter;
    value.magFilter = THREE.NearestFilter;
    value.needsUpdate = true;
    return value;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
};

const InstancedBuildings: FC<{
  buildings: BuildingSpec[];
  collisionDebug: boolean;
  fillColor: string;
  roofColor: string;
}> = ({ buildings, collisionDebug, fillColor, roofColor }) => {
  const commercialDistrict =
    buildings[0]?.districtId === "old-city" || buildings[0]?.districtId === "new-bhopal";
  const outlineRef = useRef<THREE.InstancedMesh>(null);
  const fillRef = useRef<THREE.InstancedMesh>(null);
  const roofRef = useRef<THREE.InstancedMesh>(null);
  const facadeRef = useRef<THREE.InstancedMesh>(null);
  const awningRef = useRef<THREE.InstancedMesh>(null);
  const gradient = useToonGradient();

  useLayoutEffect(() => {
    const outline = outlineRef.current;
    const fill = fillRef.current;
    const roof = roofRef.current;
    const facade = facadeRef.current;
    const awning = awningRef.current;
    if (!outline || !fill || !roof || !facade || (commercialDistrict && !awning)) return;
    const dummy = new THREE.Object3D();
    buildings.forEach((building, index) => {
      const [width, height, depth] = building.size;
      dummy.position.set(building.position[0], height / 2 + 0.23, building.position[1]);
      dummy.rotation.set(0, building.rotation, 0);
      dummy.scale.set(width * 1.01, height * 1.01, depth * 1.01);
      dummy.updateMatrix();
      outline.setMatrixAt(index, dummy.matrix);

      dummy.position.y += 0.035;
      dummy.scale.set(width, height, depth);
      dummy.updateMatrix();
      fill.setMatrixAt(index, dummy.matrix);

      dummy.position.set(building.position[0], height + 0.34, building.position[1]);
      dummy.scale.set(width * 0.68, 0.28, depth * 0.68);
      dummy.updateMatrix();
      roof.setMatrixAt(index, dummy.matrix);

      const frontX = building.position[0] + Math.sin(building.rotation) * (depth / 2 + 0.055);
      const frontZ = building.position[1] + Math.cos(building.rotation) * (depth / 2 + 0.055);
      dummy.position.set(frontX, Math.min(height * 0.58, height - 0.55) + 0.22, frontZ);
      dummy.rotation.set(0, building.rotation, 0);
      dummy.scale.set(width * 0.72, Math.min(0.62, height * 0.14), 0.09);
      dummy.updateMatrix();
      facade.setMatrixAt(index, dummy.matrix);

      const commercial = building.districtId === "old-city" || building.districtId === "new-bhopal";
      const awningFrontX = building.position[0] + Math.sin(building.rotation) * (depth / 2 + 0.34);
      const awningFrontZ = building.position[1] + Math.cos(building.rotation) * (depth / 2 + 0.34);
      if (awning && commercial) {
        dummy.position.set(awningFrontX, 1.38, awningFrontZ);
        dummy.scale.set(width * 0.76, 0.12, 0.66);
        dummy.updateMatrix();
        awning.setMatrixAt(index, dummy.matrix);
      }
    });
    [outline, fill, roof, facade, awning].filter(Boolean).forEach((mesh) => {
      if (!mesh) return;
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    });
  }, [buildings, commercialDistrict]);

  return (
    <group>
      <instancedMesh ref={outlineRef} args={[undefined, undefined, buildings.length]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={collisionDebug ? "#ff2f64" : INK} wireframe />
      </instancedMesh>
      <instancedMesh
        ref={fillRef}
        args={[undefined, undefined, buildings.length]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color={fillColor} gradientMap={gradient} />
      </instancedMesh>
      <instancedMesh ref={roofRef} args={[undefined, undefined, buildings.length]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color={roofColor} gradientMap={gradient} />
      </instancedMesh>
      <instancedMesh ref={facadeRef} args={[undefined, undefined, buildings.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color="#4e6c70" gradientMap={gradient} />
      </instancedMesh>
      {commercialDistrict
        ? <instancedMesh ref={awningRef} args={[undefined, undefined, buildings.length]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshToonMaterial color="#d85e4f" gradientMap={gradient} />
          </instancedMesh>
        : null}
    </group>
  );
};

const generateTrees = (map: BhopalMapData, buildings: BuildingSpec[], quality: QualityLevel) => {
  const random = createSeededRandom(`bhopal-trees:${map.metadata.sourceChecksum}`);
  const limit = quality === "low" ? 70 : quality === "medium" ? 120 : 180;
  const positions: Point2[] = [];
  const tryPoint = (point: Point2) => {
    if (map.waters.some((water) => pointInPolygon(point, water.points))) return;
    if (collidesWithBuildings(point, buildings, 0.8)) return;
    if (
      positions.some((existing) => Math.hypot(existing[0] - point[0], existing[1] - point[1]) < 2)
    )
      return;
    positions.push(point);
  };

  map.greenAreas.forEach((green) => {
    if (positions.length >= limit) return;
    const xs = green.points.map((point) => point[0]);
    const zs = green.points.map((point) => point[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minZ = Math.min(...zs);
    const maxZ = Math.max(...zs);
    for (let attempt = 0; attempt < 8 && positions.length < limit; attempt += 1) {
      const point: Point2 = [minX + random() * (maxX - minX), minZ + random() * (maxZ - minZ)];
      if (pointInPolygon(point, green.points)) tryPoint(point);
    }
  });

  const shyamla = map.districts.find((district) => district.id === "shyamla-hills")!;
  for (let attempt = 0; attempt < limit * 4 && positions.length < limit; attempt += 1) {
    const point: Point2 = [
      shyamla.center[0] + (random() - 0.5) * 42,
      shyamla.center[1] + (random() - 0.5) * 36,
    ];
    tryPoint(point);
  }
  return positions;
};

const InstancedTrees: FC<{ positions: Point2[] }> = ({ positions }) => {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const crownOutlineRef = useRef<THREE.InstancedMesh>(null);
  const crownRef = useRef<THREE.InstancedMesh>(null);
  const gradient = useToonGradient();

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    positions.forEach(([x, z], index) => {
      const scale = 0.78 + (index % 5) * 0.07;
      dummy.rotation.set(0, (index * 1.77) % Math.PI, 0);
      dummy.position.set(x, 0.95 * scale, z);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      trunkRef.current?.setMatrixAt(index, dummy.matrix);

      dummy.position.set(x, 2.3 * scale, z);
      dummy.scale.set(scale * 1.06, scale * 1.06, scale * 1.06);
      dummy.updateMatrix();
      crownOutlineRef.current?.setMatrixAt(index, dummy.matrix);

      dummy.scale.set(scale, scale, scale);
      dummy.position.y += 0.04;
      dummy.updateMatrix();
      crownRef.current?.setMatrixAt(index, dummy.matrix);
    });
    [trunkRef.current, crownOutlineRef.current, crownRef.current].forEach((mesh) => {
      if (!mesh) return;
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    });
  }, [positions]);

  return (
    <group>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, positions.length]} castShadow>
        <cylinderGeometry args={[0.17, 0.26, 1.8, 6]} />
        <meshToonMaterial color="#6d4735" gradientMap={gradient} />
      </instancedMesh>
      <instancedMesh
        ref={crownOutlineRef}
        args={[undefined, undefined, positions.length]}
        castShadow
      >
        <dodecahedronGeometry args={[1.42, 0]} />
        <meshBasicMaterial color={INK} wireframe />
      </instancedMesh>
      <instancedMesh ref={crownRef} args={[undefined, undefined, positions.length]} castShadow>
        <dodecahedronGeometry args={[1.32, 0]} />
        <meshToonMaterial color="#71865b" gradientMap={gradient} />
      </instancedMesh>
    </group>
  );
};

const InkedBox: FC<{
  position?: [number, number, number];
  size: [number, number, number];
  color: string;
  rotation?: [number, number, number];
}> = ({ position = [0, 0, 0], size, color, rotation = [0, 0, 0] }) => {
  const gradient = useToonGradient();
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshToonMaterial color={color} gradientMap={gradient} />
      <Edges color={INK} threshold={12} />
    </mesh>
  );
};

const LandmarkGeometry: FC<{ landmark: MapLandmark }> = ({ landmark }) => {
  const gradient = useToonGradient();
  if (landmark.kind === "lake") return null;
  if (landmark.kind === "mosque") {
    return (
      <group>
        <InkedBox position={[0, 0.8, 0]} size={[3.4, 1.4, 2.7]} color="#d7c7a2" />
        <mesh position={[0, 1.62, 0]} castShadow>
          <sphereGeometry args={[1.05, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshToonMaterial color="#65a7a0" gradientMap={gradient} />
          <Edges color={INK} threshold={10} />
        </mesh>
        {[-1.45, 1.45].map((x) => (
          <group key={x} position={[x, 1.7, -0.75]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.16, 0.23, 3.1, 8]} />
              <meshToonMaterial color="#d5b77e" gradientMap={gradient} />
              <Edges color={INK} threshold={10} />
            </mesh>
            <mesh position={[0, 1.7, 0]}>
              <coneGeometry args={[0.34, 0.7, 8]} />
              <meshToonMaterial color="#df604f" gradientMap={gradient} />
              <Edges color={INK} threshold={10} />
            </mesh>
          </group>
        ))}
      </group>
    );
  }
  if (landmark.kind === "temple") {
    return (
      <group>
        <InkedBox position={[0, 0.48, 0]} size={[2.8, 0.85, 2.4]} color="#e2c37d" />
        <mesh position={[0, 1.8, 0]} castShadow>
          <coneGeometry args={[1.05, 2.8, 5]} />
          <meshToonMaterial color="#d67d55" gradientMap={gradient} />
          <Edges color={INK} threshold={8} />
        </mesh>
      </group>
    );
  }
  if (landmark.kind === "station") {
    return (
      <group>
        <InkedBox position={[0, 0.7, 0]} size={[6.5, 1.25, 2.4]} color="#b7af9c" />
        <InkedBox position={[0, 1.55, 0]} size={[5.7, 0.48, 2.7]} color="#df604f" />
      </group>
    );
  }
  if (landmark.kind === "mall") {
    return (
      <group>
        <InkedBox position={[0, 1.35, 0]} size={[4.8, 2.6, 4]} color="#aaa28e" />
        <InkedBox position={[0, 2.95, 0]} size={[3.8, 0.5, 3.2]} color="#e9b949" />
      </group>
    );
  }
  if (landmark.kind === "memorial") {
    return (
      <group>
        <InkedBox position={[0, 0.22, 0]} size={[3.8, 0.35, 3.8]} color="#9f927c" />
        <mesh position={[0, 1.75, 0]} castShadow>
          <octahedronGeometry args={[1.15, 0]} />
          <meshToonMaterial color="#df604f" gradientMap={gradient} />
          <Edges color={INK} threshold={8} />
        </mesh>
      </group>
    );
  }
  const palette =
    landmark.kind === "park"
      ? "#71865b"
      : landmark.kind === "museum" || landmark.kind === "cultural"
      ? "#c48965"
      : landmark.kind === "market"
      ? "#d59b62"
      : "#c5af84";
  return (
    <group>
      <InkedBox position={[0, 0.65, 0]} size={[3.8, 1.2, 3.2]} color={palette} />
      <InkedBox position={[0.35, 1.55, -0.15]} size={[2.6, 0.55, 2.2]} color="#ead6ad" />
    </group>
  );
};

const LandmarkProxy: FC<{ landmark: MapLandmark }> = ({ landmark }) => (
  <group position={[landmark.position[0], 0.18, landmark.position[1]]}>
    <LandmarkGeometry landmark={landmark} />
    <Html position={[0, landmark.kind === "lake" ? 1.1 : 3.9, 0]} center sprite distanceFactor={11}>
      <span className={`boring-landmark-label${landmark.sensitive ? " is-sensitive" : ""}`}>
        {landmark.name}
      </span>
    </Html>
  </group>
);

const MissionMarker: FC<{ position: Point2; color: string }> = ({ position, color }) => {
  const arrowRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }, delta) => {
    const elapsed = clock.getElapsedTime();
    if (arrowRef.current) {
      arrowRef.current.rotation.y += delta * 0.55;
      arrowRef.current.position.y = 5.2 + Math.sin(elapsed * 2.4) * 0.42;
    }
    if (ringRef.current) {
      const scale = 1 + Math.sin(elapsed * 2.4) * 0.1;
      ringRef.current.scale.setScalar(scale);
    }
  });
  return (
    <group position={[position[0], 0.15, position[1]]}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[2.1, 2.75, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.82} side={THREE.DoubleSide} />
      </mesh>
      <group ref={arrowRef} position={[0, 5.2, 0]} rotation={[0, 0, Math.PI]}>
        <mesh>
          <coneGeometry args={[1.45, 2.2, 4]} />
          <meshBasicMaterial color={color} />
          <Edges color={INK} threshold={4} />
        </mesh>
        <mesh position={[0, -1.2, 0]}>
          <boxGeometry args={[0.7, 1.3, 0.7]} />
          <meshBasicMaterial color={color} />
          <Edges color={INK} threshold={4} />
        </mesh>
      </group>
    </group>
  );
};

const DebugWorld: FC<{ map: BhopalMapData; debugLayers: DebugLayers }> = ({ map, debugLayers }) => {
  const laneGeometry = useMemo(
    () => (debugLayers.laneGraph ? createGraphGeometry(map.vehicleGraph, 0.62) : null),
    [debugLayers.laneGraph, map.vehicleGraph]
  );
  const pedestrianGeometry = useMemo(
    () => (debugLayers.pedestrianGraph ? createGraphGeometry(map.pedestrianGraph, 0.66) : null),
    [debugLayers.pedestrianGraph, map.pedestrianGraph]
  );
  const districtGeometry = useMemo(
    () =>
      debugLayers.districtBounds
        ? createBoundsGeometry(
            map.districts.map((district) => district.bounds),
            0.7
          )
        : null,
    [debugLayers.districtBounds, map.districts]
  );
  useEffect(
    () => () => {
      laneGeometry?.dispose();
      pedestrianGeometry?.dispose();
      districtGeometry?.dispose();
    },
    [districtGeometry, laneGeometry, pedestrianGeometry]
  );

  return (
    <group>
      {laneGeometry
        ? <lineSegments geometry={laneGeometry}>
            <lineBasicMaterial color="#ffd84a" />
          </lineSegments>
        : null}
      {pedestrianGeometry
        ? <lineSegments geometry={pedestrianGeometry}>
            <lineBasicMaterial color="#43e5e0" />
          </lineSegments>
        : null}
      {districtGeometry
        ? <lineSegments geometry={districtGeometry}>
            <lineBasicMaterial color="#ff4e79" />
          </lineSegments>
        : null}
      {debugLayers.anchors
        ? map.anchors.map((anchor) => (
            <group key={anchor.id} position={[anchor.position[0], 0.8, anchor.position[1]]}>
              <mesh>
                <sphereGeometry args={[0.45, 8, 6]} />
                <meshBasicMaterial color="#ffd84a" />
              </mesh>
              <Html position={[0, 1, 0]} center>
                <span className="boring-debug-label">{anchor.id}</span>
              </Html>
            </group>
          ))
        : null}
    </group>
  );
};

type BhopalWorldProps = {
  map: BhopalMapData;
  buildings: BuildingSpec[];
  quality: QualityLevel;
  debugLayers: DebugLayers;
  targetAnchorId: string;
  missionAccent: string;
};

export const BhopalWorld: FC<BhopalWorldProps> = ({
  map,
  buildings,
  quality,
  debugLayers,
  targetAnchorId,
  missionAccent,
}) => {
  const visibleRoads = useMemo(
    () =>
      quality === "low"
        ? map.roads.filter((road, index) => road.className !== "service" || index % 4 === 0)
        : map.roads,
    [map.roads, quality]
  );
  const roadOutline = useMemo(
    () => createStripGeometry(visibleRoads, { widthScale: 1.1, y: 0.22, singleColor: INK }),
    [visibleRoads]
  );
  const roads = useMemo(
    () => createStripGeometry(visibleRoads, { y: 0.245, widthScale: 0.84 }),
    [visibleRoads]
  );
  const rails = useMemo(
    () => createStripGeometry(map.railways, { y: 0.29, widthScale: 1.2, singleColor: "#29292e" }),
    [map.railways]
  );
  const water = useMemo(() => createPolygonGeometry(map.waters, 0.195), [map.waters]);
  const green = useMemo(() => createPolygonGeometry(map.greenAreas, 0.185), [map.greenAreas]);
  const trees = useMemo(() => generateTrees(map, buildings, quality), [buildings, map, quality]);
  const districtBuildings = useMemo(
    () =>
      map.districts.map((district) => ({
        district,
        buildings: buildings.filter((building) => building.districtId === district.id),
      })),
    [buildings, map.districts]
  );
  const target = map.anchors.find((anchor) => anchor.id === targetAnchorId) ?? map.anchors[0];
  const { minX, maxX, minZ, maxZ } = map.metadata.worldBounds;
  const width = maxX - minX + 18;
  const depth = maxZ - minZ + 18;

  useEffect(
    () => () => {
      roadOutline.dispose();
      roads.dispose();
      rails.dispose();
      water.dispose();
      green.dispose();
    },
    [green, rails, roadOutline, roads, water]
  );

  return (
    <group>
      <mesh position={[(minX + maxX) / 2, 0, (minZ + maxZ) / 2]} receiveShadow>
        <boxGeometry args={[width, 0.34, depth]} />
        <meshToonMaterial color="#b9a77f" />
      </mesh>
      <mesh geometry={green} receiveShadow>
        <meshToonMaterial color="#71865b" side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={water} receiveShadow>
        <meshToonMaterial color="#5ca7a2" side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={roadOutline} receiveShadow>
        <meshBasicMaterial color={INK} />
      </mesh>
      <mesh geometry={roads} receiveShadow>
        <meshToonMaterial vertexColors />
      </mesh>
      <mesh geometry={rails} receiveShadow>
        <meshBasicMaterial color="#29292e" />
      </mesh>
      {districtBuildings.map(({ district, buildings: districtBlocks }) => (
        <InstancedBuildings
          key={district.id}
          buildings={districtBlocks}
          collisionDebug={debugLayers.collisions}
          fillColor={
            district.id === "old-city"
              ? "#c98264"
              : district.id === "shyamla-hills"
              ? "#a7a17c"
              : district.id === "new-bhopal"
              ? "#aaa28e"
              : "#d8c6a2"
          }
          roofColor={district.accent}
        />
      ))}
      <InstancedTrees positions={trees} />
      <BhopalStreetProps map={map} buildings={buildings} quality={quality} />
      {map.landmarks.map((landmark) => (
        <LandmarkProxy key={landmark.id} landmark={landmark} />
      ))}
      {target ? <MissionMarker position={target.position} color={missionAccent} /> : null}
      <DebugWorld map={map} debugLayers={debugLayers} />
    </group>
  );
};
