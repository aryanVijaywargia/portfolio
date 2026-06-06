import { useAchievementActions } from "components/achievements";
import { FC, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { Terminal } from "./terminal";
import { TerminalChatbot } from "./terminal-chatbot";
import { CopyButton } from "components/copy-button";
import { useChatbot } from "components/_stores/chatbot-store";
import { usePortfolioMode } from "components/_stores/portfolio-mode-context";
import type { CodeGroupProps } from "components/typography/code";

const SnakeGame = dynamic(() => import("./snake-game").then((mod) => mod.SnakeGame), {
  ssr: false,
});
const DungeonGame = dynamic(() => import("./dungeon-game").then((mod) => mod.DungeonGame), {
  ssr: false,
});
const GameMenu = dynamic(() => import("./game-menu").then((mod) => mod.GameMenu), {
  ssr: false,
});
const IntroReel = dynamic(() => import("./intro-reel").then((mod) => mod.IntroReel), {
  ssr: false,
});
const Code = dynamic(() => import("components/typography/code").then((mod) => mod.Code), {
  ssr: false,
});

type InteractiveTerminalProps = {
  code?: string | string[];
  language: CodeGroupProps["language"];
};

export const InteractiveTerminal: FC<InteractiveTerminalProps> = ({ code, language }) => {
  const [mode, setMode] = useState<
    "terminal" | "editor" | "chatbot" | "game-menu" | "snake" | "dungeon" | "intro-reel"
  >("terminal");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);
  const [replayIntroKey, setReplayIntroKey] = useState(0);
  const [skipTerminalIntroOnce, setSkipTerminalIntroOnce] = useState(false);
  const [editorCode, setEditorCode] = useState<string | string[] | null>(code ?? null);
  const triggerChatbot = useChatbot((state) => state.triggerChatbot);
  const requestChatbot = useChatbot((state) => state.requestChatbot);
  const clearTrigger = useChatbot((state) => state.clearTrigger);
  const closeChat = useChatbot((state) => state.closeChat);
  const { trackAchievementEvent } = useAchievementActions();
  const { activateBatman } = usePortfolioMode();

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

  useEffect(() => {
    if (!skipTerminalIntroOnce || mode !== "terminal") return undefined;

    const timeoutId = window.setTimeout(
      () => {
        setSkipTerminalIntroOnce(false);
      },
      0
    );

    return () => window.clearTimeout(timeoutId);
  }, [mode, skipTerminalIntroOnce]);

  const handleSwitchToEditor = () => {
    setMode("editor");
    if (editorCode !== null) return;

    // @ts-ignore - raw-loader modules are configured in Next's webpack pipeline.
    import("!!raw-loader!content/code-blocks/hero.tsx").then((mod) => {
      setEditorCode(`${mod.default ?? ""}`);
    });
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

  const handleSwitchToIntroReel = () => {
    setMode("intro-reel");
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

  const handleExitIntroReel = () => {
    setSkipTerminalIntroOnce(true);
    setMode("terminal");
    setIsTerminalMaximized(false);
  };

  const handleChatbotMessageSent = useCallback(
    () => trackAchievementEvent({ type: "chatbot:message-sent" }),
    [trackAchievementEvent]
  );
  const handleSnakeScoreChange = useCallback(
    (score: number) => trackAchievementEvent({ type: "snake:score", score }),
    [trackAchievementEvent]
  );
  const handleDungeonEscape = useCallback(
    () => trackAchievementEvent({ type: "dungeon:escaped" }),
    [trackAchievementEvent]
  );
  const handleValidCommand = useCallback(
    (command: string) => trackAchievementEvent({ type: "terminal:valid-command", command }),
    [trackAchievementEvent]
  );
  const handleSourceDiver = useCallback(
    () => trackAchievementEvent({ type: "terminal:source-diver" }),
    [trackAchievementEvent]
  );
  const handleSecretDiscovered = useCallback(
    () => trackAchievementEvent({ type: "terminal:secret-discovered" }),
    [trackAchievementEvent]
  );
  const handleRootAccess = useCallback(
    () => trackAchievementEvent({ type: "terminal:root-access" }),
    [trackAchievementEvent]
  );

  const isModal = isExpanded || isTerminalMaximized;

  // Determine terminal title
  const terminalTitle = isExpanded
    ? "🐕 Byte v1.0 (Connected)"
    : mode === "snake"
    ? "🐍 Snake - Terminal"
    : mode === "dungeon"
    ? "⚔️ Dungeon Quest - Terminal"
    : mode === "game-menu"
    ? "🎮 Games - Terminal"
    : mode === "intro-reel"
    ? "whois.mp4 - Terminal"
    : mode === "editor"
    ? "/index.tsx"
    : "aryan@macbook - zsh";

  // Replay Rick intro (red button in terminal mode)
  const handleReplayIntro = () => {
    setReplayIntroKey((k) => k + 1);
  };

  // Minimize maximized terminal and replay Rick intro
  const handleMinimizeAndReplayIntro = () => {
    handleMinimizeTerminal();
    handleReplayIntro();
  };

  // Determine close handler
  const handleClose = isExpanded
    ? handleExitChatbot
    : isTerminalMaximized && mode === "terminal"
    ? handleMinimizeAndReplayIntro
    : isTerminalMaximized && mode === "intro-reel"
    ? handleExitIntroReel
    : isTerminalMaximized
    ? handleMinimizeTerminal
    : mode === "editor"
    ? handleSwitchToTerminal
    : mode === "terminal"
    ? handleReplayIntro
    : undefined;

  // Determine title click handler (for launching chatbot from title)
  const handleTitleClick = !isExpanded && mode === "terminal" ? requestChatbot : undefined;

  const layoutTransition = { type: "spring" as const, damping: 25, stiffness: 300 };
  const windowSizeClass = isExpanded
    ? "h-[min(80svh,42rem)] w-[calc(100vw-2rem)] max-w-2xl sm:w-[90vw]"
    : mode === "intro-reel" && isTerminalMaximized
    ? "h-[min(86svh,48rem)] w-[calc(100vw-2rem)] max-w-5xl sm:w-[94vw]"
    : isTerminalMaximized
    ? "h-[min(80svh,42rem)] w-[calc(100vw-2rem)] max-w-3xl sm:w-[90vw]"
    : "h-[22rem] w-full sm:h-[24rem] lg:h-[27rem]";

  // Terminal content based on current mode
  const terminalContent = isExpanded
    ? <TerminalChatbot onExit={handleExitChatbot} onMessageSent={handleChatbotMessageSent} />
    : mode === "game-menu"
    ? <GameMenu onSelectGame={handleSelectGame} onExit={handleExitGame} />
    : mode === "snake"
    ? <SnakeGame onGameEnd={handleExitToGameMenu} onScoreChange={handleSnakeScoreChange} />
    : mode === "dungeon"
    ? <DungeonGame onGameEnd={handleExitToGameMenu} onEscape={handleDungeonEscape} />
    : mode === "intro-reel"
    ? <IntroReel onExit={handleExitIntroReel} />
    : mode === "editor"
    ? <div className="scrollbar-none h-full overflow-auto p-3">
        <Code
          className="text-[13px]"
          code={editorCode ?? "Loading source..."}
          language={language}
        />
      </div>
    : <Terminal
        onSwitchToEditor={handleSwitchToEditor}
        onSwitchToChatbot={handleSwitchToChatbot}
        onSwitchToGameMenu={handleSwitchToGame}
        onSwitchToIntroReel={handleSwitchToIntroReel}
        triggerChatbot={triggerChatbot}
        onTriggerHandled={clearTrigger}
        onValidCommand={handleValidCommand}
        onSourceDiver={handleSourceDiver}
        onSecretDiscovered={handleSecretDiscovered}
        onRootAccess={handleRootAccess}
        onBatmanTheme={activateBatman}
        replayIntroKey={replayIntroKey}
        skipIntro={skipTerminalIntroOnce}
      />;

  const terminalWindow = (
    <motion.figure
      layout
      layoutId="terminal-window"
      transition={layoutTransition}
      className={`terminal-window relative flex min-h-0 flex-col overflow-hidden rounded-lg shadow-2xl ${
        isModal ? "pointer-events-auto" : ""
      } ${windowSizeClass}`}
      onClick={isModal ? (e) => e.stopPropagation() : undefined}
    >
      {/* macOS Window Title Bar */}
      <motion.header
        layout="position"
        className="terminal-titlebar flex h-8 items-center rounded-t-lg border-b border-[#cccccc] bg-[#dddddd] px-3 dark:border-[#1e293b]/60 dark:bg-[#0f172a]/90"
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

        {/* Tabs - decorative, both themes */}
        {!isModal && mode === "terminal" && (
          <div className="ml-3 flex items-center gap-1">
            <span className="rounded px-2 py-0.5 font-mono text-[11px] text-cyan-700 [background:rgba(6,182,212,0.12)] dark:text-[#67e8f9]">
              ~/aryan
            </span>
          </div>
        )}

        {/* Explicit back affordance in editor mode */}
        {!isModal && mode === "editor" && (
          <button
            onClick={handleSwitchToTerminal}
            className="ml-3 inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[11px] text-cyan-700 transition-colors [background:rgba(6,182,212,0.12)] hover:text-cyan-900 dark:text-[#67e8f9] dark:hover:text-cyan-200"
            aria-label="Back to terminal"
          >
            <span aria-hidden="true">←</span>
            <span>back</span>
          </button>
        )}

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
              content={Array.isArray(editorCode) ? editorCode.join("\n") : editorCode ?? ""}
              className="text-gray-400 hover:text-white"
            />
          )}
        </div>
      </motion.header>

      {/* Content */}
      <main className="terminal-content relative min-h-0 flex-1 overflow-hidden bg-white dark:bg-[#060810] dark:bg-gradient-to-b dark:from-[#0a0e1a] dark:to-[#060810]">
        {/* cyan radial tint at top (dark mode only) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden dark:block"
          style={{
            background: "radial-gradient(ellipse at top, rgba(6,182,212,0.08), transparent 60%)",
          }}
        />
        <div className="relative h-full">{terminalContent}</div>
      </main>

      {/* Status strip - only on the default terminal view (not games/chatbot/editor/modal) */}
      {!isModal && mode === "terminal" && (
        <footer className="terminal-statusbar relative flex h-7 shrink-0 items-center justify-between border-t border-slate-200 bg-slate-100/80 px-4 font-mono text-[11px] text-slate-500 dark:border-slate-400/10 dark:bg-[#0f172a]/60 dark:text-[#64748b]">
          <div className="flex items-center gap-3.5">
            <span className="text-cyan-600 dark:text-[#67e8f9]">● live</span>
            <span>main</span>
            <span className="hidden sm:inline">node 20.11</span>
          </div>
          <span className="hidden sm:inline">↵ try `help`</span>
        </footer>
      )}

      <style jsx>{`
        .terminal-window {
          box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6),
            0 20px 50px -18px rgba(15, 23, 42, 0.25),
            0 0 80px -25px rgba(6, 182, 212, 0.18);
        }
        :global(.dark) .terminal-window {
          box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 0 0 1px rgba(255, 255, 255, 0.04), 0 30px 60px -20px rgba(0, 0, 0, 0.7),
            0 0 90px -20px rgba(6, 182, 212, 0.35);
        }

        .terminal-content {
          overscroll-behavior-y: auto;
        }

        .traffic-light {
          transition: filter 0.15s ease;
        }

        .terminal-window:not(:hover) .traffic-light {
          filter: saturate(0.8);
        }
      `}</style>
    </motion.figure>
  );

  return (
    <LayoutGroup>
      {!isModal && terminalWindow}
      {isModal &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
              />
            </AnimatePresence>
            <div className="pointer-events-none fixed inset-0 z-[110] flex items-center justify-center px-4 py-6 sm:px-6">
              {terminalWindow}
            </div>
          </>,
          document.body
        )}
    </LayoutGroup>
  );
};

export default InteractiveTerminal;
