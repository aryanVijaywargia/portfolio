import { useAchievementActions } from "components/achievements";
import { MoonIcon, StarIcon, SunIcon } from "@heroicons/react/24/solid";
import { SiGithub } from "@react-icons/all-files/si/SiGithub";
import { Link } from "components/link";
import { InteractiveTerminal } from "components/interactive-terminal";
import ToggleSwitch from "components/toggle-switch";
import { HERO } from "content/hero";
import { useTheme } from "next-themes";
import { FC, useEffect, useState } from "react";
import { useChatbot } from "components/_stores/chatbot-store";
import { DogIcon } from "components/icons/dog-icon";
import { AnimatedRoleHeading } from "components/animated-role-heading";

export const Hero: FC = () => {
  const { theme, setTheme } = useTheme();
  const [themeMounted, setThemeMounted] = useState(false);
  const requestChatbot = useChatbot((state) => state.requestChatbot);
  const { trackAchievementEvent } = useAchievementActions();

  useEffect(() => {
    setThemeMounted(true);
  }, []);

  const handleOpenChatbot = () => {
    // Scroll to terminal section
    const terminalSection = document.getElementById("terminal-section");
    if (terminalSection) {
      terminalSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    // Trigger chatbot after a short delay to let scroll complete
    setTimeout(
      () => {
        requestChatbot();
      },
      300
    );
  };

  const handleThemeToggle = (isDark: boolean) => {
    setTheme(isDark ? "dark" : "light");
    trackAchievementEvent({ type: "hero:theme-toggled" });
  };

  const handleWowClick = () => {
    trackAchievementEvent({ type: "hero:wow-clicked" });
  };

  return (
    <section className="hero relative min-h-[100svh] overflow-x-clip pb-16 md:pb-32 lg:flex lg:min-h-[calc(100svh+5rem)] lg:items-center lg:pb-0">
      {/* Top Action Bar */}
      <div className="absolute right-4 top-4 z-50 flex items-center gap-3 md:right-8 md:top-6">
        <Link
          target="_blank"
          href="https://github.com/aryanVijaywargia/portfolio"
          className="group flex h-10 w-10 items-center justify-center rounded-full border border-slate-300/60 bg-white/70 bg-clip-padding text-sm font-medium text-gray-600 backdrop-blur transition-all hfa:border-yellow-500/40 hfa:bg-yellow-500 hfa:text-white d:border-slate-400/15 d:bg-slate-900/60 d:text-slate-200 d:hfa:bg-yellow-500/90"
          data-tip="Star on GitHub"
        >
          <span className="sr-only">Star on GitHub</span>
          <StarIcon className="h-5 w-5 text-yellow-500 group-hfa:text-white" />
        </Link>
        <button
          onClick={handleOpenChatbot}
          className="group flex h-10 w-10 items-center justify-center rounded-full border border-slate-300/60 bg-white/70 bg-clip-padding text-sm font-medium text-gray-600 backdrop-blur transition-all hfa:border-sky-500/40 hfa:bg-sky-500 hfa:text-white d:border-slate-400/15 d:bg-slate-900/60 d:text-slate-200 d:hfa:bg-sky-500/90"
          data-tip="Chat with Byte"
          aria-label="Chat with Byte"
        >
          <DogIcon className="h-5 w-5 text-sky-500 group-hfa:text-white" />
        </button>
        <Link
          target="_blank"
          href="https://github.com/AryanVijaywargia"
          className="group flex h-10 w-10 items-center justify-center rounded-full border border-slate-300/60 bg-white/70 bg-clip-padding text-sm font-medium text-gray-600 backdrop-blur transition-all hfa:border-gray-900/40 hfa:bg-gray-900 hfa:text-white d:border-slate-400/15 d:bg-slate-900/60 d:text-slate-200 d:hfa:border-slate-300/30 d:hfa:bg-slate-800"
          data-tip="GitHub Profile"
        >
          <span className="sr-only">GitHub Profile</span>
          <SiGithub className="h-5 w-5" />
        </Link>
        <ToggleSwitch
          enabled={themeMounted && theme === "dark"}
          setEnabled={handleThemeToggle}
          enabledIcon={<MoonIcon className="h-3 w-3 text-slate-400" />}
          disabledIcon={<SunIcon className="h-4 w-4 text-orange-400" />}
        />
      </div>

      <div className="relative mx-auto flex max-w-6xl grid-cols-3 flex-col gap-8 gap-y-16 px-4 py-16 md:px-8 md:py-32 lg:grid lg:py-0">
        <section className="col-span-2">
          <header>
            <div className="heading-pre">{HERO.pre}</div>
            <AnimatedRoleHeading name={HERO.name} roles={HERO.roles} />
            <ul className="scrollbar-none -mx-4 mb-3 flex items-center gap-5 overflow-x-auto px-4 pb-2 text-[13px] font-medium sm:gap-6">
              {HERO.tech.map(({ name, Icon }) => (
                <li
                  className="flex items-center gap-2.5 text-slate-500 transition-colors hover:text-slate-900 d:text-slate-400 d:hover:text-slate-100"
                  key={name}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-semibold">{name}</span>
                </li>
              ))}
            </ul>
          </header>
          <main>
            <p className="mb-3 max-w-lg font-normal text-gray-500 d:text-gray-400 md:text-lg md:tracking-tight">
              {HERO.body(handleWowClick)}
            </p>

            <p className="mb-3 max-w-xl font-normal text-gray-500 md:text-lg md:tracking-tight"></p>
          </main>
          <footer className="mt-6 flex flex-wrap gap-4 md:gap-8">
            {HERO.cta1
              ? <Link
                  href={HERO.cta1.href}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-gradient-to-br from-cyan-500 to-blue-600 px-10 py-2.5 text-sm font-medium tracking-tight text-white shadow-[0_8px_24px_-8px_rgba(6,182,212,0.5),0_0_40px_-8px_rgba(59,130,246,0.3)] transition-all hfa:from-cyan-400 hfa:to-blue-500 hfa:shadow-[0_12px_32px_-8px_rgba(6,182,212,0.65),0_0_48px_-6px_rgba(59,130,246,0.5)] d:shadow-[0_8px_24px_-8px_rgba(6,182,212,0.6),0_0_40px_-8px_rgba(59,130,246,0.4)] d:hfa:shadow-[0_12px_32px_-8px_rgba(6,182,212,0.7),0_0_48px_-6px_rgba(59,130,246,0.55)] md:px-12"
                >
                  {HERO.cta1.name}
                </Link>
              : null}

            {HERO.cta2
              ? <Link
                  href={HERO.cta2.href}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-slate-300/70 bg-white/70 px-10 py-2.5 text-sm font-medium tracking-tight text-gray-600 backdrop-blur transition-all hfa:border-gray-900/40 hfa:text-gray-900 d:border-slate-400/20 d:bg-slate-900/60 d:text-slate-200 d:hfa:border-slate-300/40 d:hfa:bg-slate-900/80 d:hfa:text-slate-50 md:px-12"
                >
                  {HERO.cta2.name}
                </Link>
              : null}
          </footer>
        </section>
        <section className="relative md:h-[30rem]">
          <div className="relative flex h-full w-full min-w-0 flex-col gap-4 sm:min-w-[42rem] sm:pr-4 lg:absolute lg:-left-4 lg:top-28 lg:mr-4 lg:min-w-[34rem] lg:pr-8">
            <div id="terminal-section" className="relative flex h-full flex-col">
              <InteractiveTerminal language="tsx" />
              <div className="absolute -bottom-5 -right-5 -z-10 h-[calc(100%+1.25rem)] w-[calc(100%+1.25rem)] rounded-lg border border-gray-400/20 bg-gray-100/70 [mask-image:linear-gradient(-30deg,#fff_16.35%,rgb(255_255_255_/_0%)_61.66%)] d:border-gray-700/20 d:bg-gray-900/40"></div>
            </div>
            {/* Identity rail: outlined chips with leading colored dot - both themes */}
            <div className="relative z-20 mt-0.5 flex flex-nowrap items-center justify-end gap-1.5 whitespace-nowrap xl:gap-2">
              <span className="mr-0.5 shrink-0 font-mono text-[11px] uppercase tracking-[0.1em] text-slate-500 d:text-slate-500">
                also:
              </span>
              {[
                {
                  label: "Traveler",
                  dot: "#06b6d4",
                  text: "#0e7490",
                  textDark: "#67e8f9",
                  border: "rgba(6,182,212,0.35)",
                  bg: "rgba(6,182,212,0.08)",
                },
                {
                  label: "Reader",
                  dot: "#22c55e",
                  text: "#15803d",
                  textDark: "#86efac",
                  border: "rgba(34,197,94,0.35)",
                  bg: "rgba(34,197,94,0.08)",
                },
                {
                  label: "Lifter",
                  dot: "#f59e0b",
                  text: "#b45309",
                  textDark: "#fcd34d",
                  border: "rgba(245,158,11,0.35)",
                  bg: "rgba(245,158,11,0.08)",
                },
                {
                  label: "Swimmer",
                  dot: "#d946ef",
                  text: "#a21caf",
                  textDark: "#f0abfc",
                  border: "rgba(217,70,239,0.35)",
                  bg: "rgba(217,70,239,0.08)",
                },
                {
                  label: "Coffee Snob",
                  dot: "#7c3aed",
                  text: "#6d28d9",
                  textDark: "#c4b5fd",
                  border: "rgba(124,58,237,0.35)",
                  bg: "rgba(124,58,237,0.08)",
                },
              ].map(({ label, dot, text, textDark, border, bg }) => (
                <span
                  key={label}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-[3px] text-[11px] font-medium [color:var(--chip-text)] xl:gap-1.5 xl:px-2.5 xl:text-[12px] d:[color:var(--chip-text-dark)]"
                  style={
                    {
                      "--chip-text": text,
                      "--chip-text-dark": textDark,
                      borderColor: border,
                      backgroundColor: bg,
                    } as React.CSSProperties
                  }
                >
                  <span className="h-[5px] w-[5px] rounded-full" style={{ backgroundColor: dot }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>
        <div className="background pointer-events-none absolute inset-0 -z-30 select-none">
          {/* Layered backdrop: faded grid + cyan/violet/pink orbs (both themes) */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(100,116,139,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.06)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_30%,#000_30%,transparent_80%)] d:[background-image:linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)]"></div>
            <div className="hero-orb absolute -left-24 top-20 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,#0891b2_0%,transparent_70%)] opacity-20 blur-[80px] d:opacity-50"></div>
            <div className="hero-orb absolute -right-16 -top-10 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,#7c3aed_0%,transparent_70%)] opacity-15 blur-[80px] d:opacity-30"></div>
            <div className="hero-orb absolute -bottom-24 left-[38%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,#db2777_0%,transparent_70%)] opacity-10 blur-[80px] d:opacity-25"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
