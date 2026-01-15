import { SiGithub } from "@react-icons/all-files/si/SiGithub";
import { SiLinkedin } from "@react-icons/all-files/si/SiLinkedin";
import { SiTwitter } from "@react-icons/all-files/si/SiTwitter";

export const SOCIAL_ACCOUNTS = {
  github: {
    name: "GitHub",
    href: "https://github.com/AryanVijaywargia",
    Icon: ({ className = "" }) => <SiGithub className={className} />,
  },

  twitter: {
    name: "Twitter",
    href: "https://twitter.com/AryanVijaywargia",
    Icon: ({ className = "" }) => <SiTwitter className={className} />,
  },
  linkedin: {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/aryan-vijaywargia/",
    Icon: ({ className = "" }) => <SiLinkedin className={className} />,
  },
};
