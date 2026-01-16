import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
} from "framer-motion";
import clsx from "clsx";
import {
  CalendarIcon,
  MapPinIcon,
  ChevronRightIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import {
  EXPERIENCE_DATA,
  EXPERIENCE_STATS,
  ExperienceItem,
} from "content/experience";

// Get background gradient based on experience type
const getTypeGradient = (type: ExperienceItem["type"]) => {
  switch (type) {
    case "employment":
      return "from-emerald-500/20 via-cyan-500/10 to-transparent";
    case "freelance":
      return "from-purple-500/20 via-violet-500/10 to-transparent";
    case "project":
      return "from-blue-500/20 via-indigo-500/10 to-transparent";
    case "education":
      return "from-amber-500/20 via-yellow-500/10 to-transparent";
    default:
      return "from-gray-500/20 via-gray-500/10 to-transparent";
  }
};

// Get accent color based on experience type
const getTypeAccent = (type: ExperienceItem["type"]) => {
  switch (type) {
    case "employment":
      return {
        border: "border-emerald-500/50",
        glow: "shadow-emerald-500/20",
        text: "text-emerald-400",
        bg: "bg-emerald-500/10",
        dot: "bg-emerald-500",
      };
    case "freelance":
      return {
        border: "border-purple-500/50",
        glow: "shadow-purple-500/20",
        text: "text-purple-400",
        bg: "bg-purple-500/10",
        dot: "bg-purple-500",
      };
    case "project":
      return {
        border: "border-blue-500/50",
        glow: "shadow-blue-500/20",
        text: "text-blue-400",
        bg: "bg-blue-500/10",
        dot: "bg-blue-500",
      };
    case "education":
      return {
        border: "border-amber-500/50",
        glow: "shadow-amber-500/20",
        text: "text-amber-400",
        bg: "bg-amber-500/10",
        dot: "bg-amber-500",
      };
    default:
      return {
        border: "border-gray-500/50",
        glow: "shadow-gray-500/20",
        text: "text-gray-400",
        bg: "bg-gray-500/10",
        dot: "bg-gray-500",
      };
  }
};

// Get type label
const getTypeLabel = (type: ExperienceItem["type"]) => {
  switch (type) {
    case "employment":
      return "Full-Time";
    case "freelance":
      return "Freelance";
    case "project":
      return "Open Source";
    case "education":
      return "Education";
    default:
      return "Experience";
  }
};

// Format date for display
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

// Calculate duration
const getDuration = (startDate: string, endDate: string | null) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years > 0 && remainingMonths > 0) {
    return `${years}y ${remainingMonths}mo`;
  } else if (years > 0) {
    return `${years} year${years > 1 ? "s" : ""}`;
  } else {
    return `${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
  }
};

// Timeline Card Component
const TimelineCard = ({
  experience,
  index,
  isLeft,
}: {
  experience: ExperienceItem;
  index: number;
  isLeft: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  const accent = getTypeAccent(experience.type);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -50 : 50 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={clsx(
        "relative w-full md:w-[calc(50%-2rem)]",
        isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
      )}
    >
      {/* Connection Line to Timeline */}
      <div
        className={clsx(
          "absolute top-8 hidden h-0.5 w-8 md:block",
          accent.dot,
          isLeft ? "right-0" : "left-0"
        )}
      />

      {/* Card */}
      <div
        className={clsx(
          "group relative overflow-hidden rounded-2xl border p-6 backdrop-blur-sm transition-all duration-500",
          "hover:shadow-xl",
          accent.border,
          accent.glow,
          "bg-white/5 d:bg-gray-900/50"
        )}
      >
        {/* Background Gradient */}
        <div
          className={clsx(
            "absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity group-hover:opacity-100",
            getTypeGradient(experience.type)
          )}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  accent.bg
                )}
              >
                <experience.Icon className={clsx("h-6 w-6", accent.text)} />
              </div>
              <div>
                <span
                  className={clsx(
                    "inline-block rounded-full px-3 py-0.5 text-xs font-medium",
                    accent.bg,
                    accent.text
                  )}
                >
                  {getTypeLabel(experience.type)}
                </span>
                <h3 className="mt-1 text-lg font-bold text-gray-900 d:text-white">
                  {experience.position}
                </h3>
              </div>
            </div>
            {!experience.endDate && (
              <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                <SparklesIcon className="h-3 w-3" />
                Current
              </span>
            )}
          </div>

          {/* Company & Location */}
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600 d:text-gray-400">
            <span className="font-semibold text-gray-800 d:text-gray-200">
              {experience.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPinIcon className="h-4 w-4" />
              {experience.location}
            </span>
            <span className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              {formatDate(experience.startDate)} -{" "}
              {experience.endDate ? formatDate(experience.endDate) : "Present"}
              <span className="ml-1 text-gray-500">
                ({getDuration(experience.startDate, experience.endDate)})
              </span>
            </span>
          </div>

          {/* Description */}
          <p className="mb-4 text-gray-600 d:text-gray-400">
            {experience.description}
          </p>

          {/* Key Achievements */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-semibold text-gray-700 d:text-gray-300">
              Key Achievements
            </h4>
            <ul className="space-y-2">
              {experience.achievements.slice(0, 3).map((achievement, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600 d:text-gray-400"
                >
                  <ChevronRightIcon
                    className={clsx("mt-0.5 h-4 w-4 flex-shrink-0", accent.text)}
                  />
                  {achievement}
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {experience.technologies.map((tech, i) => (
              <span
                key={i}
                className="rounded-full border border-gray-200/50 bg-gray-100/50 px-3 py-1 text-xs font-medium text-gray-600 d:border-gray-700/50 d:bg-gray-800/50 d:text-gray-400"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Experience = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-50px" });

  // Scroll progress for the timeline
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth spring animation for timeline progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Transform progress to timeline height
  const timelineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative mx-auto max-w-7xl overflow-hidden px-4 py-16 md:px-8 md:py-24"
    >
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-gradient-radial from-emerald-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-gradient-radial from-purple-500/10 to-transparent blur-3xl" />
      </div>

      {/* Section Header */}
      <header ref={headerRef} className="relative z-10 mx-auto mb-16 max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="heading-pre"
        >
          My Journey
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="heading-2xl mb-4"
        >
          Experience Timeline
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-2xl text-gray-600 d:text-gray-400"
        >
          A story of growth, learning, and building. From bootcamp graduate to senior
          developer, each chapter has shaped my journey in software development.
        </motion.p>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap justify-center gap-8"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 d:text-white">
              {EXPERIENCE_STATS.yearsExperience}+
            </div>
            <div className="text-sm text-gray-500">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 d:text-white">
              {EXPERIENCE_STATS.technologies}+
            </div>
            <div className="text-sm text-gray-500">Technologies</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 d:text-white">
              {EXPERIENCE_STATS.projects}+
            </div>
            <div className="text-sm text-gray-500">Projects Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 d:text-white">
              {EXPERIENCE_DATA.length}
            </div>
            <div className="text-sm text-gray-500">Career Milestones</div>
          </div>
        </motion.div>
      </header>

      {/* Timeline Container */}
      <div ref={containerRef} className="relative">
        {/* Central Timeline Line */}
        <div className="absolute left-4 top-0 hidden h-full w-0.5 md:left-1/2 md:block md:-translate-x-1/2">
          {/* Background Line */}
          <div className="h-full w-full rounded-full bg-gray-200 d:bg-gray-800" />

          {/* Animated Progress Line */}
          <motion.div
            className="absolute left-0 top-0 w-full rounded-full bg-gradient-to-b from-emerald-500 via-purple-500 to-blue-500"
            style={{ height: timelineHeight }}
          />

          {/* Glowing Orb at Current Progress */}
          <motion.div
            className="absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-white shadow-lg shadow-purple-500/50"
            style={{ top: timelineHeight }}
          >
            <div className="absolute inset-0 animate-ping rounded-full bg-purple-400 opacity-75" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-purple-500" />
          </motion.div>
        </div>

        {/* Timeline Cards */}
        <div className="relative space-y-8 md:space-y-12">
          {EXPERIENCE_DATA.map((experience, index) => (
            <div key={experience.id} className="relative">
              {/* Timeline Dot */}
              <div className="absolute left-4 top-8 z-20 hidden md:left-1/2 md:block md:-translate-x-1/2">
                <div
                  className={clsx(
                    "h-4 w-4 rounded-full border-4 border-white d:border-gray-900",
                    getTypeAccent(experience.type).dot
                  )}
                />
              </div>

              {/* Card */}
              <TimelineCard
                experience={experience}
                index={index}
                isLeft={index % 2 === 0}
              />
            </div>
          ))}
        </div>

        {/* End of Timeline Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-col items-center"
        >
          <div className="mb-4 h-8 w-0.5 bg-gradient-to-b from-blue-500 to-transparent" />
          <div className="rounded-full bg-gradient-to-br from-emerald-500 via-purple-500 to-blue-500 p-4 text-white shadow-lg">
            <SparklesIcon className="h-6 w-6" />
          </div>
          <p className="mt-4 text-center text-sm font-medium text-gray-600 d:text-gray-400">
            More chapters to come...
          </p>
        </motion.div>
      </div>
    </section>
  );
};
