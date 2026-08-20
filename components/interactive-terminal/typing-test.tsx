import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { countCorrect, pickPassage, scoreRun, wpmOf, type TypingPassage, type TypingScore } from "lib/typing-test";

const BEST_WPM_STORAGE_KEY = "typingTestBestWpm";

/**
 * Reading the best score can throw in private-browsing modes, and a throw here
 * would take the whole test down with it. A lost high score is the cheaper loss.
 */
const readBestWpm = (): number | null => {
  try {
    const saved = window.localStorage.getItem(BEST_WPM_STORAGE_KEY);
    const parsed = saved === null ? Number.NaN : Number.parseInt(saved, 10);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const writeBestWpm = (wpm: number) => {
  try {
    window.localStorage.setItem(BEST_WPM_STORAGE_KEY, String(wpm));
  } catch {
    // Nothing to do - the run still scores, it just will not be remembered.
  }
};

type Outcome = {
  score: TypingScore;
  /** Best ever, this run included. */
  best: number;
  isNewBest: boolean;
};

type TypingTestProps = {
  onExit: () => void;
};

const KEY_HINT_CLASS = "text-[#D4D4D4]";

/**
 * The caret is its own zero-width element rather than a left border on the
 * character it sits before: `animate-blink` fades opacity, so riding on the
 * character would blink the letter out along with the caret.
 */
const Caret: FC = () => (
  <span aria-hidden="true" className="relative inline-block w-0 align-baseline">
    <span className="animate-blink absolute -left-px bottom-[-0.2em] top-[-0.05em] border-l-2 border-[#4EC9B0]" />
  </span>
);

const Stat: FC<{ label: string; value: string; muted?: boolean }> = ({ label, value, muted }) => (
  <div>
    <div className="text-[11px] uppercase tracking-[0.1em] text-gray-500">{label}</div>
    <div className={`mt-1 text-lg ${muted ? "text-gray-400" : "text-[#D4D4D4]"}`}>{value}</div>
  </div>
);

export const TypingTest: FC<TypingTestProps> = ({ onExit }) => {
  const [passage, setPassage] = useState<TypingPassage>(() => pickPassage());
  const [typed, setTyped] = useState("");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  // The key handler is registered once, so everything it reads lives in a ref.
  // Re-registering on every keystroke would be a listener swap per character.
  const passageRef = useRef(passage);
  const typedRef = useRef("");
  const startedAtRef = useRef<number | null>(null);
  const isFinishedRef = useRef(false);
  const keystrokesRef = useRef(0);
  const keystrokeErrorsRef = useRef(0);
  const perSecondCharsRef = useRef<number[]>([]);
  const lastSampledLengthRef = useRef(0);
  const bestWpmRef = useRef<number | null>(null);

  useEffect(() => {
    bestWpmRef.current = readBestWpm();
  }, []);

  const restart = useCallback(() => {
    const next = pickPassage(passageRef.current.id);
    passageRef.current = next;
    typedRef.current = "";
    startedAtRef.current = null;
    isFinishedRef.current = false;
    keystrokesRef.current = 0;
    keystrokeErrorsRef.current = 0;
    perSecondCharsRef.current = [];
    lastSampledLengthRef.current = 0;

    setPassage(next);
    setTyped("");
    setElapsedMs(0);
    setIsRunning(false);
    setOutcome(null);
  }, []);

  const finish = useCallback(() => {
    const startedAt = startedAtRef.current;
    if (startedAt === null) return;

    isFinishedRef.current = true;
    const runElapsedMs = Date.now() - startedAt;
    const score = scoreRun({
      target: passageRef.current.text,
      typed: typedRef.current,
      elapsedMs: runElapsedMs,
      keystrokes: keystrokesRef.current,
      keystrokeErrors: keystrokeErrorsRef.current,
      perSecondChars: perSecondCharsRef.current,
    });

    const previousBest = bestWpmRef.current;
    const isNewBest = previousBest !== null && score.wpm > previousBest;
    if (previousBest === null || score.wpm > previousBest) {
      bestWpmRef.current = score.wpm;
      writeBestWpm(score.wpm);
    }

    setElapsedMs(runElapsedMs);
    setIsRunning(false);
    setOutcome({ score, best: bestWpmRef.current ?? score.wpm, isNewBest });
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onExit();
      return;
    }

    if (event.key === "Tab" || (isFinishedRef.current && event.key === "Enter")) {
      event.preventDefault();
      restart();
      return;
    }

    if (isFinishedRef.current) return;

    if (event.key === "Backspace") {
      event.preventDefault();
      typedRef.current =
        event.ctrlKey || event.altKey || event.metaKey
          ? // Word-wise delete: clear the gap first, then the word behind it.
            typedRef.current.replace(/\s+$/, "").replace(/\S+$/, "")
          : typedRef.current.slice(0, -1);
      setTyped(typedRef.current);
      return;
    }

    // Anything held with a modifier is a browser or OS shortcut, not a letter.
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    // Arrows, function keys and the like all report multi-character names.
    if (event.key.length !== 1) return;

    event.preventDefault();

    if (startedAtRef.current === null) {
      startedAtRef.current = Date.now();
      setIsRunning(true);
    }

    const target = passageRef.current.text;
    keystrokesRef.current += 1;
    if (event.key !== target[typedRef.current.length]) keystrokeErrorsRef.current += 1;

    typedRef.current += event.key;
    setTyped(typedRef.current);

    if (typedRef.current.length >= target.length) finish();
  }, [finish, onExit, restart]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // One second-long tick drives both the clock and the consistency samples, so
  // the two can never disagree about how long the run has been going.
  useEffect(() => {
    if (!isRunning) return undefined;

    const intervalId = window.setInterval(
      () => {
        const typedLength = typedRef.current.length;
        perSecondCharsRef.current.push(typedLength - lastSampledLengthRef.current);
        lastSampledLengthRef.current = typedLength;
        setElapsedMs(Date.now() - (startedAtRef.current ?? Date.now()));
      },
      1000
    );

    return () => window.clearInterval(intervalId);
  }, [isRunning]);

  /**
   * Words with their trailing space kept attached, each laid out as one block,
   * so a line only ever breaks between words and never inside one.
   */
  const words = useMemo(() => {
    let start = 0;
    return (passage.text.match(/\S+\s*/g) ?? []).map((text) => {
      const word = { text, start };
      start += text.length;
      return word;
    });
  }, [passage.text]);

  const correctSoFar = countCorrect(passage.text, typed);
  const liveWpm = elapsedMs >= 1000 ? wpmOf(correctSoFar, elapsedMs) : null;
  const progress = Math.round((typed.length / passage.text.length) * 100);

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#1e1e1e] p-4 font-mono text-sm text-[#D4D4D4] dark:bg-transparent">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-cyan-400">$ ./typetest --passage {passage.title}</span>
        <span className="text-xs text-gray-500">
          {outcome ? "done" : isRunning ? `${progress}%` : "ready"}
        </span>
      </div>

      {outcome
        ? <div className="mt-6 flex flex-1 flex-col justify-center">
            <div className="flex items-end gap-10">
              <div>
                <div className="text-[11px] uppercase tracking-[0.1em] text-gray-500">wpm</div>
                <div className="text-5xl font-bold leading-none text-[#4EC9B0]">
                  {outcome.score.wpm}
                </div>
              </div>
              <div className="pb-1">
                <div className="text-[11px] uppercase tracking-[0.1em] text-gray-500">accuracy</div>
                <div className="text-3xl font-bold leading-none text-[#D4D4D4]">
                  {outcome.score.accuracy.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="mt-6 grid max-w-lg grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
              <Stat label="raw" value={`${outcome.score.rawWpm}`} muted />
              <Stat label="consistency" value={`${Math.round(outcome.score.consistency)}%`} muted />
              <Stat label="time" value={`${outcome.score.seconds.toFixed(1)}s`} muted />
              <Stat
                label="chars"
                value={`${outcome.score.correctChars}/${passage.text.length}`}
                muted
              />
            </div>

            <div className="mt-6 text-xs text-gray-500">
              {outcome.score.incorrectChars === 0
                ? "Clean run - not a character out of place."
                : `${outcome.score.incorrectChars} character${
                    outcome.score.incorrectChars === 1 ? "" : "s"
                  } left wrong.`}{" "}
              {outcome.isNewBest
                ? <span className="text-[#4EC9B0]">New personal best.</span>
                : <span>Personal best: {outcome.best} wpm.</span>}
            </div>
          </div>
        : <div className="mt-6 flex flex-1 flex-col justify-center">
            <p className="max-w-3xl select-none whitespace-pre-wrap text-base leading-[1.9] sm:text-lg">
              {words.map((word) => (
                <span key={word.start} className="inline-block whitespace-pre">
                  {[...word.text].map((char, offset) => {
                    const index = word.start + offset;
                    const state =
                      index >= typed.length
                        ? "text-gray-600"
                        : typed[index] === char
                        ? "text-[#D4D4D4]"
                        : "text-[#F48771] underline decoration-[#F48771]";

                    return (
                      <span key={index} className={state}>
                        {index === typed.length && <Caret />}
                        {char}
                      </span>
                    );
                  })}
                </span>
              ))}
            </p>

            <div className="mt-8 flex gap-8">
              <Stat label="wpm" value={liveWpm === null ? "--" : `${liveWpm}`} />
              <Stat label="elapsed" value={`${Math.floor(elapsedMs / 1000)}s`} muted />
              <Stat
                label="errors"
                value={`${typed.length - correctSoFar}`}
                muted={typed.length === correctSoFar}
              />
            </div>
          </div>}

      <div className="mt-6 border-t border-gray-700 pt-3">
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          {!outcome && !isRunning && <span>Start typing to begin the clock</span>}
          {outcome && (
            <span>
              <span className={KEY_HINT_CLASS}>Enter</span> Again
            </span>
          )}
          <span>
            <span className={KEY_HINT_CLASS}>Tab</span> New passage
          </span>
          <span>
            <span className={KEY_HINT_CLASS}>Ctrl/Opt+Backspace</span> Delete word
          </span>
          <span>
            <span className={KEY_HINT_CLASS}>Esc</span> Back to shell
          </span>
        </div>
      </div>
    </div>
  );
};
