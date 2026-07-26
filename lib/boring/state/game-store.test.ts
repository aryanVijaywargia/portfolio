import assert from "node:assert/strict";
import test, { beforeEach } from "node:test";

import { canTransition, useGameStore } from "./game-store";

beforeEach(() => useGameStore.getState().reset());

test("the explicit game flow accepts valid transitions and rejects invalid ones", () => {
  const store = useGameStore.getState();
  assert.equal(store.transition("mission-active"), false);
  assert.equal(useGameStore.getState().phase, "boot");
  assert.equal(store.transition("title"), true);
  useGameStore.getState().start();
  assert.equal(useGameStore.getState().phase, "free-roam");
  useGameStore.getState().beginMission(1);
  assert.equal(useGameStore.getState().phase, "mission-briefing");
  assert.equal(useGameStore.getState().currentMissionIndex, 1);
  useGameStore.getState().activateMission();
  assert.equal(useGameStore.getState().phase, "mission-active");
  assert.equal(canTransition("mission-active", "mission-complete"), true);
});

test("pause restores the exact prior state and reset removes transient state", () => {
  const store = useGameStore.getState();
  store.transition("title");
  useGameStore.getState().beginMission(2);
  useGameStore.getState().togglePause();
  assert.equal(useGameStore.getState().phase, "pause");
  assert.equal(useGameStore.getState().phaseBeforePause, "mission-briefing");
  useGameStore.getState().togglePause();
  assert.equal(useGameStore.getState().phase, "mission-briefing");
  useGameStore.getState().setHiddenTabPaused(true);
  useGameStore.getState().setControlMode("driving");
  useGameStore.getState().reset();
  assert.equal(useGameStore.getState().phase, "boot");
  assert.equal(useGameStore.getState().hiddenTabPaused, false);
  assert.equal(useGameStore.getState().controlMode, "on-foot");
});

test("mission rewards are idempotent on replay", () => {
  useGameStore.getState().completeMission("runtime-relay");
  useGameStore.getState().completeMission("runtime-relay");
  assert.deepEqual(useGameStore.getState().completedMissionIds, ["runtime-relay"]);
  useGameStore.getState().completeMission("continue-long-run");
  assert.deepEqual(useGameStore.getState().completedMissionIds, [
    "runtime-relay",
    "continue-long-run",
  ]);
});
