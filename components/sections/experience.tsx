import { useAchievementActions } from "components/achievements";
import { Link } from "components/link";
import { EXPERIENCE_JOURNEY, ExperienceCompany, ExperienceKind } from "content/experience";
import { AnimatePresence, motion, useInView } from "framer-motion";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const EXPERIENCE_THEME_CLASSES = [
  "[--experience-shell:#ffffff]",
  "[--experience-card:#f8fbff]",
  "[--experience-panel:#ffffff]",
  "[--experience-panel-strong:#ffffff]",
  "[--experience-panel-muted:#eef6fc]",
  "[--experience-text:#0f172a]",
  "[--experience-text-muted:#334155]",
  "[--experience-text-subtle:#52657e]",
  "[--experience-border:rgba(100,116,139,0.28)]",
  "[--experience-border-faint:rgba(100,116,139,0.18)]",
  "[--experience-grid:rgba(100,116,139,0.18)]",
  "[--experience-shadow:0_24px_70px_-38px_rgba(15,23,42,0.32)]",
  "[--experience-glow:rgba(14,165,233,0.14)]",
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

const KIND_LABELS: Record<ExperienceKind, string> = {
  employment: "Employment",
  freelance: "Freelance",
  education: "Education",
  project: "Open Source",
};

// Per-company color palette borrowing from the projects section while keeping
// neighboring legend entries visually distinct.
const COMPANY_PALETTE: KindStyle[] = [
  {
    label: "Violet",
    color: "#8b5cf6",
    soft: "rgba(139,92,246,0.13)",
    border: "rgba(139,92,246,0.38)",
    glow: "rgba(139,92,246,0.28)",
  },
  {
    label: "Rose",
    color: "#e11d48",
    soft: "rgba(225,29,72,0.13)",
    border: "rgba(225,29,72,0.38)",
    glow: "rgba(225,29,72,0.28)",
  },
  {
    label: "Emerald",
    color: "#10b981",
    soft: "rgba(16,185,129,0.13)",
    border: "rgba(16,185,129,0.38)",
    glow: "rgba(16,185,129,0.28)",
  },
  {
    label: "Cyan",
    color: "#0891b2",
    soft: "rgba(8,145,178,0.13)",
    border: "rgba(8,145,178,0.38)",
    glow: "rgba(8,145,178,0.28)",
  },
  {
    label: "Amber",
    color: "#f97316",
    soft: "rgba(249,115,22,0.13)",
    border: "rgba(249,115,22,0.38)",
    glow: "rgba(249,115,22,0.28)",
  },
  {
    label: "Fuchsia",
    color: "#c026d3",
    soft: "rgba(192,38,211,0.13)",
    border: "rgba(192,38,211,0.38)",
    glow: "rgba(192,38,211,0.28)",
  },
  {
    label: "Teal",
    color: "#0d9488",
    soft: "rgba(13,148,136,0.13)",
    border: "rgba(13,148,136,0.38)",
    glow: "rgba(13,148,136,0.28)",
  },
  {
    label: "Indigo",
    color: "#4338ca",
    soft: "rgba(67,56,202,0.13)",
    border: "rgba(67,56,202,0.38)",
    glow: "rgba(67,56,202,0.28)",
  },
];

const COMPANY_INDEX_BY_ID: Record<string, number> = Object.fromEntries(
  EXPERIENCE_JOURNEY.companies.map((company, index) => [company.id, index])
);

function getCompanyStyle(company: ExperienceCompany): KindStyle {
  const index = COMPANY_INDEX_BY_ID[company.id] ?? 0;
  return COMPANY_PALETTE[index % COMPANY_PALETTE.length];
}

const TIMELINE_LABEL_WIDTH = 116;

function monthIndex(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  return parsed.getUTCFullYear() * 12 + parsed.getUTCMonth();
}

const SORTED_COMPANIES = [...EXPERIENCE_JOURNEY.companies].sort(
  (a, b) => monthIndex(b.timeline.start) - monthIndex(a.timeline.start)
);

const COMPANY_TRACK_BY_ID: Record<string, number> = Object.fromEntries(
  SORTED_COMPANIES.map((company, index) => [company.id, index])
);

const DEFAULT_SELECTED_ID = SORTED_COMPANIES[0]?.id ?? "gep-worldwide";

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
  const trackCount = SORTED_COMPANIES.length;
  const trackGap = 48;
  const timelineHeight = trackCount * trackGap + 72;

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--experience-text-subtle)]">
          Timeline · proportional to actual duration
        </span>

        <div className="flex flex-wrap gap-x-3.5 gap-y-1 font-mono text-[11px] text-[var(--experience-text-subtle)]">
          {SORTED_COMPANIES.map((company) => {
            const style = getCompanyStyle(company);
            return (
              <span key={company.id} className="inline-flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-sm"
                  style={{ backgroundColor: style.color }}
                />
                {company.timeline.rowLabel}
              </span>
            );
          })}
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

          {SORTED_COMPANIES.map((company) => {
            const isSelected = selectedCompanyId === company.id;
            const style = getCompanyStyle(company);
            const layout = getTimelineLayout(company, startMonth, totalMonths);
            const top = 6 + (COMPANY_TRACK_BY_ID[company.id] ?? 0) * trackGap;

            return (
              <div key={company.id}>
                <span
                  className={clsx(
                    "absolute flex h-8 w-[108px] items-center justify-end pr-3 text-right text-[13px] leading-none tracking-[-0.01em]",
                    isSelected ? "font-semibold" : "text-[var(--experience-text-muted)]"
                  )}
                  style={{ top, color: isSelected ? style.color : undefined }}
                >
                  {company.timeline.rowLabel}
                </span>

                <button
                  type="button"
                  title={`${company.company} · ${company.duration}`}
                  aria-pressed={isSelected}
                  onClick={() => onSelect(company.id)}
                  className="min-w-8 absolute flex h-8 items-center overflow-hidden rounded-md border px-3 text-left text-[12.5px] font-semibold tracking-[-0.005em] text-[var(--experience-text)] transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--experience-shell)] d:text-white"
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
        {SORTED_COMPANIES.map((company) => {
          const isSelected = selectedCompanyId === company.id;
          const style = getCompanyStyle(company);

          return (
            <button
              key={company.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(company.id)}
              className={clsx(
                "grid grid-cols-[16px,minmax(0,1fr),auto] items-center gap-2.5 rounded-lg border px-3.5 py-3 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--experience-shell)] sm:gap-3",
                isSelected ? "" : "border-transparent hover:bg-[var(--experience-panel-muted)]"
              )}
              style={
                isSelected
                  ? {
                      borderColor: style.border,
                      backgroundColor: style.soft,
                    }
                  : undefined
              }
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
                  isSelected ? "" : "text-[var(--experience-text-subtle)]"
                )}
                style={{ color: isSelected ? style.color : undefined }}
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
  const style = getCompanyStyle(company);
  const [expandedAchievementId, setExpandedAchievementId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const expandedAchievement =
    company.achievements.find((achievement) => achievement.id === expandedAchievementId) ?? null;

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
            {company.links?.length
              ? <div className="mt-3 flex flex-wrap gap-2">
                  {company.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      className="inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] transition hover:bg-[var(--experience-panel-muted)]"
                      style={{
                        color: style.color,
                        borderColor: style.border,
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              : null}
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
          {company.achievements.map((achievement) => {
            return (
              <motion.article
                layout
                key={achievement.id}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                onClick={() => setExpandedAchievementId(achievement.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setExpandedAchievementId(achievement.id);
                  }
                }}
                className={clsx(
                  "group flex min-h-[166px] cursor-pointer flex-col gap-3 rounded-lg border bg-[var(--experience-panel)] px-4 py-4 transition-colors duration-150 hover:bg-[var(--experience-panel-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                )}
                style={{ borderColor: "var(--experience-border-faint)" }}
              >
                <div className="flex flex-col items-start gap-2">
                  <span
                    className="font-mono text-[9.5px] font-bold uppercase tracking-[0.1em]"
                    style={{ color: style.color }}
                  >
                    {achievement.category}
                  </span>
                  <span className="max-w-full font-mono text-[10.5px] font-bold leading-snug tracking-[-0.005em] text-amber-500">
                    {achievement.impact}
                  </span>
                </div>

                <h4 className="m-0 text-[14px] font-bold leading-snug tracking-[-0.01em] text-[var(--experience-text)]">
                  {achievement.title}
                </h4>
                <p className="m-0 text-[12.5px] leading-relaxed text-[var(--experience-text-muted)] line-clamp-3">
                  {achievement.summary}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-1.5">
                  {achievement.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded bg-[var(--experience-panel-muted)] px-2 py-1 font-mono text-[10px] text-[var(--experience-text-muted)]"
                    >
                      {tech}
                    </span>
                  ))}
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--experience-text-subtle)]">
                    Click to expand
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>

        {isMounted &&
          createPortal(
            <AnimatePresence>
              {expandedAchievement && (
                <motion.div
                  className="bg-slate-950/90 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setExpandedAchievementId(null)}
                >
                  <motion.article
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={`${expandedAchievement.id}-title`}
                    initial={{ opacity: 0, scale: 0.96, y: 14 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: 10 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    onClick={(event) => event.stopPropagation()}
                    className="relative flex max-h-[min(78vh,720px)] w-full max-w-3xl flex-col gap-5 overflow-y-auto rounded-2xl border p-5 shadow-2xl md:p-7"
                    style={{
                      borderColor: style.border,
                      backgroundColor: "var(--experience-shell)",
                    }}
                  >
                    <button
                      type="button"
                      aria-label="Close expanded card"
                      onClick={() => setExpandedAchievementId(null)}
                      className="absolute right-4 top-4 rounded-full border border-[var(--experience-border-faint)] px-2.5 py-1 text-sm text-[var(--experience-text-muted)] transition hover:text-[var(--experience-text)]"
                    >
                      ×
                    </button>

                    <div className="pr-10">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span
                          className="font-mono text-[10px] font-bold uppercase tracking-[0.1em]"
                          style={{ color: style.color }}
                        >
                          {expandedAchievement.category}
                        </span>
                        <span className="font-mono text-[11px] font-bold text-amber-500">
                          {expandedAchievement.impact}
                        </span>
                      </div>
                      <h4
                        id={`${expandedAchievement.id}-title`}
                        className="m-0 text-[24px] font-extrabold leading-tight tracking-[-0.02em] text-[var(--experience-text)]"
                      >
                        {expandedAchievement.title}
                      </h4>
                      <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-[var(--experience-text-muted)]">
                        {expandedAchievement.summary}
                      </p>
                    </div>

                    {expandedAchievement.pointers?.length
                      ? <ul className="m-0 grid gap-3 pl-5 text-[14px] leading-relaxed text-[var(--experience-text-muted)] marker:text-[var(--experience-text-subtle)]">
                          {expandedAchievement.pointers.map((pointer) => (
                            <li key={pointer}>{pointer}</li>
                          ))}
                        </ul>
                      : null}

                    <div className="flex flex-wrap gap-1.5 border-t border-[var(--experience-border-faint)] pt-4">
                      {expandedAchievement.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded bg-[var(--experience-panel-muted)] px-2 py-1 font-mono text-[10px] text-[var(--experience-text-muted)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.article>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}
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
        "mx-auto min-h-[100svh] max-w-[74rem] px-4 pt-24 pb-16 md:px-8 md:pt-28 md:pb-24",
        EXPERIENCE_THEME_CLASSES
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mx-auto w-full"
      >
        <ExperienceHeader />

        <div className="relative overflow-hidden rounded-2xl border bg-[var(--experience-card)] p-5 shadow-[var(--experience-shadow)] backdrop-blur [border-color:var(--experience-border)] md:p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_10%_0%,var(--experience-glow),transparent_60%)]"
          />

          <div className="experience-layout relative grid min-h-[520px] gap-8 xl:gap-8">
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
            grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.9fr);
          }
        }

        @media (min-width: 1280px) {
          .experience-layout {
            grid-template-columns: minmax(0, 1.45fr) minmax(340px, 0.95fr);
          }
        }
      `}</style>
    </section>
  );
};
