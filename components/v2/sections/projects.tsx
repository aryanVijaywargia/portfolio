import clsx from "clsx";
import { FC, useCallback, useMemo, useState } from "react";
import { PROJECTS } from "content/projects";
import { V2_PROJECT_FALLBACK_HUE, V2_PROJECT_HUES, V2_SECTION_HEADINGS } from "content/v2";
import { Image } from "components/image";
import { useAchievementActions } from "components/achievements";
import { V2Heading, V2Section, V2SectionHeader, hueVars } from "components/v2/primitives";
import { V2ScrollRail } from "components/v2/scroll-rail";

const ALL = "All Projects";

/**
 * One card plus the rail gap: the distance a prev/next step travels.
 *
 * 330 rather than a rounder number so three cards plus their gaps and the
 * rail's own gutters land inside `--v2-max-w`. At 340 the set overflowed by
 * 20px on wide screens — enough to make the rail twitch under a trackpad
 * without ever showing more.
 */
const CARD_WIDTH = 330;
const CARD_GAP = 20;

type Project = typeof PROJECTS[number];

/**
 * Every card exposes one primary destination and, when it differs, the
 * repository alongside it. Derived from the project data rather than hardcoded
 * per card so new projects need no special-casing here.
 */
const primaryLinkFor = (project: Project) => {
  const url = (project as any).url as string | undefined;
  const links = (project as any).links as { label: string; href: string }[] | undefined;
  const repository = (project as any).repository as string | undefined;

  if (url) return { href: url, label: "View project" };
  if (links?.length) return { href: links[0].href, label: `Read ${links[0].label.toLowerCase()}` };
  if (repository) return { href: repository, label: "View repository" };
  return null;
};

const ProjectCard: FC<{ project: Project; onOpen: () => void }> = ({ project, onOpen }) => {
  const hue = V2_PROJECT_HUES[project.name] ?? V2_PROJECT_FALLBACK_HUE;
  const primary = primaryLinkFor(project);
  const repository = (project as any).repository as string | undefined;
  const featuredImage = (project as any).featuredImage as string | undefined;
  const showRepo = Boolean(repository && repository !== primary?.href);
  const year = (project as any).year as string | undefined;

  return (
    <article
      style={hueVars(hue)}
      className={clsx(
        "group/card relative flex w-full flex-col overflow-hidden rounded-[var(--v2-radius-md)]",
        "border border-[rgb(var(--hue)/0.3)] border-t-[3px] border-t-[rgb(var(--hue))]",
        // The body carries its hue as a wash that fades out down the card, over
        // the surface rather than instead of it — a flat panel left the colour
        // living only in the cover art, so the card read as generic below it.
        "bg-[rgb(var(--v2-surface))]",
        "bg-[linear-gradient(165deg,rgb(var(--hue)/0.13),rgb(var(--hue)/0.03)_62%,transparent)]",
        // The hue also reads as light coming off the card.
        "shadow-[0_0_70px_-30px_rgb(var(--hue)/0.75),0_18px_34px_-26px_rgba(0,0,0,0.8)]",
        "transition-[border-color,box-shadow] duration-300",
        "hover:border-[rgb(var(--hue)/0.55)]",
        "hover:shadow-[0_0_80px_-24px_rgb(var(--hue)/0.9),0_18px_34px_-26px_rgba(0,0,0,0.8)]"
      )}
    >
      {/* Cover art. These are per-project brand cards that already carry the
          project's own colour, so they are shown as drawn — the previous card
          pushed them through grayscale and luminosity blending, which threw all
          of that away. */}
      {featuredImage
        ? <div className="p-4 pb-0">
            {/* `isolate` keeps the blend inside the cover: without it the
                overlay would mix with the page behind the card. */}
            <div className="relative isolate overflow-hidden rounded-[var(--v2-radius-md)] border border-[rgb(var(--hue)/0.28)]">
              <Image
                src={featuredImage}
                alt={project.name}
                width={800}
                height={420}
                maxWidth={800}
                className="block h-full w-full object-cover"
              />
              {/* Each brand card is drawn in its own colour, which left a blue
                  cover above gold chrome. Blending on `color` takes the hue and
                  saturation from the card's hue while keeping the artwork's
                  luminance, so the logo and wordmark stay legible. */}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[rgb(var(--hue))] mix-blend-color"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(160deg,transparent_35%,rgba(0,0,0,0.35))]"
              />
            </div>
          </div>
        : null}

      <div className="flex flex-1 flex-col gap-3 p-[22px]">
        <span className="font-[family-name:var(--v2-font-mono)] text-[10px] font-bold uppercase tracking-[0.16em] text-[rgb(var(--hue-text))]">
          {project.type.join(" · ")}
        </span>

        <h3 className="line-clamp-2 text-[22px] font-bold leading-[1.15] tracking-[-0.028em] text-[rgb(var(--v2-fg))]">
          {project.name}
        </h3>

        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((tech) => (
            <span
              key={tech.name}
              className="rounded-[var(--v2-radius-sm)] border border-[rgb(var(--v2-line-2))] px-2 py-[3px] font-[family-name:var(--v2-font-mono)] text-[11px] text-[rgb(var(--v2-fg-3))]"
            >
              {tech.name}
            </span>
          ))}
        </div>

        <p className="m-0 line-clamp-3 text-[14px] leading-[1.62] text-[rgb(var(--v2-fg-3))]">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
          {year
            ? <span className="font-[family-name:var(--v2-font-mono)] text-[13px] text-[rgb(var(--v2-fg-2))]">
                {year}
              </span>
            : null}

          {showRepo
            ? <a
                href={repository}
                target="_blank"
                rel="noreferrer"
                onClick={onOpen}
                className="font-[family-name:var(--v2-font-mono)] text-[11px] uppercase tracking-[0.14em] text-[rgb(var(--v2-fg-4))] transition-colors hover:text-[rgb(var(--hue-text))]"
              >
                repo
              </a>
            : null}

          {primary
            ? <a
                href={primary.href}
                target="_blank"
                rel="noreferrer"
                onClick={onOpen}
                className="ml-auto inline-flex items-center gap-2 rounded-[var(--v2-radius-sm)] border border-[rgb(var(--hue)/0.7)] bg-[rgb(var(--hue)/0.12)] px-4 py-2 text-[13px] font-semibold text-[rgb(var(--hue-text))] transition-colors hover:bg-[rgb(var(--hue)/0.22)]"
              >
                {primary.label}
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover/card:translate-x-0.5"
                >
                  →
                </span>
              </a>
            : null}
        </div>
      </div>
    </article>
  );
};

export const V2Projects: FC = () => {
  const { trackAchievementEvent } = useAchievementActions();
  const [filter, setFilter] = useState<string>(ALL);

  const filters = useMemo(() => [ALL, ...new Set(PROJECTS.flatMap((project) => project.type))], []);

  const visible = useMemo(
    () => PROJECTS.filter((project) => filter === ALL || project.type.includes(filter)),
    [filter]
  );

  const handleFilter = useCallback((value: string) => {
    setFilter(value);
    if (value !== ALL) trackAchievementEvent({ type: "portfolio:filter-used", filter: value });
  }, [trackAchievementEvent]);

  const handleOpen = useCallback(
    () => trackAchievementEvent({ type: "portfolio:link-opened" }),
    [trackAchievementEvent]
  );

  return (
    <V2Section id="portfolio" label="Projects">
      <V2SectionHeader section="portfolio" />

      <V2Heading className="mb-5">{V2_SECTION_HEADINGS.portfolio}</V2Heading>

      {/* Filters read as a control on the list below, so they sit under the
          heading rather than competing with the eyebrow rule above it. */}
      <div className="mb-7">
        <div className="v2-scrollbar-none -mx-[var(--v2-gutter)] flex gap-1.5 overflow-x-auto px-[var(--v2-gutter)] pb-1">
          {filters.map((value) => {
            const isActive = filter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => handleFilter(value)}
                aria-pressed={isActive}
                className={clsx(
                  "shrink-0 whitespace-nowrap border bg-transparent px-2.5 py-[5px] font-[family-name:var(--v2-font-mono)] text-[10px] uppercase tracking-[0.1em] transition-colors",
                  isActive
                    ? "border-[rgb(var(--v2-line-2))] text-[rgb(var(--v2-fg))]"
                    : "border-[rgb(var(--v2-line))] text-[rgb(var(--v2-fg-4))] hover:text-[rgb(var(--v2-fg-3))]"
                )}
              >
                {value === ALL ? "all" : value.toLowerCase()}
              </button>
            );
          })}
        </div>
      </div>

      <V2ScrollRail itemWidth={CARD_WIDTH} gapWidth={CARD_GAP} resetKey={filter} label="Projects">
        {visible.map((project) => (
          <div
            key={project.name}
            className="flex w-[82vw] max-w-[330px] shrink-0 snap-start v2sm:w-[330px] v2sm:max-w-none"
          >
            <ProjectCard project={project} onOpen={handleOpen} />
          </div>
        ))}
      </V2ScrollRail>
    </V2Section>
  );
};
