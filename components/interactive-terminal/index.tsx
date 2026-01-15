import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "./terminal";
import { TerminalChatbot } from "./terminal-chatbot";
import { CopyButton } from "components/copy-button";
import { Code, CodeGroupProps } from "components/typography/code";

type InteractiveTerminalProps = {
  code: string | string[];
  language: CodeGroupProps["language"];
};

export const InteractiveTerminal: FC<InteractiveTerminalProps> = ({ code, language }) => {
  const [mode, setMode] = useState<"terminal" | "editor" | "chatbot">("terminal");
  const [isExpanded, setIsExpanded] = useState(false);

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
  };

  const title =
    mode === "terminal"
      ? "aryan@macbook — zsh"
      : mode === "editor"
      ? "/index.tsx"
      : "🐕 Byte v1.0 (Connected)";

  return (
    <>
      {/* Backdrop when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={handleExitChatbot}
          />
        )}
      </AnimatePresence>

      <motion.figure
        layout
        className={`terminal-window relative flex flex-col overflow-hidden rounded-lg shadow-2xl ${
          isExpanded
            ? "fixed left-1/2 top-1/2 z-50 h-[80vh] w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2"
            : "h-full min-h-[380px] w-full"
        }`}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* macOS Window Title Bar */}
        <header className="terminal-titlebar flex h-8 items-center rounded-t-lg border-b border-[#2a2a2a] bg-[#3c3c3c] px-3">
          {/* Traffic Light Buttons */}
          <div className="flex items-center gap-2">
            {/* Red - Close */}
            <button
              onClick={
                mode === "editor"
                  ? handleSwitchToTerminal
                  : mode === "chatbot"
                  ? handleExitChatbot
                  : undefined
              }
              className={`traffic-light group flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57] ${
                mode !== "terminal" ? "cursor-pointer" : ""
              }`}
              aria-label={mode !== "terminal" ? "Close" : undefined}
            >
              {mode !== "terminal" && (
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
              onClick={mode === "editor" ? handleSwitchToTerminal : undefined}
              className={`traffic-light group flex h-3 w-3 items-center justify-center rounded-full bg-[#28c840] ${
                mode === "editor" ? "cursor-pointer" : ""
              }`}
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
            <span className="select-none text-xs font-medium text-[#9d9d9d]">{title}</span>
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

        {/* Terminal/Editor/Chatbot Content */}
        <main className="terminal-content flex-1 overflow-hidden bg-[#1e1e1e]">
          {mode === "terminal" ? (
            <Terminal
              onSwitchToEditor={handleSwitchToEditor}
              onSwitchToChatbot={handleSwitchToChatbot}
            />
          ) : mode === "editor" ? (
            <div className="h-full overflow-auto p-3">
              <Code className="text-[13px]" code={code} language={language} />
            </div>
          ) : (
            <TerminalChatbot onExit={handleExitChatbot} />
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
      </motion.figure>
    </>
  );
};

export default InteractiveTerminal;
