import clsx from "clsx";
import Link from "next/link";
import { FC } from "react";
import { SiGithub } from "@react-icons/all-files/si/SiGithub";
import { StarIcon } from "@heroicons/react/24/solid";
import { useAchievementActions } from "components/achievements";
import { DogIcon } from "components/icons/dog-icon";
import { InteractiveTerminal } from "components/interactive-terminal";
import type { ScratchpadNote } from "lib/scratchpad";
import { V2_HERO, V2_IDENTITY_CHIPS } from "content/v2";
import { V2Container, V2Eyebrow, hueVars } from "components/v2/primitives";
import { V2ThemeSwitch, V2ThemeToggle } from "components/v2/theme-toggle";
import { useOpenChatbot } from "components/v2/use-open-chatbot";
import { useRoleCycle } from "components/v2/use-role-cycle";

/* The v1 hero draws its action bar as round bordered buttons over a blurred
   surface — a standalone cluster, quite unlike the bare icons in the header.
   Each control keeps its own hover colour, as it does there. */
const RAIL_BUTTON_CLASS =
  "group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border " +
  "border-[rgb(var(--v2-line-2))] bg-[rgb(var(--v2-surface)/0.7)] bg-clip-padding " +
  "backdrop-blur transition-all";

const PARAGRAPH_CLASS =
  "mb-4 max-w-[34rem] text-[15.5px] leading-[1.72] text-[rgb(var(--v2-fg-3))] v2sm:text-[16.5px]";

/** Confetti burst, preserved from the v1 hero. */
const WowText: FC<{ onFire?: () => void }> = ({ onFire }) => (
  <em
    className="cursor-pointer border-b-2 border-[rgb(var(--v2-accent))] not-italic text-[rgb(var(--v2-fg))] italic"
    onClick={async (event) => {
      const target = event.currentTarget;
      const party = (await import("party-js")).default;
      party.settings.respectReducedMotion = false;
      party.confetti(target, { count: 40 });
      onFire?.();
    }}
  >
    WOW!
  </em>
);

type V2HeroProps = {
  initialScratchpadNotes: ScratchpadNote[] | null;
};

export const V2Hero: FC<V2HeroProps> = ({ initialScratchpadNotes }) => {
  const { trackAchievementEvent } = useAchievementActions();
  const openChatbot = useOpenChatbot();
  const {
    lead: roleLead,
    suffix: roleSuffix,
    label: roleLabel,
    opacity: roleOpacity,
    fadeMs,
  } = useRoleCycle(V2_HERO.roles, V2_HERO.roleSuffix);

  return (
    /* Fills the viewport like the v1 hero, plus the 5rem the header occupies:
       the header parks at the foot of the hero and rises as it scrolls away, so
       it needs that much dead space to travel through.

       On small screens the hero is content-taller than the viewport, so that
       min-height buys nothing and the parked header landed on top of the CTAs.
       The padding reserves the bar's own height there instead. */
    <section
      id="top"
      data-screen-label="Hero"
      className="relative flex min-h-[100svh] flex-col justify-center pb-[calc(var(--v2-header-h)+2.5rem)] pt-16 v2md:min-h-[calc(100svh+5rem)] v2md:pb-[60px]"
    >
      <V2Container>
        {/* Action rail — mirrors the v1 hero's controls, restyled. */}
        <div className="absolute right-[var(--v2-gutter)] top-4 z-50 flex items-center gap-3 v2md:top-6">
          <a
            href="https://github.com/aryanVijaywargia/portfolio"
            target="_blank"
            rel="noreferrer"
            title="Star on GitHub"
            aria-label="Star on GitHub"
            className={clsx(
              RAIL_BUTTON_CLASS,
              "hover:border-[rgb(var(--v2-hue-brass)/0.4)] hover:bg-[rgb(var(--v2-hue-brass))]"
            )}
          >
            <StarIcon className="h-5 w-5 text-[rgb(var(--v2-hue-brass))] group-hover:text-[rgb(var(--v2-bg))]" />
          </a>
          <button
            type="button"
            onClick={openChatbot}
            title="Chat with Byte"
            aria-label="Chat with Byte"
            className={clsx(
              RAIL_BUTTON_CLASS,
              "hover:border-[rgb(var(--v2-accent)/0.4)] hover:bg-[rgb(var(--v2-accent))]"
            )}
          >
            <DogIcon className="h-5 w-5 text-[rgb(var(--v2-accent))] group-hover:text-[rgb(var(--v2-btn-fg))]" />
          </button>
          <a
            href="https://github.com/AryanVijaywargia"
            target="_blank"
            rel="noreferrer"
            title="GitHub profile"
            aria-label="GitHub profile"
            className={clsx(
              RAIL_BUTTON_CLASS,
              "hidden v2sm:flex",
              "hover:border-[rgb(var(--v2-fg)/0.4)] hover:bg-[rgb(var(--v2-fg))]"
            )}
          >
            <SiGithub className="h-5 w-5 text-[rgb(var(--v2-fg-2))] group-hover:text-[rgb(var(--v2-bg))]" />
          </a>
          {/* Two forms of one control. Below v2sm the rail is three round
              buttons and the toggle joins them as a fourth; from v2sm up it is
              the sliding track, which is what the wide layout has always
              shown. Only one is ever visible. */}
          <V2ThemeToggle
            className={clsx(
              RAIL_BUTTON_CLASS,
              "v2sm:hidden",
              "hover:border-[rgb(var(--v2-fg)/0.4)] hover:bg-[rgb(var(--v2-fg))]"
            )}
            glyphClassName="text-[rgb(var(--v2-fg-2))] group-hover:text-[rgb(var(--v2-bg))]"
          />
          <V2ThemeSwitch className="hidden v2sm:block" />
        </div>

        <div className="v2-hero-grid grid grid-cols-1 items-start v2md:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] v2md:gap-x-10">
          <div className="v2-hero-lede v2-hero-copy">
            <div className="mb-6 flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--v2-accent))]" />
              <V2Eyebrow section="hero" />
            </div>

            <h1
              className="v2-hero-heading text-[length:var(--v2-h1-size)] font-bold leading-[1.04] tracking-[var(--v2-h1-tracking)] text-[rgb(var(--v2-fg))]"
              aria-label={`${V2_HERO.greeting} an ${V2_HERO.roleSuffix}.`}
            >
              {/* Three lines on wide screens — the two authored name lines and
                  the role — and two below v2md, where the name runs together on
                  one line (see styles/v2-theme.css). Each is nowrap either way,
                  so a longer role changes the type size, never the line count. */}
              <span aria-hidden="true">
                {/* The trailing space is inert while these are blocks — it
                    collapses at the end of a line — and becomes the word gap
                    when the narrow-screen rule runs them together. */}
                {V2_HERO.greetingLines.map((line) => (
                  <span key={line} className="v2-hero-greeting block whitespace-nowrap">
                    {line}{" "}
                  </span>
                ))}
                <span
                  className="block whitespace-nowrap transition-opacity ease-linear"
                  style={{ opacity: roleOpacity, transitionDuration: `${fadeMs}ms` }}
                >
                  {roleLead} {roleSuffix}
                  <span className="text-[rgb(var(--v2-accent))]">.</span>
                </span>
              </span>
            </h1>

            <div className="mt-3.5 font-[family-name:var(--v2-font-mono)] text-[11px] uppercase tracking-[0.16em] text-[rgb(var(--v2-fg-4))] [display:var(--v2-hero-strapline)]">
              {V2_HERO.strapline}
            </div>

            {/* Hairline grid: 1px gaps over a line-coloured backing plate. */}
            <div className="my-7 grid grid-cols-2 gap-px border border-[rgb(var(--v2-line))] bg-[rgb(var(--v2-line))] v2sm:grid-cols-4">
              {V2_HERO.stack.map((tech) => (
                <span
                  key={tech}
                  className="bg-[rgb(var(--v2-surface))] px-3 py-[11px] font-[family-name:var(--v2-font-mono)] text-[11.5px] text-[rgb(var(--v2-fg-2))]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Terminal column. On small screens this sits directly under the
              stack grid — the terminal is the thing worth showing early, and
              the prose reads better once it has been seen. The offset keeps it
              optically centred against the taller text column on wide ones. */}
          <div className="v2-hero-terminal mt-2 min-w-0 v2md:mt-[104px]">
            {/* The terminal manages its own height across its modes; the
                frame only scopes the v2 skin. */}
            <div id="terminal-section" className="v2-terminal-frame flex flex-col">
              <InteractiveTerminal language="tsx" initialScratchpadNotes={initialScratchpadNotes} />
            </div>

            <div className="scrollbar-none -mx-[var(--v2-gutter)] mt-4 flex items-center justify-start gap-1.5 overflow-x-auto px-[var(--v2-gutter)] v2md:mx-0 v2md:px-0 v2md:[&>*:first-child]:ml-auto">
              <span className="mr-0.5 hidden self-center font-[family-name:var(--v2-font-mono)] text-[10px] uppercase tracking-[0.18em] text-[rgb(var(--v2-fg-4))] v2md:inline">
                also:
              </span>
              {V2_IDENTITY_CHIPS.map(({ label, hue }) => (
                <span
                  key={label}
                  style={hueVars(hue)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-[var(--v2-radius-sm)] border border-[rgb(var(--hue)/0.42)] bg-[rgb(var(--hue)/0.1)] px-2 py-[3px] text-[11px] font-medium text-[rgb(var(--hue-text))]"
                >
                  <span className="h-[5px] w-[5px] rounded-full bg-[rgb(var(--hue))]" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="v2-hero-body mt-9 v2md:mt-0">
            <p className={PARAGRAPH_CLASS}>
              I build cool things on the internet — backends, side projects, and the occasional
              experiment that ends in{" "}
              <WowText onFire={() => trackAchievementEvent({ type: "hero:wow-clicked" })} />{" "}
              I&apos;m stack-agnostic: Go one week, Python the next, something new after that. The
              hard part is figuring out what to build; the rest is just prompting.
            </p>
            <p className={PARAGRAPH_CLASS}>
              Currently a Senior Software Engineer at{" "}
              <a
                href="https://www.gep.com/"
                target="_blank"
                rel="noreferrer"
                className="border-b border-[rgb(var(--v2-line-2))] text-[rgb(var(--v2-fg))]"
              >
                GEP Worldwide
              </a>
              , shipping the kind of stuff I&apos;d nerd out about on a weekend anyway.
            </p>
            <p className={clsx(PARAGRAPH_CLASS, "!mb-7")}>
              Outside work, I&apos;m usually travelling, reading non-fiction, swimming, or trying to
              keep a gym routine alive.
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <Link href={V2_HERO.cta.primary.href}>
                <a className="inline-flex items-center rounded-[var(--v2-radius-sm)] bg-[rgb(var(--v2-btn-bg))] px-[var(--v2-btn-px)] py-[var(--v2-btn-py)] text-sm font-[number:var(--v2-btn-weight)] tracking-[var(--v2-btn-tracking)] text-[rgb(var(--v2-btn-fg))]">
                  {V2_HERO.cta.primary.label}
                </a>
              </Link>
              <a
                href={V2_HERO.cta.secondary.href}
                className="inline-flex items-center rounded-[var(--v2-radius-sm)] border border-[rgb(var(--v2-line-2))] px-[26px] py-[13px] text-sm font-medium text-[rgb(var(--v2-fg))]"
              >
                {V2_HERO.cta.secondary.label}
              </a>
            </div>
          </div>
        </div>
      </V2Container>
    </section>
  );
};
