import { SiPython } from "@react-icons/all-files/si/SiPython";
import { SiTensorflow } from "@react-icons/all-files/si/SiTensorflow";
import { SiTypescript } from "@react-icons/all-files/si/SiTypescript";
import { SiAngular } from "@react-icons/all-files/si/SiAngular";
import { Link } from "components/link";

export const HERO = {
  pre: "Welcome to my site.",
  heading: (
    <>
      I'm <strong>Aryan Vijaywargia</strong>, a Fullstack Engineer.
    </>
  ),
  tech: [
    {
      name: "Python",
      Icon: ({ className }) => <SiPython className={className} />,
      color: "#3776ab",
      bg: "#ffd43b",
    },
    {
      name: "TensorFlow",
      Icon: ({ className }) => <SiTensorflow className={className} />,
      color: "#ffffff",
      bg: "#ff6f00",
    },
    {
      name: "TypeScript",
      Icon: ({ className }) => <SiTypescript className={className} />,
      color: "#ffffff",
      bg: "#3178c6",
    },
    {
      name: "Angular",
      Icon: ({ className }) => <SiAngular className={className} />,
      color: "#ffffff",
      bg: "#dd0031",
    },
  ] as const,
  body: (onWowClick?: () => void) => (
    <>
      I love building intelligent systems that take things to the next level - creating ML models
      for real-world applications, automated data pipelines, and stunning user-experiences that make
      you feel{" "}
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
      .<span className="mt-4 block" />I am always keen to learn and explore new technologies,
      frameworks and programming languages. Currently, I'm exploring{" "}
      <Link target="_blank" href="https://pytorch.org/" className="underline hfa:text-sky-500">
        PyTorch
      </Link>{" "}
      and{" "}
      <Link href="https://mlflow.org" target="_blank" className="underline hfa:text-sky-500">
        MLFlow
      </Link>
      .
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
