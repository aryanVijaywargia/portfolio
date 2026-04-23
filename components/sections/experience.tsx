import { useAchievementActions } from "components/achievements";
import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import clsx from "clsx";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { EXPERIENCE_JOURNEY, ExperienceAccentKey, ExperienceCompany } from "content/experience";
import { usePortfolioMode } from "components/_stores/portfolio-mode-context";
import dynamic from "next/dynamic";

const ExperienceGraph = dynamic(
  () => import("./experience-graph").then((mod) => mod.ExperienceGraph),
  {
    ssr: false,
    loading: () => (
      <div className="relative h-[600px] w-full overflow-hidden rounded-[1.5rem] border bg-[var(--experience-shell)] shadow-[var(--experience-shadow)] [border-color:var(--experience-border)]" />
    ),
  }
);

type AccentStyle = { bg: string; text: string; border: string; dot: string };

const DEFAULT_ACCENTS: Record<ExperienceAccentKey, AccentStyle> = {
  primary: {
    bg: "bg-sky-500/12 d:bg-sky-500/10",
    text: "text-sky-700 d:text-sky-400",
    border: "border-sky-500/70",
    dot: "#0ea5e9",
  },
  secondary: {
    bg: "bg-indigo-500/12 d:bg-indigo-500/10",
    text: "text-indigo-700 d:text-indigo-400",
    border: "border-indigo-500/70",
    dot: "#818cf8",
  },
  tertiary: {
    bg: "bg-violet-500/12 d:bg-violet-500/10",
    text: "text-violet-700 d:text-violet-400",
    border: "border-violet-500/70",
    dot: "#a78bfa",
  },
};

const BATMAN_ACCENTS: Record<ExperienceAccentKey, AccentStyle> = {
  primary: {
    bg: "bg-teal-500/12 d:bg-teal-500/10",
    text: "text-teal-700 d:text-teal-400",
    border: "border-teal-500/70",
    dot: "#00a692",
  },
  secondary: {
    bg: "bg-emerald-600/12 d:bg-emerald-600/10",
    text: "text-emerald-700 d:text-emerald-500",
    border: "border-emerald-600/70",
    dot: "#047857",
  },
  tertiary: {
    bg: "bg-cyan-400/12 d:bg-cyan-400/10",
    text: "text-cyan-700 d:text-cyan-300",
    border: "border-cyan-400/70",
    dot: "#a3dbcf",
  },
};

const EXPERIENCE_THEME_CLASSES = [
  "[--experience-shell:rgba(248,250,252,0.94)]",
  "[--experience-shell-strong:#ffffff]",
  "[--experience-panel:rgba(255,255,255,0.82)]",
  "[--experience-panel-muted:rgba(248,250,252,0.98)]",
  "[--experience-panel-selected:rgba(241,245,249,0.96)]",
  "[--experience-text:#0f172a]",
  "[--experience-text-muted:#475569]",
  "[--experience-text-subtle:#64748b]",
  "[--experience-border:rgba(148,163,184,0.26)]",
  "[--experience-border-strong:rgba(100,116,139,0.42)]",
  "[--experience-rail:rgba(148,163,184,0.38)]",
  "[--experience-dot:#f8fafc]",
  "[--experience-edge:rgba(100,116,139,0.42)]",
  "[--experience-grid:#dbeafe]",
  "[--experience-shadow:0_24px_60px_-40px_rgba(15,23,42,0.32)]",
  "d:[--experience-shell:#0a0f1a]",
  "d:[--experience-shell-strong:#0f172a]",
  "d:[--experience-panel:rgba(15,23,42,0.78)]",
  "d:[--experience-panel-muted:rgba(17,24,39,0.88)]",
  "d:[--experience-panel-selected:rgba(30,41,59,0.72)]",
  "d:[--experience-text:#f8fafc]",
  "d:[--experience-text-muted:#cbd5e1]",
  "d:[--experience-text-subtle:#94a3b8]",
  "d:[--experience-border:rgba(71,85,105,0.42)]",
  "d:[--experience-border-strong:rgba(100,116,139,0.58)]",
  "d:[--experience-rail:rgba(51,65,85,0.9)]",
  "d:[--experience-dot:#1e293b]",
  "d:[--experience-edge:#374151]",
  "d:[--experience-grid:#1e293b]",
  "d:[--experience-shadow:0_24px_60px_-40px_rgba(2,8,23,0.82)]",
].join(" ");

function useAccentColors(): Record<ExperienceAccentKey, AccentStyle> {
  const { mode } = usePortfolioMode();
  return mode === "batman" ? BATMAN_ACCENTS : DEFAULT_ACCENTS;
}

let ACCENT_COLORS = DEFAULT_ACCENTS;

const KIND_LABELS: Record<ExperienceCompany["kind"], string> = {
  employment: "Employment",
  freelance: "Freelance",
  project: "Open Source",
  education: "Education",
};

const railItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const graphContainerVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const accordionVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.2 } },
};

function MobileAccordion({
  mobileOpenCompanyId,
  expandedAchievementId,
  onCompanyToggle,
  onAchievementToggle,
}: {
  mobileOpenCompanyId: string | null;
  expandedAchievementId: string | null;
  onCompanyToggle: (id: string) => void;
  onAchievementToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-3 lg:hidden">
      {EXPERIENCE_JOURNEY.companies.map((company) => {
        const isOpen = mobileOpenCompanyId === company.id;
        const accent = ACCENT_COLORS[company.accentKey];

        return (
          <div
            key={company.id}
            className="overflow-hidden rounded-2xl border bg-[var(--experience-panel)] shadow-[var(--experience-shadow)] [border-color:var(--experience-border)]"
          >
            <button
              onClick={() => onCompanyToggle(company.id)}
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-[var(--experience-panel-muted)]"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: accent.dot }}
                />
                <div>
                  <div className="font-semibold text-[var(--experience-text)]">
                    {company.company}
                  </div>
                  <div className="text-sm text-[var(--experience-text-muted)]">{company.role}</div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="font-mono text-xs text-[var(--experience-text-subtle)]">
                      {company.period}
                    </span>
                    <span
                      className={clsx(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium",
                        accent.bg,
                        accent.text
                      )}
                    >
                      {KIND_LABELS[company.kind]}
                    </span>
                  </div>
                </div>
              </div>
              {isOpen
                ? <ChevronUpIcon className="h-5 w-5 flex-shrink-0 text-[var(--experience-text-subtle)]" />
                : <ChevronDownIcon className="h-5 w-5 flex-shrink-0 text-[var(--experience-text-subtle)]" />}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  variants={accordionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="overflow-hidden"
                >
                  <div className="space-y-2 px-4 pb-4">
                    {company.achievements.map((ach) => {
                      const isExpanded = expandedAchievementId === ach.id;

                      return (
                        <div
                          key={ach.id}
                          className="overflow-hidden rounded-xl border bg-[var(--experience-shell)] [border-color:var(--experience-border)]"
                        >
                          <button
                            onClick={() => onAchievementToggle(ach.id)}
                            className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-[var(--experience-panel)]"
                            aria-expanded={isExpanded}
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <span
                                className={clsx(
                                  "flex-shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase",
                                  accent.bg,
                                  accent.text
                                )}
                              >
                                {ach.category}
                              </span>
                              <span className="truncate text-sm text-[var(--experience-text)]">
                                {ach.title}
                              </span>
                            </div>
                            <div className="ml-2 flex flex-shrink-0 items-center gap-2">
                              <span className="text-[10px] text-[var(--experience-text-subtle)]">
                                {ach.technologies.length} tech
                              </span>
                              {isExpanded
                                ? <ChevronUpIcon className="h-3.5 w-3.5 text-[var(--experience-text-subtle)]" />
                                : <ChevronDownIcon className="h-3.5 w-3.5 text-[var(--experience-text-subtle)]" />}
                            </div>
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                variants={accordionVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="overflow-hidden"
                              >
                                <div className="space-y-2 px-3 pb-3">
                                  <p className="text-sm leading-relaxed text-[var(--experience-text-muted)]">
                                    {ach.summary}
                                  </p>
                                  <div
                                    className={clsx(
                                      "rounded-lg border-l-2 bg-[var(--experience-panel)] px-3 py-2",
                                      accent.border
                                    )}
                                  >
                                    <span className="text-xs font-medium text-[var(--experience-text-muted)]">
                                      Impact:{" "}
                                    </span>
                                    <span className={clsx("text-xs font-semibold", accent.text)}>
                                      {ach.impact}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {ach.technologies.map((tech) => (
                                      <span
                                        key={tech}
                                        className="rounded-full bg-[var(--experience-panel)] px-2 py-0.5 text-[10px] text-[var(--experience-text-muted)]"
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function LeftRail({
  selectedCompanyId,
  onCompanyClick,
}: {
  selectedCompanyId: string | null;
  onCompanyClick: (id: string) => void;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  return (
    <div ref={sectionRef} className="hidden w-[300px] flex-shrink-0 lg:block xl:w-[320px]">
      <div className="relative pl-7">
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-3 left-[11px] top-3 w-px"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, var(--experience-rail) 12%, var(--experience-rail) 88%, transparent 100%)",
          }}
        />

        <motion.ol
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="m-0 list-none p-0"
        >
          {EXPERIENCE_JOURNEY.companies.map((company) => {
            const isSelected = selectedCompanyId === company.id;
            const accent = ACCENT_COLORS[company.accentKey];

            return (
              <motion.li key={company.id} variants={railItemVariants} className="relative">
                <button
                  type="button"
                  onClick={() => onCompanyClick(company.id)}
                  aria-expanded={isSelected}
                  className="group relative block w-full py-4 pr-2 text-left outline-none"
                >
                  <span
                    aria-hidden
                    className="absolute top-[22px] block h-[10px] w-[10px] rounded-full transition-all duration-300 ease-out"
                    style={{
                      left: "-22px",
                      backgroundColor: isSelected ? accent.dot : "var(--experience-shell)",
                      border: `2px solid ${
                        isSelected ? accent.dot : "var(--experience-border-strong)"
                      }`,
                      boxShadow: isSelected ? `0 0 0 5px ${accent.dot}1a` : "none",
                      transform: isSelected ? "scale(1.25)" : "scale(1)",
                    }}
                  />

                  <motion.div
                    initial={false}
                    animate={{ x: isSelected ? 4 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <div
                      className="font-mono text-[10.5px] uppercase tracking-[0.22em] transition-colors duration-300"
                      style={{
                        color: isSelected ? accent.dot : "var(--experience-text-subtle)",
                      }}
                    >
                      {company.period}
                    </div>
                    <div className="mt-1.5 text-[17px] font-semibold leading-tight text-[var(--experience-text)]">
                      {company.company}
                    </div>
                    <div className="mt-0.5 text-[13.5px] leading-snug text-[var(--experience-text-muted)]">
                      {company.role}
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[var(--experience-text-subtle)]">
                      <span style={{ color: accent.dot }} className="font-medium">
                        {KIND_LABELS[company.kind]}
                      </span>
                      <span aria-hidden>·</span>
                      <span>{company.achievements.length} achievements</span>
                    </div>
                  </motion.div>
                </button>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </div>
  );
}

export const Experience = () => {
  const [graphExpanded, setGraphExpanded] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [expandedAchievementId, setExpandedAchievementId] = useState<string | null>(null);
  const [mobileOpenCompanyId, setMobileOpenCompanyId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { trackAchievementEvent } = useAchievementActions();
  const accentColors = useAccentColors();
  ACCENT_COLORS = accentColors;

  const handleRootClick = useCallback(() => {
    setGraphExpanded(true);
  }, []);

  const handleCompanyClick = useCallback((id: string) => {
    setSelectedCompanyId((prev) => (prev === id ? null : id));
    setExpandedAchievementId(null);
  }, []);

  const handleAchievementClick = useCallback((id: string) => {
    const next = expandedAchievementId === id ? null : id;
    setExpandedAchievementId(next);
    if (next) {
      trackAchievementEvent({ type: "experience:expanded", id: next });
    }
  }, [expandedAchievementId, trackAchievementEvent]);

  const handleCloseAchievement = useCallback(() => {
    setExpandedAchievementId(null);
  }, []);

  const handleMobileCompanyToggle = useCallback((id: string) => {
    setMobileOpenCompanyId((prev) => (prev === id ? null : id));
    setExpandedAchievementId(null);
  }, []);

  const handleMobileAchievementToggle = useCallback((id: string) => {
    const next = expandedAchievementId === id ? null : id;
    setExpandedAchievementId(next);
    if (next) {
      trackAchievementEvent({ type: "experience:expanded", id: next });
    }
  }, [expandedAchievementId, trackAchievementEvent]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className={clsx(
        "mx-auto min-h-[100svh] max-w-7xl px-4 pt-24 pb-16 md:px-8 md:pt-28 md:pb-24",
        EXPERIENCE_THEME_CLASSES
      )}
    >
      <header className="mx-auto mb-12 grid w-full max-w-6xl px-4 md:mb-16 md:px-8">
        <div className="heading-pre">Experience</div>
        <h1 className="heading-2xl -ml-1">My Journey</h1>
      </header>

      <div className="hidden lg:flex lg:gap-6 xl:gap-8">
        <LeftRail
          selectedCompanyId={selectedCompanyId}
          onCompanyClick={(id) => {
            if (!graphExpanded) setGraphExpanded(true);
            handleCompanyClick(id);
          }}
        />
        <motion.div
          variants={graphContainerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="min-w-0 flex-1"
        >
          {isInView
            ? <ExperienceGraph
                accentColors={accentColors}
                graphExpanded={graphExpanded}
                selectedCompanyId={selectedCompanyId}
                expandedAchievementId={expandedAchievementId}
                onRootClick={handleRootClick}
                onCompanyClick={(id) => {
                  if (!graphExpanded) setGraphExpanded(true);
                  handleCompanyClick(id);
                }}
                onAchievementClick={handleAchievementClick}
                onCloseAchievement={handleCloseAchievement}
              />
            : <div className="relative h-[600px] w-full overflow-hidden rounded-[1.5rem] border bg-[var(--experience-shell)] shadow-[var(--experience-shadow)] [border-color:var(--experience-border)]" />}
        </motion.div>
      </div>

      <MobileAccordion
        mobileOpenCompanyId={mobileOpenCompanyId}
        expandedAchievementId={expandedAchievementId}
        onCompanyToggle={handleMobileCompanyToggle}
        onAchievementToggle={handleMobileAchievementToggle}
      />
    </section>
  );
};
