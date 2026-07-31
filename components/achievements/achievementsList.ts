export type AchievementCategory =
  | "hero"
  | "terminal"
  | "explorer"
  | "projects"
  | "contact"
  | "games"
  | "hidden";

export type AchievementDefinition = {
  title: string;
  description: string;
  hint: string;
  category: AchievementCategory;
  hidden?: boolean;
};

const ACHIEVEMENTS_MAP = {
  BEHIND_THE_PIXELS: {
    title: "Behind the Pixels",
    description: "Worked through the full About photo stack.",
    hint: "There is more hidden in the About section than the first image.",
    category: "explorer",
    hidden: true,
  },
  TIMELINE_TRAVELER: {
    title: "Timeline Traveler",
    description: "Manually inspected five distinct years on the timeline.",
    hint: "The timeline rewards manual exploration, not just watching autoplay.",
    category: "explorer",
    hidden: true,
  },
  SNAKE_CHARMER: {
    title: "Snake Charmer",
    description: "Reached 30 points in Snake.",
    hint: "One of the terminal games rewards patience and control.",
    category: "games",
    hidden: true,
  },
  ESCAPE_ARTIST: {
    title: "Escape Artist",
    description: "Escaped the dungeon alive.",
    hint: "One of the terminal games can actually be beaten.",
    category: "games",
    hidden: true,
  },
  HACKER: {
    title: "Hacker",
    description: "Opened the browser console and peeked behind the curtain.",
    hint: "Some visitors look at the site. Others inspect it.",
    category: "hidden",
    hidden: true,
  },
  SOURCE_DIVER: {
    title: "Source Diver",
    description: "Used the terminal to jump into the code view.",
    hint: "The shell can open more than command output.",
    category: "terminal",
    hidden: true,
  },
  ROOT_ACCESS: {
    title: "Root Access",
    description: "Discovered the secret path and escalated successfully.",
    hint: "Curiosity and escalation both matter in this shell.",
    category: "hidden",
    hidden: true,
  },
  SHAME: {
    title: "SHAME",
    description: "You tried to cheat at the most important quiz in the world!",
    hint: "Some people answer the quiz. Some people try to scroll away.",
    category: "hidden",
    hidden: true,
  },
  BOOOO: {
    title: "BOOOO!",
    description: "At least you admitted you're a cheater...",
    hint: "Persistence is admirable. Surrendering after getting caught twice is also a choice.",
    category: "hidden",
    hidden: true,
  },
  POP_QUIZ_SURVIVOR: {
    title: "Pop Quiz Survivor",
    description: "Completed the portfolio quiz without rage-quitting.",
    hint: "There's a quiz section near the bottom of the site. Finish it.",
    category: "explorer",
    hidden: true,
  },
  BYTE_APPROVED: {
    title: "Byte Approved",
    description: "Scored a perfect 5/5 on the portfolio quiz.",
    hint: "Byte only respects perfection. Answer every question correctly.",
    category: "hidden",
    hidden: true,
  },
} as const;

export const ACHIEVEMENTS: Record<keyof typeof ACHIEVEMENTS_MAP, AchievementDefinition> =
  ACHIEVEMENTS_MAP;

export type AchievementId = keyof typeof ACHIEVEMENTS;

export const ACHIEVEMENT_ORDER = [
  "BEHIND_THE_PIXELS",
  "TIMELINE_TRAVELER",
  "SNAKE_CHARMER",
  "ESCAPE_ARTIST",
  "HACKER",
  "SOURCE_DIVER",
  "ROOT_ACCESS",
  "SHAME",
  "BOOOO",
  "POP_QUIZ_SURVIVOR",
  "BYTE_APPROVED",
] as AchievementId[];

export const ACHIEVEMENT_CATEGORY_LABELS: Record<AchievementCategory, string> = {
  hero: "Hero",
  terminal: "Terminal",
  explorer: "Explore",
  projects: "Projects",
  contact: "Contact",
  games: "Games",
  hidden: "Hidden",
};
