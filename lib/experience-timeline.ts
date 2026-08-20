import { EXPERIENCE_JOURNEY } from "content/experience";
import type { ExperienceCompany } from "content/experience";

/**
 * Geometry for the experience gantt: converts dates into percentages across a
 * fixed window so bars stay proportional to real duration.
 *
 * Kept separate from any one design's components so both the v1 and v2
 * experience sections can share a single definition of the layout maths.
 */

const monthIndex = (date: string): number => {
  const parsed = new Date(`${date}T00:00:00`);
  return parsed.getUTCFullYear() * 12 + parsed.getUTCMonth();
};

const clampPercent = (value: number): number => Math.max(0, Math.min(100, value));

const TIMELINE_START_MONTH = monthIndex(EXPERIENCE_JOURNEY.timelineStart);
const TIMELINE_TOTAL_MONTHS = Math.max(
  1,
  monthIndex(EXPERIENCE_JOURNEY.timelineEnd) - TIMELINE_START_MONTH
);

/** Position of a date along the timeline, as a percentage of its full width. */
const percentFor = (date?: string): number => {
  const month = date ? monthIndex(date) : monthIndex(EXPERIENCE_JOURNEY.timelineEnd);
  return clampPercent(((month - TIMELINE_START_MONTH) / TIMELINE_TOTAL_MONTHS) * 100);
};

type BarLayout = { left: number; width: number };

export const barLayoutFor = (company: ExperienceCompany): BarLayout => {
  const left = percentFor(company.timeline.start);
  const right = percentFor(company.timeline.end);
  // A still-running or very short engagement would otherwise render as a
  // hairline; give every bar a minimum hit area.
  return { left, width: Math.max(right - left, 1.5) };
};

/** Companies newest-first, which is the order the rows are stacked in. */
export const COMPANIES_BY_RECENCY: ExperienceCompany[] = [...EXPERIENCE_JOURNEY.companies].sort(
  (a, b) => monthIndex(b.timeline.start) - monthIndex(a.timeline.start)
);

export const DEFAULT_COMPANY_ID = COMPANIES_BY_RECENCY[0]?.id ?? "";

type YearMarker = { year: number; left: number; showLabel: boolean };

/**
 * How much of the right end belongs to the "now" marker, as a percentage of
 * the plot. A year label inside it would print on top of the word.
 */
const NOW_LABEL_ZONE = 8;

/**
 * Vertical year gridlines; labels are thinned to every other year, and dropped
 * where "now" already sits. The line itself is always drawn — it is the axis
 * that has to stay even, not the labels.
 */
export const buildYearMarkers = (): YearMarker[] => {
  const first = new Date(`${EXPERIENCE_JOURNEY.timelineStart}T00:00:00`).getUTCFullYear();
  const last = new Date(`${EXPERIENCE_JOURNEY.timelineEnd}T00:00:00`).getUTCFullYear();

  return Array.from({ length: last - first + 1 }, (_, index) => {
    const year = first + index;
    const left = percentFor(`${year}-01-01`);
    return { year, left, showLabel: year % 2 === 0 && left <= 100 - NOW_LABEL_ZONE };
  }).filter((marker) => marker.left >= 0 && marker.left <= 100);
};

export const shortYear = (year: number): string => `'${String(year).slice(-2)}`;
