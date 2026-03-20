import { useAchievements } from "components/achievements";
import { FC, useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Terminal } from "./terminal";
import { TerminalChatbot } from "./terminal-chatbot";
import { SnakeGame } from "./snake-game";
import { DungeonGame } from "./dungeon-game";
import { GameMenu } from "./game-menu";
import { CopyButton } from "components/copy-button";
import { Code, CodeGroupProps } from "components/typography/code";
import { useChatbot } from "components/_stores/chatbot-store";
import { usePortfolioMode } from "components/_stores/portfolio-mode-context";

type InteractiveTerminalProps = {
  code: string | string[];
  language: CodeGroupProps["language"];
};

export const InteractiveTerminal: FC<InteractiveTerminalProps> = ({ code, language }) => {
  const [mode, setMode] = useState<
    "terminal" | "editor" | "chatbot" | "game-menu" | "snake" | "dungeon"
  >("terminal");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);
  const [replayIntroKey, setReplayIntroKey] = useState(0);
  const { triggerChatbot, clearTrigger, closeChat } = useChatbot();
  const { trackAchievementEvent } = useAchievements();
  const { activateBatman, deactivateBatman } = usePortfolioMode();

  // Lock body scroll when modal is open
  useEffect(() => {
    const isModalOpen = isExpanded || isTerminalMaximized;
    if (isModalOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
    return undefined;
  }, [isExpanded, isTerminalMaximized]);

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

  const handleSwitchToGame = () => {
    trackAchievementEvent({ type: "arcade:opened" });
    setMode("game-menu");
    setIsTerminalMaximized(true);
  };

  const handleExitGame = () => {
    setMode("terminal");
    setIsTerminalMaximized(false);
  };

  const handleSelectGame = (gameId: string) => {
    if (gameId === "snake") {
      setMode("snake");
    } else if (gameId === "dungeon") {
      setMode("dungeon");
    }
  };

  const handleExitToGameMenu = () => {
    setMode("game-menu");
  };

  const handleMaximizeTerminal = () => {
    setIsTerminalMaximized(true);
  };

  const handleMinimizeTerminal = () => {
    setMode("terminal");
    setIsTerminalMaximized(false);
  };

  const isModal = isExpanded || isTerminalMaximized;

  // Determine terminal title
  const terminalTitle = isExpanded
    ? "🐕 Byte v1.0 (Connected)"
    : mode === "snake"
    ? "🐍 Snake — Terminal"
    : mode === "dungeon"
    ? "⚔️ Dungeon Quest — Terminal"
    : mode === "game-menu"
    ? "🎮 Games — Terminal"
    : mode === "editor"
    ? "/index.tsx"
    : "aryan@macbook — zsh";

  // Replay Rick intro (red button in terminal mode)
  const handleReplayIntro = () => {
    setReplayIntroKey((k) => k + 1);
  };

  // Determine close handler
  const handleClose = isExpanded
    ? handleExitChatbot
    : isTerminalMaximized
    ? handleMinimizeTerminal
    : mode === "editor"
    ? handleSwitchToTerminal
    : mode === "terminal"
    ? handleReplayIntro
    : undefined;

  // Determine title click handler (for launching chatbot from title)
  const handleTitleClick = !isExpanded && mode === "terminal" ? handleSwitchToChatbot : undefined;

  const layoutTransition = { type: "spring" as const, damping: 25, stiffness: 300 };

  // Terminal content based on current mode
  const terminalContent = isExpanded
    ? <TerminalChatbot
        onExit={handleExitChatbot}
        onMessageSent={() => trackAchievementEvent({ type: "chatbot:message-sent" })}
      />
    : mode === "game-menu"
    ? <GameMenu onSelectGame={handleSelectGame} onExit={handleExitGame} />
    : mode === "snake"
    ? <SnakeGame
        onGameEnd={handleExitToGameMenu}
        onScoreChange={(score) => trackAchievementEvent({ type: "snake:score", score })}
      />
    : mode === "dungeon"
    ? <DungeonGame
        onGameEnd={handleExitToGameMenu}
        onEscape={() => trackAchievementEvent({ type: "dungeon:escaped" })}
      />
    : mode === "editor"
    ? <div className="h-full overflow-auto p-3">
        <Code className="text-[13px]" code={code} language={language} />
      </div>
    : <Terminal
        onSwitchToEditor={handleSwitchToEditor}
        onSwitchToChatbot={handleSwitchToChatbot}
        onSwitchToGameMenu={handleSwitchToGame}
        triggerChatbot={triggerChatbot}
        onTriggerHandled={clearTrigger}
        onValidCommand={(command) =>
          trackAchievementEvent({ type: "terminal:valid-command", command })
        }
        onSourceDiver={() => trackAchievementEvent({ type: "terminal:source-diver" })}
        onSecretDiscovered={() => trackAchievementEvent({ type: "terminal:secret-discovered" })}
        onRootAccess={() => trackAchievementEvent({ type: "terminal:root-access" })}
        onBatmanTheme={activateBatman}
        onExitBatman={deactivateBatman}
        replayIntroKey={replayIntroKey}
      />;

  return (
    <LayoutGroup>
      {/* Backdrop overlay for modal states */}
      <AnimatePresence>
        {isModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      {/* Terminal window — shared layoutId animates size/position transitions */}
      <div
        className={
          isModal ? "pointer-events-none fixed inset-0 z-40 flex items-center justify-center" : ""
        }
      >
        <motion.figure
          layout
          layoutId="terminal-window"
          transition={layoutTransition}
          className={`terminal-window relative flex flex-col overflow-hidden rounded-lg shadow-2xl ${
            isModal ? "pointer-events-auto" : ""
          } ${
            isExpanded
              ? "h-[80vh] w-[90vw] max-w-2xl"
              : isTerminalMaximized
              ? "h-[80vh] w-[90vw] max-w-3xl"
              : "h-full min-h-[380px] w-full"
          }`}
          onClick={isModal ? (e) => e.stopPropagation() : undefined}
        >
          {/* macOS Window Title Bar */}
          <motion.header
            layout="position"
            className="terminal-titlebar flex h-8 items-center rounded-t-lg border-b border-[#cccccc] bg-[#dddddd] px-3 dark:border-[#2a2a2a] dark:bg-[#3c3c3c]"
          >
            {/* Traffic Light Buttons */}
            <div className="flex items-center gap-2">
              {/* Red - Close */}
              <button
                onClick={handleClose}
                className={`traffic-light group flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57] ${
                  handleClose ? "cursor-pointer" : ""
                }`}
                aria-label="Close"
              >
                {handleClose && (
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
                onClick={isModal ? handleClose : undefined}
                className={`traffic-light group flex h-3 w-3 items-center justify-center rounded-full bg-[#febc2e] ${
                  isModal ? "cursor-pointer" : ""
                }`}
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
                onClick={
                  isModal
                    ? handleClose
                    : mode === "editor"
                    ? handleSwitchToTerminal
                    : handleMaximizeTerminal
                }
                className="traffic-light group flex h-3 w-3 cursor-pointer items-center justify-center rounded-full bg-[#28c840]"
                aria-label={isModal ? "Exit fullscreen" : "Fullscreen"}
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
              className={`flex-1 text-center ${handleTitleClick ? "cursor-pointer" : ""}`}
              onClick={handleTitleClick}
              title={handleTitleClick ? "Launch Byte" : undefined}
            >
              <span className="select-none text-xs font-medium text-[#6b6b6b] dark:text-[#9d9d9d]">
                {terminalTitle}
              </span>
            </div>

            {/* Right side - Copy button for editor mode */}
            <div className="flex w-14 justify-end">
              {!isModal && mode === "editor" && (
                <CopyButton
                  content={Array.isArray(code) ? code.join("\n") : code}
                  className="text-gray-400 hover:text-white"
                />
              )}
            </div>
          </motion.header>

          {/* Content */}
          <main className="terminal-content flex-1 overflow-auto bg-white dark:bg-[#1e1e1e]">
            {terminalContent}
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
      </div>
    </LayoutGroup>
  );
};

export default InteractiveTerminal;
