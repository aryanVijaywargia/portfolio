import { FC, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { buildTypingStream, countCorrect, scoreRun, TYPING_DURATIONS, wpmOf, type TypingDuration, type TypingScore } from "lib/typing-test";

const BEST_WPM_STORAGE_KEY = "typingTestBestWpm";

const DEFAULT_DURATION: TypingDuration = 30;

/**
 * Type and line geometry, fixed rather than responsive.
 *
 * The test only runs on a real keyboard at >=1024px, so the panel is always the
 * maximised terminal, and pinning the numbers makes every piece of layout maths
 * below - which line the caret is on, how far to scroll - exact instead of
 * measured.
 */
const FONT_SIZE = 24;
const LINE_HEIGHT = 44;
const VISIBLE_LINES = 3;

/**
 * The caret is sized and placed off the line grid, not off the character it
 * sits before. A glyph's measured box changes with the font that happens to be
 * resolved at that moment - it measured 18px before the monospace face settled
 * and 28px after - which showed up as a caret that changed height on the first
 * keystroke.
 */
const CARET_HEIGHT = 30;
const CARET_TOP_INSET = (LINE_HEIGHT - CARET_HEIGHT) / 2;

/** Drives the countdown and the per-second consistency samples. */
const TICK_MS = 100;

/** The caret holds still while typing and only blinks once the reader stops. */
const IDLE_AFTER_MS = 1000;

const PROGRESS_CELLS = 28;

/**
 * The passage is dim until it is typed, then bright. The gap between the two is
 * what tells the reader where they are, so it is deliberately wide.
 */
const CHAR_PENDING = "text-[#5C5F66]";
const CHAR_CORRECT = "text-[#E8E8E3]";
const CHAR_WRONG = "text-[#F48771] underline decoration-[#F48771] decoration-2 underline-offset-4";

const ACCENT = "#4EC9B0";

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

type CaretBox = { left: number; line: number };

type TypingTestProps = {
  onExit: () => void;
};

const KEY_HINT_CLASS = "text-[#D4D4D4]";

const CAPTION_CLASS = "text-[10px] uppercase tracking-[0.18em] text-[#6B6E75]";

/** A label-and-value row, aligned on a character grid the way a shell would. */
const OutputRow: FC<{ label: string; children: ReactNode }> = ({ label, children }) => (
  <div className="leading-[1.9]">
    <span className="inline-block w-[13ch] text-[#6B6E75]">{label}</span>
    <span className="text-[#E8E8E3]">{children}</span>
  </div>
);

export const TypingTest: FC<TypingTestProps> = ({ onExit }) => {
  const [duration, setDuration] = useState<TypingDuration>(DEFAULT_DURATION);
  const [stream, setStream] = useState(() => buildTypingStream(DEFAULT_DURATION));
  const [typed, setTyped] = useState("");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [caret, setCaret] = useState<CaretBox | null>(null);
  const [isIdle, setIsIdle] = useState(true);
  const [isFocused, setIsFocused] = useState(true);

  // The key handler is registered once, so everything it reads lives in a ref.
  const streamRef = useRef(stream);
  const durationRef = useRef<TypingDuration>(duration);
  const typedRef = useRef("");
  const startedAtRef = useRef<number | null>(null);
  const isFinishedRef = useRef(false);
  const keystrokesRef = useRef(0);
  const keystrokeErrorsRef = useRef(0);
  const perSecondCharsRef = useRef<number[]>([]);
  const lastSampledLengthRef = useRef(0);
  const bestWpmRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);

  const focusInput = useCallback(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(focusInput, [focusInput]);

  useEffect(() => {
    bestWpmRef.current = readBestWpm();
  }, []);

  const restart = useCallback((nextDuration: TypingDuration = durationRef.current) => {
    const nextStream = buildTypingStream(nextDuration);

    durationRef.current = nextDuration;
    streamRef.current = nextStream;
    typedRef.current = "";
    startedAtRef.current = null;
    isFinishedRef.current = false;
    keystrokesRef.current = 0;
    keystrokeErrorsRef.current = 0;
    perSecondCharsRef.current = [];
    lastSampledLengthRef.current = 0;

    setDuration(nextDuration);
    setStream(nextStream);
    setTyped("");
    setElapsedMs(0);
    setIsRunning(false);
    setOutcome(null);
    focusInput();
  }, [focusInput]);

  const finish = useCallback(() => {
    const startedAt = startedAtRef.current;
    if (startedAt === null || isFinishedRef.current) return;

    isFinishedRef.current = true;
    const runElapsedMs = Date.now() - startedAt;
    const score = scoreRun({
      target: streamRef.current,
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

  const handleKeyDown = useCallback((event: ReactKeyboardEvent<HTMLInputElement>) => {
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

    const target = streamRef.current;
    keystrokesRef.current += 1;
    if (event.key !== target[typedRef.current.length]) keystrokeErrorsRef.current += 1;

    typedRef.current += event.key;
    setTyped(typedRef.current);

    // Only a safety net: the clock is what normally ends a timed run.
    if (typedRef.current.length >= target.length) finish();
  }, [finish, restart]);

  // Escape stays on the window rather than the field: it is the way out, and it
  // has to work even when focus has wandered somewhere else on the page.
  //
  // Capture phase, because the capture path starts at the window: this runs
  // before any document-level handler, including a keyboard extension binding
  // Escape to leave its own insert mode. Inside a typing test, leaving the test
  // is what Escape should do.
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onExit();
    };

    window.addEventListener("keydown", handleEscape, true);
    return () => window.removeEventListener("keydown", handleEscape, true);
  }, [onExit]);

  // One tick drives the countdown and the consistency samples, so the two can
  // never disagree about how long the run has been going.
  useEffect(() => {
    if (!isRunning) return undefined;

    const intervalId = window.setInterval(
      () => {
        const startedAt = startedAtRef.current;
        if (startedAt === null) return;

        const elapsed = Date.now() - startedAt;
        setElapsedMs(elapsed);

        // Catches up whole seconds one at a time, so a throttled tab records the
        // idle seconds it missed rather than folding them into one huge sample.
        const wholeSeconds = Math.floor(elapsed / 1000);
        while (perSecondCharsRef.current.length < wholeSeconds) {
          const typedLength = typedRef.current.length;
          perSecondCharsRef.current.push(typedLength - lastSampledLengthRef.current);
          lastSampledLengthRef.current = typedLength;
        }

        if (elapsed >= durationRef.current * 1000) finish();
      },
      TICK_MS
    );

    return () => window.clearInterval(intervalId);
  }, [finish, isRunning]);

  // The caret blinks only once the reader has stopped; while typing it holds
  // still, so it reads as a position rather than as a flashing distraction.
  useEffect(() => {
    setIsIdle(false);
    const timeoutId = window.setTimeout(() => setIsIdle(true), IDLE_AFTER_MS);
    return () => window.clearTimeout(timeoutId);
  }, [typed]);

  /**
   * Words with their trailing space kept attached, each laid out as one block,
   * so a line only ever breaks between words and never inside one.
   */
  const words = useMemo(
    () =>
      // `start` comes from the regex engine rather than a running total. The
      // obvious version - capture the offset, then advance it - was folded by
      // the production minifier into `total += text.length, { text, start: total }`,
      // which advances first and reports every word one word-length too far.
      // Nothing here depends on statement order, so there is nothing to fold.
      [...stream.matchAll(/\S+\s*/g)].map((match) => ({
        text: match[0],
        start: match.index ?? 0,
      })),
    [stream]
  );

  // Measured rather than computed: where a character lands depends on where the
  // line broke, which only layout knows.
  useLayoutEffect(() => {
    const container = wordsRef.current;
    const target = container?.querySelector<HTMLElement>("[data-caret]");
    if (!container || !target) return;

    const containerBox = container.getBoundingClientRect();
    const targetBox = target.getBoundingClientRect();
    setCaret({
      left: targetBox.left - containerBox.left,
      // Which line the character landed on. Rounding is safe: a glyph sits
      // roughly centred in its line box, nowhere near the next line's grid slot.
      line: Math.round((targetBox.top - containerBox.top) / LINE_HEIGHT),
    });
  }, [typed, stream]);

  // Keep the caret on the second of the three visible lines once it gets there,
  // so there is always a line of context behind and a line of runway ahead.
  const lineOffset = caret ? Math.max(0, (caret.line - 1) * LINE_HEIGHT) : 0;

  const correctSoFar = countCorrect(stream, typed);
  const liveWpm = elapsedMs >= 1000 ? wpmOf(correctSoFar, elapsedMs) : null;
  const liveAccuracy =
    keystrokesRef.current === 0
      ? 100
      : ((keystrokesRef.current - keystrokeErrorsRef.current) / keystrokesRef.current) * 100;

  const remainingSeconds = outcome ? 0 : Math.max(0, Math.ceil(duration - elapsedMs / 1000));
  const filledCells = Math.round(
    (Math.min(elapsedMs / 1000, duration) / duration) * PROGRESS_CELLS
  );

  const status = outcome ? "done" : isRunning ? "typing" : "ready";

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-[#1e1e1e] p-4 font-mono text-sm text-[#D4D4D4] dark:bg-transparent">
      {/* Keystrokes are read off a real focused field rather than off `window`.
          A page with nothing focused looks idle to the browser and to keyboard
          extensions - Vimium treats it as normal mode and eats `j`, `f`, `d`
          before the page sees them. Focus inside an editable field is the
          signal that the reader is typing, which is why the shell's own input
          has never had this problem. The field covers the panel so a click
          anywhere puts focus back, and stays invisible because every character
          key is handled and prevented rather than inserted. */}
      <input
        ref={inputRef}
        type="text"
        value=""
        onChange={() => undefined}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-label="Type the passage"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className="absolute inset-0 z-10 h-full w-full cursor-default bg-transparent p-0 opacity-0 outline-none"
      />

      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[#4EC9B0]">$ ./typetest --time {duration}</span>
        <span className="text-xs text-[#6B6E75]">{status}</span>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        {/* Kept in the layout while running so the passage never shifts under
            the reader mid-word. */}
        <div className={`flex items-center gap-2 ${isRunning ? "invisible" : ""}`}>
          <span className={CAPTION_CLASS}>time</span>
          {TYPING_DURATIONS.map((option) => (
            <button
              key={option}
              type="button"
              // Above the capture field, which covers everything else.
              className={`relative z-20 px-1 text-xs ${
                option === duration ? "text-[#4EC9B0]" : "text-[#6B6E75] hover:text-[#D4D4D4]"
              }`}
              onClick={() => restart(option)}
            >
              {option === duration ? `[${option}]` : ` ${option} `}
            </button>
          ))}
        </div>

        {outcome
          ? <div className="mt-6">
              <div className="flex items-end gap-10">
                <div>
                  <div className={CAPTION_CLASS}>wpm</div>
                  <div className="text-[52px] font-bold leading-none text-[#4EC9B0]">
                    {outcome.score.wpm}
                  </div>
                </div>
                <div className="pb-1">
                  <div className={CAPTION_CLASS}>accuracy</div>
                  <div className="text-[30px] font-bold leading-none text-[#E8E8E3]">
                    {outcome.score.accuracy.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="mt-7 text-[13px]">
                <OutputRow label="raw">{outcome.score.rawWpm} wpm</OutputRow>
                <OutputRow label="consistency">{Math.round(outcome.score.consistency)}%</OutputRow>
                <OutputRow label="time">{duration}s</OutputRow>
                <OutputRow label="characters">
                  {outcome.score.correctChars} correct
                  <span className="text-[#6B6E75]"> / </span>
                  {outcome.score.incorrectChars} wrong
                </OutputRow>
                <OutputRow label="best">
                  {outcome.best} wpm
                  {outcome.isNewBest && <span className="text-[#4EC9B0]"> {"<-"} new</span>}
                </OutputRow>
              </div>

              <div className="mt-6 text-[13px] text-[#4EC9B0]">
                ${" "}
                <span aria-hidden="true" className="animate-blink">
                  &#9608;
                </span>
              </div>
            </div>
          : <>
              <div className="mt-5 flex items-center gap-4">
                <span
                  className="w-[3ch] text-[40px] font-bold leading-none text-[#4EC9B0]"
                  aria-label={`${remainingSeconds} seconds left`}
                >
                  {remainingSeconds}
                </span>
                <span className="text-[13px] tracking-[0.1em]">
                  <span className="text-[#6B6E75]">[</span>
                  <span className="text-[#4EC9B0]">{"#".repeat(filledCells)}</span>
                  <span className="text-[#3A3D42]">{".".repeat(PROGRESS_CELLS - filledCells)}</span>
                  <span className="text-[#6B6E75]">]</span>
                </span>
              </div>

              {/* Three lines, clipped, scrolling up a line at a time - the whole
                stream is rendered, and only the window onto it moves. */}
              <div
                className="relative mt-6 overflow-hidden"
                style={{ height: LINE_HEIGHT * VISIBLE_LINES }}
              >
                <div
                  ref={wordsRef}
                  className="absolute inset-x-0 top-0 select-none transition-transform duration-150 ease-out"
                  style={{
                    transform: `translateY(${-lineOffset}px)`,
                    fontSize: FONT_SIZE,
                    lineHeight: `${LINE_HEIGHT}px`,
                  }}
                >
                  {caret && (
                    <span
                      aria-hidden="true"
                      className={`absolute w-[3px] rounded-full ${isIdle ? "animate-pulse" : ""}`}
                      style={{
                        left: caret.left,
                        top: caret.line * LINE_HEIGHT + CARET_TOP_INSET,
                        height: CARET_HEIGHT,
                        backgroundColor: ACCENT,
                        // Slides between characters rather than jumping, which is
                        // what makes it readable as a position at speed.
                        transition: "left 90ms linear, top 90ms linear",
                      }}
                    />
                  )}

                  {words.map((word) => (
                    <span key={word.start} className="inline-block whitespace-pre">
                      {[...word.text].map((char, offset) => {
                        const index = word.start + offset;
                        const state =
                          index >= typed.length
                            ? CHAR_PENDING
                            : typed[index] === char
                            ? CHAR_CORRECT
                            : CHAR_WRONG;

                        return (
                          <span
                            key={index}
                            className={state}
                            {...(index === typed.length ? { "data-caret": "true" } : {})}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-8 text-[13px]">
                <span>
                  <span className={CAPTION_CLASS}>wpm </span>
                  <span className="text-[#E8E8E3]">{liveWpm === null ? "--" : liveWpm}</span>
                </span>
                <span>
                  <span className={CAPTION_CLASS}>acc </span>
                  <span className="text-[#E8E8E3]">
                    {isRunning ? `${Math.round(liveAccuracy)}%` : "--"}
                  </span>
                </span>
              </div>
            </>}
      </div>

      <div className="mt-6 border-t border-[#2F3237] pt-3">
        <div className="flex flex-wrap gap-4 text-xs text-[#6B6E75]">
          {!isFocused
            ? <span className="text-[#F48771]">Click here to focus</span>
            : !outcome && !isRunning && <span>Start typing to begin the clock</span>}
          {outcome && (
            <span>
              <span className={KEY_HINT_CLASS}>Enter</span> Again
            </span>
          )}
          <span>
            <span className={KEY_HINT_CLASS}>Tab</span> Restart
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
