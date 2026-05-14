import { useAchievementActions } from "components/achievements";
import { EXPERIENCE_JOURNEY, ExperienceCompany, ExperienceKind } from "content/experience";
import { AnimatePresence, motion, useInView } from "framer-motion";
import clsx from "clsx";
import { useCallback, useMemo, useRef, useState } from "react";

const EXPERIENCE_THEME_CLASSES = [
  "[--experience-shell:rgba(255,255,255,0.92)]",
  "[--experience-card:rgba(248,250,252,0.78)]",
  "[--experience-panel:rgba(255,255,255,0.84)]",
  "[--experience-panel-strong:#ffffff]",
  "[--experience-panel-muted:rgba(241,245,249,0.74)]",
  "[--experience-text:#0f172a]",
  "[--experience-text-muted:#475569]",
  "[--experience-text-subtle:#64748b]",
  "[--experience-border:rgba(148,163,184,0.28)]",
  "[--experience-border-faint:rgba(148,163,184,0.16)]",
  "[--experience-grid:rgba(148,163,184,0.16)]",
  "[--experience-shadow:0_24px_60px_-42px_rgba(15,23,42,0.36)]",
  "[--experience-glow:rgba(14,165,233,0.08)]",
  "d:[--experience-shell:#07090f]",
  "d:[--experience-card:rgba(15,23,42,0.45)]",
  "d:[--experience-panel:rgba(7,9,15,0.5)]",
  "d:[--experience-panel-strong:rgba(7,9,15,0.8)]",
  "d:[--experience-panel-muted:rgba(148,163,184,0.04)]",
  "d:[--experience-text:#f8fafc]",
  "d:[--experience-text-muted:#94a3b8]",
  "d:[--experience-text-subtle:#64748b]",
  "d:[--experience-border:rgba(148,163,184,0.12)]",
  "d:[--experience-border-faint:rgba(148,163,184,0.08)]",
  "d:[--experience-grid:rgba(148,163,184,0.06)]",
  "d:[--experience-shadow:0_24px_60px_-40px_rgba(2,8,23,0.82)]",
  "d:[--experience-glow:rgba(6,182,212,0.08)]",
].join(" ");

type KindStyle = {
  label: string;
  color: string;
  soft: string;
  border: string;
  glow: string;
};

const KIND_STYLES: Record<ExperienceKind, KindStyle> = {
  employment: {
    label: "Work",
    color: "#06b6d4",
    soft: "rgba(6,182,212,0.1)",
    border: "rgba(6,182,212,0.42)",
    glow: "rgba(6,182,212,0.36)",
  },
  freelance: {
    label: "Freelance",
    color: "#c084fc",
    soft: "rgba(192,132,252,0.1)",
    border: "rgba(192,132,252,0.42)",
    glow: "rgba(192,132,252,0.34)",
  },
  education: {
    label: "Edu",
    color: "#fbbf24",
    soft: "rgba(251,191,36,0.12)",
    border: "rgba(251,191,36,0.42)",
    glow: "rgba(251,191,36,0.3)",
  },
  project: {
    label: "OSS",
    color: "#34d399",
    soft: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.42)",
    glow: "rgba(52,211,153,0.34)",
  },
};

const KIND_LABELS: Record<ExperienceKind, string> = {
  employment: "Employment",
  freelance: "Freelance",
  education: "Education",
  project: "Open Source",
};

const DEFAULT_SELECTED_ID = "flext";
const TIMELINE_LABEL_WIDTH = 116;

function monthIndex(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  return parsed.getUTCFullYear() * 12 + parsed.getUTCMonth();
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

function shortYear(year: number) {
  return `'${String(year).slice(-2)}`;
}

function getTimelinePercent(date: string | undefined, startMonth: number, totalMonths: number) {
  const endMonth = date ? monthIndex(date) : monthIndex(EXPERIENCE_JOURNEY.timelineEnd);

  return clampPercent(((endMonth - startMonth) / totalMonths) * 100);
}

function getTimelineLayout(company: ExperienceCompany, startMonth: number, totalMonths: number) {
  const start = getTimelinePercent(company.timeline.start, startMonth, totalMonths);
  const end = getTimelinePercent(company.timeline.end, startMonth, totalMonths);

  return {
    start,
    end,
    width: Math.max(end - start, 1.5),
  };
}

function buildYearMarkers() {
  const start = new Date(`${EXPERIENCE_JOURNEY.timelineStart}T00:00:00`).getUTCFullYear();
  const end = new Date(`${EXPERIENCE_JOURNEY.timelineEnd}T00:00:00`).getUTCFullYear();
  const startMonth = monthIndex(EXPERIENCE_JOURNEY.timelineStart);
  const totalMonths = Math.max(1, monthIndex(EXPERIENCE_JOURNEY.timelineEnd) - startMonth);

  return Array.from({ length: end - start + 1 }, (_, index) => {
    const year = start + index;
    return {
      year,
      left: getTimelinePercent(`${year}-01-01`, startMonth, totalMonths),
      showLabel: year % 2 === 0,
    };
  }).filter((marker) => marker.left >= 0 && marker.left <= 100);
}

function ExperienceHeader() {
  return (
    <header className="mb-8 grid w-full md:mb-10">
      <div className="heading-pre">{EXPERIENCE_JOURNEY.eyebrow}</div>
      <h2 className="heading-2xl -ml-1 max-w-4xl text-[var(--experience-text)]">
        {EXPERIENCE_JOURNEY.heading}
      </h2>

      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[12px] text-[var(--experience-text-subtle)] md:mt-4">
        {EXPERIENCE_JOURNEY.stats.map((stat) => (
          <span key={`${stat.value}-${stat.label}`} className="inline-flex items-baseline gap-1.5">
            <b className="text-[15px] text-[var(--experience-text)]">{stat.value}</b>
            {stat.label}
          </span>
        ))}
      </div>
    </header>
  );
}

function TimelineBlock({
  selectedCompanyId,
  onSelect,
}: {
  selectedCompanyId: string;
  onSelect: (id: string) => void;
}) {
  const startMonth = monthIndex(EXPERIENCE_JOURNEY.timelineStart);
  const totalMonths = Math.max(1, monthIndex(EXPERIENCE_JOURNEY.timelineEnd) - startMonth);
  const markers = useMemo(() => buildYearMarkers(), []);
  const trackCount =
    Math.max(...EXPERIENCE_JOURNEY.companies.map((company) => company.timeline.track)) + 1;
  const trackGap = 48;
  const timelineHeight = trackCount * trackGap + 72;

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--experience-text-subtle)]">
          Timeline · proportional to actual duration
        </span>

        <div className="flex flex-wrap gap-x-3.5 gap-y-1 font-mono text-[11px] text-[var(--experience-text-subtle)]">
          {(["employment", "freelance", "education", "project"] as ExperienceKind[]).map((kind) => (
            <span key={kind} className="inline-flex items-center gap-1.5">
              <span
                aria-hidden
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: KIND_STYLES[kind].color }}
              />
              {KIND_STYLES[kind].label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative -mx-1 overflow-x-auto px-1 pb-4">
        <div className="relative min-w-[760px]" style={{ height: timelineHeight }}>
          <div
            aria-hidden
            className="absolute bottom-8 right-0 top-0 border-l border-[var(--experience-border-faint)]"
            style={{ left: TIMELINE_LABEL_WIDTH }}
          >
            {markers.map((marker) => (
              <div key={marker.year}>
                <span
                  className="absolute top-0 h-full w-px bg-[var(--experience-grid)]"
                  style={{ left: `${marker.left}%` }}
                />
                {marker.showLabel && (
                  <span
                    className="absolute -bottom-7 -translate-x-1/2 font-mono text-[11px] text-[var(--experience-text-subtle)]"
                    style={{ left: `${marker.left}%` }}
                  >
                    {shortYear(marker.year)}
                  </span>
                )}
              </div>
            ))}

            <span className="bg-cyan-500/45 absolute bottom-0 top-0 w-px" style={{ left: "100%" }}>
              <span className="absolute -left-[3px] top-0 h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
            </span>
            <span className="absolute -bottom-7 right-0 translate-x-0 font-mono text-[11px] text-cyan-500">
              now
            </span>
          </div>

          {EXPERIENCE_JOURNEY.companies.map((company) => {
            const isSelected = selectedCompanyId === company.id;
            const style = KIND_STYLES[company.kind];
            const layout = getTimelineLayout(company, startMonth, totalMonths);
            const top = 6 + company.timeline.track * trackGap;

            return (
              <div key={company.id}>
                <span
                  className={clsx(
                    "absolute flex h-8 w-[108px] items-center justify-end pr-3 text-right text-[13px] leading-none tracking-[-0.01em]",
                    isSelected
                      ? "font-semibold text-cyan-500 d:text-cyan-300"
                      : "text-[var(--experience-text-muted)]"
                  )}
                  style={{ top }}
                >
                  {company.timeline.rowLabel}
                </span>

                <button
                  type="button"
                  title={`${company.company} · ${company.duration}`}
                  aria-pressed={isSelected}
                  onClick={() => onSelect(company.id)}
                  className="absolute flex h-8 min-w-8 items-center overflow-hidden rounded-md border px-3 text-left text-[12.5px] font-semibold tracking-[-0.005em] text-[var(--experience-text)] transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--experience-shell)] d:text-white"
                  style={{
                    top,
                    left: `calc(${TIMELINE_LABEL_WIDTH}px + (100% - ${TIMELINE_LABEL_WIDTH}px) * ${
                      layout.start / 100
                    })`,
                    width: `calc((100% - ${TIMELINE_LABEL_WIDTH}px) * ${layout.width / 100})`,
                    borderColor: style.border,
                    backgroundColor: style.soft,
                    boxShadow: isSelected
                      ? `0 0 0 1.5px ${style.color}, 0 0 16px ${style.glow}`
                      : "none",
                    zIndex: isSelected ? 2 : 1,
                  }}
                >
                  {layout.width > 12 && (
                    <span className="relative z-10 truncate">{company.timeline.barLabel}</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {EXPERIENCE_JOURNEY.companies.map((company) => {
          const isSelected = selectedCompanyId === company.id;
          const style = KIND_STYLES[company.kind];

          return (
            <button
              key={company.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(company.id)}
              className={clsx(
                "grid grid-cols-[16px,minmax(0,1fr),auto] items-center gap-2.5 rounded-lg border px-3.5 py-3 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--experience-shell)] sm:gap-3",
                isSelected
                  ? "border-cyan-500/20 bg-cyan-500/[0.06]"
                  : "border-transparent hover:bg-[var(--experience-panel-muted)]"
              )}
            >
              <span
                aria-hidden
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: style.color }}
              />
              <span className="min-w-0 text-[14px] font-semibold tracking-[-0.01em] text-[var(--experience-text)]">
                <span className="truncate">{company.company}</span>{" "}
                <span className="text-[13px] font-normal text-[var(--experience-text-muted)]">
                  · {company.roleShort}
                </span>
              </span>
              <span
                className={clsx(
                  "whitespace-nowrap font-mono text-[11px]",
                  isSelected ? "text-cyan-500" : "text-[var(--experience-text-subtle)]"
                )}
              >
                {company.periodShort}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RoleDetail({ company }: { company: ExperienceCompany }) {
  const style = KIND_STYLES[company.kind];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={company.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex min-w-0 flex-col gap-5"
      >
        <div className="flex flex-col gap-4 border-b border-[var(--experience-border-faint)] pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em]"
                style={{
                  color: style.color,
                  borderColor: style.border,
                  backgroundColor: style.soft,
                }}
              >
                <span
                  aria-hidden
                  className="h-1 w-1 rounded-full"
                  style={{ backgroundColor: style.color }}
                />
                {KIND_LABELS[company.kind]}
              </span>
              <span className="font-mono text-[11.5px] text-[var(--experience-text-muted)]">
                {company.period}{" "}
                <span className="text-[var(--experience-text-subtle)]">· {company.duration}</span>
              </span>
            </div>

            <h3 className="m-0 text-[28px] font-extrabold leading-tight tracking-[-0.025em] text-[var(--experience-text)]">
              {company.company}
            </h3>
            <p className="mt-2 text-[15px] tracking-[-0.005em] text-[var(--experience-text-muted)]">
              {company.role}
            </p>
          </div>

          {company.live && (
            <span className="inline-flex flex-shrink-0 items-center gap-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-emerald-500">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              {company.kind === "project" ? "Ongoing" : "Currently here"}
            </span>
          )}
        </div>

        <div className="grid gap-3 xl:grid-cols-2">
          {company.achievements.map((achievement) => (
            <article
              key={achievement.id}
              className="group flex min-h-[166px] flex-col gap-3 rounded-lg border bg-[var(--experience-panel)] px-4 py-4 transition-all duration-150 hover:bg-[var(--experience-panel-strong)]"
              style={{ borderColor: "var(--experience-border-faint)" }}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="font-mono text-[9.5px] font-bold uppercase tracking-[0.1em]"
                  style={{ color: style.color }}
                >
                  {achievement.category}
                </span>
                <span className="whitespace-nowrap font-mono text-[10.5px] font-bold tracking-[-0.005em] text-amber-500">
                  {achievement.impact}
                </span>
              </div>

              <h4 className="m-0 text-[14px] font-bold leading-snug tracking-[-0.01em] text-[var(--experience-text)]">
                {achievement.title}
              </h4>
              <p className="m-0 text-[12.5px] leading-relaxed text-[var(--experience-text-muted)] line-clamp-3">
                {achievement.summary}
              </p>
              <div className="mt-auto flex flex-wrap gap-1.5">
                {achievement.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded bg-[var(--experience-panel-muted)] px-2 py-1 font-mono text-[10px] text-[var(--experience-text-muted)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export const Experience = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState(DEFAULT_SELECTED_ID);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { trackAchievementEvent } = useAchievementActions();

  const selectedCompany = useMemo(
    () =>
      EXPERIENCE_JOURNEY.companies.find((company) => company.id === selectedCompanyId) ??
      EXPERIENCE_JOURNEY.companies[0],
    [selectedCompanyId]
  );

  const handleSelect = useCallback((id: string) => {
    setSelectedCompanyId(id);
    trackAchievementEvent({ type: "experience:expanded", id });
  }, [trackAchievementEvent]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className={clsx(
        "mx-auto min-h-[100svh] px-4 pt-24 pb-16 md:px-8 md:pt-28 md:pb-24",
        EXPERIENCE_THEME_CLASSES
      )}
      style={{ maxWidth: "88rem" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mx-auto"
        style={{ maxWidth: "82rem" }}
      >
        <ExperienceHeader />

        <div className="relative overflow-hidden rounded-2xl border bg-[var(--experience-card)] p-5 shadow-[var(--experience-shadow)] backdrop-blur [border-color:var(--experience-border)] md:p-7">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_10%_0%,var(--experience-glow),transparent_60%)]"
          />

          <div className="experience-layout relative grid min-h-[590px] gap-8 xl:gap-10">
            <TimelineBlock selectedCompanyId={selectedCompany.id} onSelect={handleSelect} />
            <RoleDetail company={selectedCompany} />
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .experience-layout {
          grid-template-columns: minmax(0, 1fr);
        }

        @media (min-width: 1024px) {
          .experience-layout {
            grid-template-columns: minmax(0, 1.4fr) minmax(340px, 0.9fr);
          }
        }

        @media (min-width: 1280px) {
          .experience-layout {
            grid-template-columns: minmax(760px, 1.65fr) minmax(380px, 0.95fr);
          }
        }
      `}</style>
    </section>
  );
};
