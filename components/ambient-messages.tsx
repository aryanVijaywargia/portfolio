import { usePortfolioMode } from "components/_stores/portfolio-mode-context";
import { FC, useCallback, useEffect, useRef, useState } from "react";

type AmbientSection = {
  selector: string;
  messages: readonly string[];
  surprise: string;
};

const SECTION_MESSAGES: readonly AmbientSection[] = [
  {
    selector: "#about",
    messages: [
      "yes, these are the curated ones",
      "the bio went through four drafts and a friend",
      "stats are real, the vibe is performance",
    ],
    surprise: "open the overexplained version",
  },
  {
    selector: "#timeline",
    messages: [
      "started with python, got lost on purpose",
      "every detour looks intentional in hindsight",
      "the dots hide a lot of refactoring",
    ],
    surprise: "click to see the cut scenes",
  },
  {
    selector: "#experience",
    messages: [
      "each bullet survived three managers",
      "résumé voice is doing a lot of work here",
      "the standups were not this short",
    ],
    surprise: "open the unsanitized version",
  },
  {
    selector: "#portfolio",
    messages: [
      "every readme is more confident than the repo",
      "shipped on vibes and questionable sleep",
      "the demo works, please do not poke it",
    ],
    surprise: "click for the project graveyard",
  },
  {
    selector: "#contact",
    messages: [
      "please send work, memes, or both",
      "recruiters welcome, crypto founders respectfully no",
      "your dm will be read between standups",
    ],
    surprise: "send the bat signal",
  },
  {
    selector: "#achievements",
    messages: [
      "A few badges are still hidden",
      "Some achievements need exploration",
      "This section remembers what you found",
    ],
    surprise: "check the secret dossier?",
  },
];

type AmbientMessage = {
  id: number;
  text: string;
  topPx: number;
  leftPx: number;
  rotation: number;
};

const FIRST_DELAY_MS = 4500;
const MIN_DELAY_MS = 18000;
const MAX_DELAY_MS = 45000;
const CHAR_INTERVAL_MS = 55;
const HOLD_MS = 5500;
const FADE_OUT_MS = 900;
const SURPRISE_INTERVAL_MS = 90000;
const SURPRISE_HOLD_MS = 9000;

// "Components" = visually contained UI blocks: cards, panels, terminals,
// nav/footer. We don't treat raw text (h1, p) as a blocker - those are content,
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

const overlapsAnyBlocker = (
  candidate: { left: number; top: number; right: number; bottom: number },
  blockers: DOMRect[]
) => {
  for (const b of blockers) {
    if (
      b.right < candidate.left ||
      b.left > candidate.right ||
      b.bottom < candidate.top ||
      b.top > candidate.bottom
    ) {
      continue;
    }
    return true;
  }
  return false;
};

const estimateMessageBox = (text: string) => ({
  width: Math.min(text.length * APPROX_CHAR_PX + 16, 0.7 * window.innerWidth),
  height: LINE_HEIGHT_PX + 6,
});

const collectBlockerRects = () =>
  Array.from(document.querySelectorAll(BLOCKER_SELECTORS))
    .map((el) => el.getBoundingClientRect())
    .filter((r) => r.width > 8 && r.height > 8);

const getActiveSection = () => {
  if (typeof window === "undefined") return null;
  let best: { section: AmbientSection; distance: number } | null = null;
  const anchorY = window.innerHeight * 0.48;
  const aboutEl = document.querySelector<HTMLElement>("#about");
  const firstSectionTop = aboutEl ? aboutEl.offsetTop : Number.POSITIVE_INFINITY;

  if (window.scrollY + anchorY < firstSectionTop + 64) {
    return null;
  }

  for (const section of SECTION_MESSAGES) {
    const el = document.querySelector<HTMLElement>(section.selector);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    const visibleTop = Math.max(rect.top, 0);
    const visibleBottom = Math.min(rect.bottom, window.innerHeight);
    const visibleHeight = visibleBottom - visibleTop;
    const minimumVisible = Math.min(160, rect.height * 0.2);

    if (visibleHeight < minimumVisible) continue;

    const midpoint = visibleTop + visibleHeight / 2;
    const distance = Math.abs(midpoint - anchorY);
    if (!best || distance < best.distance) {
      best = { section, distance };
    }
  }

  return best?.section ?? null;
};

const findCleanPosition = (text: string, section: AmbientSection) => {
  if (typeof window === "undefined") return null;
  const sectionEl = document.querySelector<HTMLElement>(section.selector);
  if (!sectionEl) return null;

  const blockers = collectBlockerRects();
  const { width: w, height: h } = estimateMessageBox(text);
  const ih = window.innerHeight;
  const iw = window.innerWidth;
  const sectionRect = sectionEl.getBoundingClientRect();
  const topMin = Math.max(0.08 * ih, sectionRect.top + 12);
  const topMax = Math.min(ih - h - 12, sectionRect.bottom - h - 12);

  if (topMax <= topMin) return null;

  const createCandidate = (left: number, top: number) => ({
    left: left - PADDING_PX,
    top: top - PADDING_PX,
    right: left + w + PADDING_PX,
    bottom: top + h + PADDING_PX,
  });
  const toDocumentPosition = (left: number, top: number) => ({
    topPx: Math.round(window.scrollY + top),
    leftPx: Math.round(left),
    rotation: randomBetween(-3, 3),
  });

  for (let attempt = 0; attempt < MAX_POSITION_ATTEMPTS; attempt++) {
    const left = randomBetween(8, Math.max(8, iw - w - 8));
    const top = randomBetween(topMin, topMax);
    const candidate = createCandidate(left, top);
    if (!overlapsAnyBlocker(candidate, blockers)) {
      return toDocumentPosition(left, top);
    }
  }

  const safeLeftMax = Math.max(8, iw - w - 8);
  const fallbackLefts = [24, iw - w - 24, iw * 0.5 - w / 2]
    .map((left) => Math.min(Math.max(8, left), safeLeftMax))
    .filter((left, index, arr) => arr.findIndex((item) => Math.abs(item - left) < 1) === index);
  const fallbackTops = [topMin + 10, topMax - 10, topMin + (topMax - topMin) * 0.5]
    .map((top) => Math.min(Math.max(topMin, top), topMax))
    .filter((top, index, arr) => arr.findIndex((item) => Math.abs(item - top) < 1) === index);

  for (const top of fallbackTops) {
    for (const left of fallbackLefts) {
      if (!overlapsAnyBlocker(createCandidate(left, top), blockers)) {
        return toDocumentPosition(left, top);
      }
    }
  }

  const fallbackLeft = fallbackLefts[0] ?? 8;
  const fallbackTop = fallbackTops[0] ?? topMin;
  return toDocumentPosition(fallbackLeft, fallbackTop);
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
    text: string;
    fading: boolean;
  } | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [activeSection, setActiveSection] = useState<AmbientSection | null>(null);
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
    if (!enabled || typeof window === "undefined") {
      setActiveSection(null);
      return;
    }

    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setActiveSection(getActiveSection());
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !activeSection) {
      setMessage(null);
      setRevealed(0);
      setFading(false);
      setSurprise(null);
      return;
    }
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setMessage(null);
    setRevealed(0);
    setFading(false);
    setSurprise(null);

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
      const text =
        activeSection.messages[Math.floor(Math.random() * activeSection.messages.length)];
      const pos = findCleanPosition(text, activeSection);
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
      const text = activeSection.surprise;
      const pos = findCleanPosition(text, activeSection);
      if (!pos) {
        surpriseTimer = setTimeout(showSurprise, 6000);
        return;
      }
      const id = ++surpriseIdRef.current;
      setSurprise({ ...pos, text, fading: false, id });

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
  }, [activeSection, enabled]);

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
          aria-label={surprise.text}
          className="ambient-surprise absolute cursor-pointer select-none border-0 bg-transparent p-0"
          style={{
            top: `${surprise.topPx}px`,
            left: `${surprise.leftPx}px`,
            transform: `rotate(${surprise.rotation}deg)`,
            opacity: surprise.fading ? 0 : 1,
            transition: `opacity ${FADE_OUT_MS}ms ease-out`,
          }}
        >
          <span className="ambient-surprise__shimmer">{surprise.text}</span>
        </button>
      )}

      <style jsx>{`
        .ambient-message,
        .ambient-surprise {
          font-family: "Caveat", "Patrick Hand", "Comic Sans MS", cursive;
          font-size: 1.0625rem;
          line-height: 1.05;
          letter-spacing: 0.01em;
        }

        .ambient-message {
          color: rgba(71, 85, 105, 0.5);
          max-width: min(34ch, 60vw);
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
          z-index: 60;
          color: rgba(51, 65, 85, 0.85);
          max-width: min(34ch, 60vw);
          transition: transform 200ms ease-out;
          animation: ambient-surprise-in 600ms ease-out both;
        }
        :global(.dark) .ambient-surprise {
          color: rgba(226, 232, 240, 0.85);
        }
        .ambient-surprise:hover,
        .ambient-surprise:focus-visible {
          transform: rotate(0deg);
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
