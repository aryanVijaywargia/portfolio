import {
  HomeIcon,
  UserIcon,
  BriefcaseIcon,
  CodeBracketIcon,
  EnvelopeIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";
import { FC } from "react";

type NavItem = {
  href: string;
  title: string;
  alt: string;
  desktop: boolean;
  Icon?: FC<{ className?: string }>;
};

export const HEADER = {
  nav: [
    {
      href: "/",
      title: "Home",
      alt: "Country roads..",
      desktop: false,
      Icon: HomeIcon,
    },
    {
      href: "/#about",
      title: "About",
      alt: "More about me.",
      desktop: true,
      Icon: UserIcon,
    },
    {
      href: "/#experience",
      title: "Experience",
      alt: "My work experience.",
      desktop: true,
      Icon: BriefcaseIcon,
    },
    {
      href: "/#portfolio",
      title: "Projects",
      alt: "Work I've done.",
      desktop: true,
      Icon: CodeBracketIcon,
    },
    {
      href: "/#contact",
      title: "Contact",
      alt: "Get in touch.",
      desktop: true,
      Icon: EnvelopeIcon,
    },
    {
      href: "/resume",
      title: "Resume",
      alt: "Experience, in detail.",
      desktop: false,
      Icon: DocumentTextIcon,
    },
  ] as NavItem[],
  profileNav: [],
};
