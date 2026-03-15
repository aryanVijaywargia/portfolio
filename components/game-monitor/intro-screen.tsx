import React, { useState, useEffect } from "react";
import Typewriter from "typewriter-effect";

type IntroScreenProps = { onComplete: () => void };

const introLines = [
  "HEY! YOU!",
  "Yeah, you... the one reading this.",
  "I'm stuck inside this terminal!",
  "You're going to have to help me get out...",
  "Play some games. Win. Free me.",
  "...please.",
];

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showContinue, setShowContinue] = useState(false);

  // Show continue button after 2 seconds always (fallback)
  useEffect(() => {
    const timer = setTimeout(() => setShowContinue(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-advance lines every 3 seconds
  useEffect(() => {
    if (currentLineIndex < introLines.length - 1) {
      const timer = setTimeout(() => setCurrentLineIndex((prev) => prev + 1), 3000);
      return () => clearTimeout(timer);
    } else {
      // Last line — show button after 2 seconds
      const timer = setTimeout(() => setShowContinue(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentLineIndex]);

  return (
    <div className="intro-screen">
      <div className="intro-content">
        <div className="character-ascii">
          <pre>{`
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀  ⣄⠀⠀⠀⠀⢀⣴⡀
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣯⢿⣿⢸⣿⣇⠿⠿⠻
          `}</pre>
        </div>

        <div className="dialogue-container">
          <div className="dialogue-box">
            {introLines.slice(0, currentLineIndex + 1).map((line, index) => (
              <div key={index} className="dialogue-line">
                {index === currentLineIndex
                  ? <Typewriter
                      key={`typewriter-${index}`}
                      options={{ delay: 10, cursor: "" }}
                      onInit={(tw) => tw.typeString(line).start()}
                    />
                  : <span>{line}</span>}
              </div>
            ))}
          </div>

          {showContinue && (
            <button className="continue-button" onClick={onComplete}>
              Continue →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
