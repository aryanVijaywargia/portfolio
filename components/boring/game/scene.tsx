import { EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { BhopalMapData } from "lib/boring/map/types";
import type { DebugLayers, QualityLevel, ControlMode } from "lib/boring/state/game-store";
import { GameInputController } from "lib/boring/input/actions";
import { FC, useRef } from "react";
import * as THREE from "three";

import { PlayerRig, PlayerTelemetry } from "./player-rig";
import { AmbientStreetLife } from "./street-life";
import { BhopalWorld } from "./world";
import { BuildingSpec } from "./world-geometry";

export type PerformanceSnapshot = {
  fps: number;
  drawCalls: number;
  triangles: number;
  textures: number;
};

const PerformanceReporter: FC<{ onReport: (snapshot: PerformanceSnapshot) => void }> = ({
  onReport,
}) => {
  const { gl } = useThree();
  const frames = useRef(0);
  const elapsed = useRef(0);
  useFrame((_, delta) => {
    frames.current += 1;
    elapsed.current += delta;
    if (elapsed.current < 0.75) return;
    onReport({
      fps: Math.round(frames.current / elapsed.current),
      drawCalls: Math.round(gl.info.render.calls / frames.current),
      triangles: Math.round(gl.info.render.triangles / frames.current),
      textures: gl.info.memory.textures,
    });
    gl.info.reset();
    frames.current = 0;
    elapsed.current = 0;
  });
  return null;
};

type BoringGameSceneProps = {
  map: BhopalMapData;
  buildings: BuildingSpec[];
  input: GameInputController;
  enabled: boolean;
  paused: boolean;
  hidden: boolean;
  mode: ControlMode;
  quality: QualityLevel;
  debugLayers: DebugLayers;
  targetAnchorId: string;
  missionAccent: string;
  reducedMotion: boolean;
  onModeChange: (mode: ControlMode) => void;
  onTargetReach: () => void;
  onTelemetry: (telemetry: PlayerTelemetry) => void;
  onCaption: (caption: string) => void;
  onPerformance: (snapshot: PerformanceSnapshot) => void;
};

export const BoringGameScene: FC<BoringGameSceneProps> = ({
  map,
  buildings,
  input,
  enabled,
  paused,
  hidden,
  mode,
  quality,
  debugLayers,
  targetAnchorId,
  missionAccent,
  reducedMotion,
  onModeChange,
  onTargetReach,
  onTelemetry,
  onCaption,
  onPerformance,
}) => {
  const dpr = quality === "high" ? [1, 1.5] : quality === "medium" ? [1, 1.25] : [1, 1];
  const shadows = quality !== "low";
  const shadowMapSize = quality === "high" ? 1024 : 768;
  return (
    <Canvas
      className="boring-canvas"
      shadows={shadows}
      frameloop={hidden ? "demand" : "always"}
      dpr={dpr as [number, number]}
      camera={{ position: [0, 20, -17], fov: 37, near: 0.1, far: 240 }}
      gl={{ antialias: quality !== "low", alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl, scene }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.info.autoReset = false;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.shadowMap.enabled = shadows;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        scene.background = new THREE.Color("#d9a06f");
        scene.fog = new THREE.Fog(
          "#d9a06f",
          quality === "low" ? 72 : 92,
          quality === "low" ? 155 : 205
        );
      }}
    >
      <hemisphereLight args={["#f6dfbd", "#765c4a", quality === "low" ? 1.35 : 1.15]} />
      <directionalLight
        position={[-58, 76, 42]}
        color="#ffd6a1"
        intensity={2.7}
        castShadow={shadows}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-left={-72}
        shadow-camera-right={72}
        shadow-camera-top={72}
        shadow-camera-bottom={-72}
        shadow-camera-near={4}
        shadow-camera-far={180}
        shadow-bias={-0.00015}
        shadow-normalBias={0.035}
      />
      <BhopalWorld
        map={map}
        buildings={buildings}
        quality={quality}
        debugLayers={debugLayers}
        targetAnchorId={targetAnchorId}
        missionAccent={missionAccent}
      />
      <AmbientStreetLife
        map={map}
        quality={quality}
        paused={paused || hidden}
        reducedMotion={reducedMotion}
      />
      <PlayerRig
        map={map}
        buildings={buildings}
        input={input}
        enabled={enabled}
        paused={paused || hidden}
        mode={mode}
        targetAnchorId={targetAnchorId}
        reducedMotion={reducedMotion}
        onModeChange={onModeChange}
        onTargetReach={onTargetReach}
        onTelemetry={onTelemetry}
        onCaption={onCaption}
      />
      <PerformanceReporter onReport={onPerformance} />
      {quality !== "low" && !reducedMotion
        ? <EffectComposer multisampling={0}>
            <Noise opacity={quality === "high" ? 0.032 : 0.018} />
            <Vignette eskil={false} offset={0.28} darkness={0.48} />
          </EffectComposer>
        : null}
    </Canvas>
  );
};
