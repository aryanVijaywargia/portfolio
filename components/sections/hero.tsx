import { useAchievementActions } from "components/achievements";
import { MoonIcon, StarIcon, SunIcon } from "@heroicons/react/24/solid";
import { SiGithub } from "@react-icons/all-files/si/SiGithub";
import { Link } from "components/link";
import { Badge } from "components/badge";
import { InteractiveTerminal } from "components/interactive-terminal";
import ToggleSwitch from "components/toggle-switch";
import { HERO } from "content/hero";
import { useTheme } from "next-themes";
import { FC, useEffect, useState } from "react";
import { useChatbot } from "components/_stores/chatbot-store";
import { DogIcon } from "components/icons/dog-icon";

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
          href="https://github.com/AryanVijaywargia"
          className="group flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-400/50 bg-gray-100 bg-clip-padding text-sm font-medium text-gray-600 transition-all hfa:border-yellow-500/30 hfa:bg-yellow-500 hfa:text-white d:border-slate-400/15 d:bg-slate-900/60 d:text-slate-200 d:backdrop-blur d:hfa:border-yellow-500/40 d:hfa:bg-yellow-500/90"
          data-tip="Star on GitHub"
        >
          <span className="sr-only">Star on GitHub</span>
          <StarIcon className="h-5 w-5 text-yellow-500 group-hfa:text-white" />
        </Link>
        <button
          onClick={handleOpenChatbot}
          className="group flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-400/50 bg-gray-100 bg-clip-padding text-sm font-medium text-gray-600 transition-all hfa:border-sky-500/30 hfa:bg-sky-500 hfa:text-white d:border-slate-400/15 d:bg-slate-900/60 d:text-slate-200 d:backdrop-blur d:hfa:border-sky-500/40 d:hfa:bg-sky-500/90"
          data-tip="Chat with Byte"
          aria-label="Chat with Byte"
        >
          <DogIcon className="h-5 w-5 text-sky-500 group-hfa:text-white" />
        </button>
        <Link
          target="_blank"
          href="https://github.com/AryanVijaywargia"
          className="group flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-400/50 bg-gray-100 bg-clip-padding text-sm font-medium text-gray-600 transition-all hfa:border-gray-900/30 hfa:bg-gray-900 hfa:text-white d:border-slate-400/15 d:bg-slate-900/60 d:text-slate-200 d:backdrop-blur d:hfa:border-slate-300/30 d:hfa:bg-slate-800"
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
            <h1 className="heading-hero ">{HERO.heading}</h1>
            {/* <h2 className="heading-hero ">
                <Typewriter
                  loop={false}
                  items={[
                    <>
                      I'm a <u>Fullstack</u> developer
                    </>,

                    <>I build websites & web apps</>,
                  ]}
                />
              </h2>*/}
            <ul className="scrollbar-none -mx-4 mb-2 flex items-center gap-6 overflow-x-auto px-4 pb-2 text-[15px] font-medium d:gap-2">
              {HERO.tech.map(({ name, Icon }) => (
                <li
                  className="flex items-center gap-2 text-gray-500 d:gap-2 d:rounded-full d:border d:border-slate-400/15 d:bg-slate-900/50 d:px-3.5 d:py-2 d:text-[13px] d:text-slate-300 d:backdrop-blur d:transition-colors d:hover:border-cyan-400/40 d:hover:text-slate-50"
                  key={name}
                >
                  <Icon className="h-7 w-7 text-gray-400 d:h-5 d:w-5 d:text-slate-200" />
                  {name}
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
                  className="button-rainbow inline-flex whitespace-nowrap bg-gray-800 px-10 py-2.5 text-sm font-medium tracking-tight text-gray-50 hfa:border-gray-300/90 hfa:bg-gray-900 hfa:text-white d:border-transparent d:bg-gradient-to-br d:from-cyan-500 d:to-blue-600 d:text-white d:shadow-[0_8px_24px_-8px_rgba(6,182,212,0.6),0_0_40px_-8px_rgba(59,130,246,0.4)] d:hfa:border-transparent d:hfa:from-cyan-400 d:hfa:to-blue-500 d:hfa:text-white d:hfa:shadow-[0_12px_32px_-8px_rgba(6,182,212,0.7),0_0_48px_-6px_rgba(59,130,246,0.55)] md:px-12"
                >
                  {HERO.cta1.name}
                </Link>
              : null}

            {HERO.cta2
              ? <Link
                  href={HERO.cta2.href}
                  className="button-border inline-flex whitespace-nowrap bg-white/90 px-10 py-2.5 text-sm font-medium tracking-tight text-gray-500 transition-all hfa:border-gray-900/70 hfa:bg-white/90 hfa:text-gray-900 d:border-slate-400/20 d:bg-slate-900/60 d:text-slate-200 d:backdrop-blur d:hfa:border-slate-300/40 d:hfa:bg-slate-900/80 d:hfa:text-slate-50 md:px-12"
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
            <div className="relative z-20 mt-0.5 flex flex-wrap items-center justify-end gap-1.5 d:hidden">
              <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.1em] text-gray-400">
                also:
              </span>
              <Badge style="info">Hiker</Badge>
              <Badge style="success">Chef</Badge>
              <Badge style="warning">Runner</Badge>
              <Badge style="accent">Mixologist</Badge>
              <Badge style="plain">Space Enthusiast</Badge>
            </div>
            {/* Dark-mode identity rail: outlined chips with leading colored dot */}
            <div className="relative z-20 mt-0.5 hidden flex-wrap items-center justify-end gap-2.5 d:flex">
              <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.1em] text-slate-500">
                also:
              </span>
              {[
                { label: "Hiker", color: "#67e8f9", border: "rgba(103,232,249,0.3)", bg: "rgba(6,182,212,0.06)" },
                { label: "Chef", color: "#86efac", border: "rgba(134,239,172,0.3)", bg: "rgba(34,197,94,0.06)" },
                { label: "Runner", color: "#fcd34d", border: "rgba(252,211,77,0.3)", bg: "rgba(245,158,11,0.06)" },
                { label: "Mixologist", color: "#f0abfc", border: "rgba(240,171,252,0.3)", bg: "rgba(217,70,239,0.06)" },
                { label: "Space Enthusiast", color: "#c4b5fd", border: "rgba(196,181,253,0.3)", bg: "rgba(124,58,237,0.06)" },
              ].map(({ label, color, border, bg }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[12px] font-medium"
                  style={{ color, borderColor: border, backgroundColor: bg }}
                >
                  <span
                    className="h-[5px] w-[5px] rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>
        <div className="background pointer-events-none absolute inset-0 -z-30 select-none">
          <div className="relative left-1/2 top-1/2 h-2/3 w-1/2 -translate-y-[30%] rounded-full bg-gradient-radial from-emerald-600/30 to-sky-600/5 blur-2xl d:hidden"></div>
          {/* Dark-mode layered backdrop: faded grid + cyan/violet/pink orbs */}
          <div className="absolute inset-0 hidden d:block">
            <div
              className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_30%,#000_30%,transparent_80%)]"
            ></div>
            <div className="absolute -left-24 top-20 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,#0891b2_0%,transparent_70%)] opacity-50 blur-[80px]"></div>
            <div className="absolute -right-16 -top-10 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,#7c3aed_0%,transparent_70%)] opacity-30 blur-[80px]"></div>
            <div className="absolute -bottom-24 left-[38%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,#db2777_0%,transparent_70%)] opacity-25 blur-[80px]"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
