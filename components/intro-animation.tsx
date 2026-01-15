import { FC, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type IntroAnimationProps = {
  onComplete: () => void;
};

export const IntroAnimation: FC<IntroAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<"typing" | "reveal" | "exit">("typing");
  const [typedText, setTypedText] = useState("");

  const fullText = "aryan@portfolio:~$ ./welcome.sh";
  const greetingLines = [
    "Initializing portfolio...",
    "Loading experience...",
    "Ready.",
  ];

  // Typing animation
  useEffect(() => {
    if (phase !== "typing") return;

    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => setPhase("reveal"), 300);
      }
    }, 40);

    return () => clearInterval(typeInterval);
  }, [phase]);

  // Reveal phase timing
  useEffect(() => {
    if (phase === "reveal") {
      setTimeout(() => setPhase("exit"), 1800);
    }
  }, [phase]);

  // Exit phase timing
  useEffect(() => {
    if (phase === "exit") {
      setTimeout(onComplete, 600);
    }
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0f]"
        >
          {/* Subtle grid background */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />

          <div className="relative z-10 w-full max-w-xl px-6">
            {/* Terminal window */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#1e1e1e] shadow-2xl"
            >
              {/* Title bar */}
              <div className="flex h-8 items-center gap-2 border-b border-[#2a2a2a] bg-[#2a2a2a] px-3">
                <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="ml-2 flex-1 text-center text-xs text-[#6A6A6A]">
                  terminal
                </span>
              </div>

              {/* Terminal content */}
              <div className="p-4 font-mono text-sm">
                {/* Command line */}
                <div className="flex items-center">
                  <span className="text-[#4EC9B0]">{typedText}</span>
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="ml-0.5 inline-block h-4 w-2 bg-[#4EC9B0]"
                  />
                </div>

                {/* Output lines */}
                <AnimatePresence>
                  {phase === "reveal" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 space-y-1"
                    >
                      {greetingLines.map((line, index) => (
                        <motion.div
                          key={line}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.3, duration: 0.3 }}
                          className={`${
                            index === greetingLines.length - 1
                              ? "text-[#28c840]"
                              : "text-[#D4D4D4]"
                          }`}
                        >
                          {index === greetingLines.length - 1 && (
                            <span className="mr-2">✓</span>
                          )}
                          {line}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Name reveal below terminal */}
            <AnimatePresence>
              {phase === "reveal" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="mt-8 text-center"
                >
                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Aryan Vijaywargia
                  </h1>
                  <p className="mt-2 text-sm text-[#6A6A6A]">
                    Fullstack Engineer
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Corner decorations */}
          <div className="absolute left-4 top-4 h-16 w-16 border-l-2 border-t-2 border-[#2a2a2a] opacity-50" />
          <div className="absolute bottom-4 right-4 h-16 w-16 border-b-2 border-r-2 border-[#2a2a2a] opacity-50" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
