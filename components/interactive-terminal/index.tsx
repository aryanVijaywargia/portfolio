import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "./terminal";
import { TerminalChatbot } from "./terminal-chatbot";
import { CopyButton } from "components/copy-button";
import { Code, CodeGroupProps } from "components/typography/code";
import { useChatbot } from "components/_stores/chatbot-store";

type InteractiveTerminalProps = {
  code: string | string[];
  language: CodeGroupProps["language"];
};

export const InteractiveTerminal: FC<InteractiveTerminalProps> = ({ code, language }) => {
  const [mode, setMode] = useState<"terminal" | "editor" | "chatbot">("terminal");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);
  const { triggerChatbot, clearTrigger, closeChat } = useChatbot();

  const handleSwitchToEditor = () => {
    setMode("editor");
  };

  const handleSwitchToTerminal = () => {
    setMode("terminal");
  };

  const handleSwitchToChatbot = () => {
    setMode("chatbot");
    setIsExpanded(true);
  };

  const handleExitChatbot = () => {
    setMode("terminal");
    setIsExpanded(false);
    closeChat();
    clearTrigger();
  };

  const handleMaximizeTerminal = () => {
    setIsTerminalMaximized(true);
  };

  const handleMinimizeTerminal = () => {
    setIsTerminalMaximized(false);
  };

  return (
    <>
      {/* Expanded Chatbot Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={handleExitChatbot}
          >
            <motion.figure
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="terminal-window relative flex h-[80vh] w-[90vw] max-w-2xl flex-col overflow-hidden rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* macOS Window Title Bar */}
              <header className="terminal-titlebar flex h-8 items-center rounded-t-lg border-b border-[#2a2a2a] bg-[#3c3c3c] px-3">
                {/* Traffic Light Buttons */}
                <div className="flex items-center gap-2">
                  {/* Red - Close */}
                  <button
                    onClick={handleExitChatbot}
                    className="traffic-light group flex h-3 w-3 cursor-pointer items-center justify-center rounded-full bg-[#ff5f57]"
                    aria-label="Close"
                  >
                    <svg
                      className="h-2 w-2 text-[#4a0002] opacity-0 group-hover:opacity-100"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                    >
                      <path d="M6 4.586L9.293 1.293a1 1 0 111.414 1.414L7.414 6l3.293 3.293a1 1 0 01-1.414 1.414L6 7.414l-3.293 3.293a1 1 0 01-1.414-1.414L4.586 6 1.293 2.707a1 1 0 011.414-1.414L6 4.586z" />
                    </svg>
                  </button>
                  {/* Yellow - Minimize */}
                  <button
                    className="traffic-light group flex h-3 w-3 items-center justify-center rounded-full bg-[#febc2e]"
                    aria-label="Minimize"
                  >
                    <svg
                      className="h-2 w-2 text-[#985700] opacity-0 group-hover:opacity-100"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                    >
                      <rect x="1" y="5.5" width="10" height="1" />
                    </svg>
                  </button>
                  {/* Green - Maximize/Zoom */}
                  <button
                    className="traffic-light group flex h-3 w-3 items-center justify-center rounded-full bg-[#28c840]"
                    aria-label="Fullscreen"
                  >
                    <svg
                      className="h-2 w-2 text-[#006500] opacity-0 group-hover:opacity-100"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                    >
                      <path d="M5 1H1v4h1V2.707l3.146 3.147.708-.708L2.707 2H5V1zm6 5h-1v2.293L6.854 5.146l-.708.708L9.293 9H7v1h4V6z" />
                    </svg>
                  </button>
                </div>

                {/* Window Title */}
                <div className="flex-1 text-center">
                  <span className="select-none text-xs font-medium text-[#9d9d9d]">
                    🐕 Byte v1.0 (Connected)
                  </span>
                </div>

                {/* Right side spacer */}
                <div className="w-14" />
              </header>

              {/* Chatbot Content */}
              <main className="terminal-content flex-1 overflow-hidden bg-[#1e1e1e]">
                <TerminalChatbot onExit={handleExitChatbot} />
              </main>

              <style jsx>{`
                .terminal-window {
                  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1),
                    0 20px 40px rgba(0, 0, 0, 0.3);
                }

                .traffic-light {
                  transition: filter 0.15s ease;
                }

                .terminal-window:not(:hover) .traffic-light {
                  filter: saturate(0.8);
                }
              `}</style>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Maximized Terminal Modal */}
      <AnimatePresence>
        {isTerminalMaximized && !isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={handleMinimizeTerminal}
          >
            <motion.figure
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="terminal-window relative flex h-[80vh] w-[90vw] max-w-3xl flex-col overflow-hidden rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* macOS Window Title Bar */}
              <header className="terminal-titlebar flex h-8 items-center rounded-t-lg border-b border-[#2a2a2a] bg-[#3c3c3c] px-3">
                {/* Traffic Light Buttons */}
                <div className="flex items-center gap-2">
                  {/* Red - Close */}
                  <button
                    onClick={handleMinimizeTerminal}
                    className="traffic-light group flex h-3 w-3 cursor-pointer items-center justify-center rounded-full bg-[#ff5f57]"
                    aria-label="Close"
                  >
                    <svg
                      className="h-2 w-2 text-[#4a0002] opacity-0 group-hover:opacity-100"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                    >
                      <path d="M6 4.586L9.293 1.293a1 1 0 111.414 1.414L7.414 6l3.293 3.293a1 1 0 01-1.414 1.414L6 7.414l-3.293 3.293a1 1 0 01-1.414-1.414L4.586 6 1.293 2.707a1 1 0 011.414-1.414L6 4.586z" />
                    </svg>
                  </button>
                  {/* Yellow - Minimize */}
                  <button
                    onClick={handleMinimizeTerminal}
                    className="traffic-light group flex h-3 w-3 cursor-pointer items-center justify-center rounded-full bg-[#febc2e]"
                    aria-label="Minimize"
                  >
                    <svg
                      className="h-2 w-2 text-[#985700] opacity-0 group-hover:opacity-100"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                    >
                      <rect x="1" y="5.5" width="10" height="1" />
                    </svg>
                  </button>
                  {/* Green - Exit Fullscreen */}
                  <button
                    onClick={handleMinimizeTerminal}
                    className="traffic-light group flex h-3 w-3 cursor-pointer items-center justify-center rounded-full bg-[#28c840]"
                    aria-label="Exit fullscreen"
                  >
                    <svg
                      className="h-2 w-2 text-[#006500] opacity-0 group-hover:opacity-100"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                    >
                      <path d="M5 1H1v4h1V2.707l3.146 3.147.708-.708L2.707 2H5V1zm6 5h-1v2.293L6.854 5.146l-.708.708L9.293 9H7v1h4V6z" />
                    </svg>
                  </button>
                </div>

                {/* Window Title */}
                <div
                  className="flex-1 cursor-pointer text-center"
                  onClick={handleSwitchToChatbot}
                  title="Launch Byte"
                >
                  <span className="select-none text-xs font-medium text-[#9d9d9d]">
                    aryan@macbook — zsh
                  </span>
                </div>

                {/* Right side spacer */}
                <div className="w-14" />
              </header>

              {/* Terminal Content */}
              <main className="terminal-content flex-1 overflow-hidden bg-[#1e1e1e]">
                <Terminal
                  onSwitchToEditor={handleSwitchToEditor}
                  onSwitchToChatbot={handleSwitchToChatbot}
                  triggerChatbot={triggerChatbot}
                  onTriggerHandled={clearTrigger}
                />
              </main>

              <style jsx>{`
                .terminal-window {
                  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1),
                    0 20px 40px rgba(0, 0, 0, 0.3);
                }

                .traffic-light {
                  transition: filter 0.15s ease;
                }

                .terminal-window:not(:hover) .traffic-light {
                  filter: saturate(0.8);
                }
              `}</style>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Regular Terminal/Editor (non-expanded) */}
      {!isExpanded && !isTerminalMaximized && (
        <figure className="terminal-window relative flex h-full min-h-[380px] w-full flex-col overflow-hidden rounded-lg shadow-2xl">
          {/* macOS Window Title Bar */}
          <header className="terminal-titlebar flex h-8 items-center rounded-t-lg border-b border-[#2a2a2a] bg-[#3c3c3c] px-3">
            {/* Traffic Light Buttons */}
            <div className="flex items-center gap-2">
              {/* Red - Close */}
              <button
                onClick={mode === "editor" ? handleSwitchToTerminal : undefined}
                className={`traffic-light group flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57] ${
                  mode === "editor" ? "cursor-pointer" : ""
                }`}
                aria-label={mode === "editor" ? "Close" : undefined}
              >
                {mode === "editor" && (
                  <svg
                    className="h-2 w-2 text-[#4a0002] opacity-0 group-hover:opacity-100"
                    viewBox="0 0 12 12"
                    fill="currentColor"
                  >
                    <path d="M6 4.586L9.293 1.293a1 1 0 111.414 1.414L7.414 6l3.293 3.293a1 1 0 01-1.414 1.414L6 7.414l-3.293 3.293a1 1 0 01-1.414-1.414L4.586 6 1.293 2.707a1 1 0 011.414-1.414L6 4.586z" />
                  </svg>
                )}
              </button>
              {/* Yellow - Minimize */}
              <button
                className="traffic-light group flex h-3 w-3 items-center justify-center rounded-full bg-[#febc2e]"
                aria-label="Minimize"
              >
                <svg
                  className="h-2 w-2 text-[#985700] opacity-0 group-hover:opacity-100"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                >
                  <rect x="1" y="5.5" width="10" height="1" />
                </svg>
              </button>
              {/* Green - Maximize/Zoom */}
              <button
                onClick={mode === "editor" ? handleSwitchToTerminal : handleMaximizeTerminal}
                className="traffic-light group flex h-3 w-3 cursor-pointer items-center justify-center rounded-full bg-[#28c840]"
                aria-label={mode === "editor" ? "Exit fullscreen" : "Fullscreen"}
              >
                <svg
                  className="h-2 w-2 text-[#006500] opacity-0 group-hover:opacity-100"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                >
                  <path d="M5 1H1v4h1V2.707l3.146 3.147.708-.708L2.707 2H5V1zm6 5h-1v2.293L6.854 5.146l-.708.708L9.293 9H7v1h4V6z" />
                </svg>
              </button>
            </div>

            {/* Window Title */}
            <div
              className="flex-1 cursor-pointer text-center"
              onClick={mode === "terminal" ? handleSwitchToChatbot : undefined}
              title={mode === "terminal" ? "Launch Byte" : undefined}
            >
              <span className="select-none text-xs font-medium text-[#9d9d9d]">
                {mode === "terminal" ? "aryan@macbook — zsh" : "/index.tsx"}
              </span>
            </div>

            {/* Right side - Copy button for editor mode */}
            <div className="flex w-14 justify-end">
              {mode === "editor" && (
                <CopyButton
                  content={Array.isArray(code) ? code.join("\n") : code}
                  className="text-gray-400 hover:text-white"
                />
              )}
            </div>
          </header>

          {/* Terminal/Editor Content */}
          <main className="terminal-content flex-1 overflow-hidden bg-[#1e1e1e]">
            {mode === "terminal" ? (
              <Terminal
                onSwitchToEditor={handleSwitchToEditor}
                onSwitchToChatbot={handleSwitchToChatbot}
                triggerChatbot={triggerChatbot}
                onTriggerHandled={clearTrigger}
              />
            ) : (
              <div className="h-full overflow-auto p-3">
                <Code className="text-[13px]" code={code} language={language} />
              </div>
            )}
          </main>

          <style jsx>{`
            .terminal-window {
              box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1),
                0 20px 40px rgba(0, 0, 0, 0.3);
            }

            .traffic-light {
              transition: filter 0.15s ease;
            }

            .terminal-window:not(:hover) .traffic-light {
              filter: saturate(0.8);
            }
          `}</style>
        </figure>
      )}
    </>
  );
};

export default InteractiveTerminal;
