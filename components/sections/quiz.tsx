import { useAchievements } from "components/achievements";
import { QUIZ_QUESTIONS, QUIZ_RESULT_TIERS } from "content/quiz";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { FC, useCallback, useRef, useState } from "react";

const TOTAL = QUIZ_QUESTIONS.length;

const getResultTier = (score: number) =>
  QUIZ_RESULT_TIERS.find((t) => score >= t.minScore && score <= t.maxScore) ??
  QUIZ_RESULT_TIERS[QUIZ_RESULT_TIERS.length - 1];

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
      850
    );
  };

  const tier = getResultTier(score);

  return (
    <section id="quiz" className="mx-auto max-w-6xl px-4 pb-20 md:px-8">
      <header className="mb-8">
        <div className="heading-pre">Pop Quiz</div>
        <h2 className="heading-2xl -ml-1">How well do you know this site?</h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-500 d:text-gray-400">
          Seven questions. No googling. Byte is watching.
        </p>
      </header>

      <div className="relative mx-auto max-w-2xl">
        {/* Progress bar */}
        {!isFinished && (
          <div className="mb-6">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 d:text-gray-400">
                Question {currentIndex + 1} of {TOTAL}
              </span>
              <span className="text-xs tabular-nums text-gray-400 d:text-gray-500">
                {score} correct
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 d:bg-gray-700">
              <motion.div
                className="h-full rounded-full bg-sky-500"
                animate={{
                  width: `${((currentIndex + (selectedOption !== null ? 1 : 0)) / TOTAL) * 100}%`,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Question card */}
        <AnimatePresence>
          {!isFinished && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm d:border-gray-700 d:bg-gray-800/80"
            >
              {/* Question header */}
              <div className="border-b border-gray-100 bg-gray-50/60 px-5 py-3.5 d:border-gray-700/60 d:bg-gray-800/60">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-500/10 text-[11px] font-bold tabular-nums text-sky-600 d:bg-sky-500/20 d:text-sky-400">
                    {currentIndex + 1}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 d:text-gray-500">
                    Question
                  </span>
                </div>
              </div>

              {/* Question body */}
              <div className="px-5 pb-5 pt-4">
                <p className="mb-5 text-[15px] font-medium leading-relaxed text-gray-800 d:text-gray-100">
                  {question.question}
                </p>

                <div className="space-y-2.5">
                  {question.options.map((option, i) => {
                    const isSelected = selectedOption === i;
                    const isCorrect = option.isCorrect === true;
                    const isRevealed = selectedOption !== null;

                    let stateClasses =
                      "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 d:border-gray-600 d:bg-gray-700/50 d:hover:border-gray-500 d:hover:bg-gray-700";

                    if (isRevealed && isCorrect) {
                      stateClasses =
                        "border-emerald-400 bg-emerald-50 d:border-emerald-500/60 d:bg-emerald-500/10";
                    } else if (isRevealed && isSelected && !isCorrect) {
                      stateClasses = "border-red-400 bg-red-50 d:border-red-500/60 d:bg-red-500/10";
                    } else if (isRevealed) {
                      stateClasses =
                        "border-gray-200 bg-gray-50/50 opacity-60 d:border-gray-700 d:bg-gray-800/40";
                    }

                    return (
                      <motion.button
                        key={i}
                        type="button"
                        disabled={selectedOption !== null}
                        onClick={() => handleSelect(i)}
                        whileHover={selectedOption === null ? { y: -1 } : undefined}
                        whileTap={selectedOption === null ? { scale: 0.99 } : undefined}
                        className={clsx(
                          "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all duration-200",
                          stateClasses,
                          selectedOption === null && "cursor-pointer",
                          selectedOption !== null && "cursor-default"
                        )}
                      >
                        <span
                          className={clsx(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold",
                            isRevealed && isCorrect
                              ? "bg-emerald-500 text-white"
                              : isRevealed && isSelected && !isCorrect
                              ? "bg-red-500 text-white"
                              : "bg-gray-100 text-gray-500 d:bg-gray-600 d:text-gray-300"
                          )}
                        >
                          {isRevealed && isCorrect
                            ? "\u2713"
                            : isRevealed && isSelected && !isCorrect
                            ? "\u2717"
                            : String.fromCharCode(65 + i)}
                        </span>
                        <span
                          className={clsx(
                            "flex-1",
                            isRevealed && isCorrect
                              ? "font-medium text-emerald-700 d:text-emerald-400"
                              : isRevealed && isSelected && !isCorrect
                              ? "text-red-700 d:text-red-400"
                              : "text-gray-700 d:text-gray-200"
                          )}
                        >
                          {option.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result card */}
        <AnimatePresence>
          {isFinished && tier && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm d:border-gray-700 d:bg-gray-800/80"
            >
              {/* Score header */}
              <div className="border-b border-gray-100 bg-gray-50/60 px-5 py-3.5 d:border-gray-700/60 d:bg-gray-800/60">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 d:text-gray-500">
                    Results
                  </span>
                </div>
              </div>

              <div className="px-5 pb-6 pt-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.15 }}
                  className="mb-4 text-4xl"
                >
                  {tier.emoji}
                </motion.div>

                <div className="mb-2 flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold tabular-nums text-gray-900 d:text-white">
                    {score}
                  </span>
                  <span className="text-lg text-gray-400 d:text-gray-500">/ {TOTAL}</span>
                </div>

                <h3 className="mb-2 text-lg font-semibold text-gray-800 d:text-gray-100">
                  {tier.title}
                </h3>
                <p className="mx-auto max-w-md text-sm leading-relaxed text-gray-500 d:text-gray-400">
                  {tier.description}
                </p>

                {/* CTAs */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hfa:border-gray-300 hfa:bg-gray-50 d:border-gray-600 d:bg-gray-700 d:text-gray-200 d:hfa:border-gray-500 d:hfa:bg-gray-600"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
                      />
                    </svg>
                    Try Again
                  </button>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white transition-colors hfa:bg-sky-600"
                  >
                    Get in Touch
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
