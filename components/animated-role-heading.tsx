import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FC, useEffect, useState } from "react";

type AnimatedRoleHeadingProps = {
  name: string;
  roles: readonly string[];
};

const ROLE_HOLD_MS = 1550;
const ROLE_MOTION = {
  initial: { opacity: 0, y: "0.9em" },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: "-0.9em" },
};
const ROLE_TRANSITION = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};
const ENGINEER_TRANSITION = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

export const AnimatedRoleHeading: FC<AnimatedRoleHeadingProps> = ({ name, roles }) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeRole, setActiveRole] = useState(0);
  const finalRole = roles.length - 1;

  useEffect(() => {
    if (prefersReducedMotion) return;

    if (activeRole >= finalRole) return;

    const timer = window.setTimeout(
      () => {
        setActiveRole((currentRole) => Math.min(currentRole + 1, finalRole));
      },
      ROLE_HOLD_MS
    );

    return () => window.clearTimeout(timer);
  }, [activeRole, finalRole, prefersReducedMotion]);

  if (!roles.length) return null;

  const visibleRole = prefersReducedMotion ? finalRole : activeRole;
  const qualifier = roles[visibleRole];
  const article = qualifier === "AI" || qualifier === "" ? "an" : "a";

  return (
    <h1 className="heading-hero" aria-label={`I'm ${name}, an Engineer.`}>
      <span aria-hidden="true">
        I&apos;m <strong>{name}</strong>,
        <span className="relative -my-[0.08em] block min-h-[2.32em] overflow-hidden py-[0.08em] sm:min-h-[1.16em]">
          <span>{article} </span>
          <AnimatePresence initial={false} mode="popLayout">
            {qualifier
              ? <motion.span
                  key={qualifier}
                  className="mr-[0.22em] inline-block origin-left will-change-[transform,opacity]"
                  initial={ROLE_MOTION.initial}
                  animate={ROLE_MOTION.animate}
                  exit={ROLE_MOTION.exit}
                  transition={ROLE_TRANSITION}
                >
                  {qualifier}
                </motion.span>
              : null}
          </AnimatePresence>
          <motion.span layout="position" className="inline-block" transition={ENGINEER_TRANSITION}>
            Engineer.
          </motion.span>
        </span>
      </span>
    </h1>
  );
};
