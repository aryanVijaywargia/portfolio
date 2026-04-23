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
  const requestChatbot = useChatbot((state) => state.requestChatbot);

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

      {/* Email */}
      <Link
        href="mailto:aryanvijaywargia@gmail.com"
        className={clsx(
          "rounded p-2 text-gray-500 transition-colors d:text-gray-300 d:h:text-gray-50 md:h:text-gray-900",
          showNav ? "h:text-gray-200" : "h:text-gray-900"
        )}
      >
        <span className="sr-only">Email</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
          <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
        </svg>
      </Link>

      {/* Resume CTA */}
      <Link
        href="/resume"
        className="button-rainbow ml-4 hidden whitespace-nowrap px-4 py-1.5 text-sm font-medium tracking-tight text-gray-500 md:flex"
      >
        Resume
      </Link>
    </nav>
  );
};
