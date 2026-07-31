import { ArrowLeftIcon, ArrowUpRightIcon } from "@heroicons/react/24/solid";
import { ReadingProgress } from "components/blog/reading-progress";
import { SketchSystemMap } from "components/blog/sketch-system-map";
import { Link } from "components/link";
import { TEMP_BLOG_POST } from "content/blog/posts";
import { motion, useReducedMotion } from "framer-motion";
import { NextSeo } from "next-seo";
import { FC, PropsWithChildren } from "react";

const HAND_FONT = '"Caveat", "Comic Sans MS", cursive';

const RoughUnderline: FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 300 18"
    preserveAspectRatio="none"
    aria-hidden="true"
    className={`absolute inset-x-0 -bottom-2 h-3 w-full overflow-visible text-sky-400 ${className}`}
  >
    <path
      d="M3 10 C58 3 107 15 156 8 C207 2 248 14 297 6 M7 14 C74 9 132 17 194 11 C240 7 270 12 294 9"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.75"
    />
  </svg>
);

const SketchHeading: FC<PropsWithChildren<{ note: string; rotate?: string }>> = ({
  children,
  note,
  rotate = "-rotate-2",
}) => (
  <div className="relative mb-7 mt-16 md:mt-20">
    <h2 className="relative z-10 inline-block text-3xl font-bold tracking-[-0.045em] text-gray-900 d:text-white md:text-[2.6rem]">
      {children}
      <RoughUnderline />
    </h2>
    <span
      className={`mt-5 block w-fit text-2xl leading-none text-sky-600 d:text-sky-400 lg:absolute lg:-right-36 lg:top-2 lg:mt-0 ${rotate}`}
      style={{ fontFamily: HAND_FONT }}
      aria-hidden="true"
    >
      ← {note}
    </span>
  </div>
);

const ScribbleDivider: FC = () => (
  <svg
    viewBox="0 0 620 22"
    preserveAspectRatio="none"
    aria-hidden="true"
    className="my-12 h-5 w-full text-gray-400/60"
  >
    <path
      d="M2 12 C81 4 132 19 202 10 C282 1 345 18 425 9 C497 2 551 15 617 7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeDasharray="3 7"
    />
  </svg>
);

const TemporaryPost: FC = () => {
  const post = TEMP_BLOG_POST;
  const reduceMotion = useReducedMotion();

  return (
    <>
      <NextSeo
        title={`${post.title} — Aryan Vijaywargia`}
        description={post.excerpt}
        openGraph={{ title: post.title, description: post.excerpt, type: "article" }}
      />
      <ReadingProgress />
      <div className="relative overflow-hidden bg-[#fbfaf7] pt-20 text-slate-800 d:bg-[#17191f] d:text-slate-100">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(71,85,105,0.16)_1px,transparent_1.5px)] bg-[length:26px_26px] opacity-55 d:bg-[radial-gradient(circle,rgba(148,163,184,0.13)_1px,transparent_1.5px)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-44 top-36 h-96 w-96 rounded-full bg-sky-300/10 blur-3xl d:bg-sky-400/5"
        />

        <article className="relative">
          <header className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:px-8 md:pb-24 md:pt-16">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-10 flex flex-wrap items-center justify-between gap-5 md:mb-14">
                <Link
                  href="/blog"
                  className="group inline-flex min-h-[44px] items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 transition-colors hfa:text-sky-600 d:text-slate-400 d:hfa:text-sky-400"
                >
                  <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hfa:-translate-x-1" />
                  All writing
                </Link>
                <span
                  className="-rotate-2 border-2 border-sky-500 bg-sky-100 px-4 py-1 text-xl leading-none text-sky-800 shadow-[3px_3px_0_0_#38bdf8] d:bg-sky-950/60 d:text-sky-200"
                  style={{ fontFamily: HAND_FONT }}
                >
                  rough draft #01
                </span>
              </div>

              <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(25rem,0.85fr)] lg:items-center lg:gap-8">
                <div className="relative z-10">
                  <div className="mb-6 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 d:text-slate-400">
                    <time dateTime={post.dateTime}>{post.publishedAt}</time>
                    <span aria-hidden="true">/</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h1 className="max-w-3xl text-[clamp(3.7rem,8.5vw,7.4rem)] font-bold leading-[0.84] tracking-[-0.075em] text-slate-950 d:text-white">
                    The work
                    <br />
                    between the
                    <span className="relative ml-[0.12em] inline-block text-sky-500">
                      demos
                      <RoughUnderline className="-bottom-1 h-4" />
                    </span>
                    .
                  </h1>

                  <p className="mt-10 max-w-xl text-lg leading-relaxed text-slate-600 d:text-slate-300 md:text-xl">
                    {post.excerpt}
                  </p>
                  <p
                    className="ml-auto mt-6 w-fit rotate-2 text-2xl leading-none text-sky-600 d:text-sky-400"
                    style={{ fontFamily: HAND_FONT }}
                    aria-hidden="true"
                  >
                    the interesting stuff lives underneath ↗
                  </p>
                </div>

                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, rotate: 1.5, scale: 0.96 }}
                  animate={{ opacity: 1, rotate: -1, scale: 1 }}
                  transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : 0.25 }}
                  className="relative"
                >
                  <SketchSystemMap />
                </motion.div>
              </div>
            </motion.div>
          </header>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: reduceMotion ? 0 : 0.65 }}
            className="mx-auto max-w-[47rem] px-4 pb-28 md:px-8 md:pb-36"
          >
            <div className="relative text-[17px] leading-[1.9] text-slate-700 d:text-slate-300 md:text-lg">
              <div className="relative">
                <p className="text-xl font-medium leading-relaxed text-slate-900 d:text-slate-100 md:text-2xl">
                  A good demo compresses a complicated system into a clean moment. Click the button,
                  watch the agent think, see the answer arrive. It is useful theatre: the audience
                  should understand the idea before they understand the machinery.
                </p>
                <svg
                  viewBox="0 0 110 80"
                  aria-hidden="true"
                  className="absolute -left-28 top-6 hidden h-20 w-24 rotate-6 text-sky-500 lg:block"
                >
                  <path
                    d="M102 11 C65 15 38 28 20 57 M20 57 L21 38 M20 57 L39 57"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className="absolute -left-52 top-3 hidden w-28 -rotate-6 text-right text-2xl leading-none text-sky-600 d:text-sky-400 lg:block"
                  style={{ fontFamily: HAND_FONT }}
                  aria-hidden="true"
                >
                  the clean version
                </span>
              </div>

              <p className="mt-10">
                But most of the engineering begins after that moment works once. What happens when a
                request times out, a worker restarts, a tool replies twice, or a human takes an hour
                to approve the next step? The distance between a demo and a dependable product is
                mostly made of these unglamorous questions.
              </p>

              <SketchHeading note="users notice this">
                Reliability is part of the interface
              </SketchHeading>
              <p>
                Users do not experience a queue, checkpoint, or retry policy directly. They
                experience whether the product remembers what they asked, whether an action happens
                once, and whether they can safely return when something interrupts the flow.
              </p>

              <blockquote className="relative my-14 -rotate-1 bg-sky-100/80 px-7 py-8 text-2xl font-bold leading-snug tracking-[-0.025em] text-slate-900 d:bg-sky-950/45 d:text-white md:-mx-8 md:px-10 md:text-3xl">
                <svg
                  viewBox="0 0 640 150"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-sky-500"
                >
                  <path
                    d="M8 13 C154 2 491 5 632 17 C644 49 638 111 628 139 C482 151 156 147 11 136 C1 99 1 46 8 13Z M13 8 C187 17 484 0 637 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                </svg>
                <span className="relative">
                  The invisible work becomes visible the first time it is missing.
                </span>
              </blockquote>

              <SketchHeading note="ask before launch" rotate="rotate-2">
                Design the unhappy path early
              </SketchHeading>
              <p>
                I like asking failure questions while a feature is still small. Where is progress
                stored? Which operations can be repeated safely? What will the person operating this
                system see when it stalls? Those answers influence the architecture more usefully
                than a late pass called “hardening.”
              </p>

              <div className="my-10 grid gap-4 sm:grid-cols-3">
                {[
                  ["01", "Where is progress stored?"],
                  ["02", "Can this safely run twice?"],
                  ["03", "Who sees it stall?"],
                ].map(([number, question], index) => (
                  <motion.div
                    key={number}
                    initial={reduceMotion ? false : { opacity: 0, y: 12, rotate: index - 1 }}
                    whileInView={{ opacity: 1, y: 0, rotate: index - 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: reduceMotion ? 0 : 0.35, delay: index * 0.08 }}
                    className="relative min-h-[8.5rem] border-2 border-slate-700 bg-[#fffefb] p-4 d:border-slate-300 d:bg-[#20232b]"
                  >
                    <span className="mb-3 block font-mono text-[10px] text-sky-600 d:text-sky-400">
                      {number}
                    </span>
                    <span className="block text-sm font-semibold leading-snug text-slate-800 d:text-slate-100">
                      {question}
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-sky-400"
                    />
                  </motion.div>
                ))}
              </div>

              <p>
                This does not mean building every safeguard on day one. It means leaving the right
                seams: explicit state, useful events, and boundaries where a simple implementation
                can later become a durable one.
              </p>

              <SketchHeading note="document the seams">Keep the demo; show the work</SketchHeading>
              <p>
                The demo still matters. It gives the system a reason to exist and makes the outcome
                tangible. I just want to get better at documenting what comes next—the decisions,
                false starts, and quiet infrastructure that turn a promising interaction into
                something people can trust.
              </p>

              <ScribbleDivider />

              <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
                <p className="max-w-md font-mono text-[10px] uppercase leading-5 tracking-[0.14em] text-slate-500 d:text-slate-400">
                  Temporary first post. Replace the copy later; the sketch system can stay.
                </p>
                <span
                  className="-rotate-3 text-3xl leading-none text-sky-600 d:text-sky-400"
                  style={{ fontFamily: HAND_FONT }}
                  aria-hidden="true"
                >
                  — Aryan
                </span>
              </div>
            </div>
          </motion.div>
        </article>

        <nav
          className="relative border-t-2 border-dashed border-slate-300 d:border-slate-700"
          aria-label="Blog navigation"
        >
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-12 md:px-8 md:py-16">
            <Link
              href="/blog"
              className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold transition-colors hfa:text-sky-600 d:hfa:text-sky-400"
            >
              <ArrowLeftIcon className="h-4 w-4 transition-transform group-hfa:-translate-x-1" />{" "}
              Back to writing
            </Link>
            <Link
              href="mailto:aryanvijaywargia@gmail.com"
              className="group relative inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold transition-colors hfa:text-sky-600 d:hfa:text-sky-400"
            >
              Discuss this note{" "}
              <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hfa:-translate-y-0.5 group-hfa:translate-x-0.5" />
              <RoughUnderline className="scale-x-0 transition-transform duration-300 group-hfa:scale-x-100" />
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default TemporaryPost;
