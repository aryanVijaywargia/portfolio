// @ts-ignore
import heroCode from "!!raw-loader!content/code-blocks/hero.tsx"; // Adding `!!` to a request will disable all loaders specified in the configuration
import { SiPython } from "@react-icons/all-files/si/SiPython";
import { SiTensorflow } from "@react-icons/all-files/si/SiTensorflow";
import { SiTypescript } from "@react-icons/all-files/si/SiTypescript";
import { SiAngular } from "@react-icons/all-files/si/SiAngular";
import { Link } from "components/link";
import party from "party-js";

export const HERO = {
  pre: "Welcome to my site.",
  heading: (
    <>
      I'm <strong>Aryan Vijaywargia</strong>, a Machine Learning Engineer.
    </>
  ),
  tech: [
    {
      name: "Python",
      Icon: ({ className }) => <SiPython className={className} />,
    },
    {
      name: "TensorFlow",
      Icon: ({ className }) => <SiTensorflow className={className} />,
    },
    {
      name: "TypeScript",
      Icon: ({ className }) => <SiTypescript className={className} />,
    },
    {
      name: "Angular",
      Icon: ({ className }) => <SiAngular className={className} />,
    },
  ] as const,
  body: (
    <>
      I love building intelligent systems that take things to the next level - creating ML models for
      real-world applications, automated data pipelines, and stunning user-experiences
      that make you feel{" "}
      <em
        className="relative cursor-pointer before:absolute b:bottom-0 b:-z-10 b:h-3 b:w-full b:-rotate-2 b:animate-hint-hint b:bg-pink-400/70 b:blur-sm d:b:bg-pink-600"
        onClick={(e) => {
          e.currentTarget.classList.remove("before:absolute");
          party.confetti(e.currentTarget, { count: 40 });
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
    href: "mailto:aryanvijaywargia@gmail.com",
    name: "Let's Work",
  },
  cta2: {
    href: "/resume",
    name: "Resume",
  },
  code: `${heroCode}`,
};
