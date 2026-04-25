import { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolioMode } from "components/_stores/portfolio-mode-context";

export const BatTransition: FC = () => {
  const { showTransition, dismissTransition } = usePortfolioMode();
  const [phase, setPhase] = useState<"black" | "signal" | "text" | "done">("black");

  useEffect(() => {
    if (!showTransition) {
      setPhase("black");
      return;
    }

    // Phase 1: Black screen (already showing)
    const t1 = setTimeout(() => setPhase("signal"), 400);
    // Phase 2: Bat signal appears
    const t2 = setTimeout(() => setPhase("text"), 1400);
    // Phase 3: Text appears, then fade out
    const t3 = setTimeout(
      () => {
        setPhase("done");
        dismissTransition();
      },
      3200
    );

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [showTransition, dismissTransition]);

  return (
    <AnimatePresence>
      {showTransition && phase !== "done" && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#020d0c" }}
        >
          {/* Grid background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,71,60,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,71,60,0.08) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Bat Signal SVG */}
          <AnimatePresence>
            {(phase === "signal" || phase === "text") && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 100, duration: 0.8 }}
                className="relative"
              >
                {/* Glow circle behind bat */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 0.6, 0.3], scale: [0.5, 1.2, 1] }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute inset-0 -m-16 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(0,166,146,0.2) 0%, rgba(0,166,146,0.05) 50%, transparent 70%)",
                  }}
                />

                {/* Bat icon */}
                <svg
                  width="120"
                  height="60"
                  viewBox="0 0 120 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative z-10"
                >
                  <motion.path
                    d="M60 5 C60 5, 45 0, 30 15 C20 25, 5 20, 0 30 C5 28, 15 30, 20 35 C25 40, 30 50, 40 55 C45 55, 50 45, 55 40 C57 37, 58 35, 60 33 C62 35, 63 37, 65 40 C70 45, 75 55, 80 55 C90 50, 95 40, 100 35 C105 30, 115 28, 120 30 C115 20, 100 25, 90 15 C75 0, 60 5, 60 5Z"
                    fill="#00a692"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Text */}
          <AnimatePresence>
            {phase === "text" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-12 text-center"
              >
                <h2
                  className="text-2xl font-bold tracking-widest md:text-3xl"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "#a3dbcf",
                    textShadow: "0 0 30px rgba(0,166,146,0.4)",
                    letterSpacing: "0.2em",
                  }}
                >
                  THE NIGHT IS YOURS
                </h2>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="mx-auto mt-4 h-px w-48"
                  style={{
                    background: "linear-gradient(90deg, transparent, #00a692, transparent)",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
