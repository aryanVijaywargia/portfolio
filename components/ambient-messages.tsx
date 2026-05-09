import { usePortfolioMode } from "components/_stores/portfolio-mode-context";
import { FC, useCallback, useEffect, useRef, useState } from "react";

const REGULAR_MESSAGES = [
  "Aren't you going to press some links?",
  "Try the terminal - type `help`",
  "Hover the photo to cycle",
  "Hit the resume button",
];

type AmbientMessage = {
  id: number;
  text: string;
  topPx: number;
  leftPx: number;
  rotation: number;
};

const FIRST_DELAY_MS = 9000;
const MIN_DELAY_MS = 18000;
const MAX_DELAY_MS = 45000;
const CHAR_INTERVAL_MS = 55;
const HOLD_MS = 5500;
const FADE_OUT_MS = 900;
const SURPRISE_INTERVAL_MS = 90000;
const SURPRISE_HOLD_MS = 9000;

// "Components" = visually contained UI blocks: cards, panels, terminals,
// nav/footer. We don't treat raw text (h1, p) as a blocker — those are content,
// and the message can fall in the gaps between glyphs without reading as overlap.
const BLOCKER_SELECTORS = [
  "header",
  "footer",
  "main img",
  "main button",
  '[class*="terminal-window"]',
  '[class*="rounded-xl"]',
  '[class*="rounded-2xl"]',
  '[class*="rounded-3xl"]',
  '[class*="rounded-[18px]"]',
  '[class*="rounded-[24px]"]',
].join(", ");

const PADDING_PX = 6;
const MAX_POSITION_ATTEMPTS = 40;
const FONT_PX = 17;
const APPROX_CHAR_PX = FONT_PX * 0.55;
const LINE_HEIGHT_PX = FONT_PX * 1.05;

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

const estimateMessageBox = (text: string) => ({
  width: Math.min(text.length * APPROX_CHAR_PX + 16, 0.7 * window.innerWidth),
  height: LINE_HEIGHT_PX + 6,
});

const collectBlockerRects = () =>
  Array.from(document.querySelectorAll(BLOCKER_SELECTORS))
    .map((el) => el.getBoundingClientRect())
    .filter((r) => r.width > 8 && r.height > 8);

const findCleanPosition = (text: string) => {
  if (typeof window === "undefined") return null;
  const blockers = collectBlockerRects();
  const { width: w, height: h } = estimateMessageBox(text);
  const ih = window.innerHeight;
  const iw = window.innerWidth;

  for (let attempt = 0; attempt < MAX_POSITION_ATTEMPTS; attempt++) {
    const left = randomBetween(8, Math.max(8, iw - w - 8));
    const top = randomBetween(0.08 * ih, Math.max(0.08 * ih, ih - h - 12));
    const candidate = {
      left: left - PADDING_PX,
      top: top - PADDING_PX,
      right: left + w + PADDING_PX,
      bottom: top + h + PADDING_PX,
    };
    let overlaps = false;
    for (const b of blockers) {
      if (
        b.right < candidate.left ||
        b.left > candidate.right ||
        b.bottom < candidate.top ||
        b.top > candidate.bottom
      ) {
        continue;
      }
      overlaps = true;
      break;
    }
    if (!overlaps) {
      return {
        topPx: Math.round(window.scrollY + top),
        leftPx: Math.round(left),
        rotation: randomBetween(-3, 3),
      };
    }
  }
  return null;
};

export const AmbientMessages: FC = () => {
  const { activateBatman } = usePortfolioMode();
  const [message, setMessage] = useState<AmbientMessage | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [fading, setFading] = useState(false);
  const [surprise, setSurprise] = useState<{
    id: number;
    topPx: number;
    leftPx: number;
    rotation: number;
    fading: boolean;
  } | null>(null);
  const [enabled, setEnabled] = useState(false);
  const idRef = useRef(0);
  const surpriseIdRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!enabled) {
      // Clear any in-flight message if the viewport just shrank below the threshold.
      setMessage(null);
      setRevealed(0);
      setFading(false);
      setSurprise(null);
      return;
    }
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let scheduleTimer: ReturnType<typeof setTimeout> | null = null;
    let typeTimer: ReturnType<typeof setInterval> | null = null;
    let holdTimer: ReturnType<typeof setTimeout> | null = null;
    let fadeTimer: ReturnType<typeof setTimeout> | null = null;
    let surpriseTimer: ReturnType<typeof setTimeout> | null = null;
    let surpriseHideTimer: ReturnType<typeof setTimeout> | null = null;
    let surpriseFadeTimer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const clearActive = () => {
      if (typeTimer) clearInterval(typeTimer);
      if (holdTimer) clearTimeout(holdTimer);
      if (fadeTimer) clearTimeout(fadeTimer);
      typeTimer = null;
      holdTimer = null;
      fadeTimer = null;
    };

    const showMessage = () => {
      if (cancelled) return;
      const text = REGULAR_MESSAGES[Math.floor(Math.random() * REGULAR_MESSAGES.length)];
      const pos = findCleanPosition(text);
      if (!pos) {
        // No empty slot in the current viewport - wait and try again sooner.
        scheduleTimer = setTimeout(showMessage, 6000);
        return;
      }
      const next: AmbientMessage = { id: ++idRef.current, text, ...pos };
      setMessage(next);
      setRevealed(0);
      setFading(false);

      let i = 0;
      typeTimer = setInterval(
        () => {
          i += 1;
          setRevealed(i);
          if (i >= text.length) {
            if (typeTimer) clearInterval(typeTimer);
            typeTimer = null;
            holdTimer = setTimeout(
              () => {
                setFading(true);
                fadeTimer = setTimeout(
                  () => {
                    setMessage(null);
                    setRevealed(0);
                    setFading(false);
                    scheduleNext();
                  },
                  FADE_OUT_MS
                );
              },
              HOLD_MS
            );
          }
        },
        CHAR_INTERVAL_MS
      );
    };

    const scheduleNext = () => {
      if (cancelled) return;
      const delay = randomBetween(MIN_DELAY_MS, MAX_DELAY_MS);
      scheduleTimer = setTimeout(showMessage, delay);
    };

    scheduleTimer = setTimeout(showMessage, FIRST_DELAY_MS);

    const showSurprise = () => {
      if (cancelled) return;
      const pos = findCleanPosition("click here for a surprise!") || {
        topPx: Math.round(window.scrollY + 0.5 * window.innerHeight),
        leftPx: Math.round(0.5 * window.innerWidth - 110),
        rotation: 0,
      };
      const id = ++surpriseIdRef.current;
      setSurprise({ ...pos, fading: false, id });

      surpriseHideTimer = setTimeout(
        () => {
          setSurprise((prev) => (prev && prev.id === id ? { ...prev, fading: true } : prev));
          surpriseFadeTimer = setTimeout(
            () => {
              setSurprise((prev) => (prev && prev.id === id ? null : prev));
              surpriseTimer = setTimeout(showSurprise, SURPRISE_INTERVAL_MS);
            },
            FADE_OUT_MS
          );
        },
        SURPRISE_HOLD_MS
      );
    };

    surpriseTimer = setTimeout(showSurprise, SURPRISE_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (scheduleTimer) clearTimeout(scheduleTimer);
      if (surpriseTimer) clearTimeout(surpriseTimer);
      if (surpriseHideTimer) clearTimeout(surpriseHideTimer);
      if (surpriseFadeTimer) clearTimeout(surpriseFadeTimer);
      clearActive();
    };
  }, [enabled]);

  const handleSurpriseClick = useCallback(() => {
    setSurprise(null);
    activateBatman();
  }, [activateBatman]);

  if (!enabled) return null;

  const visibleText = message ? message.text.slice(0, revealed) : "";
  const isTyping = message ? revealed < message.text.length : false;

  return (
    <>
      {message && (
        <div
          aria-hidden
          className="ambient-message pointer-events-none absolute select-none"
          style={{
            top: `${message.topPx}px`,
            left: `${message.leftPx}px`,
            transform: `rotate(${message.rotation}deg)`,
            opacity: fading ? 0 : 1,
            transition: `opacity ${FADE_OUT_MS}ms ease-out`,
          }}
        >
          <span>{visibleText}</span>
          {isTyping && <span className="ambient-message__cursor">|</span>}
        </div>
      )}

      {surprise && (
        <button
          type="button"
          onClick={handleSurpriseClick}
          aria-label="Click here for a surprise"
          className="ambient-surprise absolute cursor-pointer select-none border-0 bg-transparent p-0"
          style={{
            top: `${surprise.topPx}px`,
            left: `${surprise.leftPx}px`,
            transform: `rotate(${surprise.rotation}deg)`,
            opacity: surprise.fading ? 0 : 1,
            transition: `opacity ${FADE_OUT_MS}ms ease-out`,
          }}
        >
          <span className="ambient-surprise__lead">click here for a </span>
          <span className="ambient-surprise__shimmer">surprise</span>
          <span className="ambient-surprise__tail">!</span>
        </button>
      )}

      <style jsx>{`
        .ambient-message {
          font-family: "Caveat", "Patrick Hand", "Comic Sans MS", cursive;
          font-size: clamp(1rem, 1.35vw, 1.35rem);
          line-height: 1.05;
          color: rgba(71, 85, 105, 0.5);
          max-width: min(34ch, 60vw);
          letter-spacing: 0.01em;
          z-index: 0;
          will-change: opacity, transform;
        }
        :global(.dark) .ambient-message {
          color: rgba(203, 213, 225, 0.42);
        }
        .ambient-message__cursor {
          display: inline-block;
          margin-left: 2px;
          animation: ambient-blink 0.9s steps(1) infinite;
        }
        @keyframes ambient-blink {
          0%,
          50% {
            opacity: 1;
          }
          50.01%,
          100% {
            opacity: 0;
          }
        }

        .ambient-surprise {
          font-family: "Caveat", "Patrick Hand", "Comic Sans MS", cursive;
          font-size: clamp(1.4rem, 2vw, 1.9rem);
          line-height: 1.05;
          z-index: 60;
          color: rgba(51, 65, 85, 0.85);
          letter-spacing: 0.01em;
          transition: transform 200ms ease-out;
          animation: ambient-surprise-in 600ms ease-out both;
        }
        :global(.dark) .ambient-surprise {
          color: rgba(226, 232, 240, 0.85);
        }
        .ambient-surprise:hover,
        .ambient-surprise:focus-visible {
          transform: rotate(0deg) scale(1.04);
          outline: none;
        }
        @keyframes ambient-surprise-in {
          from {
            opacity: 0;
            transform: rotate(0deg) translateY(8px) scale(0.96);
          }
          to {
            opacity: 1;
          }
        }

        .ambient-surprise__shimmer {
          position: relative;
          display: inline-block;
          background: linear-gradient(
            90deg,
            #06b6d4 0%,
            #3b82f6 25%,
            #a855f7 50%,
            #3b82f6 75%,
            #06b6d4 100%
          );
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          font-weight: 600;
          animation: ambient-surprise-shimmer 2.4s linear infinite;
          filter: drop-shadow(0 0 6px rgba(6, 182, 212, 0.35));
        }
        @keyframes ambient-surprise-shimmer {
          from {
            background-position: 200% 0;
          }
          to {
            background-position: -200% 0;
          }
        }
      `}</style>
    </>
  );
};

export default AmbientMessages;
