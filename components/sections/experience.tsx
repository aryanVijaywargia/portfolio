import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import clsx from "clsx";
import { MapPinIcon } from "@heroicons/react/24/outline";
import {
  EXPERIENCE_DATA,
  EXPERIENCE_STATS,
  ExperienceItem,
} from "content/experience";

// Format index number with leading zero
const formatIndex = (index: number): string => {
  return String(index + 1).padStart(2, "0");
};

// Format date range
const formatDateRange = (startDate: string, endDate: string | null): string => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  const startStr = `${String(start.getMonth() + 1).padStart(2, "0")}/${start.getFullYear()}`;
  const endStr = end
    ? `${String(end.getMonth() + 1).padStart(2, "0")}/${end.getFullYear()}`
    : "Present";

  return `${startStr} - ${endStr}`;
};

// Get accent color based on type
const getAccentColor = (type: ExperienceItem["type"]): string => {
  switch (type) {
    case "employment":
      return "text-cyan-500 d:text-cyan-400";
    case "freelance":
      return "text-violet-500 d:text-violet-400";
    case "project":
      return "text-emerald-500 d:text-emerald-400";
    case "education":
      return "text-amber-500 d:text-amber-400";
    default:
      return "text-gray-500 d:text-gray-400";
  }
};

// Stacked Experience Card Component (inspired by Ashley's time-machine)
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
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  // Calculate sticky top offset for stacking effect
  const stickyTop = `${(index + 1) * 2}rem`;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      style={{ top: stickyTop }}
      className={clsx(
        "sticky z-10 mb-8 rounded-2xl bg-white p-6 shadow-lg shadow-gray-200/50 transition-shadow duration-300 hover:shadow-xl md:p-8",
        "d:bg-gray-900 d:shadow-gray-900/50",
        index === total - 1 && "mb-0 pb-12 md:pb-16"
      )}
    >
      {/* Card Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Date & Location Row */}
          <div className="mb-2 flex flex-wrap items-center gap-3 text-sm text-gray-500 d:text-gray-400">
            <span className="font-mono">
              {formatDateRange(experience.startDate, experience.endDate)}
            </span>
            <span className="flex items-center gap-1">
              <MapPinIcon className="h-3.5 w-3.5" />
              {experience.location}
            </span>
            {!experience.endDate && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 d:bg-emerald-900/30 d:text-emerald-400">
                Current
              </span>
            )}
          </div>

          {/* Position Title */}
          <h3 className="mb-1 font-mono text-sm font-medium uppercase tracking-wider text-gray-400 d:text-gray-500">
            {experience.position}
          </h3>

          {/* Company Name - Large */}
          <h2 className={clsx("text-2xl font-bold tracking-tight md:text-3xl", getAccentColor(experience.type))}>
            {experience.company}
          </h2>
        </div>

        {/* Large Index Number - Right Side */}
        <div className="hidden select-none font-mono text-5xl font-bold leading-none text-gray-100 md:block md:text-6xl d:text-gray-800">
          {formatIndex(index)}
        </div>
      </div>

      {/* Description */}
      <p className="mb-6 max-w-3xl text-gray-600 d:text-gray-300">
        {experience.description}
      </p>

      {/* Achievements */}
      <div className="mb-6">
        {experience.achievements.slice(0, 3).map((achievement, i) => (
          <p key={i} className="mb-2 text-sm text-gray-500 d:text-gray-400">
            {achievement}
          </p>
        ))}
      </div>

      {/* Technologies */}
      <div className="flex flex-wrap gap-2">
        {experience.technologies.map((tech, i) => (
          <span
            key={i}
            className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 d:border-gray-700 d:bg-gray-800 d:text-gray-400"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

// Years of Experience Counter
const YearsCounter = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="sticky top-[calc(100vh-8rem)] z-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 p-8 text-center text-white shadow-xl md:p-12"
    >
      <div>
        <h2 className="mb-2 text-4xl font-bold md:text-5xl">
          That's {EXPERIENCE_STATS.yearsExperience}+ years experience!
        </h2>
        <p className="text-lg text-white/80">
          {EXPERIENCE_STATS.technologies}+ technologies • {EXPERIENCE_STATS.projects}+ projects delivered
        </p>
      </div>
    </motion.div>
  );
};

export const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  // Scroll progress for background effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-cyan-50/30 py-16 md:py-24 d:from-gray-950 d:via-gray-900 d:to-gray-950"
    >
      {/* Background Decoration */}
      <motion.div
        style={{ y: backgroundY }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-cyan-200/20 blur-3xl d:bg-cyan-900/20" />
        <div className="absolute bottom-1/4 left-0 h-96 w-96 rounded-full bg-violet-200/20 blur-3xl d:bg-violet-900/20" />
      </motion.div>

      <div className="mx-auto max-w-5xl px-4 md:px-8">
        {/* Section Header */}
        <header ref={headerRef} className="mb-12 text-center md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="heading-pre"
          >
            Where have I been?
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="heading-2xl mb-4"
          >
            Work Experience
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-gray-600 d:text-gray-400"
          >
            Scroll through my career journey. Each card stacks as you explore my
            professional timeline.
          </motion.p>
        </header>

        {/* Stacked Cards Container */}
        <div className="relative pt-4">
          {EXPERIENCE_DATA.map((experience, index) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              index={index}
              total={EXPERIENCE_DATA.length}
            />
          ))}

          {/* Years Counter Card */}
          <YearsCounter />
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-gray-400 d:text-gray-500">
            Want to know more?{" "}
            <a
              href="#contact"
              className="font-medium text-gray-600 underline underline-offset-4 transition-colors hover:text-gray-900 d:text-gray-300 d:hover:text-white"
            >
              Let's connect
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
