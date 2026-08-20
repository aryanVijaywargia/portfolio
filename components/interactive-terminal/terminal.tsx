import { FC, useState, useRef, useEffect, KeyboardEvent, MouseEvent as ReactMouseEvent, useCallback, useMemo } from "react";
import { useAchievements } from "components/achievements";
import { ACHIEVEMENTS, ACHIEVEMENT_ORDER } from "components/achievements/achievementsList";
import type { AchievementId } from "components/achievements/achievementsList";
import { TERMINAL_CONFIG, COMMANDS, SOCIAL_LINKS, DESKTOP_HELP, DESKTOP_COMMANDS, STARTUP_BANNER, AUTOCOMPLETE_COMMANDS, escapeHtml, getCommandOutput, getCommandSuggestion, isSpecialCommand, CommandOutput } from "./terminal-commands";
import { RickIntro } from "./rick-intro";

type OutputLine = {
  id: number;
  text: string;
  className?: string;
};

const TROPHIES_PER_SHELF = 4;
const TROPHY_PROGRESS_WIDTH = 24;

const buildTrophyAscii = (isUnlocked: boolean) => {
  const mark = isUnlocked ? "*" : "?";
  const stem = isUnlocked ? "||" : "::";

  return [
    "    .------.",
    "  __|      |__",
    `(   |  ${mark}   |   )`,
    " \\  |____|  /",
    "     \\____/",
    `       ${stem}`,
    `     __${stem}__`,
    "    |______|",
  ].join("\n");
};

const buildAchievementShelfMarkup = (unlockedIds: AchievementId[]) => {
  const unlockedSet = new Set(unlockedIds);
  const progress = Math.round((unlockedIds.length / ACHIEVEMENT_ORDER.length) * 100);
  const progressFilled = Math.round(
    (unlockedIds.length / ACHIEVEMENT_ORDER.length) * TROPHY_PROGRESS_WIDTH
  );
  const shelves: AchievementId[][] = [];

  for (let index = 0; index < ACHIEVEMENT_ORDER.length; index += TROPHIES_PER_SHELF) {
    shelves.push(ACHIEVEMENT_ORDER.slice(index, index + TROPHIES_PER_SHELF));
  }

  const shelfMarkup = shelves
    .map((shelf) => {
      const trophies = shelf
        .map((id) => {
          const achievement = ACHIEVEMENTS[id];
          const isUnlocked = unlockedSet.has(id);
          const label = isUnlocked ? achievement.title : "Locked";
          const detail = isUnlocked ? achievement.description : achievement.hint;

          return `
            <div
              class="achievement-trophy achievement-trophy--${escapeHtml(achievement.category)} ${
            isUnlocked ? "is-unlocked" : "is-locked"
          }"
              aria-label="${escapeHtml(`${label}. ${detail}`)}"
              title="${escapeHtml(detail)}"
            >
              <pre class="achievement-ascii-cup" aria-hidden="true">${escapeHtml(
                buildTrophyAscii(isUnlocked)
              )}</pre>
              <span class="achievement-trophy-label">${escapeHtml(label)}</span>
            </div>`;
        })
        .join("");

      return `<div class="achievement-shelf-row"><div class="achievement-trophies">${trophies}</div><pre class="achievement-shelf-plank" aria-hidden="true">+${"-".repeat(
        130
      )}+</pre></div>`;
    })
    .join("");

  const lockedCount = ACHIEVEMENT_ORDER.length - unlockedIds.length;
  const unlockedCountLabel = String(unlockedIds.length).padStart(2, "0");
  const achievementTotal = ACHIEVEMENT_ORDER.length;
  const progressFillLabel = "#".repeat(progressFilled);
  const progressTrackLabel = ".".repeat(TROPHY_PROGRESS_WIDTH - progressFilled);
  const progressValueLabel = String(progress).padStart(3, " ");

  return `
    <section class="achievement-case" aria-label="Achievement trophy case">
      <div class="achievement-case-header">
        <div>
          <span class="achievement-case-kicker">ACHIEVEMENT ARCHIVE</span>
          <strong class="achievement-case-title">Trophy case</strong>
        </div>
        <span class="achievement-case-count">[${unlockedCountLabel}/${achievementTotal}]</span>
      </div>
      <div class="achievement-progress" aria-label="${progress}% complete">
        <span aria-hidden="true">[</span><span class="achievement-progress-fill">${progressFillLabel}</span><span class="achievement-progress-track">${progressTrackLabel}</span><span aria-hidden="true">]</span><span class="achievement-progress-value">${progressValueLabel}%</span>
      </div>
      <div class="achievement-shelves">${shelfMarkup}</div>
      <p class="achievement-case-note">${
        lockedCount === 0
          ? "Case complete. Every trophy recovered."
          : `${lockedCount} hidden ${
              lockedCount === 1 ? "trophy" : "trophies"
            } remain — keep exploring.`
      }</p>
    </section>`;
};

type TerminalProps = {
  onSwitchToEditor: () => void;
  onSwitchToChatbot: () => void;
  onSwitchToGameMenu: () => void;
  onSwitchToIntroReel: () => void;
  onSwitchToRadio: () => void;
  onSwitchToScratchpad: () => void;
  onSwitchToTypingTest: () => void;
  triggerChatbot?: boolean;
  onTriggerHandled?: () => void;
  onValidCommand?: (command: string) => void;
  onSourceDiver?: () => void;
  onSecretDiscovered?: () => void;
  onRootAccess?: () => void;
  onBatmanTheme?: () => void;
  replayIntroKey?: number;
  skipIntro?: boolean;
};

export const Terminal: FC<TerminalProps> = ({
  onSwitchToEditor,
  onSwitchToChatbot,
  onSwitchToGameMenu,
  onSwitchToIntroReel,
  onSwitchToRadio,
  onSwitchToScratchpad,
  onSwitchToTypingTest,
  triggerChatbot,
  onTriggerHandled,
  onValidCommand,
  onSourceDiver,
  onSecretDiscovered,
  onRootAccess,
  onBatmanTheme,
  replayIntroKey,
  skipIntro = false,
}) => {
  const [showIntro, setShowIntro] = useState(() => !skipIntro);
  const [outputLines, setOutputLines] = useState<OutputLine[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isPasswordMode, setIsPasswordMode] = useState(false);
  const [lineIdCounter, setLineIdCounter] = useState(0);
  const [canPlayKeyboardGames, setCanPlayKeyboardGames] = useState(false);
  const [showStartupBanner, setShowStartupBanner] = useState(false);
  const { unlockedIds } = useAchievements();

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const chatbotTimeoutIds = useRef<NodeJS.Timeout[]>([]);
  const lineTimeoutIds = useRef<Set<NodeJS.Timeout>>(new Set());
  const startupRenderedRef = useRef(false);

  // Replay intro when red button is clicked
  useEffect(() => {
    if (replayIntroKey && replayIntroKey > 0) {
      setShowIntro(true);
      setOutputLines([]);
      setCurrentInput("");
      setCommandHistory([]);
      setHistoryIndex(-1);
      setLineIdCounter(0);
      startupRenderedRef.current = false;
    }
  }, [replayIntroKey]);

  useEffect(() => {
    const gameMediaQuery = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine)"
    );
    const startupBannerMediaQuery = window.matchMedia("(min-width: 768px)");
    const updateCanPlayKeyboardGames = () => setCanPlayKeyboardGames(gameMediaQuery.matches);
    const updateShowStartupBanner = () => setShowStartupBanner(startupBannerMediaQuery.matches);

    updateCanPlayKeyboardGames();
    updateShowStartupBanner();
    gameMediaQuery.addEventListener?.("change", updateCanPlayKeyboardGames);
    startupBannerMediaQuery.addEventListener?.("change", updateShowStartupBanner);
    return () => {
      gameMediaQuery.removeEventListener?.("change", updateCanPlayKeyboardGames);
      startupBannerMediaQuery.removeEventListener?.("change", updateShowStartupBanner);
    };
  }, []);

  const getHelpLines = useCallback(
    () => [
      ...COMMANDS.help.slice(0, -2),
      ...(canPlayKeyboardGames ? DESKTOP_HELP : []),
      ...COMMANDS.help.slice(-2),
    ],
    [canPlayKeyboardGames]
  );

  const availableCommands = useMemo(
    () => [...AUTOCOMPLETE_COMMANDS, ...(canPlayKeyboardGames ? DESKTOP_COMMANDS : [])].sort(),
    [canPlayKeyboardGames]
  );

  // Initialize once after intro completes.
  useEffect(() => {
    if (!showIntro && !startupRenderedRef.current) {
      startupRenderedRef.current = true;
      addLines(showStartupBanner ? STARTUP_BANNER : COMMANDS.initial, 0);
      // Focus input after mount
      setTimeout(
        () => {
          inputRef.current?.focus({ preventScroll: true });
        },
        100
      );
    }
  }, [showIntro, showStartupBanner]);

  // Cleanup chatbot timeouts on unmount
  useEffect(() => {
    const pendingLineTimeouts = lineTimeoutIds.current;

    return () => {
      chatbotTimeoutIds.current.forEach((id) => clearTimeout(id));
      chatbotTimeoutIds.current = [];
      pendingLineTimeouts.forEach((id) => clearTimeout(id));
      pendingLineTimeouts.clear();
    };
  }, []);

  // Handle external trigger for chatbot
  useEffect(() => {
    if (triggerChatbot) {
      // Clear any existing timeouts
      chatbotTimeoutIds.current.forEach((id) => clearTimeout(id));
      chatbotTimeoutIds.current = [];

      if (showIntro) {
        startupRenderedRef.current = true;
        setOutputLines([]);
        setCurrentInput("");
        setLineIdCounter(0);
        setShowIntro(false);
        return;
      }

      // Run the chatbot loading animation
      chatbotTimeoutIds.current.push(
        setTimeout(
          () => {
            addLineImmediate(`${TERMINAL_CONFIG.prompt} chatbot`, "command-line");
          },
          0
        )
      );
      chatbotTimeoutIds.current.push(
        setTimeout(
          () => {
            addLineImmediate("", undefined);
          },
          50
        )
      );
      chatbotTimeoutIds.current.push(
        setTimeout(
          () => {
            addLineImmediate("Initializing Neural Bark Network...", "info");
          },
          130
        )
      );
      chatbotTimeoutIds.current.push(
        setTimeout(
          () => {
            addLineImmediate("[#####-----] 50%", "info");
          },
          450
        )
      );
      chatbotTimeoutIds.current.push(
        setTimeout(
          () => {
            addLineImmediate("[##########] 100%", "info");
          },
          850
        )
      );
      chatbotTimeoutIds.current.push(
        setTimeout(
          () => {
            addLineImmediate("Woof! Connection established.", "info");
          },
          1250
        )
      );
      chatbotTimeoutIds.current.push(
        setTimeout(
          () => {
            onTriggerHandled?.();
            onSwitchToChatbot();
          },
          1550
        )
      );
    }

    return () => {
      chatbotTimeoutIds.current.forEach((id) => clearTimeout(id));
      chatbotTimeoutIds.current = [];
    };
  }, [triggerChatbot, showIntro, onSwitchToChatbot, onTriggerHandled]);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [outputLines]);

  // Focus input on click, or run commands exposed as buttons in terminal output.
  const handleTerminalClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const commandButton = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-terminal-command]"
    );
    const command = commandButton?.dataset.terminalCommand;
    if (command) {
      handleCommand(command);
      return;
    }
    inputRef.current?.focus({ preventScroll: true });
  };

  const addLine = (text: string, className?: string, delay = 0): NodeJS.Timeout => {
    const timeoutId = setTimeout(
      () => {
        lineTimeoutIds.current.delete(timeoutId);
        setLineIdCounter((prev) => {
          const newId = prev + 1;
          setOutputLines((lines) => [...lines, { id: newId, text, className }]);
          return newId;
        });
      },
      delay
    );
    lineTimeoutIds.current.add(timeoutId);
    return timeoutId;
  };

  // Add line immediately without returning timeout (for non-tracked calls)
  const addLineImmediate = (text: string, className?: string) => {
    setLineIdCounter((prev) => {
      const newId = prev + 1;
      setOutputLines((lines) => [...lines, { id: newId, text, className }]);
      return newId;
    });
  };

  const addLines = (lines: CommandOutput[], baseDelay = 80) => {
    lines.forEach((line, index) => {
      addLine(line.text, line.className, index * baseDelay);
    });
  };

  const clearTerminal = () => {
    lineTimeoutIds.current.forEach((id) => clearTimeout(id));
    lineTimeoutIds.current.clear();
    setOutputLines([]);
  };

  const handleCommand = (cmd: string) => {
    const normalizedCmd = cmd.toLowerCase().trim();

    // Add command to history (never record passwords)
    if (cmd.trim() && !isPasswordMode) {
      setCommandHistory((prev) => [...prev, cmd]);
      setHistoryIndex(-1);
    }

    // Clear before scheduling the command echo so `clear` disappears too.
    if (!isPasswordMode && normalizedCmd === "clear") {
      onValidCommand?.(normalizedCmd);
      clearTerminal();
      return;
    }

    // Echo the command line, masking password input
    const echoedCmd = isPasswordMode ? "*".repeat(cmd.length) : escapeHtml(cmd);
    addLine(`${TERMINAL_CONFIG.prompt} ${echoedCmd}`, "command-line", 0);

    // Handle password mode
    if (isPasswordMode) {
      if (cmd === TERMINAL_CONFIG.password) {
        addLine("Access granted.", "info", 80);
        onRootAccess?.();
      } else if (cmd === TERMINAL_CONFIG.batmanPassword) {
        // Batman theme activation sequence
        addLine("", undefined, 0);
        addLine("\ud83e\udd87 ACCESS GRANTED \u2014 Dark Knight Protocol Initiated", "info", 80);
        addLine("", undefined, 200);
        addLine(
          "  \u2584\u2584\u2584\u2584\u2584\u2584\u2584   \u2584\u2584\u2584\u2584\u2584\u2584\u2584",
          undefined,
          300
        );
        addLine(
          " \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588",
          undefined,
          350
        );
        addLine(
          " \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 BAT \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588",
          undefined,
          400
        );
        addLine(
          "  \u2580\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2580",
          undefined,
          450
        );
        addLine(
          "    \u2580\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2580",
          undefined,
          500
        );
        addLine("       \u2580\u2588\u2588\u2588\u2588\u2588\u2588\u2580", undefined, 550);
        addLine("", undefined, 600);
        addLine(
          "[\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588] 100% \u2014 The night is yours.",
          "info",
          700
        );
        setTimeout(
          () => {
            onBatmanTheme?.();
            // Scroll to top after theme switch
            window.scrollTo({ top: 0, behavior: "smooth" });
          },
          1500
        );
        onRootAccess?.();
      } else {
        addLine("Wrong password", "error", 80);
      }
      setIsPasswordMode(false);
      return;
    }

    // Handle special commands
    if (isSpecialCommand(normalizedCmd)) {
      onValidCommand?.(normalizedCmd);

      switch (normalizedCmd) {
        case "achievements": {
          const unlockedSet = new Set(unlockedIds);
          const unlocked = ACHIEVEMENT_ORDER.filter((id) => unlockedSet.has(id));

          addLine("", undefined, 0);
          addLine("$ achievements --trophy-case", "info", 60);
          addLine(buildAchievementShelfMarkup(unlocked), "achievement-display", 140);
          addLine("", undefined, 220);
          return;
        }

        case "clear":
          clearTerminal();
          return;

        case "history":
          addLine("", undefined, 0);
          commandHistory.forEach((histCmd, index) => {
            addLine(`  ${index + 1}  ${escapeHtml(histCmd)}`, undefined, (index + 1) * 50);
          });
          addLine("", undefined, (commandHistory.length + 1) * 50);
          return;

        case "email":
          addLine("Opening email client...", "info", 80);
          setTimeout(
            () => {
              window.open(SOCIAL_LINKS.email, "_blank");
            },
            500
          );
          return;

        case "code":
          addLine("Opening code editor...", "info", 80);
          onSourceDiver?.();
          setTimeout(
            () => {
              onSwitchToEditor();
            },
            300
          );
          return;

        case "chatbot":
          // Clear any existing chatbot timeouts
          chatbotTimeoutIds.current.forEach((id) => clearTimeout(id));
          chatbotTimeoutIds.current = [];

          chatbotTimeoutIds.current.push(addLine("", undefined, 0));
          chatbotTimeoutIds.current.push(
            addLine("Initializing Neural Bark Network...", "info", 80)
          );
          chatbotTimeoutIds.current.push(addLine("[#####-----] 50%", "info", 400));
          chatbotTimeoutIds.current.push(addLine("[##########] 100%", "info", 800));
          chatbotTimeoutIds.current.push(addLine("Woof! Connection established.", "info", 1200));
          chatbotTimeoutIds.current.push(
            setTimeout(
              () => {
                onSwitchToChatbot();
              },
              1500
            )
          );
          return;

        case "radio":
          onSwitchToRadio();
          return;

        case "scratchpad":
          addLine("", undefined, 0);
          addLine("Opening shared scratchpad.txt…", "info", 80);
          setTimeout(
            () => {
              onSwitchToScratchpad();
            },
            280
          );
          return;

        case "typetest":
          if (!canPlayKeyboardGames) {
            addLine(
              `Command not found: ${escapeHtml(cmd)}. Type 'help' for available commands.`,
              "error",
              80
            );
            return;
          }

          addLine("", undefined, 0);
          addLine("Loading typetest...", "info", 80);
          setTimeout(
            () => {
              onSwitchToTypingTest();
            },
            280
          );
          return;

        case "game":
          if (!canPlayKeyboardGames) {
            addLine(
              `Command not found: ${escapeHtml(cmd)}. Type 'help' for available commands.`,
              "error",
              80
            );
            return;
          }

          addLine("", undefined, 0);
          addLine("Loading Games Menu...", "info", 80);
          addLine("[##########] 100%", "info", 400);
          setTimeout(
            () => {
              onSwitchToGameMenu();
            },
            600
          );
          return;

        case "whois":
          addLine("", undefined, 0);
          addLine("Loading Aryan profile video...", "info", 80);
          addLine("[##########] 100%", "info", 400);
          setTimeout(
            () => {
              onSwitchToIntroReel();
            },
            600
          );
          return;

        case "sudo":
          addLine("Enter password:", "info", 80);
          setIsPasswordMode(true);
          return;
      }
    }

    // Handle regular commands
    const output = normalizedCmd === "help" ? getHelpLines() : getCommandOutput(normalizedCmd);
    if (output) {
      onValidCommand?.(normalizedCmd);
      if (normalizedCmd === "secret") {
        onSecretDiscovered?.();
        addLines(output, 80);
        addLine("Enter password:", "info", 240);
        setIsPasswordMode(true);
        return;
      }
      addLines(output, 80);
    } else if (normalizedCmd) {
      const suggestion = getCommandSuggestion(normalizedCmd, availableCommands);
      if (suggestion) {
        addLine(
          `Command not found: ${escapeHtml(
            cmd
          )}. Did you mean '<span class="command">${suggestion}</span>'?`,
          "error",
          80
        );
      } else {
        addLine(
          `Command not found: ${escapeHtml(cmd)}. Type 'help' for available commands.`,
          "error",
          80
        );
      }
    }
  };

  const handleTabComplete = () => {
    if (isPasswordMode) return;

    const input = currentInput.trimStart().toLowerCase();
    if (!input) return;

    const matches = availableCommands.filter((command) => command.startsWith(input));
    if (matches.length === 1) {
      setCurrentInput(matches[0]);
      return;
    }
    if (matches.length > 1) {
      // Extend to the longest common prefix; if we're already there, list matches
      let prefix = matches[0];
      matches.slice(1).forEach((match) => {
        while (!match.startsWith(prefix)) {
          prefix = prefix.slice(0, -1);
        }
      });

      if (prefix.length > input.length) {
        setCurrentInput(prefix);
      } else {
        addLineImmediate(`${TERMINAL_CONFIG.prompt} ${escapeHtml(currentInput)}`, "command-line");
        addLineImmediate(
          matches.map((match) => `<span class="command">${match}</span>`).join("  ")
        );
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Shell-style control shortcuts
    if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
      e.preventDefault();
      clearTerminal();
      return;
    }
    if (e.ctrlKey && (e.key === "c" || e.key === "C")) {
      // Keep native copy when text is selected
      if (window.getSelection()?.toString()) return;
      e.preventDefault();
      addLineImmediate(`${TERMINAL_CONFIG.prompt} ${escapeHtml(displayInput)}^C`, "command-line");
      setCurrentInput("");
      setIsPasswordMode(false);
      return;
    }
    if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
      e.preventDefault();
      setCurrentInput("");
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      handleTabComplete();
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleCommand(currentInput);
      setCurrentInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput("");
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex] || "");
        }
      }
    }
  };

  const displayInput = isPasswordMode ? "*".repeat(currentInput.length) : currentInput;

  if (showIntro) {
    return <RickIntro onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div
      className="terminal-wrapper scrollbar-none h-full min-h-0 overflow-y-auto overflow-x-hidden rounded-b-md bg-white dark:bg-transparent"
      onClick={handleTerminalClick}
      ref={terminalRef}
    >
      <div className="terminal-content p-3 font-mono text-[16px] leading-relaxed sm:text-[13px]">
        {/* Output Lines */}
        {outputLines.map((line) => (
          <div
            key={line.id}
            className={`terminal-line ${line.className || ""}`}
            dangerouslySetInnerHTML={{ __html: line.text || "&nbsp;" }}
          />
        ))}

        {/* Input Line - inline with output */}
        {/* min-w-0 on the input, because a flex item defaults to min-width:auto —
            an <input> refuses to shrink past its intrinsic size, so on a phone
            the prompt plus the field overflowed the window. With the field
            focused the browser then scrolled the container sideways, dragging
            the start of every line off the left edge. */}
        <div className="terminal-input-line flex items-center font-mono">
          <span className="prompt select-none whitespace-nowrap text-[#0d7377] dark:text-[#4EC9B0]">
            {TERMINAL_CONFIG.prompt}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="terminal-input ml-1 min-w-0 flex-1 border-none bg-transparent text-[#383a42] outline-none dark:text-[#D4D4D4]"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
          />
        </div>
      </div>

      <style jsx>{`
        .terminal-wrapper {
          cursor: text;
          font-family: "Menlo", "Monaco", "Courier New", monospace;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-y: auto;
          touch-action: pan-y;
        }

        .terminal-line {
          color: #383a42;
          white-space: pre-wrap;
          word-break: break-word;
          min-height: 1.5em;
        }

        .terminal-line.banner-line {
          min-height: 0;
          font-size: 8px;
          line-height: 1.05;
          white-space: pre;
          word-break: normal;
        }

        :global(.dark) .terminal-line {
          color: #d4d4d4;
        }

        .terminal-line.achievement-display {
          min-height: 0;
          white-space: normal;
        }

        .terminal-line :global(.achievement-case) {
          position: relative;
          width: min(100%, 760px);
          margin: 0.5rem 0 1rem;
          overflow: hidden;
          border: 1px solid rgba(8, 145, 178, 0.3);
          border-radius: 4px;
          background-color: rgba(241, 245, 249, 0.9);
          background-image: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(14, 116, 144, 0.025) 3px,
            rgba(14, 116, 144, 0.025) 4px
          );
          box-shadow:
            0 16px 38px rgba(15, 23, 42, 0.1),
            inset 3px 0 0 rgba(6, 182, 212, 0.5);
          padding: 0.9rem 1rem 0.75rem;
        }

        :global(.dark) .terminal-line :global(.achievement-case) {
          border-color: rgba(34, 211, 238, 0.26);
          background-color: rgba(5, 13, 27, 0.94);
          background-image: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(103, 232, 249, 0.025) 3px,
            rgba(103, 232, 249, 0.025) 4px
          );
          box-shadow:
            0 18px 48px rgba(0, 0, 0, 0.28),
            inset 3px 0 0 rgba(34, 211, 238, 0.5);
        }

        .terminal-line :global(.achievement-case-header) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0 0.2rem 0.55rem;
        }

        .terminal-line :global(.achievement-case-kicker),
        .terminal-line :global(.achievement-case-title) {
          display: block;
        }

        .terminal-line :global(.achievement-case-kicker) {
          margin-bottom: 0.2rem;
          color: #0e7490;
          font-size: 0.56rem;
          font-weight: 700;
          letter-spacing: 0.16em;
        }

        .terminal-line :global(.achievement-case-kicker::before) {
          content: "// ";
          opacity: 0.58;
        }

        :global(.dark) .terminal-line :global(.achievement-case-kicker) {
          color: #38bdf8;
        }

        .terminal-line :global(.achievement-case-title) {
          color: #172033;
          font-size: clamp(0.9rem, 2.4vw, 1.18rem);
          line-height: 1;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        :global(.dark) .terminal-line :global(.achievement-case-title) {
          color: #f8fafc;
        }

        .terminal-line :global(.achievement-case-count) {
          color: #0e7490;
          font-size: 0.76rem;
          font-weight: 700;
          line-height: 1;
          letter-spacing: 0.08em;
        }

        :global(.dark) .terminal-line :global(.achievement-case-count) {
          color: #67e8f9;
        }

        .terminal-line :global(.achievement-progress) {
          display: flex;
          align-items: center;
          gap: 0;
          padding: 0 0.2rem 0.55rem;
          color: #64748b;
          font-size: 0.62rem;
          font-weight: 700;
          line-height: 1;
          letter-spacing: 0.03em;
        }

        .terminal-line :global(.achievement-progress-fill) {
          color: #0891b2;
          text-shadow: 0 0 7px rgba(6, 182, 212, 0.36);
        }

        :global(.dark) .terminal-line :global(.achievement-progress-fill) {
          color: #67e8f9;
          text-shadow: 0 0 8px rgba(34, 211, 238, 0.48);
        }

        .terminal-line :global(.achievement-progress-track) {
          color: rgba(100, 116, 139, 0.45);
        }

        .terminal-line :global(.achievement-progress-value) {
          margin-left: 0.55rem;
          color: #64748b;
        }

        .terminal-line :global(.achievement-shelves) {
          display: grid;
          gap: 0.38rem;
        }

        .terminal-line :global(.achievement-shelf-row) {
          position: relative;
          min-width: 0;
          padding: 0.12rem 0.2rem 0;
          animation: achievement-shelf-boot 320ms ease-out both;
        }

        .terminal-line :global(.achievement-shelf-row:nth-child(2)) {
          animation-delay: 70ms;
        }

        .terminal-line :global(.achievement-shelf-row:nth-child(3)) {
          animation-delay: 140ms;
        }

        .terminal-line :global(.achievement-trophies) {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          align-items: end;
          min-height: 84px;
          gap: 0.25rem;
        }

        .terminal-line :global(.achievement-trophy) {
          --trophy-color: #64748b;
          display: flex;
          min-width: 0;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          gap: 0.18rem;
          color: var(--trophy-color);
          transition:
            transform 180ms ease,
            opacity 180ms ease,
            filter 180ms ease;
        }

        .terminal-line :global(.achievement-trophy.is-unlocked:hover) {
          transform: translateY(-2px);
          filter: brightness(1.15);
        }

        .terminal-line :global(.achievement-trophy--hero) {
          --trophy-color: #38bdf8;
        }

        .terminal-line :global(.achievement-trophy--terminal) {
          --trophy-color: #22d3ee;
        }

        .terminal-line :global(.achievement-trophy--explorer) {
          --trophy-color: #818cf8;
        }

        .terminal-line :global(.achievement-trophy--projects) {
          --trophy-color: #8b5cf6;
        }

        .terminal-line :global(.achievement-trophy--contact) {
          --trophy-color: #34d399;
        }

        .terminal-line :global(.achievement-trophy--games) {
          --trophy-color: #fbbf24;
        }

        .terminal-line :global(.achievement-trophy--hidden) {
          --trophy-color: #e879f9;
        }

        .terminal-line :global(.achievement-trophy.is-locked) {
          --trophy-color: #64748b;
          opacity: 0.38;
          filter: grayscale(1);
        }

        .terminal-line :global(.achievement-trophy.is-locked:hover) {
          opacity: 0.64;
        }

        .terminal-line :global(.achievement-ascii-cup) {
          margin: 0;
          color: var(--trophy-color);
          font: inherit;
          font-size: clamp(0.4rem, 1.35vw, 0.56rem);
          font-weight: 700;
          line-height: 0.9;
          letter-spacing: 0;
          text-align: left;
          text-shadow: 0 0 8px color-mix(in srgb, var(--trophy-color) 52%, transparent);
          white-space: pre;
        }

        .terminal-line :global(.achievement-trophy.is-unlocked .achievement-ascii-cup) {
          animation: achievement-phosphor 3.2s ease-in-out infinite;
        }

        .terminal-line :global(.achievement-trophy.is-locked .achievement-ascii-cup) {
          text-shadow: none;
        }

        .terminal-line :global(.achievement-trophy-label) {
          width: 100%;
          overflow: hidden;
          color: #334155;
          font-size: 0.58rem;
          font-weight: 700;
          line-height: 1.15;
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        :global(.dark) .terminal-line :global(.achievement-trophy-label) {
          color: #cbd5e1;
        }

        .terminal-line :global(.achievement-shelf-plank) {
          width: 100%;
          margin: 0.1rem 0 0;
          overflow: hidden;
          color: rgba(14, 116, 144, 0.62);
          font: inherit;
          font-size: 0.58rem;
          line-height: 1;
          text-shadow: 0 0 7px rgba(6, 182, 212, 0.2);
          white-space: pre;
        }

        :global(.dark) .terminal-line :global(.achievement-shelf-plank) {
          color: rgba(103, 232, 249, 0.48);
        }

        .terminal-line :global(.achievement-case-note) {
          margin: 0.62rem 0.2rem 0;
          color: #52637a;
          font-size: 0.66rem;
          line-height: 1.35;
        }

        .terminal-line :global(.achievement-case-note::before) {
          color: #0891b2;
          content: "> ";
        }

        :global(.dark) .terminal-line :global(.achievement-case-note) {
          color: #94a3b8;
        }

        @keyframes achievement-shelf-boot {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes achievement-phosphor {
          0%,
          100% {
            opacity: 0.9;
          }
          50% {
            opacity: 1;
            filter: brightness(1.12);
          }
        }

        @media (max-width: 520px) {
          .terminal-line :global(.achievement-case) {
            padding: 0.72rem 0.5rem 0.62rem;
          }

          .terminal-line :global(.achievement-shelf-row) {
            padding-inline: 0.1rem;
          }

          .terminal-line :global(.achievement-trophies) {
            min-height: 71px;
            gap: 0.12rem;
          }

          .terminal-line :global(.achievement-ascii-cup) {
            font-size: clamp(0.32rem, 1.55vw, 0.43rem);
          }

          .terminal-line :global(.achievement-trophy-label) {
            font-size: 0.5rem;
          }

          .terminal-line :global(.achievement-shelf-plank) {
            font-size: 0.48rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .terminal-line :global(.achievement-shelf-row),
          .terminal-line :global(.achievement-trophy.is-unlocked .achievement-ascii-cup) {
            animation: none;
          }
        }

        .terminal-line.command-line {
          color: #383a42;
        }

        :global(.dark) .terminal-line.command-line {
          color: #d4d4d4;
        }

        .terminal-line.error {
          color: #e45649;
        }

        :global(.dark) .terminal-line.error {
          color: #f14c4c;
        }

        .terminal-line.info {
          color: #4078f2;
        }

        :global(.dark) .terminal-line.info {
          color: #3794ff;
        }

        .terminal-line :global(.command) {
          color: #0d7377;
        }

        :global(.dark) .terminal-line :global(.command) {
          color: #4ec9b0;
        }

        .terminal-line :global(.terminal-link) {
          color: #4078f2;
          text-decoration: underline;
        }

        :global(.dark) .terminal-line :global(.terminal-link) {
          color: #3794ff;
        }

        .terminal-line :global(.terminal-link:hover) {
          color: #6699e6;
        }

        :global(.dark) .terminal-line :global(.terminal-link:hover) {
          color: #75beff;
        }

        .terminal-line :global(.skill-category) {
          color: #a626a4;
          font-weight: 600;
        }

        :global(.dark) .terminal-line :global(.skill-category) {
          color: #c586c0;
        }

        .terminal-line :global(.project-name) {
          color: #986801;
        }

        :global(.dark) .terminal-line :global(.project-name) {
          color: #dcdcaa;
        }

        .terminal-line :global(.exp-title) {
          color: #0d7377;
          font-weight: 600;
        }

        :global(.dark) .terminal-line :global(.exp-title) {
          color: #4ec9b0;
        }

        .terminal-line :global(.inherit) {
          color: #383a42;
        }

        :global(.dark) .terminal-line :global(.inherit) {
          color: #d4d4d4;
        }

        /* JSON-intro syntax highlighting (matches design system) */
        .terminal-line :global(.t-prompt) {
          color: #0d7377;
        }
        :global(.dark) .terminal-line :global(.t-prompt) {
          color: #06b6d4;
        }
        .terminal-line :global(.t-cmd) {
          color: #1f2328;
        }
        :global(.dark) .terminal-line :global(.t-cmd) {
          color: #f8fafc;
        }
        .terminal-line :global(.t-out) {
          color: #4b5563;
        }
        :global(.dark) .terminal-line :global(.t-out) {
          color: #94a3b8;
        }
        .terminal-line :global(.json-key) {
          color: #0d7377;
        }
        :global(.dark) .terminal-line :global(.json-key) {
          color: #67e8f9;
        }
        .terminal-line :global(.json-val) {
          color: #b45309;
        }
        :global(.dark) .terminal-line :global(.json-val) {
          color: #fbbf24;
        }
        .terminal-line :global(.json-str) {
          color: #047857;
        }
        :global(.dark) .terminal-line :global(.json-str) {
          color: #a7f3d0;
        }
        .terminal-line :global(.cmt) {
          color: #6b7280;
          font-style: italic;
        }
        :global(.dark) .terminal-line :global(.cmt) {
          color: #64748b;
        }

        .prompt {
          color: #0d7377;
        }

        :global(.dark) .prompt {
          color: #4ec9b0;
        }

        .terminal-input {
          font-family: inherit;
          font-size: inherit;
          caret-color: #383a42;
        }

        :global(.dark) .terminal-input {
          caret-color: #d4d4d4;
        }

        .terminal-input:focus {
          outline: none;
          border: none;
          box-shadow: none;
        }

        .terminal-input::placeholder {
          color: #a0a0a0;
        }

        :global(.dark) .terminal-input::placeholder {
          color: #6a6a6a;
        }
      `}</style>
    </div>
  );
};
