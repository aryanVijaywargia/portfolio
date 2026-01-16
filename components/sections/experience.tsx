import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import clsx from "clsx";
import {
  EXPERIENCE_DATA,
  EXPERIENCE_STATS,
  ExperienceItem,
} from "content/experience";

// Format index number with leading zero (reversed - newest = highest number)
const formatIndex = (index: number, total: number): string => {
  return String(total - index).padStart(2, "0");
};

// Format date range
const formatDateRange = (startDate: string, endDate: string | null): string => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  const startStr = `${String(start.getMonth() + 1).padStart(2, "0")}/${start.getFullYear()}`;
  const endStr = end
    ? `${String(end.getMonth() + 1).padStart(2, "0")}/${end.getFullYear()}`
    : `${String(new Date().getMonth() + 1).padStart(2, "0")}/${new Date().getFullYear()}`;

  return `${startStr} - ${endStr}`;
};

// Get accent color based on type
const getTypeColor = (type: ExperienceItem["type"]): string => {
  switch (type) {
    case "employment":
      return "text-emerald-500";
    case "freelance":
      return "text-violet-500";
    case "project":
      return "text-cyan-500";
    case "education":
      return "text-amber-500";
    default:
      return "text-gray-500";
  }
};

// Stacked Experience Card Component - matching Ashley's time-machine exactly
const ExperienceCard = ({
  experience,
  index,
  total,
}: {
  experience: ExperienceItem;
  index: number;
  total: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  // Each card gets increasing top offset (2rem per card) for stacking effect
  // Cards stack with headers peeking out above
  const stickyTop = `${(index + 1) * 2}rem`;

  // Last card needs extra bottom padding
  const isLast = index === total - 1;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ top: stickyTop }}
      className={clsx(
        "sticky z-10 rounded-xl bg-white shadow-[0_0_5px_5px_rgba(0,0,0,0.018)]",
        "d:bg-gray-900 d:shadow-[0_0_5px_5px_rgba(0,0,0,0.3)]",
        // Margin bottom creates space for scrolling - each card needs to scroll up enough
        // for the next card to cover it (except header row)
        isLast ? "mb-0 pb-20" : "mb-16"
      )}
    >
      {/* Card Content */}
      <div className="px-4 pb-6 pt-2 md:px-8 md:pb-8">
        {/* Header Row - This is what "peeks" out when stacked */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 d:border-gray-800">
          <div className="flex items-center gap-4">
            {/* Date */}
            <span className="font-mono text-sm italic text-gray-500 d:text-gray-400">
              {formatDateRange(experience.startDate, experience.endDate)}
            </span>
            {/* Position - styled like Ashley's with pixel font effect */}
            <span className={clsx(
              "font-mono text-sm font-medium uppercase tracking-widest",
              getTypeColor(experience.type)
            )}>
              {experience.position}
            </span>
          </div>
          {/* Index Number - Right side */}
          <span className="hidden font-mono text-lg font-medium text-gray-300 md:block d:text-gray-600">
            {formatIndex(index, total)}
          </span>
        </div>

        {/* Company Name - Large Title */}
        <h2 className={clsx(
          "mb-4 mt-4 text-3xl font-bold tracking-tight md:text-4xl",
          getTypeColor(experience.type)
        )}>
          {experience.company}
        </h2>

        {/* Excerpt / Main Description */}
        <p className="mb-4 text-gray-600 d:text-gray-300">
          {experience.description}
        </p>

        {/* Detailed Description - Achievements */}
        <div className="space-y-3">
          {experience.achievements.map((achievement, i) => (
            <p key={i} className="text-sm leading-relaxed text-gray-500 d:text-gray-400">
              {achievement}
            </p>
          ))}
        </div>

        {/* Technologies - only show on non-mobile for cleaner look */}
        <div className="mt-6 hidden flex-wrap gap-2 md:flex">
          {experience.technologies.map((tech, i) => (
            <span
              key={i}
              className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-500 d:border-gray-700 d:bg-gray-800 d:text-gray-400"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Years of Experience Counter - Final card
const YearsCounter = ({ total }: { total: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Position below all the stacked cards
  const stickyTop = `${(total + 1) * 2}rem`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      style={{ top: stickyTop }}
      className="sticky z-10 flex items-center justify-center rounded-xl bg-white p-8 shadow-[0_0_5px_5px_rgba(0,0,0,0.018)] md:p-12 d:bg-gray-900 d:shadow-[0_0_5px_5px_rgba(0,0,0,0.3)]"
    >
      <h2 className="text-center text-2xl font-bold text-gray-900 md:text-4xl d:text-white">
        That's {EXPERIENCE_STATS.yearsExperience} years experience!
      </h2>
    </motion.div>
  );
};

export const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  // Scroll progress for background
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative bg-gradient-to-b from-emerald-50/50 via-cyan-50/30 to-white py-16 md:py-24 d:from-gray-950 d:via-gray-900 d:to-gray-950"
    >
      {/* Background Decoration */}
      <motion.div
        style={{ y: backgroundY }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl d:bg-emerald-900/20" />
        <div className="absolute bottom-1/3 right-1/4 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl d:bg-cyan-900/20" />
      </motion.div>

      <div className="mx-auto max-w-4xl px-4 md:px-8">
        {/* Section Header */}
        <header ref={headerRef} className="mb-12 text-center md:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl d:text-white"
          >
            Where have I been all your life?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-gray-600 d:text-gray-400"
          >
            Scroll to explore my career journey. Cards stack as you go.
          </motion.p>
        </header>

        {/* Stacked Cards Container */}
        <div className="relative pt-8">
          {EXPERIENCE_DATA.map((experience, index) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              index={index}
              total={EXPERIENCE_DATA.length}
            />
          ))}

          {/* Years Counter - Final Card */}
          <YearsCounter total={EXPERIENCE_DATA.length} />
        </div>
      </div>
    </section>
  );
};
