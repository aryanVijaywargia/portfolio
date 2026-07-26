import assert from "node:assert/strict";
import test from "node:test";

import { createSeededRandom, FixedStepClock } from "./fixed-step";

const runAtRenderRate = (renderHz: number) => {
  const clock = new FixedStepClock();
  let position = 0;
  let velocity = 0;
  let updates = 0;
  for (let frame = 0; frame < renderHz * 10; frame += 1) {
    clock.advance(1 / renderHz, (delta) => {
      velocity += 3.25 * delta;
      position += velocity * delta;
      updates += 1;
    });
  }
  return { position, velocity, updates };
};

test("fixed-step results are stable at 30, 60, and 144 Hz render cadence", () => {
  const thirty = runAtRenderRate(30);
  const sixty = runAtRenderRate(60);
  const oneFortyFour = runAtRenderRate(144);
  assert.equal(thirty.updates, 600);
  assert.equal(sixty.updates, 600);
  assert.ok(Math.abs(oneFortyFour.updates - 600) <= 1);
  assert.ok(Math.abs(thirty.position - sixty.position) < 1e-9);
  assert.ok(Math.abs(thirty.position - oneFortyFour.position) < 0.55);
  assert.ok(Math.abs(thirty.velocity - oneFortyFour.velocity) < 0.06);
});

test("catch-up work and bad frame deltas are bounded", () => {
  const clock = new FixedStepClock({ maxFrameDeltaSeconds: 0.25, maxCatchUpSteps: 4 });
  let updates = 0;
  const longFrame = clock.advance(12, () => {
    updates += 1;
  });
  assert.equal(updates, 4);
  assert.equal(longFrame.steps, 4);
  assert.ok(longFrame.droppedSeconds > 0);
  assert.equal(
    clock.advance(Number.NaN, () => {
      updates += 1;
    }).steps,
    0
  );
});

test("seeded ambient randomness is reproducible", () => {
  const first = createSeededRandom("bhopal-ambient");
  const second = createSeededRandom("bhopal-ambient");
  const third = createSeededRandom("different-seed");
  const firstSequence = Array.from({ length: 12 }, first);
  assert.deepEqual(firstSequence, Array.from({ length: 12 }, second));
  assert.notDeepEqual(firstSequence, Array.from({ length: 12 }, third));
});
