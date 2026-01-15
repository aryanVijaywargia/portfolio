import { SiGithub } from "@react-icons/all-files/si/SiGithub";
import { Link } from "components/link";
import clsx from "clsx";
import DarkmodeIcon from "components/darkmode-icon";
import { useTheme } from "next-themes";
import { FC } from "react";
import { useChatbot } from "components/_stores/chatbot-store";
import { DogIcon } from "components/icons/dog-icon";

type ProfileNavProps = {
  showNav: boolean;
};

export const ProfileNav: FC<ProfileNavProps> = ({ showNav }) => {
  const { theme, setTheme } = useTheme();
  const { requestChatbot } = useChatbot();

  const handleOpenChatbot = () => {
    // Scroll to terminal section
    const terminalSection = document.getElementById("terminal-section");
    if (terminalSection) {
      terminalSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    // Trigger chatbot after a short delay to let scroll complete
    setTimeout(() => {
      requestChatbot();
    }, 300);
  };

  return (
    <nav className="z-10 ml-auto flex items-center gap-2 pl-4">
      {/* Byte Chatbot Button */}
      <button
        type="button"
        onClick={handleOpenChatbot}
        aria-label="Chat with Byte"
        className={clsx(
          "rounded p-2 text-sky-500 transition-colors d:text-sky-400 d:h:text-sky-300 md:h:text-sky-600",
          showNav ? "h:text-sky-300" : "h:text-sky-600"
        )}
      >
        <span className="sr-only">Chat with Byte</span>
        <DogIcon className="h-5 w-5" />
      </button>

      {/* Theme Toggle */}
      <button
        type="button"
        className={clsx(
          "rounded p-2 text-gray-500 transition-colors d:text-gray-300 d:h:text-gray-50 md:h:text-gray-900",
          showNav ? "h:text-gray-200" : "h:text-gray-900"
        )}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <span className="sr-only">Switch Color Theme</span>
        <DarkmodeIcon />
      </button>

      {/* GitHub Link */}
      <Link
        href="https://github.com/AryanVijaywargia"
        className={clsx(
          "rounded p-2 text-gray-500 transition-colors d:text-gray-300 d:h:text-gray-50 md:h:text-gray-900",
          showNav ? "h:text-gray-200" : "h:text-gray-900"
        )}
      >
        <span className="sr-only">Github</span>
        <SiGithub className="h-5 w-5" />
      </Link>

      {/* Contact CTA */}
      <Link
        target="_blank"
        href="mailto:aryanvijaywargia@gmail.com"
        className="button-rainbow ml-4 hidden whitespace-nowrap px-4 py-1.5 text-sm font-medium tracking-tight text-gray-500 md:flex"
      >
        Lets work
      </Link>
    </nav>
  );
};
