import { SiGithub } from "@react-icons/all-files/si/SiGithub";
import { SiLinkedin } from "@react-icons/all-files/si/SiLinkedin";
import { EnvelopeIcon } from "@heroicons/react/24/solid";

export const SOCIAL_ACCOUNTS = {
  github: {
    name: "GitHub",
    href: "https://github.com/AryanVijaywargia",
    Icon: ({ className = "" }) => <SiGithub className={className} />,
  },

  linkedin: {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/aryan-vijaywargia/",
    Icon: ({ className = "" }) => <SiLinkedin className={className} />,
  },
  email: {
    name: "Email",
    href: "mailto:aryanvijaywargia@gmail.com",
    Icon: ({ className = "" }) => <EnvelopeIcon className={className} />,
  },
};
