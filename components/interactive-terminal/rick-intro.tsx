import { FC, useState, useEffect, useRef, useCallback } from "react";

// Rick with portal gun + portal opening - iconic scene
const RICK_ASCII = `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣷⡄⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣧⣀⣾⣿⣿⣿⣿⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢹⣿⣶⣦⣤⣀⡀⠀⠀⠀⠀⠀⣼⣿⣿⣿⡿⠿⠟⠛⠛⠿⠿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣶⣶⣤⣤⡿⠟⠉⢴⣶⣿⣿⣿⣿⣿⣷⣦⣍⠻⣿⣿⣿⡇⠀⠀⠀⠀⠀⣀⣀⣠⣤⣶⡶
⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣿⣿⣿⡿⠟⣋⣀⣙⡻⢶⣝⢿⣿⣿⣿⣿⣿⣿⣿⣿⣌⠻⣿⣷⣶⣶⣿⣿⣿⣿⣿⣿⣿⠏⠀
⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⠏⣴⣿⡿⠿⢿⣿⣦⡙⢦⣽⣿⣿⣿⣿⣿⣿⣿⣿⡧⠹⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⣿⣿⡆⢉⣥⣶⣾⣶⣌⠻⣿⣎⠻⣿⣿⣿⡿⠟⣋⣭⣴⣶⡄⢹⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⢃⣿⣿⡿⠿⠿⠿⣧⡙⢿⣷⣶⣶⣶⣶⣿⠿⠟⠋⣩⣴⡌⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⣸⣿⣿⡟⢸⠟⣡⣶⣾⣿⣿⣶⣌⠲⣬⣉⠉⣉⣥⣴⣾⣿⣷⣦⡙⣧⢹⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢀⣠⣴⣾⣿⣿⣿⣿⡇⡎⣼⣿⣿⣿⣿⣿⣿⠉⢢⢹⡿⢰⣿⣿⣿⣿⣿⣿⠉⣳⠈⢸⣿⣿⡋⠀⠀⠀⠀⠀⠀⠀
⠠⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⢁⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⡇⣾⣿⣿⣿⣿⣿⣿⣿⣿⠀⢸⣿⣿⣿⣷⣶⣤⣄⣀⣀⠀
⠀⠀⠉⠻⢿⣿⣿⣿⣿⣿⣿⢸⡇⢿⣿⣿⣿⣿⣿⣿⣿⠇⣼⣧⠸⣿⣿⣿⣿⣿⣿⣿⡿⢠⢸⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁
⠀⠀⠀⠀⠀⠈⠛⢿⣿⣿⣿⢸⣿⣌⠻⢿⣿⣿⣿⡿⢋⣼⣿⣿⣧⡙⠿⣿⣿⣿⡿⠟⣡⣿⢸⣿⣿⣿⣿⣿⡿⠋⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⣾⣿⣿⣿⣶⣤⣤⣤⣶⣿⠋⣿⣿⢻⣿⣷⣶⣤⣴⣶⣿⣿⣿⢸⣿⣿⣿⡿⠋⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⢹⣿⣷⣬⣛⣛⠛⣛⣩⣽⠀⣿⣿⢀⣷⣬⣙⡛⠛⣛⣫⣴⣿⢸⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠠⣾⣿⣿⣿⣿⣿⣿⠟⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⠘⢿⣿⣷⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠈⠙⠻⢿⣿⣿⢃⣾⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣌⣡⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⣦⡙⣿⣿⣷⣤⣀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠈⣿⢸⣿⡇⣿⣿⣿⣿⡿⢿⣿⡿⢻⣟⢹⡟⢻⣟⠻⣿⣿⣿⣿⣿⣿⣿⢸⣿⡇⣿⣿⣿⠿⠟⠁⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢰⣿⣦⡙⠇⢸⣿⣿⡟⡰⠁⠈⠁⠀⠁⠀⠀⠀⠁⠀⠉⠀⠙⣌⢻⣿⣿⠘⣋⣴⠉⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣷⡌⣿⣿⢰⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⡌⣿⡇⣼⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠘⠛⠛⠛⠛⠻⣷⠹⣿⠸⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡇⣿⢡⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣇⢻⣧⡙⠿⠶⠴⢦⡀⠶⣶⣶⡶⠆⢠⣤⠴⢏⣴⢃⡎⠀⠈⠉⠉⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠟⠛⠀⠻⣿⣷⣶⣾⣿⣿⡇⢹⠏⣴⣶⣶⣶⣶⡿⠃⠚⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣿⣤⣾⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠛⠛⠻⠿⠿⠛⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`;

/**
 * How close to the bottom still counts as "following along". Below this the
 * typing keeps dragging the view down; above it, the reader is in charge.
 */
const PIN_THRESHOLD_PX = 24;

const INTRO_LINES = [
  "MORTY!!!",
  "You're not gonna believe this, Morty...",
  "I'm, I'm trapped in this kid's terminal!",
  "I'm Terminal Rick, baby!",
  "This Aryan guy built some kind of portfolio and I got stuck in it...",
  "Quick Morty, type 'help' to see what we're working with!",
];

type RickIntroProps = {
  onComplete: () => void;
};

export const RickIntro: FC<RickIntroProps> = ({ onComplete }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [showSkip, setShowSkip] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  /** Whether new output should drag the view down with it. */
  const pinnedRef = useRef(true);
  const [isInView, setIsInView] = useState(true);

  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }, [onComplete]);

  // Show skip hint after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard skip
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        handleComplete();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handleComplete]);

  // Avoid frequent React updates and forced terminal scrolling after the user
  // has moved on to the rest of the page. The intro resumes where it stopped
  // if the terminal comes back into view.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry?.isIntersecting ?? false),
      { rootMargin: "160px 0px", threshold: 0.01 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Typewriter effect for current line
  useEffect(() => {
    if (currentLineIndex >= INTRO_LINES.length) {
      setAllDone(true);
      return;
    }

    if (!isInView) return;

    const currentLine = INTRO_LINES[currentLineIndex];
    let charIndex = displayedText.length;

    const interval = setInterval(
      () => {
        charIndex++;
        setDisplayedText(currentLine.slice(0, charIndex));

        if (charIndex >= currentLine.length) {
          clearInterval(interval);
          // Line complete, wait then advance
          setTimeout(
            () => {
              setCompletedLines((prev) => [...prev, currentLine]);
              setDisplayedText("");
              setCurrentLineIndex((prev) => prev + 1);
            },
            1200
          );
        }
      },
      30
    );

    return () => clearInterval(interval);
    // displayedText is deliberately read only when the effect starts so an
    // interval tick does not recreate the interval on every character.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLineIndex, isInView]);

  // Keep the intro output pinned inside the terminal without moving the page —
  // but only while the reader is already at the bottom. Pinning on every
  // character regardless meant a scroll up inside the terminal was undone
  // 30ms later, over and over, which reads as the panel fighting the wheel.
  useEffect(() => {
    const wrapper = containerRef.current;
    if (!wrapper || !pinnedRef.current) return;
    wrapper.scrollTop = wrapper.scrollHeight;
  }, [displayedText, completedLines, allDone]);

  /**
   * Re-pins once the reader returns to the bottom, and lets go the moment they
   * leave it. The threshold absorbs sub-pixel rounding and the growth of the
   * line still being typed, so simply watching the wheel is not enough.
   */
  const handleScroll = useCallback(() => {
    const wrapper = containerRef.current;
    if (!wrapper) return;
    const distanceFromBottom = wrapper.scrollHeight - wrapper.scrollTop - wrapper.clientHeight;
    pinnedRef.current = distanceFromBottom <= PIN_THRESHOLD_PX;
  }, []);

  return (
    <div
      ref={containerRef}
      className="rick-intro-wrapper"
      onClick={handleComplete}
      onScroll={handleScroll}
    >
      <div className="rick-intro-content">
        <pre className="rick-ascii">{RICK_ASCII}</pre>

        <div className="rick-dialogue">
          {completedLines.map((line, i) => (
            <div key={i} className="dialogue-line completed">
              {line}
            </div>
          ))}
          {currentLineIndex < INTRO_LINES.length && (
            <div className="dialogue-line current">
              {displayedText}
              <span className="cursor">_</span>
            </div>
          )}
          {allDone && (
            <div className="dialogue-line continue-hint">[Click anywhere to continue...]</div>
          )}
        </div>
      </div>

      {showSkip && <div className="skip-hint">Press Enter or click to skip</div>}

      <style jsx>{`
        .rick-intro-wrapper {
          width: 100%;
          height: 100%;
          background: #ffffff;
          cursor: pointer;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 1.5rem;
          font-family: "Menlo", "Monaco", "Courier New", monospace;
          position: relative;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .rick-intro-wrapper::-webkit-scrollbar {
          width: 0;
          height: 0;
          background: transparent;
        }

        :global(.dark) .rick-intro-wrapper {
          background: transparent;
        }

        .rick-intro-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          max-width: 100%;
          margin: auto;
          min-height: 100%;
          justify-content: center;
        }

        .rick-ascii {
          color: #0f7a55;
          font-size: 0.45rem;
          line-height: 1.1;
          margin: 0;
          background: none;
          white-space: pre;
          text-align: center;
          opacity: 0;
          animation: fadeInAscii 0.8s ease-out 0.3s forwards;
        }

        :global(.dark) .rick-ascii {
          color: #4ec9b0;
        }

        @keyframes fadeInAscii {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .rick-dialogue {
          width: 100%;
          padding: 0 0.5rem;
        }

        .dialogue-line {
          color: #166534;
          font-size: 13px;
          line-height: 1.8;
          margin-bottom: 0.25rem;
        }

        :global(.dark) .dialogue-line {
          color: #4ec9b0;
        }

        .dialogue-line.completed {
          opacity: 0.78;
        }

        .dialogue-line.current {
          opacity: 1;
        }

        .dialogue-line.continue-hint {
          opacity: 0.7;
          margin-top: 0.5rem;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        .cursor {
          animation: blink 0.7s step-end infinite;
          color: #15803d;
        }

        :global(.dark) .cursor {
          color: #4ec9b0;
        }

        @keyframes blink {
          50% {
            opacity: 0;
          }
        }

        .skip-hint {
          position: absolute;
          bottom: 0.75rem;
          right: 1rem;
          color: #64786f;
          font-size: 10px;
          font-family: "Menlo", "Monaco", "Courier New", monospace;
        }

        :global(.dark) .skip-hint {
          color: #555;
        }
      `}</style>
    </div>
  );
};
