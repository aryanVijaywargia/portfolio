import { SiGithub } from "@react-icons/all-files/si/SiGithub";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { Link } from "components/link";
import clsx from "clsx";
import DarkmodeIcon from "components/darkmode-icon";
import { useTheme } from "next-themes";
import { useChatbot } from "components/_stores/chatbot-store";
import { FC } from "react";

type ProfileNavProps = {
  showNav: boolean;
};

export const ProfileNav: FC<ProfileNavProps> = ({ showNav }) => {
  const { theme, setTheme } = useTheme();
  const { openChat } = useChatbot();

  return (
    <nav className="z-10 ml-auto flex gap-1 pl-4">
      {/*<div className="my-2 mx-4 border-l border-l-gray-200"></div>*/}
      <button
        type="button"
        onClick={openChat}
        className={clsx(
          "rounded p-2 text-gray-500 transition-colors d:text-gray-300 d:h:text-gray-50 md:h:text-gray-900",
          showNav ? "h:text-gray-200" : "h:text-gray-900"
        )}
        data-tip="Chat with Byte"
        aria-label="Chat with Byte"
      >
        <span className="sr-only">Chat with Byte</span>
        <ChatBubbleLeftRightIcon className="h-5 w-5" />
      </button>
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
