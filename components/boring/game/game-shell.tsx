import type { BhopalMapData } from "lib/boring/map/types";
import { GameInputController } from "lib/boring/input/actions";
import { ControlMode, QualityLevel, useGameStore } from "lib/boring/state/game-store";
import { useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { Component, ErrorInfo, FC, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";

import { BORING_MISSIONS } from "../boring-missions";
import { GameHud } from "./hud";
import { HtmlMissionDossier, MissionBriefingOverlay, MissionCompleteOverlay, OverlaySwitch, PdaOverlay, TitleOverlay } from "./overlays";
import type { PlayerTelemetry } from "./player-rig";
import { BoringGameScene, PerformanceSnapshot } from "./scene";
import { generateBuildings } from "./world-geometry";

const INITIAL_TELEMETRY: PlayerTelemetry = { x: 0, z: 0, heading: 0, speed: 0, mode: "on-foot" };
const INITIAL_PERFORMANCE: PerformanceSnapshot = {
  fps: 0,
  drawCalls: 0,
  triangles: 0,
  textures: 0,
};

const supportsWebGl = () => {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
          canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }))
    );
  } catch {
    return false;
  }
};

const chooseAutomaticQuality = (): QualityLevel => {
  const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number };
  const memory = navigatorWithMemory.deviceMemory ?? 8;
  if (memory <= 4 || navigator.hardwareConcurrency <= 4 || window.innerWidth < 680) return "low";
  if (memory <= 8 || navigator.hardwareConcurrency <= 8 || window.innerWidth < 1100)
    return "medium";
  return "high";
};

class SceneErrorBoundary extends Component<
  PropsWithChildren<{ onError: (error: Error) => void }>,
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Boring Mode scene failed", error, info.componentStack);
    this.props.onError(error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const LoadingSurface: FC<{
  muted: boolean;
  status: string;
  onMuteToggle: () => void;
  onDossier: () => void;
  onExit: () => void;
}> = ({ muted, status, onMuteToggle, onDossier, onExit }) => (
  <section className="boring-game-loading" aria-live="polite" aria-busy="true">
    <div className="loading-comic-panel">
      <span>BHOPAL DISPATCH / CASE FILE 00</span>
      <h1>BORING MODE</h1>
      <p>{status}</p>
      <div className="boring-loading-track">
        <i />
      </div>
      <p className="boring-loading-controls">WASD / arrows · E interact · P pause · touch ready</p>
      <div>
        <button type="button" onClick={onMuteToggle}>
          {muted ? "SOUND OFF" : "SOUND ON"}
        </button>
        <button type="button" onClick={onDossier}>
          HTML DOSSIER
        </button>
        <button type="button" onClick={onExit}>
          EXIT
        </button>
      </div>
    </div>
  </section>
);

export const GameShell: FC = () => {
  const router = useRouter();
  const reducedMotion = Boolean(useReducedMotion());
  const input = useMemo(() => new GameInputController(), []);
  const [map, setMap] = useState<BhopalMapData | null>(null);
  const [loadingStatus, setLoadingStatus] = useState("Checking graphics and accessibility paths…");
  const [telemetry, setTelemetry] = useState<PlayerTelemetry>(INITIAL_TELEMETRY);
  const [performanceSnapshot, setPerformanceSnapshot] =
    useState<PerformanceSnapshot>(INITIAL_PERFORMANCE);
  const [caption, setCaption] = useState("Welcome to Bhopal Dispatch.");
  const [dossierOpen, setDossierOpen] = useState(false);
  const [failureReason, setFailureReason] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);
  const [mapParseMs, setMapParseMs] = useState(0);

  const store = useGameStore();
  const mission = BORING_MISSIONS[store.currentMissionIndex] ?? BORING_MISSIONS[0];
  const targetAnchorId =
    store.phase === "mission-active" ? mission.completionAnchorId : mission.anchorId;
  const targetAnchor =
    map?.anchors.find((anchor) => anchor.id === targetAnchorId) ?? map?.anchors[0];
  const buildings = useMemo(() => (map ? generateBuildings(map) : []), [map]);
  const gameplayEnabled = ["free-roam", "mission-active"].includes(store.phase) && !dossierOpen;
  const paused = store.phase === "pause" || dossierOpen;

  const exitToPortfolio = useCallback(() => {
    document.documentElement.removeAttribute("data-portfolio-mode");
    const referrer = document.referrer;
    try {
      const previous = referrer ? new URL(referrer) : null;
      if (previous?.origin === window.location.origin && window.history.length > 1) {
        router.back();
        return;
      }
    } catch {
      // Invalid/blocked referrer falls through to the stable root route.
    }
    router.push("/");
  }, [router]);

  const toggleMute = useCallback(() => {
    setMuted((value) => {
      const next = !value;
      try {
        localStorage.setItem("boring-muted", String(next));
      } catch {
        // Local storage is optional.
      }
      return next;
    });
  }, []);

  const setQuality = useCallback((quality: QualityLevel) => {
    useGameStore.getState().setQuality(quality);
    try {
      localStorage.setItem("boring-quality", quality);
    } catch {
      // Local storage is optional.
    }
  }, []);

  useEffect(() => {
    useGameStore.getState().reset();
    document.documentElement.setAttribute("data-portfolio-mode", "boring");
    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    input.attach();
    try {
      setMuted(localStorage.getItem("boring-muted") !== "false");
      const savedQuality = localStorage.getItem("boring-quality") as QualityLevel | null;
      useGameStore
        .getState()
        .setQuality(
          savedQuality && ["high", "medium", "low"].includes(savedQuality)
            ? savedQuality
            : chooseAutomaticQuality()
        );
    } catch {
      useGameStore.getState().setQuality(chooseAutomaticQuality());
    }

    return () => {
      input.detach();
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
      if (document.documentElement.getAttribute("data-portfolio-mode") === "boring") {
        document.documentElement.removeAttribute("data-portfolio-mode");
      }
      useGameStore.getState().reset();
    };
  }, [input]);

  useEffect(() => {
    const controller = new AbortController();
    const webGlAvailable = supportsWebGl();
    if (!webGlAvailable) {
      useGameStore.getState().transition("webgl-unavailable");
      setFailureReason(
        "WebGL is unavailable or the browser reported a major performance caveat. The complete portfolio is available below."
      );
      setDossierOpen(true);
    }
    setLoadingStatus("Loading the pinned OpenStreetMap city file…");
    fetch("/game/maps/bhopal-v1.json", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Map request failed with ${response.status}`);
        return response.text();
      })
      .then((source) => {
        setLoadingStatus("Projecting roads, lakes, districts, and safe anchors…");
        const parseStarted = window.performance.now();
        const parsed = JSON.parse(source) as BhopalMapData;
        setMapParseMs(window.performance.now() - parseStarted);
        if (parsed.metadata.schemaVersion !== 1 || parsed.districts.length !== 4) {
          throw new Error("The local map file has an unsupported schema.");
        }
        setMap(parsed);
        if (webGlAvailable) useGameStore.getState().transition("title");
      })
      .catch((error: Error) => {
        if (error.name === "AbortError") return;
        setFailureReason(`The offline city file could not be loaded: ${error.message}`);
        setDossierOpen(true);
        useGameStore.getState().transition("loading-error");
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      const hidden = document.visibilityState === "hidden";
      useGameStore.getState().setHiddenTabPaused(hidden);
      if (hidden) input.reset();
      else setCaption("Simulation resumed without a time jump.");
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [input]);

  useEffect(
    () =>
      input.subscribe((action) => {
        if (action === "pause" || action === "back") {
          if (dossierOpen && !failureReason) {
            setDossierOpen(false);
            return;
          }
          useGameStore.getState().togglePause();
        }
      }),
    [dossierOpen, failureReason, input]
  );

  const handleStoryStart = () => {
    useGameStore.getState().beginMission(0);
  };

  const handleModeChange = useCallback(
    (mode: ControlMode) => useGameStore.getState().setControlMode(mode),
    []
  );

  const handleTargetReach = useCallback(() => {
    const current = useGameStore.getState();
    const currentMission = BORING_MISSIONS[current.currentMissionIndex] ?? BORING_MISSIONS[0];
    if (current.phase === "free-roam") {
      current.beginMission(current.currentMissionIndex);
      setCaption(`Mission briefing opened: ${currentMission.title}`);
    } else if (current.phase === "mission-active") {
      current.completeMission(currentMission.id);
      setCaption(`${currentMission.title} completed.`);
    }
  }, []);

  const handleSceneFailure = useCallback((error: Error) => {
    setFailureReason(`The WebGL scene stopped safely: ${error.message}`);
    setDossierOpen(true);
    useGameStore.getState().transition("loading-error");
  }, []);

  if (!map && !dossierOpen) {
    return (
      <div className="boring-home">
        <LoadingSurface
          muted={muted}
          status={loadingStatus}
          onMuteToggle={toggleMute}
          onDossier={() => setDossierOpen(true)}
          onExit={exitToPortfolio}
        />
      </div>
    );
  }

  if (dossierOpen && (!map || failureReason)) {
    return (
      <div className="boring-home is-dossier-only">
        <HtmlMissionDossier
          map={map}
          reason={failureReason ?? "The HTML dossier was opened before the city finished loading."}
          canClose={Boolean(map && !failureReason)}
          onClose={() => setDossierOpen(false)}
          onExit={exitToPortfolio}
        />
      </div>
    );
  }

  if (!map || !targetAnchor) return null;

  const debugVisible =
    process.env.NODE_ENV === "development" || Object.values(store.debugLayers).some(Boolean);

  return (
    <div className="boring-home">
      <SceneErrorBoundary onError={handleSceneFailure}>
        <BoringGameScene
          map={map}
          buildings={buildings}
          input={input}
          enabled={gameplayEnabled}
          paused={paused}
          hidden={store.hiddenTabPaused}
          mode={store.controlMode}
          quality={store.quality}
          debugLayers={store.debugLayers}
          targetAnchorId={targetAnchorId}
          missionAccent={mission.accent}
          reducedMotion={reducedMotion}
          onModeChange={handleModeChange}
          onTargetReach={handleTargetReach}
          onTelemetry={setTelemetry}
          onCaption={setCaption}
          onPerformance={setPerformanceSnapshot}
        />
      </SceneErrorBoundary>

      <div className="boring-screen-grade" aria-hidden="true" />
      <header className="boring-game-header">
        <Link href="/boring">
          <a className="boring-wordmark" aria-label="Boring Mode home">
            <span>ARYAN VIJAYWARGIA</span>
            <strong>BORING MODE / BHOPAL</strong>
          </a>
        </Link>
        <button type="button" className="boring-exit" onClick={exitToPortfolio}>
          EXIT TO PORTFOLIO
        </button>
      </header>

      {store.phase !== "title"
        ? <GameHud
            map={map}
            mission={mission}
            missionIndex={store.currentMissionIndex}
            phase={
              store.phase === "pause" && store.phaseBeforePause
                ? store.phaseBeforePause
                : store.phase
            }
            completedCount={store.completedMissionIds.length}
            telemetry={telemetry}
            target={targetAnchor}
            input={input}
            caption={caption}
            muted={muted}
            onMuteToggle={toggleMute}
            onPause={() => store.togglePause()}
          />
        : null}

      <OverlaySwitch>
        {dossierOpen
          ? <HtmlMissionDossier
              key="dossier"
              map={map}
              canClose
              onClose={() => setDossierOpen(false)}
              onExit={exitToPortfolio}
            />
          : store.phase === "title"
          ? <TitleOverlay
              key="title"
              muted={muted}
              onStart={handleStoryStart}
              onFreeRoam={() => store.start()}
              onMuteToggle={toggleMute}
              onOpenDossier={() => setDossierOpen(true)}
              onExit={exitToPortfolio}
            />
          : store.phase === "mission-briefing"
          ? <MissionBriefingOverlay
              key={`brief-${mission.id}`}
              mission={mission}
              onAccept={() => store.activateMission()}
              onBack={() => store.returnToFreeRoam()}
            />
          : store.phase === "mission-complete"
          ? <MissionCompleteOverlay
              key={`complete-${mission.id}`}
              mission={mission}
              isLast={store.currentMissionIndex === BORING_MISSIONS.length - 1}
              onNext={() =>
                store.beginMission(
                  Math.min(store.currentMissionIndex + 1, BORING_MISSIONS.length - 1)
                )
              }
              onFreeRoam={() =>
                store.returnToFreeRoam(
                  Math.min(store.currentMissionIndex + 1, BORING_MISSIONS.length - 1)
                )
              }
              onReplay={() => store.beginMission(store.currentMissionIndex)}
              onExit={exitToPortfolio}
            />
          : store.phase === "pause"
          ? <PdaOverlay
              key="pda"
              map={map}
              currentMissionIndex={store.currentMissionIndex}
              completedMissionIds={store.completedMissionIds}
              quality={store.quality}
              debugLayers={store.debugLayers}
              onQualityChange={setQuality}
              onDebugToggle={store.toggleDebugLayer}
              onResume={() => store.togglePause()}
              onOpenDossier={() => setDossierOpen(true)}
              onExit={exitToPortfolio}
            />
          : null}
      </OverlaySwitch>

      {debugVisible
        ? <aside className="boring-debug-overlay" aria-label="Game performance debug overlay">
            <span>{performanceSnapshot.fps} FPS</span>
            <span>{performanceSnapshot.drawCalls} calls</span>
            <span>{performanceSnapshot.triangles.toLocaleString()} tris</span>
            <span>{buildings.length} blocks</span>
            <span>{store.controlMode}</span>
            <span>{store.phase}</span>
            <span>{store.quality}</span>
            <span>map parse {mapParseMs.toFixed(1)} ms</span>
            <span>
              x {telemetry.x.toFixed(1)} · z {telemetry.z.toFixed(1)}
            </span>
          </aside>
        : null}

      <a
        className="boring-osm-attribution"
        href={map.metadata.licenseUrl}
        target="_blank"
        rel="noreferrer"
      >
        {map.metadata.attribution}
      </a>
    </div>
  );
};
