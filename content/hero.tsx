import { SiGo } from "@react-icons/all-files/si/SiGo";
import { SiTypescript } from "@react-icons/all-files/si/SiTypescript";
import { SiCsharp } from "@react-icons/all-files/si/SiCsharp";
import { SiPython } from "@react-icons/all-files/si/SiPython";
import { Link } from "components/link";

export const HERO = {
  pre: "Welcome to my site.",
  heading: (
    <>
      I'm <strong>Aryan Vijaywargia</strong>, a FullStack Engineer.
    </>
  ),
  tech: [
    {
      name: "Go",
      Icon: ({ className }) => <SiGo className={className} />,
    },
    {
      name: "C#",
      Icon: ({ className }) => <SiCsharp className={className} />,
    },
    {
      name: "TypeScript",
      Icon: ({ className }) => <SiTypescript className={className} />,
    },
    {
      name: "Python",
      Icon: ({ className }) => <SiPython className={className} />,
    },
  ] as const,
  body: (onWowClick?: () => void) => (
    <>
      I build the kind of backend infrastructure that AI agents and search platforms run on —
      durable execution engines, streaming protocol adapters, and CDC pipelines that make the
      hard parts feel{" "}
      <em
        className="relative cursor-pointer before:absolute b:bottom-0 b:-z-10 b:h-3 b:w-full b:-rotate-2 b:animate-hint-hint b:bg-pink-400/70 b:blur-sm d:b:bg-pink-600"
        onClick={async (e) => {
          const target = e.currentTarget;
          target.classList.remove("before:absolute");
          const party = (await import("party-js")).default;
          party.settings.respectReducedMotion = false;
          party.confetti(target, { count: 40 });
          onWowClick?.();
        }}
      >
        WOW!
      </em>
      .<span className="mt-4 block" />Currently a Senior Software Engineer at{" "}
      <Link target="_blank" href="https://www.gep.com/" className="underline hfa:text-sky-500">
        GEP Worldwide
      </Link>
      , where I work on agentic systems, platform reliability, and search infrastructure.
      <span className="mt-4 block" />
      Outside work, I’m usually travelling, reading non-fiction, swimming, or trying to keep a gym
      routine alive.
    </>
  ),
  cta1: {
    href: "/resume",
    name: "Resume",
  },
  cta2: {
    href: "mailto:aryanvijaywargia@gmail.com",
    name: "Contact Me",
  },
};
