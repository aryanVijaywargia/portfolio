import { ArrowPathIcon, ArrowRightIcon, CheckIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { QUIZ_QUESTIONS } from "components/quiz";
import { useAchievementActions } from "components/achievements";
import { V2Eyebrow, V2Heading } from "components/v2/primitives";

type QuizPhase = "intro" | "questions" | "result";

/**
 * The closing quiz, restyled for v2.
 *
 * Behaviour is carried over from the v1 quiz unchanged — three phases, the
 * same question bank, the same achievement events, and the same
 * scroll-away guard that pulls the reader back and warns them. Only the
 * presentation is new, so it reads as part of this design.
 */
export const V2Quiz: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { trackAchievementEvent } = useAchievementActions();

  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [warningOpen, setWarningOpen] = useState(false);
  // Two strikes and the reader is offered a way out, as on the v1 quiz.
  const [warningCount, setWarningCount] = useState(0);

  // Scrolling away mid-quiz is treated as looking up the answers: the reader
  // is pulled back to the section and told why.
  useEffect(() => {
    if (phase !== "questions" || warningOpen) return undefined;

    let handling = false;
    const onScroll = () => {
      const top = sectionRef.current?.offsetTop;
      if (typeof top !== "number") return;
      if (window.scrollY > top - 300 || handling) return;

      handling = true;
      window.scrollTo({ top, behavior: "smooth" });
      trackAchievementEvent({ type: "quiz:scroll-cheat" });
      setWarningCount((count) => count + 1);
      setWarningOpen(true);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [phase, warningOpen, trackAchievementEvent]);

  const scrollIntoView = () => {
    window.requestAnimationFrame(() => {
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth";
      document.getElementById("quiz")?.scrollIntoView({ behavior, block: "start" });
    });
  };

  const start = () => {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setPhase("questions");
    scrollIntoView();
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (selectedAnswer === null) return;

    const question = QUIZ_QUESTIONS[questionIndex];
    const isCorrect = question.correctAnswer === "any" || selectedAnswer === question.correctAnswer;
    const nextScore = score + (isCorrect ? 1 : 0);
    setScore(nextScore);

    if (questionIndex === QUIZ_QUESTIONS.length - 1) {
      trackAchievementEvent({ type: "quiz:completed" });
      if (nextScore === QUIZ_QUESTIONS.length) {
        trackAchievementEvent({ type: "quiz:perfect-score" });
      }
      setPhase("result");
      scrollIntoView();
      return;
    }

    setQuestionIndex((current) => current + 1);
    setSelectedAnswer(null);
  };

  const question = QUIZ_QUESTIONS[questionIndex];
  const total = QUIZ_QUESTIONS.length;
  const resultCopy =
    score === total
      ? "Perfect. Byte is reluctantly impressed."
      : score >= 4
      ? "You were paying attention. Mostly."
      : "A scenic scroll through the site may help.";

  return (
    <section
      ref={sectionRef}
      id="quiz"
      data-screen-label="Quiz"
      data-v2-defer=""
      className="flex min-h-[100svh] scroll-mt-20 flex-col justify-center pb-[var(--v2-section-gap)] pt-[var(--v2-section-pt)]"
    >
      <div className="mx-auto w-full max-w-[var(--v2-max-w)] px-[var(--v2-gutter)]">
        {phase === "intro"
          ? <div>
              <div className="mb-6 flex items-center gap-4 v2md:mb-[30px]">
                <V2Eyebrow section="quiz" />
                <span className="h-px flex-1 bg-[rgb(var(--v2-line))]" />
              </div>
              <V2Heading className="max-w-3xl">Were you paying attention?</V2Heading>
              <p className="mt-5 max-w-xl text-[15.5px] leading-[1.72] text-[rgb(var(--v2-fg-3))] v2sm:text-[16.5px]">
                {total} questions. Everything you need has already appeared somewhere on this page.
              </p>
              <button
                type="button"
                onClick={start}
                className="group mt-8 inline-flex items-center gap-3 rounded-[var(--v2-radius-sm)] bg-[rgb(var(--v2-btn-bg))] px-[var(--v2-btn-px)] py-[var(--v2-btn-py)] text-sm font-[number:var(--v2-btn-weight)] tracking-[var(--v2-btn-tracking)] text-[rgb(var(--v2-btn-fg))]"
              >
                Start the quiz
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <QuizNote />
            </div>
          : null}

        {phase === "questions"
          ? <div>
              <div className="mb-10 flex items-center gap-4">
                <span className="shrink-0 font-[family-name:var(--v2-font-mono)] text-[10.5px] uppercase tracking-[0.2em] text-[rgb(var(--v2-fg-4))]">
                  {String(questionIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 overflow-hidden bg-[rgb(var(--v2-line))]">
                  <span
                    className="block h-full origin-left bg-[rgb(var(--v2-accent))] transition-transform duration-500"
                    style={{ transform: `scaleX(${(questionIndex + 1) / total})` }}
                  />
                </span>
              </div>

              <form onSubmit={submit}>
                <fieldset>
                  <legend className="max-w-3xl text-[length:var(--v2-h2-size)] font-bold leading-[1.08] tracking-[var(--v2-h2-tracking)] text-[rgb(var(--v2-fg))]">
                    {question.prompt}
                  </legend>

                  <div className="mt-10 grid gap-x-10 gap-y-1 v2sm:grid-cols-2">
                    {question.answers.map((answer, index) => {
                      const isSelected = selectedAnswer === index;
                      return (
                        <label
                          key={answer}
                          className={clsx(
                            "group flex cursor-pointer items-center gap-4 border-b py-4 transition-colors",
                            isSelected
                              ? "border-[rgb(var(--v2-accent))]"
                              : "border-[rgb(var(--v2-line))] hover:border-[rgb(var(--v2-line-2))]"
                          )}
                        >
                          <input
                            type="radio"
                            name="quiz-answer"
                            className="sr-only"
                            checked={isSelected}
                            onChange={() => setSelectedAnswer(index)}
                          />
                          <span
                            className={clsx(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-[family-name:var(--v2-font-mono)] text-xs font-semibold transition-colors",
                              isSelected
                                ? "border-[rgb(var(--v2-accent))] bg-[rgb(var(--v2-accent))] text-[rgb(var(--v2-btn-fg))]"
                                : "border-[rgb(var(--v2-line-2))] text-[rgb(var(--v2-fg-4))]"
                            )}
                          >
                            {isSelected
                              ? <CheckIcon className="h-4 w-4" />
                              : String.fromCharCode(65 + index)}
                          </span>
                          <span
                            className={clsx(
                              "text-[15px] font-medium transition-colors v2sm:text-base",
                              isSelected ? "text-[rgb(var(--v2-fg))]" : "text-[rgb(var(--v2-fg-3))]"
                            )}
                          >
                            {answer}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-10 flex justify-end">
                  <button
                    type="submit"
                    disabled={selectedAnswer === null}
                    className="group inline-flex items-center gap-2 rounded-[var(--v2-radius-sm)] bg-[rgb(var(--v2-btn-bg))] px-6 py-3 text-sm font-semibold text-[rgb(var(--v2-btn-fg))] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {questionIndex === total - 1 ? "Finish" : "Next"}
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-enabled:group-hover:translate-x-1" />
                  </button>
                </div>
              </form>
            </div>
          : null}

        {phase === "result"
          ? <div>
              <span className="font-[family-name:var(--v2-font-mono)] text-[10.5px] uppercase tracking-[0.2em] text-[rgb(var(--v2-fg-4))]">
                Transmission complete
              </span>
              <div className="mt-5 flex items-end gap-3">
                <span className="font-[family-name:var(--v2-font-display)] text-7xl font-bold tracking-[-0.06em] text-[rgb(var(--v2-fg))] v2sm:text-8xl">
                  {score}
                </span>
                <span className="mb-3 font-[family-name:var(--v2-font-mono)] text-xl text-[rgb(var(--v2-fg-4))]">
                  / {total}
                </span>
              </div>

              <div className="mt-6 h-1.5 max-w-xl overflow-hidden rounded-full bg-[rgb(var(--v2-line))]">
                <div
                  className="h-full rounded-full bg-[rgb(var(--v2-accent))] transition-[width] duration-700"
                  style={{ width: `${(score / total) * 100}%` }}
                />
              </div>

              <p className="mt-6 text-xl font-semibold text-[rgb(var(--v2-fg))]">{resultCopy}</p>

              <button
                type="button"
                onClick={start}
                className="group mt-8 inline-flex items-center gap-2 font-[family-name:var(--v2-font-mono)] text-sm font-semibold text-[rgb(var(--v2-accent))]"
              >
                <ArrowPathIcon className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-180" />
                Try again
              </button>
              <QuizNote />
            </div>
          : null}
      </div>

      {warningOpen
        ? <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 px-5 backdrop-blur-md">
            <div className="w-full max-w-md rounded-[var(--v2-radius-md)] border border-[rgb(var(--v2-line-2))] bg-[rgb(var(--v2-surface))] p-6">
              <p className="font-[family-name:var(--v2-font-mono)] text-[10.5px] uppercase tracking-[0.2em] text-[rgb(var(--v2-accent))]">
                Nice try
              </p>
              <p className="mt-3 text-base text-[rgb(var(--v2-fg))]">
                The answers are further up the page. Finish the quiz first.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setWarningOpen(false)}
                  className="inline-flex items-center rounded-[var(--v2-radius-sm)] bg-[rgb(var(--v2-btn-bg))] px-5 py-2.5 text-sm font-semibold text-[rgb(var(--v2-btn-fg))]"
                >
                  Back to the quiz
                </button>
                {warningCount >= 2
                  ? <button
                      type="button"
                      onClick={() => {
                        trackAchievementEvent({ type: "quiz:confessed-cheat" });
                        setWarningOpen(false);
                        setPhase("intro");
                        setQuestionIndex(0);
                        setSelectedAnswer(null);
                        setScore(0);
                        scrollIntoView();
                      }}
                      className="inline-flex items-center rounded-[var(--v2-radius-sm)] border border-[rgb(var(--v2-line-2))] bg-[rgb(var(--v2-surface-2))] px-5 py-2.5 text-sm font-semibold text-[rgb(var(--v2-fg-2))]"
                    >
                      I give up, I&apos;m a cheater
                    </button>
                  : null}
              </div>
            </div>
          </div>
        : null}
    </section>
  );
};

const QuizNote: FC = () => (
  <p className="mt-5 font-[family-name:var(--v2-font-mono)] text-xs text-[rgb(var(--v2-fg-4))]">
    Quiz results unlock achievements. Check them in the terminal with{" "}
    <code className="font-semibold text-[rgb(var(--v2-accent))]">achievements</code>.
  </p>
);
