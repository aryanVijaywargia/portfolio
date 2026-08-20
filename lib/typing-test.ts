/**
 * Scoring and copy for the terminal's typing test.
 *
 * The arithmetic lives here rather than in the component because the component
 * is mostly spans and key handling, and the numbers are the part worth being
 * able to read on their own.
 */

/** Typing tests have always counted a "word" as five characters, spaces included. */
const CHARS_PER_WORD = 5;
const MS_PER_MINUTE = 60_000;

export type TypingPassage = {
  id: string;
  /** A short label for the passage, shown while typing. */
  title: string;
  text: string;
};

/**
 * Medium-to-hard passages: mixed case, punctuation, digits and apostrophes,
 * which is where the difficulty in a typing test actually lives.
 *
 * Every character has to be reachable on a standard keyboard. An em dash or a
 * curly quote cannot be typed, so the test would stall on it forever - keep
 * this ASCII.
 */
export const TYPING_PASSAGES: TypingPassage[] = [
  {
    id: "durability",
    title: "durability",
    text:
      "A durable execution engine does not remember what happened; it remembers what was decided. " +
      "Replay the log, skip the effects you already applied, and the crash you feared becomes a pause you slept through.",
  },
  {
    id: "tail-latency",
    title: "tail latency",
    text:
      "Latency is a distribution, not a number. The p50 flatters you, the p99 tells the truth, " +
      "and the p99.9 is where your users live when the cache goes cold. Measure the tail, or the tail will measure you.",
  },
  {
    id: "search",
    title: "search",
    text:
      "Search is mostly a spelling problem. Users type 'kubernets', 'postgress', and 'recieve', " +
      "then blame the index when nothing comes back. A good analyzer forgives them quietly, and logs what it forgave.",
  },
  {
    id: "deletes",
    title: "deletes",
    text:
      "The best deploy I ever shipped removed 1,400 lines and added none. Nobody noticed on Monday, " +
      "the graphs got boring by Wednesday, and by Friday the on-call phone had finally stopped ringing at 3 a.m.",
  },
  {
    id: "consensus",
    title: "consensus",
    text:
      "Every distributed system is a disagreement about what time it is. Clocks drift, packets arrive " +
      "out of order, and two nodes will swear they were both the leader. You pick which lie you can live with.",
  },
];

export type TypingRun = {
  /** The passage the reader was given. */
  target: string;
  /** What they left on screen when the run ended, mistakes included. */
  typed: string;
  elapsedMs: number;
  /** Every key that produced a character, including ones later corrected. */
  keystrokes: number;
  /** Of those, the ones that did not match the passage when they were pressed. */
  keystrokeErrors: number;
  /** Characters committed during each whole second, for consistency. */
  perSecondChars: number[];
};

export type TypingScore = {
  /** Correct characters only - the number people mean by "my WPM". */
  wpm: number;
  /** Everything typed, mistakes included. The gap to `wpm` is what errors cost. */
  rawWpm: number;
  /** Share of keystrokes that were right first time, 0-100. */
  accuracy: number;
  /** How even the pace was, 0-100. Steady typing scores high. */
  consistency: number;
  seconds: number;
  correctChars: number;
  incorrectChars: number;
};

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

/** Characters of `typed` that landed on the right letter of `target`. */
export const countCorrect = (target: string, typed: string): number =>
  [...typed].filter((char, index) => char === target[index]).length;

/**
 * Words per minute for a character count.
 *
 * A run can only be scored once time has passed, so the elapsed floor keeps a
 * divide-by-zero from reaching the screen as "Infinity wpm".
 */
export const wpmOf = (chars: number, elapsedMs: number): number =>
  Math.round(chars / CHARS_PER_WORD / (Math.max(elapsedMs, 1) / MS_PER_MINUTE));

/**
 * Consistency as the inverse of how much the per-second pace wandered.
 *
 * A coefficient of variation (spread relative to the average) rather than raw
 * spread, so a fast typist is not punished for having larger absolute swings
 * than a slow one.
 */
const consistencyOf = (perSecondChars: number[]): number => {
  if (perSecondChars.length < 2) return 100;

  const mean = perSecondChars.reduce((sum, value) => sum + value, 0) / perSecondChars.length;
  if (mean <= 0) return 0;

  const variance =
    perSecondChars.reduce((sum, value) => sum + (value - mean) ** 2, 0) / perSecondChars.length;

  return clampPercent((1 - Math.sqrt(variance) / mean) * 100);
};

export const scoreRun = ({
  target,
  typed,
  elapsedMs,
  keystrokes,
  keystrokeErrors,
  perSecondChars,
}: TypingRun): TypingScore => {
  const correctChars = countCorrect(target, typed);

  return {
    wpm: wpmOf(correctChars, elapsedMs),
    rawWpm: wpmOf(typed.length, elapsedMs),
    accuracy:
      keystrokes === 0 ? 100 : clampPercent(((keystrokes - keystrokeErrors) / keystrokes) * 100),
    consistency: consistencyOf(perSecondChars),
    seconds: elapsedMs / 1000,
    correctChars,
    incorrectChars: typed.length - correctChars,
  };
};

/**
 * A passage other than the one just typed, so retrying is a fresh test rather
 * than a memory exercise.
 */
export const pickPassage = (excludeId?: string): TypingPassage => {
  const pool = TYPING_PASSAGES.filter((passage) => passage.id !== excludeId);
  const candidates = pool.length > 0 ? pool : TYPING_PASSAGES;
  return candidates[Math.floor(Math.random() * candidates.length)];
};
