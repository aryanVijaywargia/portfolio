import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORY_LABELS, ACHIEVEMENT_ORDER, AchievementCategory, AchievementDefinition, AchievementId } from "./achievementsList";
import clsx from "clsx";
import {
  ArrowPathIcon,
  LockClosedIcon,
  CameraIcon,
  ClockIcon,
  CodeBracketIcon,
  FireIcon,
  KeyIcon,
  CommandLineIcon,
  EyeIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    __ARYAN_DEVTOOLS__?: {
      achievements: string;
      hint: string;
      openRepo: () => string;
      repo: string;
    };
  }
}

type AchievementEvent =
  | { type: "devtools:opened" }
  | { type: "terminal:valid-command"; command: string }
  | { type: "terminal:source-diver" }
  | { type: "terminal:secret-discovered" }
  | { type: "terminal:root-access" }
  | { type: "hero:theme-toggled" }
  | { type: "hero:wow-clicked" }
  | { type: "chatbot:message-sent" }
  | { type: "about:cycle-complete" }
  | { type: "timeline:year-viewed"; year: string }
  | { type: "experience:expanded"; id: string }
  | { type: "portfolio:filter-used"; filter: string }
  | { type: "portfolio:link-opened" }
  | { type: "contact:action"; action: "copy-email" | "download-vcard" }
  | { type: "arcade:opened" }
  | { type: "snake:score"; score: number }
  | { type: "dungeon:escaped" };

type AchievementProgress = {
  unlockedIds: AchievementId[];
  validCommands: string[];
  themeToggled: boolean;
  chatbotMessagesSent: number;
  aboutCyclesCompleted: number;
  timelineYearsViewed: string[];
  experienceEntriesViewed: string[];
  projectFiltersUsed: string[];
  projectLinksOpened: number;
  contactActionsUsed: ("copy-email" | "download-vcard")[];
  arcadeOpened: boolean;
  devtoolsOpened: boolean;
  snakeBestScore: number;
  dungeonEscaped: boolean;
  wowClicked: boolean;
  sourceDiverOpened: boolean;
  secretDiscovered: boolean;
  rootAccessGranted: boolean;
};

type AchievementContextValue = {
  achievements: AchievementDefinition[];
  unlockedIds: AchievementId[];
  unlockAchievement: (id: AchievementId) => void;
  trackAchievementEvent: (event: AchievementEvent) => void;
  isUnlocked: (id: AchievementId) => boolean;
  resetAchievements: () => void;
  progress: AchievementProgress;
};

const STORAGE_KEY = "portfolio-achievements:v2";

const DEFAULT_PROGRESS: AchievementProgress = {
  unlockedIds: [],
  validCommands: [],
  themeToggled: false,
  chatbotMessagesSent: 0,
  aboutCyclesCompleted: 0,
  timelineYearsViewed: [],
  experienceEntriesViewed: [],
  projectFiltersUsed: [],
  projectLinksOpened: 0,
  contactActionsUsed: [],
  arcadeOpened: false,
  devtoolsOpened: false,
  snakeBestScore: 0,
  dungeonEscaped: false,
  wowClicked: false,
  sourceDiverOpened: false,
  secretDiscovered: false,
  rootAccessGranted: false,
};

const AchievementContext = createContext<AchievementContextValue>({
  achievements: ACHIEVEMENT_ORDER.map((id) => ACHIEVEMENTS[id]),
  unlockedIds: [],
  unlockAchievement: () => {},
  trackAchievementEvent: () => {},
  isUnlocked: () => false,
  resetAchievements: () => {},
  progress: DEFAULT_PROGRESS,
});

const mergeUnique = <T,>(items: T[], nextItem: T) =>
  items.includes(nextItem) ? items : [...items, nextItem];

const getAchievementIdsToUnlock = (progress: AchievementProgress) => {
  const nextUnlocks: AchievementId[] = [];

  if (progress.aboutCyclesCompleted >= 1) nextUnlocks.push("BEHIND_THE_PIXELS");
  if (progress.timelineYearsViewed.length >= 5) nextUnlocks.push("TIMELINE_TRAVELER");
  if (progress.experienceEntriesViewed.length >= 4) nextUnlocks.push("GIT_ARCHAEOLOGIST");
  if (progress.snakeBestScore >= 30) nextUnlocks.push("SNAKE_CHARMER");
  if (progress.dungeonEscaped) nextUnlocks.push("ESCAPE_ARTIST");
  if (progress.devtoolsOpened) nextUnlocks.push("HACKER");
  if (progress.sourceDiverOpened) nextUnlocks.push("SOURCE_DIVER");
  if (progress.secretDiscovered && progress.rootAccessGranted) nextUnlocks.push("ROOT_ACCESS");

  return nextUnlocks;
};

const applyAchievementEvent = (
  previous: AchievementProgress,
  event: AchievementEvent
): AchievementProgress => {
  const next = { ...previous };

  switch (event.type) {
    case "devtools:opened":
      next.devtoolsOpened = true;
      break;
    case "terminal:valid-command":
      next.validCommands = mergeUnique(previous.validCommands, event.command);
      break;
    case "terminal:source-diver":
      next.sourceDiverOpened = true;
      break;
    case "terminal:secret-discovered":
      next.secretDiscovered = true;
      break;
    case "terminal:root-access":
      next.rootAccessGranted = true;
      break;
    case "hero:theme-toggled":
      next.themeToggled = true;
      break;
    case "hero:wow-clicked":
      next.wowClicked = true;
      break;
    case "chatbot:message-sent":
      next.chatbotMessagesSent = Math.max(previous.chatbotMessagesSent, 1);
      break;
    case "about:cycle-complete":
      next.aboutCyclesCompleted = previous.aboutCyclesCompleted + 1;
      break;
    case "timeline:year-viewed":
      next.timelineYearsViewed = mergeUnique(previous.timelineYearsViewed, event.year);
      break;
    case "experience:expanded":
      next.experienceEntriesViewed = mergeUnique(previous.experienceEntriesViewed, event.id);
      break;
    case "portfolio:filter-used":
      next.projectFiltersUsed = mergeUnique(previous.projectFiltersUsed, event.filter);
      break;
    case "portfolio:link-opened":
      next.projectLinksOpened = Math.max(previous.projectLinksOpened, 1);
      break;
    case "contact:action":
      next.contactActionsUsed = mergeUnique(previous.contactActionsUsed, event.action);
      break;
    case "arcade:opened":
      next.arcadeOpened = true;
      break;
    case "snake:score":
      next.snakeBestScore = Math.max(previous.snakeBestScore, event.score);
      break;
    case "dungeon:escaped":
      next.dungeonEscaped = true;
      break;
  }

  const unlockedIds = Array.from(
    new Set([...next.unlockedIds, ...getAchievementIdsToUnlock(next)])
  ) as AchievementId[];

  return { ...next, unlockedIds };
};

const ACHIEVEMENT_ICONS: Record<AchievementId, React.ComponentType<{ className?: string }>> = {
  BEHIND_THE_PIXELS: CameraIcon,
  TIMELINE_TRAVELER: ClockIcon,
  GIT_ARCHAEOLOGIST: CodeBracketIcon,
  SNAKE_CHARMER: FireIcon,
  ESCAPE_ARTIST: KeyIcon,
  HACKER: CommandLineIcon,
  SOURCE_DIVER: EyeIcon,
  ROOT_ACCESS: ShieldCheckIcon,
};

const getCategoryAccent = (category: AchievementCategory) => {
  switch (category) {
    case "hero":
      return { border: "border-l-sky-500", iconBg: "bg-sky-50 d:bg-sky-500/10", iconText: "text-sky-600 d:text-sky-400", badge: "text-sky-600 d:text-sky-400", dot: "bg-sky-500" };
    case "terminal":
      return { border: "border-l-cyan-500", iconBg: "bg-cyan-50 d:bg-cyan-500/10", iconText: "text-cyan-600 d:text-cyan-400", badge: "text-cyan-600 d:text-cyan-400", dot: "bg-cyan-500" };
    case "explorer":
      return { border: "border-l-indigo-500", iconBg: "bg-indigo-50 d:bg-indigo-500/10", iconText: "text-indigo-600 d:text-indigo-400", badge: "text-indigo-600 d:text-indigo-400", dot: "bg-indigo-500" };
    case "projects":
      return { border: "border-l-violet-500", iconBg: "bg-violet-50 d:bg-violet-500/10", iconText: "text-violet-600 d:text-violet-400", badge: "text-violet-600 d:text-violet-400", dot: "bg-violet-500" };
    case "contact":
      return { border: "border-l-emerald-500", iconBg: "bg-emerald-50 d:bg-emerald-500/10", iconText: "text-emerald-600 d:text-emerald-400", badge: "text-emerald-600 d:text-emerald-400", dot: "bg-emerald-500" };
    case "games":
      return { border: "border-l-amber-500", iconBg: "bg-amber-50 d:bg-amber-500/10", iconText: "text-amber-600 d:text-amber-400", badge: "text-amber-600 d:text-amber-400", dot: "bg-amber-500" };
    case "hidden":
      return { border: "border-l-fuchsia-500", iconBg: "bg-fuchsia-50 d:bg-fuchsia-500/10", iconText: "text-fuchsia-600 d:text-fuchsia-400", badge: "text-fuchsia-600 d:text-fuchsia-400", dot: "bg-fuchsia-500" };
    default:
      return { border: "border-l-gray-500", iconBg: "bg-gray-50 d:bg-gray-500/10", iconText: "text-gray-600 d:text-gray-400", badge: "text-gray-600 d:text-gray-400", dot: "bg-gray-500" };
  }
};

export const AchievementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<AchievementProgress>(DEFAULT_PROGRESS);
  const [latestAchievementId, setLatestAchievementId] = useState<AchievementId | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const previousUnlockedIdsRef = useRef<AchievementId[]>(DEFAULT_PROGRESS.unlockedIds);
  const repoUrl = "https://github.com/aryanVijaywargia/portfolio";

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);
      if (storedValue) {
        const parsed = JSON.parse(storedValue) as Partial<AchievementProgress>;
        const hydrated = {
          ...DEFAULT_PROGRESS,
          ...parsed,
          unlockedIds: (parsed.unlockedIds ?? []).filter(
            (id): id is AchievementId => id in ACHIEVEMENTS
          ),
          validCommands: parsed.validCommands ?? [],
          timelineYearsViewed: parsed.timelineYearsViewed ?? [],
          experienceEntriesViewed: parsed.experienceEntriesViewed ?? [],
          projectFiltersUsed: parsed.projectFiltersUsed ?? [],
          contactActionsUsed: parsed.contactActionsUsed ?? [],
        };

        previousUnlockedIdsRef.current = hydrated.unlockedIds;
        setProgress(hydrated);
      }
    } catch (error) {
      console.warn("Failed to load achievements progress", error);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated || typeof window === "undefined") return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [hasHydrated, progress]);

  useEffect(() => {
    if (!hasHydrated) return;

    const newUnlocks = progress.unlockedIds.filter(
      (achievementId) => !previousUnlockedIdsRef.current.includes(achievementId)
    );

    previousUnlockedIdsRef.current = progress.unlockedIds;

    if (!newUnlocks.length) return;

    setLatestAchievementId(newUnlocks[newUnlocks.length - 1] ?? null);
  }, [hasHydrated, progress.unlockedIds]);

  useEffect(() => {
    if (!latestAchievementId) return;

    const timeoutId = window.setTimeout(() => setLatestAchievementId(null), 4800);
    return () => window.clearTimeout(timeoutId);
  }, [latestAchievementId]);

  const unlockAchievement = useCallback((achievementId: AchievementId) => {
    setProgress((current) => {
      if (current.unlockedIds.includes(achievementId)) return current;
      return {
        ...current,
        unlockedIds: [...current.unlockedIds, achievementId],
      };
    });
  }, []);

  const trackAchievementEvent = useCallback((event: AchievementEvent) => {
    setProgress((current) => applyAchievementEvent(current, event));
  }, []);

  const isUnlocked = useCallback(
    (achievementId: AchievementId) => progress.unlockedIds.includes(achievementId),
    [progress.unlockedIds]
  );

  const resetAchievements = useCallback(() => {
    previousUnlockedIdsRef.current = [];
    setLatestAchievementId(null);
    setProgress(DEFAULT_PROGRESS);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const achievements = ACHIEVEMENT_ORDER.map((id) => ACHIEVEMENTS[id]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const devtoolsThreshold = 160;
    const logoUrl = `${window.location.origin}/logo.svg`;
    let hasDetectedOpen = false;

    const logDevtoolsBanner = () => {
      const imageStyle = [
        "font-size: 1px",
        "padding: 56px 112px",
        `background: url('${logoUrl}') center / contain no-repeat`,
        "color: transparent",
      ].join(";");

      const titleStyle = [
        "color: #f8fafc",
        "background: linear-gradient(135deg, #0f172a, #111827)",
        "font-size: 18px",
        "font-weight: 700",
        "padding: 10px 14px",
        "border-radius: 10px",
      ].join(";");

      const bodyStyle = ["color: #cbd5e1", "font-size: 12px", "line-height: 1.6"].join(";");

      console.log("%c ", imageStyle);
      console.log("%cInspect away.", titleStyle);
      console.log(
        "%cSource lives here:\n" +
          `${repoUrl}\n\n` +
          "Tip: inspect window.__ARYAN_DEVTOOLS__ or run window.__ARYAN_DEVTOOLS__.openRepo()\n\n" +
          "🔑 There's a locked achievement in the terminal. Try: secret → sudo → password: aryancodes",
        bodyStyle
      );
    };

    window.__ARYAN_DEVTOOLS__ = {
      achievements: `${window.location.origin}/#achievements`,
      hint: "Try window.__ARYAN_DEVTOOLS__.openRepo()",
      openRepo: () => {
        trackAchievementEvent({ type: "portfolio:link-opened" });
        window.open(repoUrl, "_blank", "noopener,noreferrer");
        return "Repo opened in a new tab.";
      },
      repo: repoUrl,
    };

    logDevtoolsBanner();

    const detectDevtools = () => {
      const widthOpen = window.outerWidth - window.innerWidth > devtoolsThreshold;
      const heightOpen = window.outerHeight - window.innerHeight > devtoolsThreshold;
      const isOpen = widthOpen || heightOpen;

      if (isOpen && !hasDetectedOpen) {
        hasDetectedOpen = true;
        trackAchievementEvent({ type: "devtools:opened" });
      }

      if (!isOpen) {
        hasDetectedOpen = false;
      }
    };

    detectDevtools();
    const intervalId = window.setInterval(detectDevtools, 1000);
    window.addEventListener("resize", detectDevtools);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("resize", detectDevtools);
      delete window.__ARYAN_DEVTOOLS__;
    };
  }, [repoUrl, trackAchievementEvent]);

  return (
    <AchievementContext.Provider
      value={{
        achievements,
        unlockedIds: progress.unlockedIds,
        unlockAchievement,
        trackAchievementEvent,
        isUnlocked,
        resetAchievements,
        progress,
      }}
    >
      {children}
      <AchievementToasts latestAchievementId={latestAchievementId} />
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => useContext(AchievementContext);

const AchievementToasts: React.FC<{ latestAchievementId: AchievementId | null }> = ({
  latestAchievementId,
}) => {
  const achievement = latestAchievementId ? ACHIEVEMENTS[latestAchievementId] : null;
  const accent = achievement ? getCategoryAccent(achievement.category) : null;
  const Icon = latestAchievementId ? ACHIEVEMENT_ICONS[latestAchievementId] : null;

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] md:left-6 md:right-auto md:max-w-sm">
      <AnimatePresence>
        {achievement && latestAchievementId && accent && Icon && (
          <motion.div
            key={latestAchievementId}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <Link href="/#achievements">
              <a className="pointer-events-auto flex items-center gap-3.5 rounded-xl border border-gray-200 bg-white px-4 py-3.5 shadow-xl shadow-gray-900/10 transition-transform hfa:scale-[1.01] d:border-gray-700 d:bg-gray-800 d:shadow-black/30">
                <div className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", accent.iconBg)}>
                  <Icon className={clsx("h-5 w-5", accent.iconText)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 d:text-gray-500">
                    Achievement unlocked
                  </p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-gray-900 d:text-white">
                    {achievement.title}
                  </p>
                </div>
                <CheckCircleIcon className="h-5 w-5 shrink-0 text-emerald-500" />
              </a>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AchievementCard: React.FC<{ achievementId: AchievementId }> = ({ achievementId }) => {
  const achievement = ACHIEVEMENTS[achievementId];
  const accent = getCategoryAccent(achievement.category);
  const Icon = ACHIEVEMENT_ICONS[achievementId];

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className={clsx(
        "group relative flex gap-4 rounded-xl border-l-4 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md d:bg-gray-800/80 d:hover:shadow-lg d:hover:shadow-black/20",
        accent.border
      )}
    >
      <div className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", accent.iconBg)}>
        <Icon className={clsx("h-5 w-5", accent.iconText)} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-gray-900 d:text-white">
          {achievement.title}
        </h3>
        <p className="mt-1 text-[13px] leading-relaxed text-gray-500 d:text-gray-400">
          {achievement.description}
        </p>
        <span className={clsx("mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider", accent.badge)}>
          <span className={clsx("h-1.5 w-1.5 rounded-full", accent.dot)} />
          {ACHIEVEMENT_CATEGORY_LABELS[achievement.category]}
        </span>
      </div>
    </motion.article>
  );
};

export const AchievementsSection: React.FC = () => {
  const { unlockedIds, resetAchievements } = useAchievements();
  const totalCount = ACHIEVEMENT_ORDER.length;
  const unlockedCount = unlockedIds.length;
  const percentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;
  const unlockedAchievementIds = ACHIEVEMENT_ORDER.filter((id) => unlockedIds.includes(id));

  return (
    <section id="achievements" className="mx-auto max-w-6xl px-4 pb-20 md:px-8">
      <header className="mb-8">
        <div className="heading-pre">Discovery Log</div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="heading-2xl -ml-1">Achievements</h2>
          {unlockedCount > 0 && (
            <button
              type="button"
              onClick={resetAchievements}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hfa:border-gray-300 hfa:text-gray-700 d:border-gray-700 d:bg-gray-800 d:text-gray-400 d:hfa:border-gray-600 d:hfa:text-gray-200"
            >
              <ArrowPathIcon className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
        </div>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-500 d:text-gray-400">
          There are {totalCount} hidden gems on this site. Explore to find them all.
        </p>

        <div className="mt-5">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 d:text-gray-400">
              Completed {percentage}%
            </span>
            <span className="text-xs tabular-nums text-gray-400 d:text-gray-500">
              {unlockedCount} of {totalCount}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 d:bg-gray-700">
            <motion.div
              className="h-full rounded-full bg-sky-500"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            />
          </div>
        </div>
      </header>

      {unlockedCount > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {unlockedAchievementIds.map((achievementId) => (
            <AchievementCard key={achievementId} achievementId={achievementId} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center d:border-gray-700 d:bg-gray-800/40">
          <LockClosedIcon className="mx-auto h-8 w-8 text-gray-300 d:text-gray-600" />
          <p className="mt-3 text-sm text-gray-400 d:text-gray-500">
            No achievements unlocked yet. Keep exploring.
          </p>
        </div>
      )}
    </section>
  );
};
