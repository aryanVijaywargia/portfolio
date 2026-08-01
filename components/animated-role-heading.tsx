import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FC, useEffect, useState } from "react";

type AnimatedRoleHeadingProps = {
  name: string;
  roles: readonly string[];
};

const ROLE_HOLD_MS = 1550;
const ROLE_MOTION = {
  initial: { opacity: 0, y: "45%" },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: "-45%" },
};
const ROLE_TRANSITION = {
  duration: 0.34,
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
  const role = `${article}${qualifier ? ` ${qualifier}` : ""} Engineer.`;

  return (
    <h1 className="heading-hero" aria-label={`I'm ${name}, an Engineer.`}>
      <span aria-hidden="true">
        I&apos;m <strong>{name}</strong>,
        <span className="relative -my-[0.08em] block h-[2.16em] overflow-hidden py-[0.08em] sm:h-[1.16em]">
          <AnimatePresence initial={false}>
            <motion.span
              key={role}
              className="absolute inset-x-0 top-[0.08em] block will-change-[transform,opacity] sm:whitespace-nowrap"
              initial={ROLE_MOTION.initial}
              animate={ROLE_MOTION.animate}
              exit={ROLE_MOTION.exit}
              transition={ROLE_TRANSITION}
            >
              {qualifier
                ? <>
                    <span>
                      {article} {qualifier}
                    </span>
                    <span className="block sm:inline"> Engineer.</span>
                  </>
                : role}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </h1>
  );
};
