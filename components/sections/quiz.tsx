import { useAchievements } from "components/achievements";
import { QUIZ_QUESTIONS, QUIZ_RESULT_TIERS } from "content/quiz";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { FC, useCallback, useEffect, useRef, useState } from "react";

const TOTAL = QUIZ_QUESTIONS.length;

const getResultTier = (score: number) =>
  QUIZ_RESULT_TIERS.find((t) => score >= t.minScore && score <= t.maxScore) ??
  QUIZ_RESULT_TIERS[QUIZ_RESULT_TIERS.length - 1];

// ── Score Counter (animates 0 → target) ───────────────────────────

const ScoreCounter: FC<{ target: number }> = ({ target }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0 || count >= target) return;
    const timer = setTimeout(() => setCount((c) => c + 1), 180);
    return () => clearTimeout(timer);
  }, [count, target]);

  return <>{count}</>;
};

// ── Quiz ──────────────────────────────────────────────────────────

export const Quiz: FC = () => {
  const { trackAchievementEvent } = useAchievements();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const hasCompletedOnceRef = useRef(false);

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsFinished(false);
  }, []);

  const question = QUIZ_QUESTIONS[currentIndex];
  if (!question) return null;

  const handleSelect = (optionIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);

    const isCorrect = question.options[optionIndex]?.isCorrect === true;
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(newScore);

    setTimeout(
      () => {
        if (currentIndex < TOTAL - 1) {
          setCurrentIndex((i) => i + 1);
          setSelectedOption(null);
        } else {
          setIsFinished(true);

          if (!hasCompletedOnceRef.current) {
            hasCompletedOnceRef.current = true;
            trackAchievementEvent({ type: "quiz:completed" });
          }
          if (newScore === TOTAL) {
            trackAchievementEvent({ type: "quiz:perfect-score" });
          }
        }
      },
      900
    );
  };

  const tier = getResultTier(score);

  return (
    <section id="quiz" className="relative mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-32">
      {/* Header */}
      <header className="mb-16 md:mb-24">
        <div className="heading-pre">Pop Quiz</div>
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="heading-2xl -ml-1">
              How well do you
              <br className="hidden sm:block" /> know this site?
            </h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-gray-500 d:text-gray-400">
              Seven questions. No googling. Byte is watching.
            </p>
          </div>

          {/* Progress dots */}
          {!isFinished && (
            <div className="flex shrink-0 items-center gap-2 pt-3">
              {Array.from({ length: TOTAL }, (_, i) => {
                const answered =
                  i < currentIndex || (i === currentIndex && selectedOption !== null);
                const active = i === currentIndex && selectedOption === null;
                return (
                  <motion.div
                    key={i}
                    layout
                    className={clsx(
                      "rounded-full transition-colors duration-500",
                      answered && "h-2 w-2 bg-emerald-500",
                      active && "h-2.5 w-2.5 bg-accent",
                      !answered && !active && "h-2 w-2 bg-gray-200 d:bg-gray-700"
                    )}
                  />
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* Quiz body */}
      <div className="relative mx-auto max-w-3xl">
        <AnimatePresence mode="wait">
          {!isFinished
            ? <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.32, ease: [0.25, 1, 0.5, 1] }}
                className="relative"
              >
                {/* Giant watermark number */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="pointer-events-none absolute -left-3 -top-10 select-none font-mono text-[8rem] font-black leading-none tracking-tighter text-gray-900/[0.04] d:text-white/[0.03] md:-left-10 md:-top-16 md:text-[12rem]"
                >
                  {String(currentIndex + 1).padStart(2, "0")}
                </motion.div>

                {/* Question text */}
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06, duration: 0.3 }}
                  className="relative text-xl font-semibold leading-snug text-gray-900 d:text-white md:text-[1.625rem] md:leading-snug"
                >
                  {question.question}
                </motion.p>

                {/* Options */}
                <div className="mt-10 space-y-1 md:mt-12">
                  {question.options.map((option, i) => {
                    const isSelected = selectedOption === i;
                    const isCorrect = option.isCorrect === true;
                    const isRevealed = selectedOption !== null;

                    return (
                      <motion.button
                        key={i}
                        type="button"
                        disabled={isRevealed}
                        onClick={() => handleSelect(i)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                          opacity: 1,
                          x: isRevealed && isSelected && !isCorrect ? [0, -6, 6, -3, 0] : 0,
                        }}
                        transition={{
                          opacity: { duration: 0.25, delay: 0.1 + i * 0.04 },
                          x:
                            isRevealed && isSelected && !isCorrect
                              ? { duration: 0.4, ease: "easeOut" }
                              : { duration: 0.25, delay: 0.1 + i * 0.04 },
                        }}
                        className={clsx(
                          "group flex w-full items-center gap-4 border-l-2 py-3.5 pl-5 pr-4 text-left transition-all duration-200",
                          // Default: transparent border, hover reveals accent
                          !isRevealed &&
                            "cursor-pointer border-transparent hfa:border-accent hfa:bg-gray-50/80 d:hfa:border-sky-400 d:hfa:bg-white/[0.02]",
                          // Correct answer highlight
                          isRevealed &&
                            isCorrect &&
                            "border-emerald-500 bg-emerald-50/70 d:border-emerald-400 d:bg-emerald-500/[0.06]",
                          // Wrong selection
                          isRevealed &&
                            isSelected &&
                            !isCorrect &&
                            "border-red-500 bg-red-50/60 d:border-red-400 d:bg-red-500/[0.06]",
                          // Uninvolved (revealed, not selected, not correct)
                          isRevealed && !isSelected && !isCorrect && "border-transparent opacity-30"
                        )}
                      >
                        {/* Letter indicator */}
                        <span
                          className={clsx(
                            "shrink-0 font-mono text-xs font-bold tracking-widest transition-colors duration-200",
                            !isRevealed &&
                              "text-gray-400 group-hover:text-accent group-focus:text-accent d:text-gray-600 d:group-hover:text-sky-400",
                            isRevealed && isCorrect && "text-emerald-600 d:text-emerald-400",
                            isRevealed && isSelected && !isCorrect && "text-red-600 d:text-red-400",
                            isRevealed &&
                              !isSelected &&
                              !isCorrect &&
                              "text-gray-400 d:text-gray-600"
                          )}
                        >
                          {isRevealed && isCorrect
                            ? "\u2713"
                            : isRevealed && isSelected && !isCorrect
                            ? "\u2717"
                            : String.fromCharCode(65 + i)}
                        </span>

                        {/* Separator */}
                        <span
                          className={clsx(
                            "text-gray-200 transition-colors duration-200 d:text-gray-700",
                            isRevealed && isCorrect && "text-emerald-300 d:text-emerald-700",
                            isRevealed && isSelected && !isCorrect && "text-red-300 d:text-red-700"
                          )}
                        >
                          &mdash;
                        </span>

                        {/* Label */}
                        <span
                          className={clsx(
                            "text-[15px] transition-colors duration-200",
                            !isRevealed &&
                              "text-gray-600 group-hover:text-gray-900 d:text-gray-400 d:group-hover:text-white",
                            isRevealed &&
                              isCorrect &&
                              "font-medium text-emerald-800 d:text-emerald-300",
                            isRevealed &&
                              isSelected &&
                              !isCorrect &&
                              "text-red-700 line-through decoration-red-300/50 d:text-red-300 d:decoration-red-500/40",
                            isRevealed &&
                              !isSelected &&
                              !isCorrect &&
                              "text-gray-500 d:text-gray-500"
                          )}
                        >
                          {option.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Running score (subtle) */}
                <div className="mt-8 flex justify-end">
                  <span className="font-mono text-xs tabular-nums text-gray-300 d:text-gray-700">
                    {score}/{currentIndex + (selectedOption !== null ? 1 : 0)}
                  </span>
                </div>
              </motion.div>
            : /* ── Result ── */
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              >
                <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-16">
                  {/* Score column */}
                  <div className="shrink-0">
                    <div className="flex items-baseline gap-1">
                      <motion.span
                        className="text-[6rem] font-black leading-none tracking-tighter text-gray-900 d:text-white md:text-[8rem]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.15,
                          duration: 0.5,
                          ease: [0.25, 1, 0.5, 1],
                        }}
                      >
                        <ScoreCounter target={score} />
                      </motion.span>
                      <motion.span
                        className="text-2xl font-light text-gray-300 d:text-gray-600 md:text-3xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        /{TOTAL}
                      </motion.span>
                    </div>

                    {/* Score bar */}
                    <div className="mt-3 h-1 w-32 overflow-hidden rounded-full bg-gray-100 d:bg-gray-800 md:w-40">
                      <motion.div
                        className={clsx(
                          "h-full rounded-full",
                          score >= 6 ? "bg-emerald-500" : score >= 4 ? "bg-sky-500" : "bg-amber-500"
                        )}
                        initial={{ width: "0%" }}
                        animate={{ width: `${(score / TOTAL) * 100}%` }}
                        transition={{
                          delay: 0.6,
                          duration: 0.8,
                          ease: [0.25, 1, 0.5, 1],
                        }}
                      />
                    </div>
                  </div>

                  {/* Tier info column */}
                  {tier && (
                    <motion.div
                      className="flex-1 pt-2 md:pt-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.35,
                        duration: 0.5,
                        ease: [0.25, 1, 0.5, 1],
                      }}
                    >
                      <span className="mb-3 inline-block text-2xl">{tier.emoji}</span>
                      <h3 className="text-xl font-bold leading-snug text-gray-900 d:text-white md:text-2xl">
                        {tier.title}
                      </h3>
                      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-gray-500 d:text-gray-400">
                        {tier.description}
                      </p>

                      {/* Actions */}
                      <div className="mt-8 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={handleRetry}
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hfa:border-gray-300 hfa:bg-gray-50 d:border-gray-700 d:text-gray-300 d:hfa:border-gray-600 d:hfa:bg-gray-800"
                        >
                          <ArrowPathIcon className="h-4 w-4" />
                          Try Again
                        </button>
                        <a
                          href="mailto:aryanvijaywargia@gmail.com"
                          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hfa:bg-gray-800 d:bg-white d:text-gray-900 d:hfa:bg-gray-100"
                        >
                          Get in Touch
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                            />
                          </svg>
                        </a>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>}
        </AnimatePresence>
      </div>
    </section>
  );
};
