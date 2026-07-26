import { create } from "zustand";

export type GamePhase =
  | "boot"
  | "title"
  | "free-roam"
  | "mission-briefing"
  | "mission-active"
  | "dialogue"
  | "pause"
  | "mission-complete"
  | "loading-error"
  | "webgl-unavailable";

export type QualityLevel = "high" | "medium" | "low";
export type ControlMode = "on-foot" | "driving";

export type DebugLayers = {
  districtBounds: boolean;
  laneGraph: boolean;
  pedestrianGraph: boolean;
  collisions: boolean;
  anchors: boolean;
};

const DEFAULT_DEBUG_LAYERS: DebugLayers = {
  districtBounds: false,
  laneGraph: false,
  pedestrianGraph: false,
  collisions: false,
  anchors: false,
};

const ALLOWED_TRANSITIONS: Record<GamePhase, GamePhase[]> = {
  boot: ["title", "loading-error", "webgl-unavailable"],
  title: ["free-roam", "mission-briefing", "loading-error", "webgl-unavailable"],
  "free-roam": ["mission-briefing", "pause", "loading-error"],
  "mission-briefing": ["mission-active", "free-roam", "pause"],
  "mission-active": ["dialogue", "pause", "mission-complete", "free-roam"],
  dialogue: ["mission-active", "pause"],
  pause: [
    "title",
    "free-roam",
    "mission-briefing",
    "mission-active",
    "dialogue",
    "mission-complete",
  ],
  "mission-complete": ["free-roam", "mission-briefing", "pause"],
  "loading-error": ["boot", "title"],
  "webgl-unavailable": ["boot", "title"],
};

type GameStore = {
  phase: GamePhase;
  phaseBeforePause: GamePhase | null;
  quality: QualityLevel;
  controlMode: ControlMode;
  currentMissionIndex: number;
  completedMissionIds: string[];
  hiddenTabPaused: boolean;
  debugLayers: DebugLayers;
  transition: (phase: GamePhase) => boolean;
  start: () => void;
  beginMission: (index: number) => void;
  activateMission: () => void;
  completeMission: (id: string) => void;
  returnToFreeRoam: (nextMissionIndex?: number) => void;
  togglePause: () => void;
  setHiddenTabPaused: (paused: boolean) => void;
  setQuality: (quality: QualityLevel) => void;
  setControlMode: (mode: ControlMode) => void;
  toggleDebugLayer: (key: keyof DebugLayers) => void;
  reset: () => void;
};

const initialState = {
  phase: "boot" as GamePhase,
  phaseBeforePause: null as GamePhase | null,
  quality: "high" as QualityLevel,
  controlMode: "on-foot" as ControlMode,
  currentMissionIndex: 0,
  completedMissionIds: [] as string[],
  hiddenTabPaused: false,
  debugLayers: { ...DEFAULT_DEBUG_LAYERS },
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  transition: (phase) => {
    const current = get().phase;
    if (current === phase) return true;
    if (!ALLOWED_TRANSITIONS[current].includes(phase)) return false;
    set({ phase });
    return true;
  },
  start: () => set({ phase: "free-roam" }),
  beginMission: (currentMissionIndex) => set({ phase: "mission-briefing", currentMissionIndex }),
  activateMission: () => {
    if (get().phase === "mission-briefing") set({ phase: "mission-active" });
  },
  completeMission: (id) => {
    const completedMissionIds = get().completedMissionIds.includes(id)
      ? get().completedMissionIds
      : [...get().completedMissionIds, id];
    set({ phase: "mission-complete", completedMissionIds });
  },
  returnToFreeRoam: (nextMissionIndex) =>
    set((state) => ({
      phase: "free-roam",
      currentMissionIndex: nextMissionIndex ?? state.currentMissionIndex,
    })),
  togglePause: () => {
    const { phase, phaseBeforePause } = get();
    if (phase === "pause") {
      set({ phase: phaseBeforePause ?? "free-roam", phaseBeforePause: null });
      return;
    }
    if (["title", "boot", "loading-error", "webgl-unavailable"].includes(phase)) return;
    set({ phaseBeforePause: phase, phase: "pause" });
  },
  setHiddenTabPaused: (hiddenTabPaused) => set({ hiddenTabPaused }),
  setQuality: (quality) => set({ quality }),
  setControlMode: (controlMode) => set({ controlMode }),
  toggleDebugLayer: (key) =>
    set(({ debugLayers }) => ({
      debugLayers: { ...debugLayers, [key]: !debugLayers[key] },
    })),
  reset: () => set({ ...initialState, debugLayers: { ...DEFAULT_DEBUG_LAYERS } }),
}));

export const canTransition = (from: GamePhase, to: GamePhase) =>
  from === to || ALLOWED_TRANSITIONS[from].includes(to);
