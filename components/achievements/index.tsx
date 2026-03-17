import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORY_LABELS, ACHIEVEMENT_ORDER, AchievementCategory, AchievementDefinition, AchievementId } from "./achievementsList";
import clsx from "clsx";
import { ArrowPathIcon, CameraIcon, ClockIcon, CodeBracketIcon, FireIcon, KeyIcon, CommandLineIcon, EyeIcon, ShieldCheckIcon, CheckCircleIcon, AcademicCapIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

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
  | { type: "dungeon:escaped" }
  | { type: "quiz:completed" }
  | { type: "quiz:perfect-score" };

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
  quizCompleted: boolean;
  quizPerfectScore: boolean;
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
  quizCompleted: false,
  quizPerfectScore: false,
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
  if (progress.quizCompleted) nextUnlocks.push("POP_QUIZ_SURVIVOR");
  if (progress.quizPerfectScore) nextUnlocks.push("BYTE_APPROVED");

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
    case "quiz:completed":
      next.quizCompleted = true;
      break;
    case "quiz:perfect-score":
      next.quizPerfectScore = true;
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
  POP_QUIZ_SURVIVOR: AcademicCapIcon,
  BYTE_APPROVED: SparklesIcon,
};

const getCategoryAccent = (category: AchievementCategory) => {
  switch (category) {
    case "hero":
      return {
        border: "border-l-sky-500",
        iconBg: "bg-sky-50 d:bg-sky-500/10",
        iconText: "text-sky-600 d:text-sky-400",
        badge: "text-sky-600 d:text-sky-400",
        dot: "bg-sky-500",
      };
    case "terminal":
      return {
        border: "border-l-cyan-500",
        iconBg: "bg-cyan-50 d:bg-cyan-500/10",
        iconText: "text-cyan-600 d:text-cyan-400",
        badge: "text-cyan-600 d:text-cyan-400",
        dot: "bg-cyan-500",
      };
    case "explorer":
      return {
        border: "border-l-indigo-500",
        iconBg: "bg-indigo-50 d:bg-indigo-500/10",
        iconText: "text-indigo-600 d:text-indigo-400",
        badge: "text-indigo-600 d:text-indigo-400",
        dot: "bg-indigo-500",
      };
    case "projects":
      return {
        border: "border-l-violet-500",
        iconBg: "bg-violet-50 d:bg-violet-500/10",
        iconText: "text-violet-600 d:text-violet-400",
        badge: "text-violet-600 d:text-violet-400",
        dot: "bg-violet-500",
      };
    case "contact":
      return {
        border: "border-l-emerald-500",
        iconBg: "bg-emerald-50 d:bg-emerald-500/10",
        iconText: "text-emerald-600 d:text-emerald-400",
        badge: "text-emerald-600 d:text-emerald-400",
        dot: "bg-emerald-500",
      };
    case "games":
      return {
        border: "border-l-amber-500",
        iconBg: "bg-amber-50 d:bg-amber-500/10",
        iconText: "text-amber-600 d:text-amber-400",
        badge: "text-amber-600 d:text-amber-400",
        dot: "bg-amber-500",
      };
    case "hidden":
      return {
        border: "border-l-fuchsia-500",
        iconBg: "bg-fuchsia-50 d:bg-fuchsia-500/10",
        iconText: "text-fuchsia-600 d:text-fuchsia-400",
        badge: "text-fuchsia-600 d:text-fuchsia-400",
        dot: "bg-fuchsia-500",
      };
    default:
      return {
        border: "border-l-gray-500",
        iconBg: "bg-gray-50 d:bg-gray-500/10",
        iconText: "text-gray-600 d:text-gray-400",
        badge: "text-gray-600 d:text-gray-400",
        dot: "bg-gray-500",
      };
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
                <div
                  className={clsx(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    accent.iconBg
                  )}
                >
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

// ── Progress Ring ──────────────────────────────────────────────

const RING_SIZE = 56;
const RING_STROKE = 3.5;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const ProgressRing: React.FC<{ unlocked: number; total: number }> = ({ unlocked, total }) => {
  const pct = total > 0 ? (unlocked / total) * 100 : 0;
  const isFull = unlocked === total && total > 0;

  return (
    <div className="relative inline-flex shrink-0">
      <svg
        width={RING_SIZE}
        height={RING_SIZE}
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          strokeWidth={RING_STROKE}
          className="stroke-gray-200 d:stroke-gray-700/40"
        />
        <motion.circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
          className={isFull ? "stroke-amber-500" : "stroke-sky-500"}
          strokeDasharray={RING_CIRCUMFERENCE}
          initial={{ strokeDashoffset: RING_CIRCUMFERENCE }}
          whileInView={{
            strokeDashoffset: RING_CIRCUMFERENCE - (pct / 100) * RING_CIRCUMFERENCE,
          }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={clsx(
            "text-base font-bold tabular-nums tracking-tight",
            isFull ? "text-amber-600 d:text-amber-400" : "text-gray-900 d:text-white"
          )}
        >
          {unlocked}
        </span>
        <span className="text-[8px] font-semibold uppercase tracking-widest text-gray-400 d:text-gray-500">
          / {total}
        </span>
      </div>
    </div>
  );
};

// ── Category Glow Colors ──────────────────────────────────────

const getCategoryShadow = (category: AchievementCategory) => {
  switch (category) {
    case "hero":
      return "shadow-sky-400/30 d:shadow-sky-500/20";
    case "terminal":
      return "shadow-cyan-400/30 d:shadow-cyan-500/20";
    case "explorer":
      return "shadow-indigo-400/30 d:shadow-indigo-500/20";
    case "projects":
      return "shadow-violet-400/30 d:shadow-violet-500/20";
    case "contact":
      return "shadow-emerald-400/30 d:shadow-emerald-500/20";
    case "games":
      return "shadow-amber-400/30 d:shadow-amber-500/20";
    case "hidden":
      return "shadow-fuchsia-400/30 d:shadow-fuchsia-500/20";
    default:
      return "shadow-gray-400/30 d:shadow-gray-500/20";
  }
};

// ── Trophy Item ───────────────────────────────────────────────

const TrophyItem: React.FC<{ achievementId: AchievementId; index: number }> = ({
  achievementId,
  index,
}) => {
  const achievement = ACHIEVEMENTS[achievementId];
  const accent = getCategoryAccent(achievement.category);
  const shadow = getCategoryShadow(achievement.category);
  const Icon = ACHIEVEMENT_ICONS[achievementId];

  return (
    <motion.div
      className="flex flex-col items-center gap-1.5"
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: Math.min(index * 0.08, 0.5),
      }}
    >
      <div
        className={clsx(
          "flex h-10 w-10 items-center justify-center rounded-full shadow-md",
          accent.iconBg,
          shadow
        )}
      >
        <Icon className={clsx("h-5 w-5", accent.iconText)} />
      </div>
      <span className="max-w-[80px] truncate text-center text-[11px] font-medium text-gray-600 d:text-gray-400">
        {achievement.title}
      </span>
    </motion.div>
  );
};

// ── Shelf Bar ─────────────────────────────────────────────────

const ShelfBar: React.FC = () => (
  <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent shadow-sm d:via-gray-600" />
);

// ── Dust Particles (empty state) ──────────────────────────────

const DustParticles: React.FC = () => (
  <div className="pointer-events-none absolute inset-0">
    {[0, 1, 2, 3, 4].map((i) => (
      <motion.div
        key={i}
        className="absolute h-[2px] w-[2px] rounded-full bg-gray-400/40 d:bg-gray-500/30"
        style={{
          left: `${18 + i * 16}%`,
          top: `${30 + (i % 3) * 20}%`,
        }}
        animate={{
          y: [0, -20],
          opacity: [0.3, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: i * 0.5,
          ease: "easeOut",
        }}
      />
    ))}
  </div>
);

// ── Shimmer Overlay (full state) ──────────────────────────────

const ShimmerOverlay: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <div className="shimmer-sweep absolute inset-0" />
    <style jsx>{`
      .shimmer-sweep::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          120deg,
          transparent 20%,
          rgba(255, 255, 255, 0.08) 40%,
          rgba(255, 255, 255, 0.15) 50%,
          rgba(255, 255, 255, 0.08) 60%,
          transparent 80%
        );
        animation: shimmer 4s ease-in-out infinite;
      }
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `}</style>
  </div>
);

// ── Trophy Shelf Row ──────────────────────────────────────────

const TrophyShelfRow: React.FC<{ achievementIds: AchievementId[]; startIndex: number }> = ({
  achievementIds,
  startIndex,
}) => (
  <div className="flex flex-col items-stretch">
    <div className="flex flex-wrap justify-center gap-6 px-4 pb-3">
      {achievementIds.map((id, i) => (
        <TrophyItem key={id} achievementId={id} index={startIndex + i} />
      ))}
    </div>
    <ShelfBar />
  </div>
);

// ── Section ────────────────────────────────────────────────────

export const AchievementsSection: React.FC = () => {
  const { unlockedIds, resetAchievements } = useAchievements();
  const totalCount = ACHIEVEMENT_ORDER.length;
  const unlockedCount = unlockedIds.length;
  const unlockedAchievementIds = ACHIEVEMENT_ORDER.filter((id) => unlockedIds.includes(id));
  const isFull = unlockedCount === totalCount && totalCount > 0;

  // Split trophies across shelves: up to 5 per row on desktop, 3 on mobile (flex-wrap handles it)
  const shelf1Ids = unlockedAchievementIds.slice(0, 5);
  const shelf2Ids = unlockedAchievementIds.slice(5, 10);

  return (
    <section id="achievements" className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-32">
      {/* Header */}
      <header className="mb-16 md:mb-24">
        <div className="heading-pre">Discovery Log</div>
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="heading-2xl -ml-1">Achievements</h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-gray-500 d:text-gray-400">
              {totalCount} hidden gems scattered across this site. Explore every corner to find them
              all.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ProgressRing unlocked={unlockedCount} total={totalCount} />
            {unlockedCount > 0 && (
              <button
                type="button"
                onClick={resetAchievements}
                className="rounded-lg p-2 text-gray-400 transition-colors hfa:text-gray-600 d:text-gray-500 d:hfa:text-gray-300"
                aria-label="Reset achievements"
              >
                <ArrowPathIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Trophy Shelves */}
      <div className="relative">
        {isFull && <ShimmerOverlay />}

        {unlockedCount === 0
          ? /* Empty State: two bare shelves with dust */
            <div className="relative flex flex-col gap-24 py-8 md:gap-32 md:py-12">
              <DustParticles />
              <ShelfBar />
              <div className="flex items-center justify-center">
                <p className="text-sm text-gray-400 d:text-gray-500">
                  Nothing on display yet. Explore the site to earn trophies.
                </p>
              </div>
              <ShelfBar />
            </div>
          : <div className="flex flex-col gap-16 md:gap-24">
              {/* Shelf 1 */}
              {shelf1Ids.length > 0 && <TrophyShelfRow achievementIds={shelf1Ids} startIndex={0} />}

              {/* Shelf 2: only if >5 unlocked */}
              {shelf2Ids.length > 0 && <TrophyShelfRow achievementIds={shelf2Ids} startIndex={5} />}

              {/* Show a second empty shelf bar if ≤5 and >0 unlocked, for visual balance */}
              {shelf2Ids.length === 0 && (
                <div className="pt-4">
                  <ShelfBar />
                </div>
              )}
            </div>}
      </div>
    </section>
  );
};

// ── Constellation / Skill Tree ─────────────────────────────────────

const toRadians = (deg: number) => (deg * Math.PI) / 180;
const polar = (cx: number, cy: number, r: number, deg: number) => ({
  x: cx + r * Math.cos(toRadians(deg)),
  y: cy + r * Math.sin(toRadians(deg)),
});

const CONSTELLATION_COLORS: Record<AchievementCategory, { main: string; glow: string }> = {
  explorer: { main: "#818cf8", glow: "#a5b4fc" },
  games: { main: "#fbbf24", glow: "#fde68a" },
  terminal: { main: "#22d3ee", glow: "#67e8f9" },
  hidden: { main: "#e879f9", glow: "#f0abfc" },
  hero: { main: "#38bdf8", glow: "#7dd3fc" },
  projects: { main: "#8b5cf6", glow: "#a78bfa" },
  contact: { main: "#34d399", glow: "#6ee7b7" },
};

// Group achievements into category branches
const CONSTELLATION_BRANCHES = (() => {
  const groups: { category: AchievementCategory; ids: AchievementId[] }[] = [];
  const seen = new Set<AchievementCategory>();
  ACHIEVEMENT_ORDER.forEach((id) => {
    const cat = ACHIEVEMENTS[id].category;
    if (!seen.has(cat)) {
      seen.add(cat);
      groups.push({ category: cat, ids: [] });
    }
    groups.find((g) => g.category === cat)!.ids.push(id);
  });
  return groups;
})();

// Pre-compute positions: center → category hubs → achievement leaves
const SVG_W = 800;
const SVG_H = 600;
const SVG_CX = SVG_W / 2;
const SVG_CY = SVG_H / 2;
const HUB_RADIUS = 150;
const LEAF_RADIUS = 100;

const BRANCH_LAYOUT = CONSTELLATION_BRANCHES.map((branch, bi) => {
  const baseAngle = (360 / CONSTELLATION_BRANCHES.length) * bi - 90; // start from top
  const hubPos = polar(SVG_CX, SVG_CY, HUB_RADIUS, baseAngle);
  const count = branch.ids.length;
  const fanSpread = Math.min(count * 22, 70);
  const startAngle = baseAngle - fanSpread / 2;
  const step = count > 1 ? fanSpread / (count - 1) : 0;

  const leaves = branch.ids.map((id, i) => ({
    id,
    pos: polar(hubPos.x, hubPos.y, LEAF_RADIUS, startAngle + step * i),
  }));

  return { ...branch, hubPos, leaves };
});

// ── Data-flow animated edge ────────────────────────────────────────

const DataFlowEdge: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
  color: string;
  complete?: boolean;
}> = ({ x1, y1, x2, y2, active, color, complete }) => (
  <g>
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={active ? color : "#1e293b"}
      strokeWidth={active ? (complete ? 2.5 : 1.5) : 0.7}
      strokeOpacity={active ? (complete ? 0.8 : 0.45) : 0.12}
    />
    {active && (
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={complete ? 2.5 : 1.5}
        strokeDasharray="4 10"
        strokeLinecap="round"
        strokeOpacity={complete ? 0.85 : 0.55}
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -14 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
      />
    )}
  </g>
);

// ── Constellation node (generic) ───────────────────────────────────

const ConstellationNode: React.FC<{
  x: number;
  y: number;
  r: number;
  color: string;
  glowColor: string;
  active: boolean;
  complete?: boolean;
  pulse?: boolean;
  label?: string;
  icon?: React.ComponentType<{ className?: string }>;
  sublabel?: string;
}> = ({ x, y, r, color, glowColor, active, complete, pulse, label, icon: Icon, sublabel }) => (
  <g>
    {/* Outer glow ring */}
    {active && (
      <motion.circle
        cx={x}
        cy={y}
        r={r + 8}
        fill="none"
        stroke={glowColor}
        strokeWidth={1}
        initial={{ opacity: 0.05 }}
        animate={{ opacity: [0.05, 0.25, 0.05] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    )}
    {/* Soft radial glow */}
    {active && (
      <motion.circle
        cx={x}
        cy={y}
        r={r + 5}
        fill={glowColor}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.04, 0.15, 0.04] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
    )}
    {/* Main circle */}
    <circle
      cx={x}
      cy={y}
      r={r}
      fill={active ? color : "#111827"}
      stroke={active ? glowColor : "#1f2937"}
      strokeWidth={active ? 1.5 : 0.5}
      opacity={active ? 1 : 0.35}
    />
    {/* Pulse overlay for complete branches */}
    {pulse && active && (
      <motion.circle
        cx={x}
        cy={y}
        r={r}
        fill="transparent"
        stroke={glowColor}
        strokeWidth={2}
        initial={{ opacity: 0, r: r }}
        animate={{ opacity: [0.6, 0], r: r + 14 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
      />
    )}
    {/* Icon (achievement nodes) */}
    {Icon && (
      <foreignObject x={x - 8} y={y - 8} width={16} height={16}>
        <div className="flex h-full w-full items-center justify-center">
          <Icon className={clsx("h-3.5 w-3.5", active ? "text-white" : "text-gray-600")} />
        </div>
      </foreignObject>
    )}
    {/* Text label (center/category nodes) */}
    {label && !Icon && (
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fill={active ? "#ffffff" : "#4b5563"}
        fontSize={r > 20 ? 11 : 9}
        fontWeight={700}
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {label}
      </text>
    )}
    {/* Sublabel below node */}
    {sublabel && (
      <text
        x={x}
        y={y + r + 14}
        textAnchor="middle"
        fill={active ? "#d1d5db" : "#374151"}
        fontSize={8.5}
        fontWeight={500}
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {sublabel}
      </text>
    )}
  </g>
);

// ── Background star field ──────────────────────────────────────────

const StarField: React.FC = () => {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        x: (i * 137.508) % SVG_W,
        y: (i * 89.443) % SVG_H,
        r: 0.4 + (i % 3) * 0.3,
        delay: (i % 7) * 0.8,
      })),
    []
  );

  return (
    <g>
      {stars.map((s, i) => (
        <motion.circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="#ffffff"
          initial={{ opacity: 0.03 }}
          animate={{ opacity: [0.03, 0.12, 0.03] }}
          transition={{ duration: 4, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        />
      ))}
    </g>
  );
};

// ── Constellation Section ──────────────────────────────────────────

export const ConstellationSection: React.FC = () => {
  const { unlockedIds } = useAchievements();
  const totalCount = ACHIEVEMENT_ORDER.length;
  const unlockedCount = unlockedIds.length;
  const allComplete = unlockedCount === totalCount && totalCount > 0;

  // Pan state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ sx: number; sy: number; px: number; py: number } | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = { sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [pan]);
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    setPan({
      x: dragRef.current.px + (e.clientX - dragRef.current.sx),
      y: dragRef.current.py + (e.clientY - dragRef.current.sy),
    });
  }, []);
  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const isNodeUnlocked = (id: AchievementId) => unlockedIds.includes(id);
  const isBranchComplete = (ids: AchievementId[]) =>
    ids.length > 0 && ids.every((id) => unlockedIds.includes(id));
  const isBranchPartial = (ids: AchievementId[]) => ids.some((id) => unlockedIds.includes(id));

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-32">
      {/* Header */}
      <header className="mb-16 md:mb-24">
        <div className="heading-pre">Skill Tree</div>
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="heading-2xl -ml-1">Constellation</h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-gray-500 d:text-gray-400">
              A living map of discoveries. Unlock achievements to light up the network. Drag to
              explore the constellation.
            </p>
          </div>
          <ProgressRing unlocked={unlockedCount} total={totalCount} />
        </div>
      </header>

      {/* Canvas */}
      <div
        className="relative cursor-grab overflow-hidden rounded-2xl border border-white/[0.06] bg-[#060a14] active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ touchAction: "none" }}
      >
        {/* Subtle dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="relative block h-auto w-full select-none"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
        >
          {/* Star field */}
          <StarField />

          {/* ── Edges ── */}
          {BRANCH_LAYOUT.map((branch) => {
            const color = CONSTELLATION_COLORS[branch.category].main;
            const complete = isBranchComplete(branch.ids);
            const partial = isBranchPartial(branch.ids);

            return (
              <g key={`edges-${branch.category}`}>
                {/* Center → Hub */}
                <DataFlowEdge
                  x1={SVG_CX}
                  y1={SVG_CY}
                  x2={branch.hubPos.x}
                  y2={branch.hubPos.y}
                  active={partial}
                  color={color}
                  complete={complete}
                />
                {/* Hub → each Leaf */}
                {branch.leaves.map(({ id, pos }) => (
                  <DataFlowEdge
                    key={id}
                    x1={branch.hubPos.x}
                    y1={branch.hubPos.y}
                    x2={pos.x}
                    y2={pos.y}
                    active={isNodeUnlocked(id)}
                    color={color}
                    complete={complete}
                  />
                ))}
              </g>
            );
          })}

          {/* ── Achievement leaf nodes ── */}
          {BRANCH_LAYOUT.map((branch) => {
            const colors = CONSTELLATION_COLORS[branch.category];
            const complete = isBranchComplete(branch.ids);
            return branch.leaves.map(({ id, pos }) => {
              const unlocked = isNodeUnlocked(id);
              return (
                <ConstellationNode
                  key={id}
                  x={pos.x}
                  y={pos.y}
                  r={14}
                  color={colors.main}
                  glowColor={colors.glow}
                  active={unlocked}
                  complete={complete}
                  icon={ACHIEVEMENT_ICONS[id]}
                  sublabel={unlocked ? ACHIEVEMENTS[id].title : "???"}
                />
              );
            });
          })}

          {/* ── Category hub nodes ── */}
          {BRANCH_LAYOUT.map((branch) => {
            const colors = CONSTELLATION_COLORS[branch.category];
            const complete = isBranchComplete(branch.ids);
            const partial = isBranchPartial(branch.ids);
            return (
              <ConstellationNode
                key={branch.category}
                x={branch.hubPos.x}
                y={branch.hubPos.y}
                r={20}
                color={colors.main}
                glowColor={colors.glow}
                active={partial}
                complete={complete}
                pulse={complete}
                label={ACHIEVEMENT_CATEGORY_LABELS[branch.category]}
              />
            );
          })}

          {/* ── Center node ── */}
          <ConstellationNode
            x={SVG_CX}
            y={SVG_CY}
            r={26}
            color={allComplete ? "#f59e0b" : "#3b82f6"}
            glowColor={allComplete ? "#fde68a" : "#93c5fd"}
            active={true}
            pulse={allComplete}
            label="You"
          />
        </svg>

        {/* Empty state overlay */}
        {unlockedCount === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#060a14]/60">
            <p className="text-sm text-gray-500">
              The constellation is dark. Explore the site to ignite it.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
