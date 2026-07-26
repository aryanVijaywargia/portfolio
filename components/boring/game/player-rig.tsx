import { Edges } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import type { BhopalMapData, Point2 } from "lib/boring/map/types";
import { GameInputController } from "lib/boring/input/actions";
import { FixedStepClock } from "lib/boring/simulation/fixed-step";
import type { ControlMode } from "lib/boring/state/game-store";
import { FC, useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { BuildingSpec, collidesWithBuildings, pointInPolygon } from "./world-geometry";

const INK = "#17181d";

export type PlayerTelemetry = {
  x: number;
  z: number;
  heading: number;
  speed: number;
  mode: ControlMode;
};

const AutoRickshaw: FC<{ rootRef: React.MutableRefObject<THREE.Group | null> }> = ({ rootRef }) => {
  return (
    <group ref={rootRef}>
      <mesh position={[0, 0.72, -0.15]} castShadow>
        <boxGeometry args={[2.34, 0.88, 3.25]} />
        <meshBasicMaterial color={INK} />
      </mesh>
      <mesh position={[0, 0.75, -0.08]} castShadow>
        <boxGeometry args={[2.18, 0.78, 3.08]} />
        <meshToonMaterial color="#2f6d53" />
      </mesh>
      <mesh position={[0, 0.96, 0.78]} castShadow>
        <boxGeometry args={[2.12, 0.42, 1.45]} />
        <meshToonMaterial color="#e9b949" />
      </mesh>
      <mesh position={[0, 1.56, -0.58]} castShadow>
        <boxGeometry args={[2.2, 1.35, 1.86]} />
        <meshBasicMaterial color={INK} />
      </mesh>
      <mesh position={[0, 1.55, -0.52]} castShadow>
        <boxGeometry args={[2.02, 1.22, 1.68]} />
        <meshToonMaterial color="#27282d" />
      </mesh>
      <mesh position={[0, 1.48, 0.54]} rotation={[-0.28, 0, 0]}>
        <boxGeometry args={[1.78, 0.82, 0.1]} />
        <meshToonMaterial color="#83b8b0" transparent opacity={0.86} />
        <Edges color={INK} threshold={2} />
      </mesh>
      <mesh position={[0, 2.3, -0.5]} castShadow>
        <boxGeometry args={[2.35, 0.18, 2.02]} />
        <meshToonMaterial color="#e9b949" />
        <Edges color={INK} threshold={2} />
      </mesh>
      {[-0.66, 0.66].map((x) => (
        <mesh key={`light-${x}`} position={[x, 0.82, 1.49]}>
          <boxGeometry args={[0.42, 0.24, 0.08]} />
          <meshBasicMaterial color="#fff1b9" />
          <Edges color={INK} threshold={2} />
        </mesh>
      ))}
      <mesh position={[0, 0.48, 1.67]}>
        <boxGeometry args={[1.72, 0.13, 0.12]} />
        <meshToonMaterial color="#34363b" />
      </mesh>
      {[
        [-1.08, 0.48, -0.8] as [number, number, number],
        [1.08, 0.48, -0.8] as [number, number, number],
        [0, 0.44, 1.28] as [number, number, number],
      ].map((position) => (
        <mesh
          key={position.join(":")}
          position={position}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.48, 0.48, 0.34, 12]} />
          <meshToonMaterial color={INK} />
        </mesh>
      ))}
      <mesh position={[0, 0.72, 1.56]}>
        <boxGeometry args={[0.55, 0.22, 0.08]} />
        <meshBasicMaterial color="#f5ecd7" />
      </mesh>
    </group>
  );
};

type WalkerRefs = {
  leftLeg: React.MutableRefObject<THREE.Mesh | null>;
  rightLeg: React.MutableRefObject<THREE.Mesh | null>;
  leftArm: React.MutableRefObject<THREE.Mesh | null>;
  rightArm: React.MutableRefObject<THREE.Mesh | null>;
};

const Walker: FC<{
  rootRef: React.MutableRefObject<THREE.Group | null>;
  limbRefs: WalkerRefs;
}> = ({ rootRef, limbRefs }) => (
  <group ref={rootRef}>
    <mesh position={[0, 1.78, 0]} castShadow>
      <sphereGeometry args={[0.34, 10, 8]} />
      <meshToonMaterial color="#9a603f" />
      <Edges color={INK} threshold={8} />
    </mesh>
    <mesh position={[0, 1.96, -0.02]} castShadow>
      <sphereGeometry args={[0.35, 9, 6]} />
      <meshToonMaterial color="#27252b" />
    </mesh>
    <mesh position={[0, 1.08, 0]} castShadow>
      <capsuleGeometry args={[0.34, 0.72, 4, 8]} />
      <meshToonMaterial color="#df604f" />
      <Edges color={INK} threshold={8} />
    </mesh>
    <mesh position={[0.29, 1.05, -0.28]} rotation={[0.1, 0, -0.28]} castShadow>
      <boxGeometry args={[0.36, 0.64, 0.2]} />
      <meshToonMaterial color="#e9b949" />
      <Edges color={INK} threshold={8} />
    </mesh>
    {([-0.2, 0.2] as const).map((x, index) => (
      <mesh
        ref={index === 0 ? limbRefs.leftLeg : limbRefs.rightLeg}
        key={x}
        position={[x, 0.38, 0]}
        castShadow
      >
        <capsuleGeometry args={[0.11, 0.48, 3, 6]} />
        <meshToonMaterial color="#2f3d54" />
        <Edges color={INK} threshold={8} />
      </mesh>
    ))}
    {([-0.42, 0.42] as const).map((x, index) => (
      <mesh
        ref={index === 0 ? limbRefs.leftArm : limbRefs.rightArm}
        key={`arm-${x}`}
        position={[x, 1.08, 0]}
        rotation={[0, 0, index === 0 ? -0.1 : 0.1]}
        castShadow
      >
        <capsuleGeometry args={[0.09, 0.52, 3, 6]} />
        <meshToonMaterial color="#9a603f" />
        <Edges color={INK} threshold={8} />
      </mesh>
    ))}
  </group>
);

const shortestAngleDelta = (from: number, to: number) =>
  Math.atan2(Math.sin(to - from), Math.cos(to - from));

type PlayerRigProps = {
  map: BhopalMapData;
  buildings: BuildingSpec[];
  input: GameInputController;
  enabled: boolean;
  paused: boolean;
  mode: ControlMode;
  targetAnchorId: string;
  reducedMotion: boolean;
  onModeChange: (mode: ControlMode) => void;
  onTargetReach: () => void;
  onTelemetry: (telemetry: PlayerTelemetry) => void;
  onCaption: (caption: string) => void;
};

export const PlayerRig: FC<PlayerRigProps> = ({
  map,
  buildings,
  input,
  enabled,
  paused,
  mode,
  targetAnchorId,
  reducedMotion,
  onModeChange,
  onTargetReach,
  onTelemetry,
  onCaption,
}) => {
  const carRef = useRef<THREE.Group | null>(null);
  const walkerRef = useRef<THREE.Group | null>(null);
  const walkerLeftLegRef = useRef<THREE.Mesh | null>(null);
  const walkerRightLegRef = useRef<THREE.Mesh | null>(null);
  const walkerLeftArmRef = useRef<THREE.Mesh | null>(null);
  const walkerRightArmRef = useRef<THREE.Mesh | null>(null);
  const clockRef = useRef(new FixedStepClock());
  const spawn = map.anchors.find((anchor) => anchor.id === "spawn-kamla-park") ?? map.anchors[0];
  const target = map.anchors.find((anchor) => anchor.id === targetAnchorId) ?? map.anchors[0];
  const [spawnX, spawnZ] = spawn.position;
  const carPosition = useRef(new THREE.Vector3(spawnX + 2.5, 0.22, spawnZ + 1));
  const walkerPosition = useRef(new THREE.Vector3(spawnX, 0.22, spawnZ));
  const carHeading = useRef(Math.PI * 0.5);
  const walkerHeading = useRef(0);
  const speed = useRef(0);
  const cameraYaw = useRef(0);
  const cameraYawOffset = useRef(0);
  const cameraDistance = useRef(22);
  const targetReached = useRef(false);
  const lastTelemetryAt = useRef(0);
  const elapsed = useRef(0);
  const { camera } = useThree();
  const cameraTarget = useMemo(() => new THREE.Vector3(), []);
  const cameraPosition = useMemo(() => new THREE.Vector3(), []);
  const forward = useMemo(() => new THREE.Vector3(), []);
  const next = useMemo(() => new THREE.Vector3(), []);
  const side = useMemo(() => new THREE.Vector3(), []);
  const walkDelta = useMemo(() => new THREE.Vector3(), []);
  const cameraLift = useMemo(() => new THREE.Vector3(), []);

  const resetToSpawn = useCallback(() => {
    walkerPosition.current.set(spawnX, 0.22, spawnZ);
    carPosition.current.set(spawnX + 2.5, 0.22, spawnZ + 1);
    carHeading.current = Math.PI * 0.5;
    speed.current = 0;
    clockRef.current.reset();
    onModeChange("on-foot");
    onCaption("Recovered at the last safe curb.");
  }, [onCaption, onModeChange, spawnX, spawnZ]);

  useEffect(() => {
    targetReached.current = false;
  }, [targetAnchorId]);

  useEffect(() => {
    const unsubscribe = input.subscribe((action) => {
      if (action === "interact" || action === "confirm") {
        if (mode === "driving") {
          side.set(Math.cos(carHeading.current), 0, -Math.sin(carHeading.current));
          walkerPosition.current.copy(carPosition.current).addScaledVector(side, 2);
          onModeChange("on-foot");
          onCaption("Vehicle parked safely. Continue on foot.");
        } else if (walkerPosition.current.distanceTo(carPosition.current) < 4.3) {
          onModeChange("driving");
          onCaption("Ride accepted. Drive safely.");
        } else {
          onCaption("Move closer to the yellow auto to enter.");
        }
      }
      if (action === "recover") resetToSpawn();
      if (action === "camera-left") cameraYawOffset.current -= Math.PI / 8;
      if (action === "camera-right") cameraYawOffset.current += Math.PI / 8;
      if (action === "camera-zoom-in")
        cameraDistance.current = Math.max(16, cameraDistance.current - 2);
      if (action === "camera-zoom-out")
        cameraDistance.current = Math.min(30, cameraDistance.current + 2);
      if (action === "namaste") onCaption("Namaste — a respectful greeting and request.");
    });
    return unsubscribe;
  }, [input, mode, onCaption, onModeChange, resetToSpawn, side]);

  const isBlocked = (point: Point2, padding: number) => {
    const { minX, maxX, minZ, maxZ } = map.metadata.worldBounds;
    if (point[0] < minX || point[0] > maxX || point[1] < minZ || point[1] > maxZ) return true;
    if (map.waters.some((water) => pointInPolygon(point, water.points))) return true;
    return collidesWithBuildings(point, buildings, padding);
  };

  useFrame((state, frameDelta) => {
    const car = carRef.current;
    const walker = walkerRef.current;
    if (!car || !walker) return;

    if (!paused) {
      clockRef.current.advance(frameDelta, (delta) => {
        elapsed.current += delta;
        if (!enabled) return;
        if (mode === "driving") {
          const throttle = Number(input.state.accelerate) - Number(input.state.brake);
          const steering = input.state.moveX;
          const maxSpeed = input.state.boost ? 20 : 14;
          if (throttle !== 0) speed.current += throttle * (input.state.boost ? 16 : 12) * delta;
          else speed.current *= Math.exp(-2.5 * delta);
          speed.current = THREE.MathUtils.clamp(speed.current, -6, maxSpeed);
          if (Math.abs(speed.current) > 0.08 && steering !== 0) {
            const direction = speed.current < 0 ? -1 : 1;
            carHeading.current += steering * direction * 1.45 * delta;
          }
          forward.set(Math.sin(carHeading.current), 0, Math.cos(carHeading.current));
          next.copy(carPosition.current).addScaledVector(forward, speed.current * delta);
          if (!isBlocked([next.x, next.z], 1.15)) carPosition.current.copy(next);
          else speed.current *= -0.12;
        } else {
          const dx = input.state.moveX;
          const dz = input.state.moveY;
          if (dx !== 0 || dz !== 0) {
            const length = Math.hypot(dx, dz) || 1;
            const walkSpeed = input.state.boost ? 6.2 : 4.2;
            next
              .copy(walkerPosition.current)
              .add(
                walkDelta.set(
                  (dx / length) * walkSpeed * delta,
                  0,
                  (dz / length) * walkSpeed * delta
                )
              );
            if (!isBlocked([next.x, next.z], 0.35)) walkerPosition.current.copy(next);
            walkerHeading.current = Math.atan2(dx, dz);
          }
        }
      });
    } else {
      clockRef.current.reset();
    }

    car.position.copy(carPosition.current);
    car.rotation.y = carHeading.current;
    walker.position.copy(walkerPosition.current);
    walker.rotation.y = walkerHeading.current;
    const walkerMoving =
      enabled &&
      mode === "on-foot" &&
      (Math.abs(input.state.moveX) > 0.01 || Math.abs(input.state.moveY) > 0.01);
    const gait = walkerMoving && !reducedMotion ? Math.sin(elapsed.current * 10.5) * 0.48 : 0;
    if (walkerLeftLegRef.current) walkerLeftLegRef.current.rotation.x = gait;
    if (walkerRightLegRef.current) walkerRightLegRef.current.rotation.x = -gait;
    if (walkerLeftArmRef.current) walkerLeftArmRef.current.rotation.x = -gait * 0.72;
    if (walkerRightArmRef.current) walkerRightArmRef.current.rotation.x = gait * 0.72;
    car.visible = true;
    walker.visible = mode === "on-foot";

    const focus = mode === "driving" ? carPosition.current : walkerPosition.current;
    const heading = mode === "driving" ? carHeading.current : cameraYaw.current;
    const desiredYaw = heading + cameraYawOffset.current;
    cameraYaw.current +=
      shortestAngleDelta(cameraYaw.current, desiredYaw) *
      (1 - Math.exp(-(reducedMotion ? 2.1 : 3.5) * Math.min(frameDelta, 0.05)));
    const speedLift = mode === "driving" ? Math.min(Math.abs(speed.current) * 0.16, 3.2) : 0;
    forward.set(Math.sin(cameraYaw.current), 0, Math.cos(cameraYaw.current));
    cameraPosition
      .copy(focus)
      .addScaledVector(forward, -cameraDistance.current)
      .add(cameraLift.set(0, 27 + speedLift, 0));
    const cameraAlpha = 1 - Math.exp(-(reducedMotion ? 3 : 5.2) * Math.min(frameDelta, 0.05));
    camera.position.lerp(cameraPosition, cameraAlpha);
    cameraTarget
      .copy(focus)
      .addScaledVector(forward, mode === "driving" ? 5 : 2)
      .setY(0.9);
    camera.lookAt(cameraTarget);
    const perspective = camera as THREE.PerspectiveCamera;
    const desiredFov = 37 + speedLift * 0.7;
    if (Math.abs(perspective.fov - desiredFov) > 0.02) {
      perspective.fov = THREE.MathUtils.lerp(perspective.fov, desiredFov, cameraAlpha);
      perspective.updateProjectionMatrix();
    }

    const activePosition = mode === "driving" ? carPosition.current : walkerPosition.current;
    const distanceToTarget = Math.hypot(
      activePosition.x - target.position[0],
      activePosition.z - target.position[1]
    );
    if (enabled && distanceToTarget < 3.5 && !targetReached.current) {
      targetReached.current = true;
      speed.current = 0;
      onTargetReach();
    }

    if (state.clock.elapsedTime - lastTelemetryAt.current > 0.1) {
      lastTelemetryAt.current = state.clock.elapsedTime;
      onTelemetry({
        x: activePosition.x,
        z: activePosition.z,
        heading: mode === "driving" ? carHeading.current : walkerHeading.current,
        speed: mode === "driving" ? speed.current : input.state.moveY * 4.2,
        mode,
      });
    }
  });

  return (
    <group>
      <AutoRickshaw rootRef={carRef} />
      <Walker
        rootRef={walkerRef}
        limbRefs={{
          leftLeg: walkerLeftLegRef,
          rightLeg: walkerRightLegRef,
          leftArm: walkerLeftArmRef,
          rightArm: walkerRightArmRef,
        }}
      />
    </group>
  );
};
