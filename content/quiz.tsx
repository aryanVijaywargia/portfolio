export type QuizAnswerOption = {
  label: string;
  isCorrect?: boolean;
};

export type QuizQuestion = {
  question: string;
  options: QuizAnswerOption[];
};

export type QuizResultTier = {
  minScore: number;
  maxScore: number;
  title: string;
  description: string;
  emoji: string;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "Let's start easy. What is the correct spelling of my full name?",
    options: [
      { label: "Aryan Vijaywargia", isCorrect: true },
      { label: "Aryan Vijaywargiya" },
      { label: "Aaryan Vijaywargia" },
      { label: "Aryan Vijayvargia" },
    ],
  },
  {
    question: "Who's the AI sidekick hanging around the hero section?",
    options: [
      { label: "Chip" },
      { label: "Byte", isCorrect: true },
      { label: "Pixel" },
      { label: "Claude (he wishes)" },
    ],
  },
  {
    question: "Which of these is NOT in the hero tech row?",
    options: [
      { label: "Python" },
      { label: "TypeScript" },
      { label: "Kubernetes", isCorrect: true },
      { label: "TensorFlow" },
    ],
  },
  {
    question: "If you keep clicking the About photo stack, what happens?",
    options: [
      { label: "It opens a modal with more photos" },
      { label: "Nothing, it's decorative" },
      { label: "The photos cycle/shuffle like a mini deck", isCorrect: true },
      { label: "It triggers a confetti explosion" },
    ],
  },
  {
    question: "How is my work history presented on the site?",
    options: [
      { label: "A boring PDF embed" },
      { label: "Like an interactive terminal / git log", isCorrect: true },
      { label: "A horizontal carousel of logos" },
      { label: "An auto-playing timeline video" },
    ],
  },
  {
    question: "Which project mixes Twitter sentiment with FOREX data?",
    options: [
      { label: "CryptoMood Tracker" },
      { label: "Social Trading Bot" },
      { label: "Forex Trading Recommendation System", isCorrect: true },
      { label: "TweetFinance Analytics" },
    ],
  },
  {
    question: "Which mini-game can you launch from the interactive terminal?",
    options: [
      { label: "Tetris" },
      { label: "Snake", isCorrect: true },
      { label: "Pong" },
      { label: "Minesweeper" },
    ],
  },
];

export const QUIZ_RESULT_TIERS: QuizResultTier[] = [
  {
    minScore: 6,
    maxScore: 7,
    title: "You absolutely did your homework.",
    description:
      "Byte is genuinely impressed. You either explored every corner of the site or you have suspiciously good instincts.",
    emoji: "🏆",
  },
  {
    minScore: 4,
    maxScore: 5,
    title: "Respectable. Byte is cautiously impressed.",
    description:
      "You clearly paid attention to most of the site. A few blind spots, but nothing a quick scroll can't fix.",
    emoji: "👏",
  },
  {
    minScore: 0,
    maxScore: 3,
    title: "You skimmed. Professionally, of course.",
    description:
      "Look, speed-reading is a skill. But maybe give the site another pass before your next attempt.",
    emoji: "😅",
  },
];
