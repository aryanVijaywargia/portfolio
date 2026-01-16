import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import clsx from "clsx";
import {
  EXPERIENCE_DATA,
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

  const startStr = start.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  const endStr = end
    ? end.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Present";

  return `${startStr} — ${endStr}`;
};

// Get accent color based on type
const getAccentColor = (type: ExperienceItem["type"]): string => {
  switch (type) {
    case "employment":
      return "text-emerald-500 d:text-emerald-400";
    case "freelance":
      return "text-violet-500 d:text-violet-400";
    case "project":
      return "text-sky-500 d:text-sky-400";
    case "education":
      return "text-amber-500 d:text-amber-400";
    default:
      return "text-gray-500 d:text-gray-400";
  }
};

// Experience Row Component
const ExperienceRow = ({
  experience,
  index,
}: {
  experience: ExperienceItem;
  index: number;
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rowRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      className="group relative"
    >
      {/* Row Container */}
      <div className="relative grid grid-cols-1 gap-6 border-t border-gray-200 py-10 transition-colors duration-300 group-hover:bg-gray-50/50 md:grid-cols-12 md:gap-8 md:py-14 d:border-gray-800 d:group-hover:bg-gray-900/30">
        {/* Large Index Number - Left Column */}
        <div className="relative hidden md:col-span-2 md:flex md:items-start md:justify-end md:pr-8 lg:col-span-2">
          <span
            className={clsx(
              "select-none font-serif text-7xl font-bold leading-none tracking-tighter transition-all duration-500 lg:text-8xl xl:text-9xl",
              "text-transparent",
              "[-webkit-text-stroke:1.5px_theme(colors.gray.300)]",
              "group-hover:[-webkit-text-stroke:1.5px_theme(colors.gray.400)]",
              "d:[-webkit-text-stroke:1.5px_theme(colors.gray.700)]",
              "d:group-hover:[-webkit-text-stroke:1.5px_theme(colors.gray.500)]",
              "group-hover:translate-x-1 group-hover:scale-105"
            )}
          >
            {formatIndex(index)}
          </span>
        </div>

        {/* Mobile Index Number - Watermark Style */}
        <div className="pointer-events-none absolute right-4 top-6 md:hidden">
          <span className="font-serif text-5xl font-bold leading-none tracking-tighter text-gray-100 d:text-gray-800/50">
            {formatIndex(index)}
          </span>
        </div>

        {/* Content - Right Column */}
        <div className="relative md:col-span-10 lg:col-span-10">
          {/* Header Row */}
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-4">
            {/* Role Title */}
            <h3 className="font-serif text-2xl font-bold tracking-tight text-gray-900 d:text-white sm:text-3xl">
              {experience.position}
            </h3>

            {/* Company Name */}
            <span className={clsx("text-lg font-medium", getAccentColor(experience.type))}>
              {experience.company}
            </span>

            {/* Date Range */}
            <span className="text-sm font-medium tracking-wide text-gray-400 sm:ml-auto d:text-gray-500">
              {formatDateRange(experience.startDate, experience.endDate)}
              {!experience.endDate && (
                <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 d:bg-emerald-900/30 d:text-emerald-400">
                  Current
                </span>
              )}
            </span>
          </div>

          {/* Location */}
          <p className="mb-4 text-sm text-gray-500 d:text-gray-400">
            {experience.location}
          </p>

          {/* Description */}
          <p className="mb-6 max-w-3xl text-base leading-relaxed text-gray-600 d:text-gray-300">
            {experience.description}
          </p>

          {/* Achievements - Expandable on hover */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={isInView ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            className="overflow-hidden"
          >
            <ul className="mb-6 space-y-2">
              {experience.achievements.slice(0, 3).map((achievement, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-gray-500 d:text-gray-400"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-300 d:bg-gray-600" />
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {experience.technologies.slice(0, 6).map((tech, i) => (
              <span
                key={i}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 transition-colors group-hover:border-gray-300 group-hover:bg-gray-100 d:border-gray-700 d:bg-gray-800 d:text-gray-400 d:group-hover:border-gray-600 d:group-hover:bg-gray-700"
              >
                {tech}
              </span>
            ))}
            {experience.technologies.length > 6 && (
              <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-400 d:border-gray-700 d:bg-gray-800">
                +{experience.technologies.length - 6}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24"
    >
      {/* Section Header */}
      <header ref={headerRef} className="mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="heading-pre"
        >
          Career Journey
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="heading-2xl mb-4"
        >
          Experience
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-lg text-gray-600 d:text-gray-400"
        >
          A curated timeline of my professional journey, from coding bootcamp to
          leading development teams on production applications.
        </motion.p>
      </header>

      {/* Experience List */}
      <div className="relative">
        {EXPERIENCE_DATA.map((experience, index) => (
          <ExperienceRow
            key={experience.id}
            experience={experience}
            index={index}
          />
        ))}

        {/* Bottom Border */}
        <div className="border-t border-gray-200 d:border-gray-800" />
      </div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
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
    </section>
  );
};
