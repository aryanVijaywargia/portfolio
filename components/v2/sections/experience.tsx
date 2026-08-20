import clsx from "clsx";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EXPERIENCE_JOURNEY } from "content/experience";
import type { ExperienceAchievement, ExperienceCompany, ExperienceKind } from "content/experience";
import { V2_SECTION_HEADINGS } from "content/v2";
import { useAchievementActions } from "components/achievements";
import { V2Heading, V2Section, V2SectionHeader } from "components/v2/primitives";
import { barLayoutFor, buildYearMarkers, COMPANIES_BY_RECENCY, DEFAULT_COMPANY_ID, shortYear } from "lib/experience-timeline";

const KIND_LABELS: Record<ExperienceKind, string> = {
  employment: "Employment",
  freelance: "Freelance",
  education: "Education",
  project: "Open Source",
};

const YEAR_MARKERS = buildYearMarkers();

const GANTT_HEIGHT = 300;
const AXIS_HEIGHT = 32;
const BAR_HEIGHT = 30;
const LABEL_WIDTH = 108;
const PLOT_OFFSET = 116;

/**
 * Colour for a company row, keyed by its position in the recency ordering.
 * Index 0 (the current role) resolves to the variant accent; the rest step
 * through the earth ramp defined in the token layer.
 */
const companyColor = (index: number) => `rgb(var(--v2-co-${Math.min(index, 4)}))`;
const companyColorSoft = (index: number, alpha: number) =>
  `rgb(var(--v2-co-${Math.min(index, 4)}) / ${alpha})`;

const trackTop = (index: number, count: number) => {
  const usable = GANTT_HEIGHT - AXIS_HEIGHT;
  const rowHeight = usable / Math.max(count, 1);
  return index * rowHeight + (rowHeight - BAR_HEIGHT) / 2;
};

/* ---------- achievement card ---------- */

/**
 * One achievement.
 *
 * Below v2lg the card collapses to its heading and chips and the summary
 * becomes part of what expanding reveals — a phone shows three or four of
 * these at once, and full paragraphs on each turn the list into a wall. Wide
 * screens have the room, so the summary stays open there.
 */
const AchievementCard: FC<{ achievement: ExperienceAchievement }> = ({ achievement }) => {
  const [expanded, setExpanded] = useState(false);
  const hasPointers = Boolean(achievement.pointers?.length);

  return (
    <article
      onClick={() => setExpanded((open) => !open)}
      className="flex cursor-pointer flex-col gap-2.5 rounded-[var(--v2-radius-sm)] border border-[rgb(var(--v2-line))] bg-[rgb(var(--v2-bg))] p-4"
    >
      <div className="flex items-baseline justify-between gap-2.5">
        <span className="font-[family-name:var(--v2-font-mono)] text-[9.5px] font-bold uppercase tracking-[0.12em] text-[rgb(var(--v2-fg-4))]">
          {achievement.category}
        </span>
        <span className="font-[family-name:var(--v2-font-mono)] text-[10px] font-bold text-[rgb(var(--v2-accent))]">
          {achievement.impact}
        </span>
      </div>

      <h4 className="text-sm font-bold leading-[1.4] text-[rgb(var(--v2-fg))]">
        {achievement.title}
      </h4>
      <p
        className={clsx(
          "m-0 text-[12.5px] leading-[1.65] text-[rgb(var(--v2-fg-3))]",
          expanded ? "block" : "hidden v2lg:block"
        )}
      >
        {achievement.summary}
      </p>

      {expanded && achievement.pointers
        ? <ul className="m-0 list-disc pl-[18px] text-[12.5px] leading-[1.65] text-[rgb(var(--v2-fg-3))] marker:text-[rgb(var(--v2-fg-4))]">
            {achievement.pointers.map((pointer) => (
              <li key={pointer} className="mb-2">
                {pointer}
              </li>
            ))}
          </ul>
        : null}

      <div className="flex flex-wrap items-center gap-1.5">
        {achievement.technologies.map((tech) => (
          <span
            key={tech}
            className="border border-[rgb(var(--v2-line))] px-[7px] py-[3px] font-[family-name:var(--v2-font-mono)] text-[9.5px] text-[rgb(var(--v2-fg-4))]"
          >
            {tech}
          </span>
        ))}
        {/* On wide screens the summary is already open, so a card with nothing
            further to show advertises no affordance. */}
        <span
          className={clsx(
            "ml-auto font-[family-name:var(--v2-font-mono)] text-[9.5px] uppercase tracking-[0.1em] text-[rgb(var(--v2-fg-4))]",
            !hasPointers && "v2lg:hidden"
          )}
        >
          {expanded ? "collapse" : "expand"}
        </span>
      </div>
    </article>
  );
};

/* ---------- detail panel ---------- */

const RoleDetail: FC<{ company: ExperienceCompany }> = ({ company }) => (
  <div className="flex flex-col gap-[18px] p-6">
    <div className="border-b border-[rgb(var(--v2-line))] pb-[18px]">
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <span className="font-[family-name:var(--v2-font-mono)] text-[10px] font-bold uppercase tracking-[0.12em] text-[rgb(var(--v2-fg-4))]">
          {KIND_LABELS[company.kind]}
        </span>
        <span className="font-[family-name:var(--v2-font-mono)] text-[11px] text-[rgb(var(--v2-fg-3))]">
          {company.period} <span className="text-[rgb(var(--v2-fg-4))]">· {company.duration}</span>
        </span>
        {company.live
          ? <span className="inline-flex items-center gap-1.5 font-[family-name:var(--v2-font-mono)] text-[10px] font-bold uppercase tracking-[0.14em] text-[rgb(var(--v2-accent))]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="v2-animate-ping absolute inline-flex h-full w-full rounded-full bg-[rgb(var(--v2-accent))] opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[rgb(var(--v2-accent))]" />
              </span>
              currently here
            </span>
          : null}
      </div>

      <h3 className="text-[26px] font-bold leading-tight tracking-[-0.025em] text-[rgb(var(--v2-fg))]">
        {company.company}
      </h3>
      <p className="mt-2 text-[14.5px] text-[rgb(var(--v2-fg-3))]">{company.role}</p>

      {company.links?.length
        ? <div className="mt-3 flex flex-wrap gap-2">
            {company.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center border border-[rgb(var(--v2-line-2))] px-2.5 py-1 font-[family-name:var(--v2-font-mono)] text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgb(var(--v2-fg-3))]"
              >
                {link.label}
              </a>
            ))}
          </div>
        : null}
    </div>

    <div className="grid gap-3">
      {company.achievements.map((achievement) => (
        <AchievementCard key={achievement.id} achievement={achievement} />
      ))}
    </div>
  </div>
);

/* ---------- section ---------- */

export const V2Experience: FC = () => {
  const { trackAchievementEvent } = useAchievementActions();
  const [selectedId, setSelectedId] = useState(DEFAULT_COMPANY_ID);
  const stripRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(
    () =>
      EXPERIENCE_JOURNEY.companies.find((company) => company.id === selectedId) ??
      EXPERIENCE_JOURNEY.companies[0],
    [selectedId]
  );

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    trackAchievementEvent({ type: "experience:expanded", id });
  }, [trackAchievementEvent]);

  /**
   * Keeps the selected tab on screen.
   *
   * Selection can come from outside the strip, and the strip is wider than the
   * viewport, so the active tab is often out of sight. `scrollLeft` rather
   * than `scrollIntoView`: the latter also scrolls every ancestor, which walks
   * the page away from the section the reader is looking at.
   */
  useEffect(() => {
    const strip = stripRef.current;
    const tab = strip?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!strip || !tab) return;

    const overshootRight =
      tab.offsetLeft + tab.offsetWidth - (strip.scrollLeft + strip.clientWidth);
    const overshootLeft = strip.scrollLeft - tab.offsetLeft;
    // A little past the edge, so the neighbour still peeks and the strip
    // reads as scrollable.
    const margin = 16;
    if (overshootRight > 0) strip.scrollTo({ left: strip.scrollLeft + overshootRight + margin });
    else if (overshootLeft > 0) strip.scrollTo({ left: tab.offsetLeft - margin });
  }, [selectedId]);

  const count = COMPANIES_BY_RECENCY.length;

  return (
    <V2Section id="experience" label="Experience">
      <V2SectionHeader section="experience" />
      <V2Heading className="mb-8">{V2_SECTION_HEADINGS.experience}</V2Heading>

      <div className="rounded-[var(--v2-radius-md)] border border-[rgb(var(--v2-line))] bg-[rgb(var(--v2-surface))]">
        {/* The Gantt needs ~700px before its bars are readable, so below v2lg
            the whole timeline column is replaced by a strip of company tabs —
            same selection, a shape that survives a phone. */}
        <div
          ref={stripRef}
          className="v2-scrollbar-none flex gap-2 overflow-x-auto border-b border-[rgb(var(--v2-line))] p-4 v2lg:hidden"
        >
          {COMPANIES_BY_RECENCY.map((company, index) => {
            const isActive = company.id === selected.id;
            return (
              <button
                key={company.id}
                type="button"
                onClick={() => handleSelect(company.id)}
                aria-pressed={isActive}
                className={clsx(
                  "flex shrink-0 flex-col items-start gap-1 rounded-[var(--v2-radius-sm)] border px-3.5 py-2.5 text-left transition-colors",
                  isActive
                    ? "bg-[rgb(var(--v2-bg))]"
                    : "border-[rgb(var(--v2-line))] hover:border-[rgb(var(--v2-line-2))]"
                )}
                style={isActive ? { borderColor: companyColor(index) } : undefined}
              >
                <span className="whitespace-nowrap text-sm font-semibold text-[rgb(var(--v2-fg))]">
                  {company.company}
                </span>
                <span
                  className="whitespace-nowrap font-[family-name:var(--v2-font-mono)] text-[10.5px]"
                  style={{ color: isActive ? companyColor(index) : "rgb(var(--v2-fg-4))" }}
                >
                  {company.periodShort}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 v2lg:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.95fr)]">
          <div className="hidden flex-col gap-5 border-b border-[rgb(var(--v2-line))] p-6 v2lg:flex v2lg:border-b-0 v2lg:border-r">
            <span className="font-[family-name:var(--v2-font-mono)] text-[10.5px] uppercase tracking-[0.12em] text-[rgb(var(--v2-fg-4))]">
              Timeline · proportional to actual duration
            </span>

            <div className="v2-scrollbar-none overflow-x-auto pb-3.5">
              <div className="relative min-w-[700px]" style={{ height: GANTT_HEIGHT }}>
                {/* Row labels, aligned to the bar tracks. */}
                {COMPANIES_BY_RECENCY.map((company, index) => (
                  <span
                    key={company.id}
                    className="absolute overflow-hidden text-ellipsis whitespace-nowrap pr-3 text-right text-[12.5px] transition-colors"
                    style={{
                      color:
                        company.id === selected.id ? companyColor(index) : "rgb(var(--v2-fg-3))",
                      fontWeight: company.id === selected.id ? 600 : 400,
                      left: 0,
                      width: LABEL_WIDTH,
                      height: BAR_HEIGHT,
                      lineHeight: `${BAR_HEIGHT}px`,
                      top: trackTop(index, count),
                    }}
                  >
                    {company.timeline.rowLabel}
                  </span>
                ))}

                {/* Plot area: everything inside is positioned as a percentage
                    of the date range, so bars and gridlines cannot drift apart. */}
                <div
                  className="absolute right-0 top-0 border-l border-[rgb(var(--v2-line))]"
                  style={{ left: PLOT_OFFSET, bottom: AXIS_HEIGHT }}
                >
                  {YEAR_MARKERS.map((marker) => (
                    <span key={marker.year}>
                      <span
                        aria-hidden
                        className="absolute top-0 h-full w-px bg-[rgb(var(--v2-line))]"
                        style={{ left: `${marker.left}%` }}
                      />
                      {marker.showLabel
                        ? <span
                            className="absolute -bottom-[26px] -translate-x-1/2 font-[family-name:var(--v2-font-mono)] text-[10.5px] text-[rgb(var(--v2-fg-4))]"
                            style={{ left: `${marker.left}%` }}
                          >
                            {shortYear(marker.year)}
                          </span>
                        : null}
                    </span>
                  ))}

                  <span
                    aria-hidden
                    className="absolute bottom-0 top-0 w-px bg-[rgb(var(--v2-accent))] opacity-50"
                    style={{ left: "100%" }}
                  >
                    <span className="absolute -left-[3px] top-0 h-1.5 w-1.5 rounded-full bg-[rgb(var(--v2-accent))]" />
                  </span>
                  <span className="absolute -bottom-[26px] right-0 font-[family-name:var(--v2-font-mono)] text-[10.5px] text-[rgb(var(--v2-accent))]">
                    now
                  </span>

                  {COMPANIES_BY_RECENCY.map((company, index) => {
                    const { left, width } = barLayoutFor(company);
                    const isActive = company.id === selected.id;
                    return (
                      <button
                        key={company.id}
                        type="button"
                        onClick={() => handleSelect(company.id)}
                        aria-pressed={isActive}
                        className="absolute flex items-center overflow-hidden rounded-[var(--v2-radius-sm)] border px-2.5 text-left text-xs font-semibold transition-all duration-200"
                        style={{
                          left: `${left}%`,
                          width: `${width}%`,
                          minWidth: 28,
                          height: BAR_HEIGHT,
                          top: trackTop(index, count),
                          borderColor: companyColor(index),
                          background: isActive ? companyColor(index) : "transparent",
                          color: isActive ? "rgb(var(--v2-btn-fg))" : "rgb(var(--v2-fg))",
                          zIndex: isActive ? 2 : 1,
                        }}
                      >
                        {/* A very short engagement cannot fit a legible label;
                            the row list underneath carries the full name. */}
                        {width > 12
                          ? <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                              {company.timeline.barLabel}
                            </span>
                          : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              {COMPANIES_BY_RECENCY.map((company, index) => {
                const isActive = company.id === selected.id;
                return (
                  <button
                    key={company.id}
                    type="button"
                    onClick={() => handleSelect(company.id)}
                    aria-pressed={isActive}
                    className={clsx(
                      "grid grid-cols-[14px_minmax(0,1fr)_auto] items-center gap-3 rounded-[var(--v2-radius-sm)] border px-3 py-[11px] text-left transition-all duration-150",
                      isActive
                        ? "border-[rgb(var(--v2-line-2))] bg-[rgb(var(--v2-bg))]"
                        : "border-transparent hover:bg-[rgb(var(--v2-bg))]"
                    )}
                  >
                    <span
                      aria-hidden
                      className="h-2 w-2 rounded-full"
                      style={{ background: companyColor(index) }}
                    />
                    <span className="min-w-0 text-sm font-semibold text-[rgb(var(--v2-fg))]">
                      {company.company}{" "}
                      <span className="text-[13px] font-normal text-[rgb(var(--v2-fg-3))]">
                        · {company.roleShort}
                      </span>
                    </span>
                    <span
                      className="whitespace-nowrap font-[family-name:var(--v2-font-mono)] text-[10.5px] transition-colors"
                      style={{
                        color: isActive ? companyColor(index) : "rgb(var(--v2-fg-4))",
                      }}
                    >
                      {company.periodShort}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <RoleDetail company={selected} />
        </div>
      </div>
    </V2Section>
  );
};
