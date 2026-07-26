export type FixedStepOptions = {
  stepSeconds?: number;
  maxFrameDeltaSeconds?: number;
  maxCatchUpSteps?: number;
};

export type FixedStepResult = {
  steps: number;
  alpha: number;
  droppedSeconds: number;
};

/**
 * Small deterministic clock used by the game simulation. Render cadence can vary while
 * simulation updates continue at a fixed rate with a bounded catch-up loop.
 */
export class FixedStepClock {
  readonly stepSeconds: number;
  readonly maxFrameDeltaSeconds: number;
  readonly maxCatchUpSteps: number;
  private accumulatorSeconds = 0;

  constructor(options: FixedStepOptions = {}) {
    this.stepSeconds = options.stepSeconds ?? 1 / 60;
    this.maxFrameDeltaSeconds = options.maxFrameDeltaSeconds ?? 0.25;
    this.maxCatchUpSteps = options.maxCatchUpSteps ?? 6;
  }

  advance(frameDeltaSeconds: number, update: (stepSeconds: number) => void): FixedStepResult {
    const safeDelta = Number.isFinite(frameDeltaSeconds)
      ? Math.max(0, Math.min(frameDeltaSeconds, this.maxFrameDeltaSeconds))
      : 0;
    this.accumulatorSeconds += safeDelta;

    let steps = 0;
    while (this.accumulatorSeconds >= this.stepSeconds && steps < this.maxCatchUpSteps) {
      update(this.stepSeconds);
      this.accumulatorSeconds -= this.stepSeconds;
      steps += 1;
    }

    let droppedSeconds = 0;
    if (this.accumulatorSeconds >= this.stepSeconds) {
      droppedSeconds = this.accumulatorSeconds - (this.accumulatorSeconds % this.stepSeconds);
      this.accumulatorSeconds %= this.stepSeconds;
    }

    return {
      steps,
      alpha: this.accumulatorSeconds / this.stepSeconds,
      droppedSeconds,
    };
  }

  reset() {
    this.accumulatorSeconds = 0;
  }
}

export const hashSeed = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

/** Mulberry32: compact, reproducible and sufficient for ambient/gameplay layout. */
export const createSeededRandom = (seed: number | string) => {
  let state = typeof seed === "number" ? seed >>> 0 : hashSeed(seed);
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};
