import { SiGo } from "@react-icons/all-files/si/SiGo";
import { SiTypescript } from "@react-icons/all-files/si/SiTypescript";
import { SiCsharp } from "@react-icons/all-files/si/SiCsharp";
import { SiPython } from "@react-icons/all-files/si/SiPython";
import { Link } from "components/link";

export const HERO = {
  pre: "Welcome to my site.",
  heading: (
    <>
      I'm <strong>Aryan Vijaywargia</strong>, a Software Engineer.
    </>
  ),
  tech: [
    {
      name: "Go",
      Icon: ({ className }) => <SiGo className={className} />,
      color: "#ffffff",
      bg: "#00add8",
    },
    {
      name: "C#",
      Icon: ({ className }) => <SiCsharp className={className} />,
      color: "#ffffff",
      bg: "#512bd4",
    },
    {
      name: "TypeScript",
      Icon: ({ className }) => <SiTypescript className={className} />,
      color: "#ffffff",
      bg: "#3178c6",
    },
    {
      name: "Python",
      Icon: ({ className }) => <SiPython className={className} />,
      color: "#3776ab",
      bg: "#ffd43b",
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
      , where I work on the Leo Agentic Runtime and search platform. On the side, I'm building{" "}
      <Link target="_blank" href="https://www.continua.in/" className="underline hfa:text-sky-500">
        Continua
      </Link>
      , a durable execution engine for AI agents.
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
