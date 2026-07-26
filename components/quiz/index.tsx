import { useAchievementActions } from "components/achievements";
import { CheckIcon, ArrowRightIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { FC, FormEvent, useEffect, useRef, useState } from "react";

type QuizQuestion = {
  prompt: string;
  answers: readonly string[];
  correctAnswer: number | "any";
};

const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    prompt: "What is inevitable?",
    answers: [
      "Another meeting that could've been an email",
      "AGI",
      "CSS winning the argument",
      "Me starting one more side project",
    ],
    correctAnswer: 1,
  },
  {
    prompt: "What year did I begin my professional software engineering career?",
    answers: ["2019 — prehistoric", "2021 — Zoom University", "2023 — plot begins", "You're old"],
    correctAnswer: 2,
  },
  {
    prompt: "Which stack do I use?",
    answers: [
      "Whatever fits the problem",
      "Whichever dependency installs first",
      "The one with the nicest logo",
      "Excel in production",
    ],
    correctAnswer: 0,
  },
  {
    prompt: "Who claims to be trapped inside my terminal?",
    answers: [
      "Batman, debugging in the dark",
      "Byte, currently unionizing",
      "Rick Sanchez, unfortunately",
      "A recruiter asking for 8 years of Go",
    ],
    correctAnswer: 2,
  },
  {
    prompt: "Which project is my durable execution engine for AI agents?",
    answers: [
      "Continua — it survives the crash",
      "Forex Trend Prediction — money printer pending",
      "Sudoku Solver — nine boxes, zero agents",
      "Leo Search Platform — close cousin, wrong child",
    ],
    correctAnswer: 0,
  },
];

type QuizPhase = "intro" | "questions" | "result";

const QuizNote: FC = () => (
  <p className="mt-5 font-mono text-xs text-slate-500 d:text-slate-400">
    Quiz results unlock achievements. Check the achievements in the terminal with{" "}
    <code className="font-semibold text-cyan-700 d:text-cyan-300">achievements</code>.
  </p>
);

export const Quiz: FC = () => {
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [warningOpen, setWarningOpen] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const quizRef = useRef<HTMLElement>(null);
  const { trackAchievementEvent } = useAchievementActions();

  useEffect(() => {
    if (phase !== "questions" || warningOpen) return undefined;

    let handlingEscape = false;

    const handleScroll = () => {
      const quizTop = quizRef.current?.offsetTop;
      if (typeof quizTop !== "number") return;

      const escapeBoundary = quizTop - 300;
      if (window.scrollY > escapeBoundary || handlingEscape) return;

      handlingEscape = true;
      window.scrollTo({ top: quizTop, behavior: "smooth" });
      trackAchievementEvent({ type: "quiz:scroll-cheat" });
      setWarningCount((count) => count + 1);
      setWarningOpen(true);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [phase, trackAchievementEvent, warningOpen]);

  const scrollQuizIntoView = () => {
    window.requestAnimationFrame(() => {
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth";
      document.getElementById("quiz")?.scrollIntoView({ behavior, block: "start" });
    });
  };

  const startQuiz = () => {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setPhase("questions");
    scrollQuizIntoView();
  };

  const submitAnswer = (event: FormEvent) => {
    event.preventDefault();
    if (selectedAnswer === null) return;

    const question = QUIZ_QUESTIONS[questionIndex];
    const isCorrect = question.correctAnswer === "any" || selectedAnswer === question.correctAnswer;
    const nextScore = score + (isCorrect ? 1 : 0);
    const isLastQuestion = questionIndex === QUIZ_QUESTIONS.length - 1;

    setScore(nextScore);

    if (isLastQuestion) {
      trackAchievementEvent({ type: "quiz:completed" });
      if (nextScore === QUIZ_QUESTIONS.length) {
        trackAchievementEvent({ type: "quiz:perfect-score" });
      }
      setPhase("result");
      scrollQuizIntoView();
      return;
    }

    setQuestionIndex((current) => current + 1);
    setSelectedAnswer(null);
  };

  const question = QUIZ_QUESTIONS[questionIndex];
  const scorePercent = Math.round((score / QUIZ_QUESTIONS.length) * 100);
  const resultCopy =
    score === QUIZ_QUESTIONS.length
      ? "Perfect. Byte is reluctantly impressed."
      : score >= 4
      ? "You were paying attention. Mostly."
      : "A scenic scroll through the site may help.";

  return (
    <section
      ref={quizRef}
      id="quiz"
      className="relative min-h-[100svh] overflow-hidden px-4 py-24 md:px-8 md:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-70 d:opacity-100"
      >
        <div className="absolute left-[8%] top-[18%] h-64 w-64 rounded-full bg-cyan-300/20 blur-[90px] d:bg-cyan-500/10" />
        <div className="absolute bottom-[12%] right-[6%] h-72 w-72 rounded-full bg-violet-300/20 blur-[100px] d:bg-violet-500/10" />
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(100,116,139,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.055)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_70%_65%_at_50%_50%,#000_25%,transparent_82%)]" />
      </div>

      <div className="mx-auto flex min-h-[calc(100svh-12rem)] max-w-4xl items-center">
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <p className="heading-pre">Final checkpoint</p>
              <p className="font-mono text-sm text-cyan-700 d:text-cyan-300">The</p>
              <h2 className="heading-2xl -ml-1 mt-2 max-w-3xl">Were you paying attention?</h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 d:text-slate-400 md:text-lg">
                Five questions. Everything you need has already appeared somewhere on this page.
              </p>
              <button
                type="button"
                onClick={startQuiz}
                className="group mt-8 inline-flex items-center gap-3 rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_-12px_rgba(6,182,212,0.65)] transition-all hfa:from-cyan-400 hfa:to-blue-500 hfa:shadow-[0_16px_40px_-12px_rgba(6,182,212,0.8)]"
              >
                Start the quiz
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hfa:translate-x-1" />
              </button>
              <QuizNote />
            </motion.div>
          )}

          {phase === "questions" && (
            <motion.div
              key={`question-${questionIndex}`}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <div className="mb-10 flex items-center gap-4">
                <span className="shrink-0 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 d:text-slate-400">
                  {String(questionIndex + 1).padStart(2, "0")} /{" "}
                  {String(QUIZ_QUESTIONS.length).padStart(2, "0")}
                </span>
                <div className="h-px flex-1 overflow-hidden bg-slate-200 d:bg-slate-700">
                  <motion.div
                    className="h-full origin-left bg-gradient-to-r from-cyan-500 to-blue-500"
                    initial={{ scaleX: questionIndex / QUIZ_QUESTIONS.length }}
                    animate={{ scaleX: (questionIndex + 1) / QUIZ_QUESTIONS.length }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  />
                </div>
              </div>

              <form onSubmit={submitAnswer}>
                <fieldset>
                  <legend className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-slate-900 d:text-white md:text-5xl md:leading-[1.08]">
                    {question.prompt}
                  </legend>
                  <div className="mt-10 grid gap-x-10 gap-y-2 md:grid-cols-2">
                    {question.answers.map((answer, index) => {
                      const isSelected = selectedAnswer === index;
                      return (
                        <label
                          key={answer}
                          className={`group relative flex cursor-pointer items-center gap-4 border-b py-4 transition-colors ${
                            isSelected
                              ? "border-cyan-500 text-cyan-700 d:border-cyan-400 d:text-cyan-300"
                              : "border-slate-200 text-slate-700 hfa:border-slate-400 hfa:text-slate-950 d:border-slate-700 d:text-slate-300 d:hfa:border-slate-500 d:hfa:text-white"
                          }`}
                        >
                          <input
                            className="sr-only"
                            type="radio"
                            name="quiz-answer"
                            value={index}
                            checked={isSelected}
                            onChange={() => setSelectedAnswer(index)}
                          />
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-semibold transition-all ${
                              isSelected
                                ? "border-cyan-500 bg-cyan-500 text-white shadow-[0_0_24px_-6px_rgba(6,182,212,0.8)]"
                                : "border-slate-300 text-slate-500 group-hfa:border-slate-500 d:border-slate-600 d:text-slate-400"
                            }`}
                          >
                            {isSelected
                              ? <CheckIcon className="h-4 w-4" />
                              : String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-base font-medium md:text-lg">{answer}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-10 flex justify-end">
                  <button
                    type="submit"
                    disabled={selectedAnswer === null}
                    className="group inline-flex items-center gap-2 rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all enabled:hfa:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-40 d:bg-white d:text-slate-900 d:enabled:hfa:bg-cyan-300"
                  >
                    {questionIndex === QUIZ_QUESTIONS.length - 1 ? "See my score" : "Next question"}
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-enabled:group-hfa:translate-x-1" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {phase === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
              className="w-full"
            >
              <p className="heading-pre">Transmission complete</p>
              <div className="mt-5 flex items-end gap-3">
                <span className="text-7xl font-bold tracking-[-0.08em] text-slate-950 d:text-white md:text-9xl">
                  {score}
                </span>
                <span className="mb-2 font-mono text-xl text-slate-400 md:mb-4 md:text-2xl">
                  / {QUIZ_QUESTIONS.length}
                </span>
              </div>
              <div className="mt-6 h-1.5 max-w-xl overflow-hidden rounded-full bg-slate-200 d:bg-slate-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${scorePercent}%` }}
                  transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                />
              </div>
              <p className="mt-6 text-xl font-semibold text-slate-800 d:text-slate-100 md:text-2xl">
                {resultCopy}
              </p>
              <button
                type="button"
                onClick={startQuiz}
                className="group mt-8 inline-flex items-center gap-2 font-mono text-sm font-semibold text-cyan-700 transition-colors hfa:text-cyan-500 d:text-cyan-300 d:hfa:text-cyan-200"
              >
                <ArrowPathIcon className="h-4 w-4 transition-transform duration-300 group-hfa:-rotate-180" />
                Try again
              </button>
              <QuizNote />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {warningOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/85 px-5 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quiz-warning-title"
            onClick={() => setWarningOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="w-full max-w-2xl text-center"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                Scroll violation detected
              </p>
              <h3
                id="quiz-warning-title"
                className="mt-5 text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl"
              >
                No cheating on the very important quiz!
              </h3>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setWarningOpen(false)}
                  className="rounded-md bg-cyan-500 px-7 py-3 text-sm font-semibold text-slate-950 transition-colors hfa:bg-cyan-300"
                >
                  Ok
                </button>
                {warningCount >= 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      trackAchievementEvent({ type: "quiz:confessed-cheat" });
                      setWarningOpen(false);
                      setPhase("intro");
                      setQuestionIndex(0);
                      setSelectedAnswer(null);
                      setScore(0);
                      scrollQuizIntoView();
                    }}
                    className="rounded-md border border-white/20 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition-colors hfa:border-white/40 hfa:bg-white/15"
                  >
                    I give up, I&apos;m a cheater
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Quiz;
