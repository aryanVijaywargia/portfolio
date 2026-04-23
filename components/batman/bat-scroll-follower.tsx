import { FC, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { usePortfolioMode } from "components/_stores/portfolio-mode-context";

export const BatScrollFollower: FC = () => {
  const { mode } = usePortfolioMode();
  const prefersReducedMotion = useReducedMotion();
  const [docHeight, setDocHeight] = useState(1);
  const [viewportH, setViewportH] = useState(800);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : true
  );

  const { scrollY } = useScroll();
  const scrollProgress = useTransform(scrollY, [0, docHeight], [0, 1]);
  const batY = useTransform(scrollProgress, [0, 1], [80, viewportH - 100]);
  const smoothY = useSpring(batY, { damping: 25, stiffness: 60, mass: 1.2 });
  const batX = useTransform(scrollY, (v) => Math.sin(v * 0.005) * 30);

  useEffect(() => {
    if (mode !== "batman") return;

    const measure = () => {
      setDocHeight(Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
      setViewportH(window.innerHeight);
      setIsMobile(window.innerWidth < 768);
    };

    measure();
    window.addEventListener("resize", measure);
    const timer = setTimeout(measure, 1000);

    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(timer);
    };
  }, [mode]);

  if (mode !== "batman" || isMobile || prefersReducedMotion) return null;

  return (
    <motion.div
      className="pointer-events-none fixed z-[50]"
      style={{
        right: "8%",
        top: 0,
        y: smoothY,
        x: batX,
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          width: "80px",
          height: "80px",
          top: "-26px",
          left: "-16px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,166,146,0.1) 0%, transparent 65%)",
        }}
      />

      {/* Bat with fluttering wings using transforms */}
      <div style={{ position: "relative", width: "48px", height: "28px" }}>
        {/* Left wing */}
        <motion.div
          style={{
            position: "absolute",
            right: "50%",
            top: 0,
            width: "24px",
            height: "28px",
            transformOrigin: "right center",
          }}
          animate={{ scaleX: [1, 0.6, 1, 0.7, 1], rotateY: [0, 50, 0, 40, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            width="24"
            height="28"
            viewBox="0 0 50 55"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 20 C46 18 42 8 40 2 C36 10 28 16 18 16 C12 16 6 12 0 6 C4 16 6 26 10 34 C14 40 22 46 32 50 C38 52 44 55 50 55 L50 20Z"
              fill="var(--bat-primary)"
              fillOpacity="0.7"
            />
          </svg>
        </motion.div>

        {/* Right wing */}
        <motion.div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            width: "24px",
            height: "28px",
            transformOrigin: "left center",
          }}
          animate={{ scaleX: [1, 0.6, 1, 0.7, 1], rotateY: [0, -50, 0, -40, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            width="24"
            height="28"
            viewBox="50 0 50 55"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 20 C54 18 58 8 60 2 C64 10 72 16 82 16 C88 16 94 12 100 6 C96 16 94 26 90 34 C86 40 78 46 68 50 C62 52 56 55 50 55 L50 20Z"
              fill="var(--bat-primary)"
              fillOpacity="0.7"
            />
          </svg>
        </motion.div>

        {/* Body (static center) */}
        <svg
          width="48"
          height="28"
          viewBox="0 0 100 55"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {/* Body */}
          <ellipse cx="50" cy="32" rx="5" ry="16" fill="var(--bat-primary)" fillOpacity="0.85" />
          {/* Head */}
          <circle cx="50" cy="16" r="5" fill="var(--bat-primary)" fillOpacity="0.85" />
          {/* Left ear */}
          <path d="M46 14 L42 4 L48 12 Z" fill="var(--bat-primary)" fillOpacity="0.85" />
          {/* Right ear */}
          <path d="M54 14 L58 4 L52 12 Z" fill="var(--bat-primary)" fillOpacity="0.85" />
          {/* Eyes */}
          <circle cx="48" cy="15.5" r="1.2" fill="#041716" fillOpacity="0.9" />
          <circle cx="52" cy="15.5" r="1.2" fill="#041716" fillOpacity="0.9" />
        </svg>
      </div>
    </motion.div>
  );
};
