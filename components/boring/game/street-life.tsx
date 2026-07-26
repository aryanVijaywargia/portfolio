import { useFrame } from "@react-three/fiber";
import type { BhopalMapData, NavigationGraph, Point2 } from "lib/boring/map/types";
import { createSeededRandom } from "lib/boring/simulation/fixed-step";
import type { QualityLevel } from "lib/boring/state/game-store";
import { FC, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import type { BuildingSpec } from "./world-geometry";

const INK = "#17181d";

const useStreetToonGradient = () => {
  const texture = useMemo(() => {
    const data = new Uint8Array([40, 142, 255]);
    const value = new THREE.DataTexture(data, 3, 1, THREE.RedFormat);
    value.minFilter = THREE.NearestFilter;
    value.magFilter = THREE.NearestFilter;
    value.needsUpdate = true;
    return value;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
};

type Route = {
  id: string;
  start: Point2;
  end: Point2;
  length: number;
  phase: number;
  speed: number;
};

const createRoutes = (
  graph: NavigationGraph,
  count: number,
  seed: string,
  minimumLength: number,
  focusPoints: Point2[]
): Route[] => {
  const random = createSeededRandom(seed);
  const nodes = new Map(graph.nodes.map((node) => [node.id, node.position]));
  const candidates = graph.edges
    .map((edge) => {
      const start = nodes.get(edge.from);
      const end = nodes.get(edge.to);
      if (!start || !end) return null;
      const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
      return length >= minimumLength ? { id: edge.id, start, end, length } : null;
    })
    .filter((route): route is Omit<Route, "phase" | "speed"> => Boolean(route));

  const remaining = candidates.map((route) => ({ route, jitter: random() * 2.4 }));
  const selected: Route[] = [];
  while (selected.length < count && remaining.length) {
    const focus = focusPoints[selected.length % focusPoints.length];
    let bestIndex = 0;
    let bestScore = Number.POSITIVE_INFINITY;
    remaining.forEach(({ route, jitter }, index) => {
      const middleX = (route.start[0] + route.end[0]) / 2;
      const middleZ = (route.start[1] + route.end[1]) / 2;
      const crowded = selected.some((existing) => {
        const existingX = (existing.start[0] + existing.end[0]) / 2;
        const existingZ = (existing.start[1] + existing.end[1]) / 2;
        return Math.hypot(middleX - existingX, middleZ - existingZ) < 2.4;
      });
      const score =
        Math.hypot(middleX - focus[0], middleZ - focus[1]) + jitter + (crowded ? 30 : 0);
      if (score < bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });
    const [{ route }] = remaining.splice(bestIndex, 1);
    const reverse = random() > 0.5;
    selected.push({
      ...route,
      start: reverse ? route.end : route.start,
      end: reverse ? route.start : route.end,
      phase: random() * 2,
      speed: 0.7 + random() * 0.65,
    });
  }
  return selected;
};

type MovingPose = { x: number; z: number; heading: number; cycle: number };

const getMovingPose = (route: Route, elapsed: number, speedScale: number): MovingPose => {
  const raw = (route.phase + (elapsed * route.speed * speedScale) / route.length) % 2;
  const goingForward = raw <= 1;
  const t = goingForward ? raw : 2 - raw;
  const dx = route.end[0] - route.start[0];
  const dz = route.end[1] - route.start[1];
  return {
    x: route.start[0] + dx * t,
    z: route.start[1] + dz * t,
    heading: Math.atan2(goingForward ? dx : -dx, goingForward ? dz : -dz),
    cycle: raw * Math.PI * 2,
  };
};

type VehicleKind = "compact" | "suv" | "auto" | "bus" | "scooter";

type VehicleShape = {
  width: number;
  length: number;
  bodyHeight: number;
  cabinHeight: number;
  cabinLength: number;
  wheelRadius: number;
};

const VEHICLE_SHAPES: Record<VehicleKind, VehicleShape> = {
  compact: {
    width: 1.42,
    length: 2.7,
    bodyHeight: 0.48,
    cabinHeight: 0.58,
    cabinLength: 1.5,
    wheelRadius: 0.3,
  },
  suv: {
    width: 1.72,
    length: 3.25,
    bodyHeight: 0.58,
    cabinHeight: 0.72,
    cabinLength: 1.82,
    wheelRadius: 0.35,
  },
  auto: {
    width: 1.42,
    length: 2.35,
    bodyHeight: 0.46,
    cabinHeight: 0.98,
    cabinLength: 1.42,
    wheelRadius: 0.31,
  },
  bus: {
    width: 1.92,
    length: 4.9,
    bodyHeight: 0.72,
    cabinHeight: 1.35,
    cabinLength: 4.2,
    wheelRadius: 0.39,
  },
  scooter: {
    width: 0.42,
    length: 1.42,
    bodyHeight: 0.2,
    cabinHeight: 0.58,
    cabinLength: 0.36,
    wheelRadius: 0.22,
  },
};

const VEHICLE_KINDS: VehicleKind[] = [
  "auto",
  "scooter",
  "compact",
  "suv",
  "auto",
  "compact",
  "scooter",
];
const vehicleKindForIndex = (index: number): VehicleKind =>
  index === 2 ? "bus" : VEHICLE_KINDS[index % VEHICLE_KINDS.length];
const VEHICLE_COLORS = [
  "#df604f",
  "#e9b949",
  "#4f8274",
  "#eee0bd",
  "#536a85",
  "#d77c55",
  "#7d8a67",
];

type InstancedRef = React.MutableRefObject<THREE.InstancedMesh | null>;

const setPartMatrix = (
  mesh: THREE.InstancedMesh | null,
  index: number,
  actor: THREE.Object3D,
  part: THREE.Object3D,
  matrix: THREE.Matrix4,
  pose: MovingPose,
  position: [number, number, number],
  scale: [number, number, number],
  rotation: [number, number, number] = [0, 0, 0]
) => {
  if (!mesh) return;
  actor.position.set(pose.x, 0, pose.z);
  actor.rotation.set(0, pose.heading, 0);
  actor.scale.set(1, 1, 1);
  actor.updateMatrix();
  part.position.set(...position);
  part.rotation.set(...rotation);
  part.scale.set(...scale);
  part.updateMatrix();
  matrix.multiplyMatrices(actor.matrix, part.matrix);
  mesh.setMatrixAt(index, matrix);
};

const AnimatedVehicles: FC<{ routes: Route[]; paused: boolean; reducedMotion: boolean }> = ({
  routes,
  paused,
  reducedMotion,
}) => {
  const bodyOutlineRef = useRef<THREE.InstancedMesh>(null);
  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const glassRef = useRef<THREE.InstancedMesh>(null);
  const stripeRef = useRef<THREE.InstancedMesh>(null);
  const wheelRef = useRef<THREE.InstancedMesh>(null);
  const riderRef = useRef<THREE.InstancedMesh>(null);
  const elapsed = useRef(0);
  const actor = useMemo(() => new THREE.Object3D(), []);
  const part = useMemo(() => new THREE.Object3D(), []);
  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const gradient = useStreetToonGradient();

  const movingRefs = useMemo<InstancedRef[]>(
    () => [bodyOutlineRef, bodyRef, glassRef, stripeRef, wheelRef, riderRef],
    []
  );

  useLayoutEffect(() => {
    movingRefs.forEach(({ current }) => current?.instanceMatrix.setUsage(THREE.DynamicDrawUsage));
    routes.forEach((_, index) => {
      const kind = vehicleKindForIndex(index);
      const bodyColor =
        kind === "auto"
          ? "#e9b949"
          : kind === "bus"
          ? "#df604f"
          : VEHICLE_COLORS[index % VEHICLE_COLORS.length];
      bodyRef.current?.setColorAt(index * 2, new THREE.Color(bodyColor));
      bodyRef.current?.setColorAt(
        index * 2 + 1,
        new THREE.Color(kind === "auto" ? "#2f6d53" : kind === "bus" ? "#e6d4ab" : bodyColor)
      );
      stripeRef.current?.setColorAt(
        index,
        new THREE.Color(kind === "bus" ? "#3d7d99" : kind === "auto" ? "#24282b" : "#e8bd62")
      );
      riderRef.current?.setColorAt(
        index,
        new THREE.Color(["#cb6d58", "#486987", "#e0b34c"][index % 3])
      );
    });
    [bodyRef.current, stripeRef.current, riderRef.current].forEach((mesh) => {
      if (mesh?.instanceColor) mesh.instanceColor.needsUpdate = true;
    });
  }, [movingRefs, routes]);

  useFrame((_, delta) => {
    if (!paused && !reducedMotion) elapsed.current += Math.min(delta, 0.05);
    routes.forEach((route, index) => {
      const kind = vehicleKindForIndex(index);
      const shape = VEHICLE_SHAPES[kind];
      const pose = getMovingPose(
        route,
        elapsed.current,
        kind === "bus" ? 2.45 : kind === "scooter" ? 4.3 : 3.25
      );
      const bodyY = shape.wheelRadius + shape.bodyHeight * 0.48;
      const cabinY = bodyY + shape.bodyHeight * 0.42 + shape.cabinHeight * 0.5;
      const cabinZ = kind === "auto" ? -0.28 : kind === "scooter" ? -0.12 : -0.16;
      const bodyScale: [number, number, number] = [shape.width, shape.bodyHeight, shape.length];
      const bodyOutlineScale: [number, number, number] = [
        shape.width + 0.1,
        shape.bodyHeight + 0.08,
        shape.length + 0.1,
      ];
      const cabinScale: [number, number, number] = [
        shape.width * 0.82,
        shape.cabinHeight,
        shape.cabinLength,
      ];
      const cabinOutlineScale: [number, number, number] = [
        cabinScale[0] + 0.1,
        cabinScale[1] + 0.08,
        cabinScale[2] + 0.1,
      ];
      setPartMatrix(
        bodyOutlineRef.current,
        index * 2,
        actor,
        part,
        matrix,
        pose,
        [0, bodyY, 0],
        bodyOutlineScale
      );
      setPartMatrix(
        bodyRef.current,
        index * 2,
        actor,
        part,
        matrix,
        pose,
        [0, bodyY + 0.02, 0],
        bodyScale
      );
      setPartMatrix(
        bodyOutlineRef.current,
        index * 2 + 1,
        actor,
        part,
        matrix,
        pose,
        [0, cabinY, cabinZ],
        cabinOutlineScale
      );
      setPartMatrix(
        bodyRef.current,
        index * 2 + 1,
        actor,
        part,
        matrix,
        pose,
        [0, cabinY + 0.02, cabinZ],
        cabinScale
      );
      const windscreenScale: [number, number, number] = [
        shape.width * 0.69,
        shape.cabinHeight * 0.55,
        0.07,
      ];
      setPartMatrix(
        glassRef.current,
        index,
        actor,
        part,
        matrix,
        pose,
        [0, cabinY + 0.05, cabinZ + shape.cabinLength * 0.505],
        windscreenScale,
        [-0.08, 0, 0]
      );
      setPartMatrix(
        stripeRef.current,
        index,
        actor,
        part,
        matrix,
        pose,
        [0, bodyY + 0.05, 0],
        [shape.width + 0.04, Math.max(0.09, shape.bodyHeight * 0.22), shape.length + 0.04]
      );
      const riderVisible = kind === "scooter";
      setPartMatrix(
        riderRef.current,
        index,
        actor,
        part,
        matrix,
        pose,
        [0, 0.92, -0.12],
        riderVisible ? [0.46, 0.72, 0.42] : [0, 0, 0],
        [0.2, 0, 0]
      );

      const wheelZ = shape.length * (kind === "bus" ? 0.34 : 0.31);
      const wheelX = shape.width * 0.48;
      const wheelPositions: [number, number, number][] =
        kind === "auto"
          ? [
              [-wheelX, shape.wheelRadius, -wheelZ],
              [wheelX, shape.wheelRadius, -wheelZ],
              [0, shape.wheelRadius, wheelZ],
              [0, 0, 0],
            ]
          : kind === "scooter"
          ? [
              [0, shape.wheelRadius, -wheelZ],
              [0, shape.wheelRadius, wheelZ],
              [0, 0, 0],
              [0, 0, 0],
            ]
          : [
              [-wheelX, shape.wheelRadius, -wheelZ],
              [wheelX, shape.wheelRadius, -wheelZ],
              [-wheelX, shape.wheelRadius, wheelZ],
              [wheelX, shape.wheelRadius, wheelZ],
            ];
      wheelPositions.forEach((position, wheelIndex) => {
        const hidden = position[1] === 0;
        setPartMatrix(
          wheelRef.current,
          index * 4 + wheelIndex,
          actor,
          part,
          matrix,
          pose,
          position,
          hidden
            ? [0, 0, 0]
            : [shape.wheelRadius * 2, kind === "scooter" ? 0.16 : 0.24, shape.wheelRadius * 2],
          [0, 0, Math.PI / 2]
        );
      });
    });
    movingRefs.forEach(({ current }) => {
      if (current) current.instanceMatrix.needsUpdate = true;
    });
  });

  return (
    <group>
      <instancedMesh
        ref={bodyOutlineRef}
        args={[undefined, undefined, routes.length * 2]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={INK} side={THREE.BackSide} />
      </instancedMesh>
      <instancedMesh
        ref={bodyRef}
        args={[undefined, undefined, routes.length * 2]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color="#ffffff" gradientMap={gradient} />
      </instancedMesh>
      <instancedMesh
        ref={glassRef}
        args={[undefined, undefined, routes.length]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color="#79a9a4" gradientMap={gradient} />
      </instancedMesh>
      <instancedMesh
        ref={stripeRef}
        args={[undefined, undefined, routes.length]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color="#ffffff" gradientMap={gradient} />
      </instancedMesh>
      <instancedMesh
        ref={wheelRef}
        args={[undefined, undefined, routes.length * 4]}
        frustumCulled={false}
      >
        <cylinderGeometry args={[0.5, 0.5, 1, 10]} />
        <meshToonMaterial color="#202126" gradientMap={gradient} />
      </instancedMesh>
      <instancedMesh
        ref={riderRef}
        args={[undefined, undefined, routes.length]}
        frustumCulled={false}
      >
        <capsuleGeometry args={[0.5, 0.75, 3, 6]} />
        <meshToonMaterial color="#ffffff" gradientMap={gradient} />
      </instancedMesh>
    </group>
  );
};

const NPC_PALETTES = [
  { top: "#d95f50", lower: "#263852", skin: "#8f5739", accent: "#e6b957" },
  { top: "#e2b649", lower: "#6e3f46", skin: "#a76a48", accent: "#458077" },
  { top: "#4b7e75", lower: "#34383f", skin: "#70412e", accent: "#d47658" },
  { top: "#e7d5ad", lower: "#485f7c", skin: "#b67a55", accent: "#7d4865" },
  { top: "#754e73", lower: "#313741", skin: "#8c5237", accent: "#e8bd62" },
];

const AnimatedPedestrians: FC<{ routes: Route[]; paused: boolean; reducedMotion: boolean }> = ({
  routes,
  paused,
  reducedMotion,
}) => {
  const torsoOutlineRef = useRef<THREE.InstancedMesh>(null);
  const torsoRef = useRef<THREE.InstancedMesh>(null);
  const headRef = useRef<THREE.InstancedMesh>(null);
  const hairRef = useRef<THREE.InstancedMesh>(null);
  const limbRef = useRef<THREE.InstancedMesh>(null);
  const accessoryRef = useRef<THREE.InstancedMesh>(null);
  const elapsed = useRef(0);
  const actor = useMemo(() => new THREE.Object3D(), []);
  const part = useMemo(() => new THREE.Object3D(), []);
  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const gradient = useStreetToonGradient();
  const refs = useMemo<InstancedRef[]>(
    () => [torsoOutlineRef, torsoRef, headRef, hairRef, limbRef, accessoryRef],
    []
  );

  useLayoutEffect(() => {
    refs.forEach(({ current }) => current?.instanceMatrix.setUsage(THREE.DynamicDrawUsage));
    routes.forEach((_, index) => {
      const palette = NPC_PALETTES[index % NPC_PALETTES.length];
      torsoRef.current?.setColorAt(index, new THREE.Color(palette.top));
      headRef.current?.setColorAt(index, new THREE.Color(palette.skin));
      accessoryRef.current?.setColorAt(index, new THREE.Color(palette.accent));
      limbRef.current?.setColorAt(index * 4, new THREE.Color(palette.lower));
      limbRef.current?.setColorAt(index * 4 + 1, new THREE.Color(palette.lower));
      limbRef.current?.setColorAt(index * 4 + 2, new THREE.Color(palette.skin));
      limbRef.current?.setColorAt(index * 4 + 3, new THREE.Color(palette.skin));
    });
    [torsoRef.current, headRef.current, limbRef.current, accessoryRef.current].forEach((mesh) => {
      if (mesh?.instanceColor) mesh.instanceColor.needsUpdate = true;
    });
  }, [refs, routes]);

  useFrame((_, delta) => {
    if (!paused && !reducedMotion) elapsed.current += Math.min(delta, 0.05);
    routes.forEach((route, index) => {
      const pose = getMovingPose(route, elapsed.current, 1.15);
      const style = index % NPC_PALETTES.length;
      const stride = reducedMotion ? 0 : Math.sin(pose.cycle * 2 + index * 0.7) * 0.42;
      const bob = reducedMotion ? 0 : Math.abs(Math.sin(pose.cycle * 2 + index)) * 0.045;
      const heightScale = 0.9 + (index % 4) * 0.045;
      setPartMatrix(
        torsoOutlineRef.current,
        index,
        actor,
        part,
        matrix,
        pose,
        [0, 1.08 + bob, 0],
        [0.72, 1.06 * heightScale, 0.58]
      );
      setPartMatrix(
        torsoRef.current,
        index,
        actor,
        part,
        matrix,
        pose,
        [0, 1.09 + bob, 0.01],
        [0.64, 0.98 * heightScale, 0.5]
      );
      setPartMatrix(
        headRef.current,
        index,
        actor,
        part,
        matrix,
        pose,
        [0, 1.83 * heightScale + bob, 0],
        [0.58, 0.58, 0.58]
      );
      setPartMatrix(
        hairRef.current,
        index,
        actor,
        part,
        matrix,
        pose,
        [0, 1.99 * heightScale + bob, -0.02],
        [0.59, style === 1 ? 0.28 : 0.2, 0.59]
      );
      const legX = 0.16;
      setPartMatrix(
        limbRef.current,
        index * 4,
        actor,
        part,
        matrix,
        pose,
        [-legX, 0.42, 0],
        [0.18, 0.7, 0.18],
        [stride, 0, 0]
      );
      setPartMatrix(
        limbRef.current,
        index * 4 + 1,
        actor,
        part,
        matrix,
        pose,
        [legX, 0.42, 0],
        [0.18, 0.7, 0.18],
        [-stride, 0, 0]
      );
      setPartMatrix(
        limbRef.current,
        index * 4 + 2,
        actor,
        part,
        matrix,
        pose,
        [-0.36, 1.12 + bob, 0],
        [0.14, 0.63, 0.14],
        [-stride * 0.75, 0, -0.12]
      );
      setPartMatrix(
        limbRef.current,
        index * 4 + 3,
        actor,
        part,
        matrix,
        pose,
        [0.36, 1.12 + bob, 0],
        [0.14, 0.63, 0.14],
        [stride * 0.75, 0, 0.12]
      );
      const accessoryScale: [number, number, number] =
        style === 1 ? [0.7, 0.72, 0.1] : style === 3 ? [0.34, 0.42, 0.22] : [0, 0, 0];
      const accessoryPosition: [number, number, number] =
        style === 3 ? [0.34, 0.96, -0.22] : [0, 1.13, -0.31];
      setPartMatrix(
        accessoryRef.current,
        index,
        actor,
        part,
        matrix,
        pose,
        accessoryPosition,
        accessoryScale,
        [0, 0, style === 1 ? -0.24 : 0]
      );
    });
    refs.forEach(({ current }) => {
      if (current) current.instanceMatrix.needsUpdate = true;
    });
  });

  return (
    <group>
      <instancedMesh
        ref={torsoOutlineRef}
        args={[undefined, undefined, routes.length]}
        frustumCulled={false}
      >
        <capsuleGeometry args={[0.5, 0.75, 3, 7]} />
        <meshBasicMaterial color={INK} side={THREE.BackSide} />
      </instancedMesh>
      <instancedMesh
        ref={torsoRef}
        args={[undefined, undefined, routes.length]}
        frustumCulled={false}
      >
        <capsuleGeometry args={[0.5, 0.75, 3, 7]} />
        <meshToonMaterial color="#ffffff" gradientMap={gradient} />
      </instancedMesh>
      <instancedMesh
        ref={headRef}
        args={[undefined, undefined, routes.length]}
        frustumCulled={false}
      >
        <sphereGeometry args={[0.5, 9, 7]} />
        <meshToonMaterial color="#ffffff" gradientMap={gradient} />
      </instancedMesh>
      <instancedMesh
        ref={hairRef}
        args={[undefined, undefined, routes.length]}
        frustumCulled={false}
      >
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshToonMaterial color="#28242a" gradientMap={gradient} />
      </instancedMesh>
      <instancedMesh
        ref={limbRef}
        args={[undefined, undefined, routes.length * 4]}
        frustumCulled={false}
      >
        <capsuleGeometry args={[0.5, 1, 2, 6]} />
        <meshToonMaterial color="#ffffff" gradientMap={gradient} />
      </instancedMesh>
      <instancedMesh
        ref={accessoryRef}
        args={[undefined, undefined, routes.length]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color="#ffffff" gradientMap={gradient} />
      </instancedMesh>
    </group>
  );
};

type PropSpec = {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  rotation?: number;
  color: string;
};

const PropBatch: FC<{ props: PropSpec[] }> = ({ props }) => {
  const fillRef = useRef<THREE.InstancedMesh>(null);
  const gradient = useStreetToonGradient();
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    props.forEach((spec, index) => {
      dummy.position.set(...spec.position);
      dummy.rotation.set(0, spec.rotation ?? 0, 0);
      dummy.scale.set(...spec.size);
      dummy.position.y += 0.025;
      dummy.updateMatrix();
      fillRef.current?.setMatrixAt(index, dummy.matrix);
      fillRef.current?.setColorAt(index, new THREE.Color(spec.color));
    });
    if (fillRef.current) {
      fillRef.current.instanceMatrix.needsUpdate = true;
      fillRef.current.computeBoundingSphere();
      if (fillRef.current.instanceColor) fillRef.current.instanceColor.needsUpdate = true;
    }
  }, [props]);
  if (!props.length) return null;
  return (
    <instancedMesh ref={fillRef} args={[undefined, undefined, props.length]} receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshToonMaterial color="#ffffff" gradientMap={gradient} />
    </instancedMesh>
  );
};

const createWireGeometry = (buildings: BuildingSpec[]) => {
  const positions: number[] = [];
  const selected = buildings
    .filter((building) => building.districtId === "old-city")
    .sort(
      (a, b) =>
        Math.atan2(a.position[1] + 18.9, a.position[0] + 7.57) -
        Math.atan2(b.position[1] + 18.9, b.position[0] + 7.57)
    )
    .slice(0, 14);
  for (let index = 1; index < selected.length; index += 1) {
    const a = selected[index - 1];
    const b = selected[index];
    const ay = Math.min(5.4, a.size[1] + 0.7);
    const by = Math.min(5.4, b.size[1] + 0.7);
    const middle: [number, number, number] = [
      (a.position[0] + b.position[0]) / 2,
      Math.min(ay, by) - 0.65,
      (a.position[1] + b.position[1]) / 2,
    ];
    positions.push(
      a.position[0],
      ay,
      a.position[1],
      ...middle,
      ...middle,
      b.position[0],
      by,
      b.position[1]
    );
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
};

const RooftopTanks: FC<{ buildings: BuildingSpec[]; quality: QualityLevel }> = ({
  buildings,
  quality,
}) => {
  const tankRef = useRef<THREE.InstancedMesh>(null);
  const gradient = useStreetToonGradient();
  const selected = useMemo(
    () =>
      buildings.filter(
        (building, index) =>
          index % (quality === "low" ? 7 : quality === "medium" ? 5 : 4) === 0 &&
          building.size[1] > 3
      ),
    [buildings, quality]
  );
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    selected.forEach((building, index) => {
      dummy.position.set(
        building.position[0] - building.size[0] * 0.18,
        building.size[1] + 0.78,
        building.position[1]
      );
      dummy.rotation.set(0, building.rotation, 0);
      dummy.scale.set(0.78, 0.74, 0.78);
      dummy.updateMatrix();
      tankRef.current?.setMatrixAt(index, dummy.matrix);
    });
    if (tankRef.current) {
      tankRef.current.instanceMatrix.needsUpdate = true;
      tankRef.current.computeBoundingSphere();
    }
  }, [selected]);
  return (
    <instancedMesh ref={tankRef} args={[undefined, undefined, selected.length]}>
      <cylinderGeometry args={[0.5, 0.5, 1, 10]} />
      <meshToonMaterial color="#4f7f77" gradientMap={gradient} />
    </instancedMesh>
  );
};

export const BhopalStreetProps: FC<{
  map: BhopalMapData;
  buildings: BuildingSpec[];
  quality: QualityLevel;
}> = ({ map, buildings, quality }) => {
  const kamla = useMemo(
    () => map.landmarks.find((landmark) => landmark.id === "kamla-park")?.position ?? [-14.5, -5],
    [map.landmarks]
  );
  const newMarket = useMemo(
    () => map.landmarks.find((landmark) => landmark.id === "new-market")?.position ?? [-10, 16.3],
    [map.landmarks]
  );
  const tribal = useMemo(
    () =>
      map.landmarks.find((landmark) => landmark.id === "tribal-museum")?.position ?? [-25.5, 16.9],
    [map.landmarks]
  );
  const props = useMemo(() => {
    const lakeWalls: Omit<PropSpec, "color">[] = [];
    const lakeCaps: Omit<PropSpec, "color">[] = [];
    const rails: Omit<PropSpec, "color">[] = [];
    const benches: Omit<PropSpec, "color">[] = [];
    for (let index = 0; index < (quality === "low" ? 4 : 7); index += 1) {
      const x = kamla[0] - 4.2 + index * 1.45;
      const z = kamla[1] + 2.8 + Math.sin(index * 0.72) * 0.28;
      lakeWalls.push({
        id: `lake-wall-${index}`,
        position: [x, 0.52, z],
        size: [1.28, 0.54, 0.58],
        rotation: -0.08,
      });
      lakeCaps.push({
        id: `lake-cap-${index}`,
        position: [x, 0.83, z],
        size: [1.36, 0.13, 0.65],
        rotation: -0.08,
      });
      rails.push({
        id: `rail-top-${index}`,
        position: [x, 1.08, kamla[1] - 2.25],
        size: [1.38, 0.08, 0.09],
      });
      rails.push({
        id: `rail-mid-${index}`,
        position: [x, 0.72, kamla[1] - 2.25],
        size: [1.38, 0.07, 0.08],
      });
      rails.push({
        id: `rail-post-${index}`,
        position: [x - 0.66, 0.67, kamla[1] - 2.25],
        size: [0.08, 0.92, 0.08],
      });
    }
    [kamla, tribal].forEach((point, pointIndex) => {
      for (let index = 0; index < 3; index += 1) {
        benches.push({
          id: `bench-${pointIndex}-${index}`,
          position: [point[0] - 2 + index * 2.1, 0.52, point[1] + (pointIndex ? 2.5 : 4.15)],
          size: [1.45, 0.22, 0.48],
          rotation: pointIndex ? 0.12 : -0.08,
        });
      }
    });
    const curbDark: Omit<PropSpec, "color">[] = [];
    const curbLight: Omit<PropSpec, "color">[] = [];
    for (let index = 0; index < (quality === "low" ? 8 : 14); index += 1) {
      const item = {
        id: `median-${index}`,
        position: [newMarket[0] - 6.5 + index, 0.41, newMarket[1] + 2.35] as [
          number,
          number,
          number
        ],
        size: [0.92, 0.32, 0.7] as [number, number, number],
        rotation: 0.04,
      };
      (index % 2 ? curbLight : curbDark).push(item);
    }
    return [
      ...lakeWalls.map((spec) => ({ ...spec, color: "#8cb2b6" })),
      ...lakeCaps.map((spec) => ({ ...spec, color: "#b94e49" })),
      ...rails.map((spec) => ({ ...spec, color: "#294d61" })),
      ...benches.map((spec) => ({ ...spec, color: "#806047" })),
      ...curbDark.map((spec) => ({ ...spec, color: "#27282d" })),
      ...curbLight.map((spec) => ({ ...spec, color: "#e7dfc6" })),
    ];
  }, [kamla, newMarket, quality, tribal]);
  const wires = useMemo(() => createWireGeometry(buildings), [buildings]);
  useEffect(() => () => wires.dispose(), [wires]);
  return (
    <group>
      <PropBatch props={props} />
      <RooftopTanks buildings={buildings} quality={quality} />
      {quality !== "low"
        ? <lineSegments geometry={wires}>
            <lineBasicMaterial color="#262329" />
          </lineSegments>
        : null}
    </group>
  );
};

export const AmbientStreetLife: FC<{
  map: BhopalMapData;
  quality: QualityLevel;
  paused: boolean;
  reducedMotion: boolean;
}> = ({ map, quality, paused, reducedMotion }) => {
  const focusPoints = useMemo(
    () =>
      [
        "kamla-park",
        "chowk-bazaar",
        "new-market",
        "tribal-museum",
        "shaurya-smarak",
        "rani-kamlapati-station",
      ]
        .map((id) => map.landmarks.find((landmark) => landmark.id === id)?.position)
        .filter((point): point is Point2 => Boolean(point)),
    [map.landmarks]
  );
  const vehicleCount = quality === "low" ? 8 : quality === "medium" ? 13 : 18;
  const pedestrianCount = quality === "low" ? 12 : quality === "medium" ? 20 : 30;
  const vehicleRoutes = useMemo(
    () =>
      createRoutes(
        map.vehicleGraph,
        vehicleCount,
        `bhopal-traffic:${map.metadata.sourceChecksum}`,
        2.8,
        focusPoints
      ),
    [focusPoints, map.metadata.sourceChecksum, map.vehicleGraph, vehicleCount]
  );
  const pedestrianRoutes = useMemo(
    () =>
      createRoutes(
        map.pedestrianGraph,
        pedestrianCount,
        `bhopal-walkers:${map.metadata.sourceChecksum}`,
        4.2,
        focusPoints
      ),
    [focusPoints, map.metadata.sourceChecksum, map.pedestrianGraph, pedestrianCount]
  );
  return (
    <group>
      <AnimatedVehicles routes={vehicleRoutes} paused={paused} reducedMotion={reducedMotion} />
      <AnimatedPedestrians
        routes={pedestrianRoutes}
        paused={paused}
        reducedMotion={reducedMotion}
      />
    </group>
  );
};
