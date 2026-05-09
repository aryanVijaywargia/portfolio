import { useAchievementActions } from "components/achievements";
import { LinkIcon } from "@heroicons/react/24/solid";
import { FaGithub } from "@react-icons/all-files/fa/FaGithub";
import { Image } from "components/image";
import { Link } from "components/link";
import clsx from "clsx";
import { ScrollGallery } from "components/scroll-gallery";
import { PORTFOLIO } from "content/portfolio-preview";
import { PROJECTS } from "content/projects";
import { FC, useCallback, useMemo, useState } from "react";

type PortfolioPreviewProps = {};

export const PortfolioPreview: FC<PortfolioPreviewProps> = ({}) => {
  const [filter, setFilter] = useState("All Projects");
  const { trackAchievementEvent } = useAchievementActions();

  const handleFilterChange = useCallback((value: string) => {
    setFilter(value);
    if (value !== "All Projects") {
      trackAchievementEvent({ type: "portfolio:filter-used", filter: value });
    }
  }, [trackAchievementEvent]);

  const handleProjectLinkOpen = useCallback(() => {
    trackAchievementEvent({ type: "portfolio:link-opened" });
  }, [trackAchievementEvent]);

  const rotationIndexByName = useMemo(() => {
    const visible = PROJECTS.filter(
      ({ type }) => filter === "All Projects" || type.includes(filter)
    );
    return new Map(visible.map((project, index) => [project.name, index]));
  }, [filter]);

  const filterTags = useMemo(
    () => ["All Projects", ...new Set(PROJECTS.map((p) => p.type).flat())],
    []
  );

  return (
    <section
      id="portfolio"
      className="portfolio-preview min-h-[100svh] pt-24 pb-16 spacing-4 md:pt-28 md:pb-24"
    >
      <header className="mx-auto grid w-full max-w-6xl px-4 md:px-8">
        <div className="heading-pre">{PORTFOLIO.pre}</div>
        <h1 className="heading-2xl -ml-1">{PORTFOLIO.heading}</h1>
        <div className="scrollbar-none relative -mx-4 overflow-x-auto px-4 pb-2">
          <fieldset
            className="flex gap-3"
            onChange={(e) => handleFilterChange((e.target as HTMLInputElement).value)}
          >
            <legend className="sr-only">Filter by Tag</legend>
            {filterTags.map((type, index) => {
              return (
                <label key={type} className="flex">
                  <input
                    type="radio"
                    className="peer hidden"
                    defaultChecked={index === 0}
                    name="Tag Filter"
                    value={type}
                  />
                  <div className="cursor-pointer appearance-none whitespace-nowrap rounded-full border border-gray-200 bg-gray-400/10 px-3 py-1 text-[13px] font-medium text-gray-400 transition-colors peer-checked:text-gray-900 hfa:text-gray-500 d:border-gray-700 d:peer-checked:text-gray-50 d:hfa:text-gray-300">
                    {type}
                  </div>
                </label>
              );
            })}
          </fieldset>
        </div>
      </header>
      <ScrollGallery itemWidth={340} gapWidth={32} filter={filter}>
        {PROJECTS.map((project, index) => {
          const rotationIndex = rotationIndexByName.get(project.name) ?? -1;
          const featuredImage = (project as any).featuredImage as string | undefined;

          return (
            <section
              key={project.name}
              className={clsx(
                "relative h-[380px] w-[340px] min-w-[340px] snap-start rounded-xl border-2 border-gray-700/30 bg-clip-padding p-4 shadow-xl transition-[min-width,width,margin-left,opacity] duration-300 spacing-0 d:border-white/20",
                filter === "All Projects" || project.type.includes(filter)
                  ? "flex"
                  : "-ml-8 !w-0 !min-w-0 !overflow-hidden !border-0 !px-0 opacity-20",
                rotationIndex % 2 === 0 && "sm:rotate-[1.5deg]",
                rotationIndex % 2 === 1 && "sm:rotate-[-1.5deg]",
                index % 8 === 0 &&
                  "bg-[linear-gradient(40deg,var(--tw-gradient-stops))] from-pink-300/80 to-violet-500/40 shadow-[currentBg] shadow-violet-500/20",
                index % 8 === 1 &&
                  "bg-[linear-gradient(120deg,var(--tw-gradient-stops))] from-yellow-300/80 to-rose-600/80 shadow-rose-600/20",
                index % 8 === 2 &&
                  "bg-[linear-gradient(180deg,var(--tw-gradient-stops))] from-gray-200/40 to-rose-500/80 shadow-rose-500/20",
                index % 8 === 3 &&
                  "bg-[linear-gradient(120deg,var(--tw-gradient-stops))] from-green-400/70 to-cyan-600/80 shadow-cyan-600/20",
                index % 8 === 4 &&
                  "bg-[linear-gradient(140deg,var(--tw-gradient-stops))] from-orange-500/50 to-yellow-500/80 shadow-yellow-500/20",
                index % 8 === 5 &&
                  "bg-[linear-gradient(200deg,var(--tw-gradient-stops))] from-purple-500/80 to-sky-600/40 shadow-sky-600/20",
                index % 8 === 6 &&
                  "bg-[linear-gradient(70deg,var(--tw-gradient-stops))] from-emerald-400/80 to-teal-600/40 shadow-teal-600/20",
                index % 8 === 7 &&
                  "bg-[linear-gradient(140deg,var(--tw-gradient-stops))] from-cyan-400/80 to-indigo-700/50 shadow-indigo-700/20"
              )}
            >
              <figure className="relative flex aspect-2 w-full">
                {featuredImage
                  ? <Image
                      src={featuredImage}
                      alt={project.name}
                      width={400}
                      height={200}
                      maxWidth={320}
                      className="rounded-t-lg object-cover object-center [mask-image:linear-gradient(180deg,#fff_16.35%,rgb(255_255_255_/_0%)_91.66%)]"
                    />
                  : <div className="relative h-full w-full overflow-hidden rounded-t-lg bg-slate-950/90 [mask-image:linear-gradient(180deg,#fff_16.35%,rgb(255_255_255_/_0%)_91.66%)]">
                      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(14,165,233,0.28),rgba(168,85,247,0.26),rgba(16,185,129,0.18))]" />
                      <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:28px_28px]" />
                      <div className="absolute left-8 top-9 h-16 w-16 rounded-full border border-cyan-200/30 bg-cyan-300/10 blur-sm" />
                      <div className="absolute right-10 top-8 h-24 w-24 rounded-full border border-fuchsia-200/25 bg-fuchsia-300/10 blur-sm" />
                      <div className="absolute bottom-9 left-1/2 h-12 w-36 -translate-x-1/2 rounded-full bg-white/10 blur-xl" />
                    </div>}
              </figure>
              <header>
                <h2 className="text-2xl font-bold tracking-tighter text-gray-800 d:text-white">
                  {project.name}
                </h2>
                <div className="-ml-0.5 mt-0.5 flex items-center gap-2 tracking-tight text-gray-600 d:text-gray-200">
                  {project.tech?.map(({ name, Icon }, i) => {
                    if (i > 3) return null;
                    return (
                      <div
                        key={name}
                        className="flex select-none items-center gap-1 whitespace-nowrap rounded border border-gray-700/10 bg-gray-200/30 px-1.5 py-[2px] text-[13px] font-medium hfa:bg-gray-200/60 d:bg-gray-900/20 d:text-gray-50/80 d:hfa:bg-gray-900/30"
                      >
                        {name}
                      </div>
                    );
                  })}
                </div>
              </header>
              <main className="mt-2 text-[15px] tracking-tight text-gray-600 d:text-gray-200 ">
                <p className="line-clamp-4">{project.description}</p>
              </main>
              <footer className="absolute bottom-3 left-0 mt-auto flex w-full items-end justify-end gap-2 px-4">
                <div className="mr-auto text-sm font-semibold text-gray-700/80 d:text-gray-300/80">
                  {project.year}
                </div>
                {project.repository
                  ? <Link
                      target="_blank"
                      href={project.repository}
                      onClick={handleProjectLinkOpen}
                      className="p-1 text-gray-700/80 transition-all hfa:text-gray-900 d:text-gray-300/80 d:hfa:text-gray-50"
                      data-tip="View repository"
                    >
                      <span className="sr-only">Link to Github repository</span>
                      <FaGithub className="h-5 w-5 " />
                    </Link>
                  : null}
                {project.url
                  ? <Link
                      target="_blank"
                      href={project.url}
                      onClick={handleProjectLinkOpen}
                      className="p-1 text-gray-700/80 transition-all hfa:text-gray-900 d:text-gray-300/80 d:hfa:text-gray-50"
                      data-tip="View site"
                    >
                      <span className="sr-only">Link to Project</span>
                      <LinkIcon className="h-5 w-5 " />
                    </Link>
                  : null}
              </footer>
            </section>
          );
        })}
      </ScrollGallery>
    </section>
  );
};
