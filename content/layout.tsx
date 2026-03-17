import AryanLogo from "public/logo.svg";
import { HomeIcon, UserIcon, BriefcaseIcon, CodeBracketIcon } from "@heroicons/react/24/solid";
import { FC } from "react";

type NavItem = {
  href: string;
  title: string;
  alt: string;
  desktop: boolean;
  Icon?: FC<{ className?: string }>;
};

export const HEADER = {
  logo: {
    href: "/",
    title: <AryanLogo />,
    alt: "Aryan Vijaywargia Logo",
  },
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
  ] as NavItem[],
  profileNav: [],
};
