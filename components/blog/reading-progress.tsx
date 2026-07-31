import { motion, useScroll } from "framer-motion";
import { FC } from "react";

export const ReadingProgress: FC = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-cyan-500 to-blue-600"
      style={{ scaleX: scrollYProgress }}
    />
  );
};
