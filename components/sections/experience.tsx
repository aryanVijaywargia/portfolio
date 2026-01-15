import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import clsx from "clsx";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MinusIcon,
  PlusIcon,
  XMarkIcon,
  CodeBracketSquareIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import {
  EXPERIENCE_DATA,
  EXPERIENCE_STATS,
  EXPERIENCE_BRANCHES,
  EXPERIENCE_CONTRIBUTORS,
  ExperienceItem,
} from "content/experience";

export const Experience = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const targetText = "git log --work-experience --interactive";

  // Typing animation effect
  useEffect(() => {
    if (!isInView) return;

    setIsTyping(true);
    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex <= targetText.length) {
        setTypedText(targetText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [isInView]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  const getTypeColor = (type: ExperienceItem["type"]) => {
    switch (type) {
      case "employment":
        return "text-cyan-400";
      case "freelance":
        return "text-purple-400";
      case "project":
        return "text-green-400";
      case "education":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const getTypeBadge = (type: ExperienceItem["type"]) => {
    switch (type) {
      case "employment":
        return "EMP";
      case "freelance":
        return "FREE";
      case "project":
        return "OSS";
      case "education":
        return "EDU";
      default:
        return "UNK";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-16"
    >
      {/* Section Header */}
      <header className="mx-auto mb-8 grid w-full max-w-6xl px-4 md:px-8">
        <div className="heading-pre">Interactive Experience</div>
        <h1 className="heading-2xl -ml-1">Work History as Code</h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Main Terminal Window */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-lg border border-gray-700/50 bg-[#1a1a2e] shadow-2xl">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-gray-700/50 bg-gray-800/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex items-center gap-2 font-mono text-sm text-gray-400">
                <CodeBracketSquareIcon className="h-4 w-4" />
                <span>work-experience.terminal</span>
              </div>
              <div className="w-16"></div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm">
              {/* Command Input */}
              <div className="mb-6 flex items-center gap-2">
                <span className="text-cyan-400">$</span>
                <span className="text-gray-300">{typedText}</span>
                <span className={`text-gray-300 ${showCursor ? "opacity-100" : "opacity-0"}`}>
                  |
                </span>
              </div>

              {/* Experience Commits */}
              <div className="space-y-4">
                {EXPERIENCE_DATA.map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: index * 0.2 + 1 }}
                    className="group"
                  >
                    {/* Commit Header */}
                    <button
                      onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                      className="-m-3 w-full rounded-md p-3 text-left transition-all hover:bg-gray-800/30"
                    >
                      <div className="flex items-start gap-4">
                        {/* Commit Hash & Icon */}
                        <div className="flex flex-shrink-0 items-center gap-3">
                          <span className="font-bold text-yellow-400">{exp.hash}</span>
                          <div
                            className={`rounded p-1 ${getTypeColor(
                              exp.type
                            )} bg-current bg-opacity-10`}
                          >
                            <exp.Icon className="h-4 w-4" />
                          </div>
                        </div>

                        {/* Commit Info */}
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-xs font-semibold text-cyan-400">
                              {getTypeBadge(exp.type)}
                            </span>
                            <span className="font-medium text-white">
                              {exp.position} @ {exp.company}
                            </span>
                            {!exp.endDate && (
                              <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400">
                            <span>
                              Author: Aryan Vijaywargia &lt;aryanvijaywargia@gmail.com&gt;
                            </span>
                            <span className="ml-4">
                              Date: {formatDate(exp.startDate)} -{" "}
                              {exp.endDate ? formatDate(exp.endDate) : "Present"}
                            </span>
                          </div>
                          <div className="mt-1 text-gray-300">{exp.description}</div>
                        </div>

                        {/* Expand Icon */}
                        <div className="flex-shrink-0">
                          {expandedId === exp.id ? (
                            <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {expandedId === exp.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-12 mt-4 space-y-4 border-l-2 border-gray-700 pl-6">
                            {/* Achievements Diff */}
                            <div>
                              <h4 className="mb-2 font-semibold text-green-400">+ Achievements:</h4>
                              <div className="space-y-1">
                                {exp.achievements.map((achievement, i) => (
                                  <div key={i} className="flex items-start gap-2 text-sm">
                                    <PlusIcon className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-400" />
                                    <span className="text-gray-300">{achievement}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Technologies */}
                            <div>
                              <h4 className="mb-2 font-semibold text-blue-400">
                                📁 Technologies Modified:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {exp.technologies.map((tech, i) => (
                                  <span
                                    key={i}
                                    className="rounded border border-blue-500/30 bg-blue-500/20 px-2 py-1 text-xs text-blue-400"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Projects */}
                            <div>
                              <h4 className="mb-2 font-semibold text-purple-400">
                                🔀 Branch Merges:
                              </h4>
                              <div className="space-y-1">
                                {exp.projects.map((project, i) => (
                                  <div key={i} className="flex items-center gap-2 text-sm">
                                    <ArrowRightIcon className="h-3 w-3 text-purple-400" />
                                    <span className="text-gray-300">{project}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ delay: 0.5 }}
            className="rounded-lg border border-gray-700/50 bg-[#1a1a2e] p-6"
          >
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-cyan-400">
              <ChartBarIcon className="h-5 w-5" />
              Repository Stats
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Commits:</span>
                <span className="font-mono text-white">{EXPERIENCE_STATS.totalCommits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Years Active:</span>
                <span className="font-mono text-white">{EXPERIENCE_STATS.yearsExperience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Technologies:</span>
                <span className="font-mono text-white">{EXPERIENCE_STATS.technologies}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Projects:</span>
                <span className="font-mono text-white">{EXPERIENCE_STATS.projects}</span>
              </div>
            </div>
          </motion.div>

          {/* Branches */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ delay: 0.7 }}
            className="rounded-lg border border-gray-700/50 bg-[#1a1a2e] p-6"
          >
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-cyan-400">
              <ArrowRightIcon className="h-5 w-5" />
              Branches
            </h3>
            <div className="space-y-2">
              {EXPERIENCE_BRANCHES.map((branch, index) => (
                <div key={branch.name} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{branch.name}</span>
                  <span className="font-mono text-gray-400">({branch.count})</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contributors */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ delay: 0.9 }}
            className="rounded-lg border border-gray-700/50 bg-[#1a1a2e] p-6"
          >
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-cyan-400">
              <UserGroupIcon className="h-5 w-5" />
              Contributors
            </h3>
            <div className="space-y-2">
              {EXPERIENCE_CONTRIBUTORS.map((contributor, index) => (
                <div key={index} className="text-sm text-gray-300">
                  {contributor}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
