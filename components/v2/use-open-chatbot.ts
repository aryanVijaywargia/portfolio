import { useCallback } from "react";
import { useChatbot } from "components/_stores/chatbot-store";

/**
 * Opens Byte in the terminal, scrolling it into view first.
 *
 * The v1 site exposes this from both the header and the hero, so the delay that
 * lets the smooth scroll finish before the chatbot is requested lives here
 * rather than being written out at each call site.
 */
export const useOpenChatbot = () => {
  const requestChatbot = useChatbot((state) => state.requestChatbot);

  return useCallback(() => {
    document.getElementById("terminal-section")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    window.setTimeout(() => requestChatbot(), 300);
  }, [requestChatbot]);
};
