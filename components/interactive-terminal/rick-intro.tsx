import { FC, useState, useEffect, useRef, useCallback } from "react";

// Rick with portal gun + portal opening — iconic scene
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

const INTRO_LINES = [
  "MORTY!!!",
  "You're not gonna believe this, Morty...",
  "I'm--I'm trapped in this kid's terminal!",
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

  // Typewriter effect for current line
  useEffect(() => {
    if (currentLineIndex >= INTRO_LINES.length) {
      setAllDone(true);
      return;
    }

    const currentLine = INTRO_LINES[currentLineIndex];
    let charIndex = 0;
    setDisplayedText("");

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
              setCurrentLineIndex((prev) => prev + 1);
            },
            1200
          );
        }
      },
      30
    );

    return () => clearInterval(interval);
  }, [currentLineIndex]);

  // Auto-scroll dialogue into view
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedText, completedLines]);

  return (
    <div ref={containerRef} className="rick-intro-wrapper" onClick={handleComplete}>
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
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          cursor: pointer;
          overflow: auto;
          padding: 1.5rem;
          font-family: "Menlo", "Monaco", "Courier New", monospace;
          position: relative;
        }

        :global(.dark) .rick-intro-wrapper {
          background: #1e1e1e;
        }

        .rick-intro-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          max-width: 100%;
        }

        .rick-ascii {
          color: #000000;
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
          color: #000000;
          font-size: 13px;
          line-height: 1.8;
          margin-bottom: 0.25rem;
        }

        :global(.dark) .dialogue-line {
          color: #4ec9b0;
        }

        .dialogue-line.completed {
          opacity: 0.5;
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
          color: #000000;
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
          color: #999;
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
