import { FC, useState, useRef, useEffect, KeyboardEvent, useCallback } from "react";
import { TERMINAL_CONFIG, COMMANDS, SOCIAL_LINKS, getCommandOutput, isSpecialCommand, CommandOutput } from "./terminal-commands";
import { RickIntro } from "./rick-intro";

type OutputLine = {
  id: number;
  text: string;
  className?: string;
};

type TerminalProps = {
  onSwitchToEditor: () => void;
  onSwitchToChatbot: () => void;
  onSwitchToGameMenu: () => void;
  triggerChatbot?: boolean;
  onTriggerHandled?: () => void;
  onValidCommand?: (command: string) => void;
  onSourceDiver?: () => void;
  onSecretDiscovered?: () => void;
  onRootAccess?: () => void;
  onBatmanTheme?: () => void;
  onExitBatman?: () => void;
};

export const Terminal: FC<TerminalProps> = ({
  onSwitchToEditor,
  onSwitchToChatbot,
  onSwitchToGameMenu,
  triggerChatbot,
  onTriggerHandled,
  onValidCommand,
  onSourceDiver,
  onSecretDiscovered,
  onRootAccess,
  onBatmanTheme,
  onExitBatman,
}) => {
  const [showIntro, setShowIntro] = useState(true);
  const [outputLines, setOutputLines] = useState<OutputLine[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isPasswordMode, setIsPasswordMode] = useState(false);
  const [lineIdCounter, setLineIdCounter] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const chatbotTimeoutIds = useRef<NodeJS.Timeout[]>([]);

  // Initialize with banner after intro completes
  useEffect(() => {
    if (!showIntro) {
      addLines(COMMANDS.banner, 0);
      // Focus input after mount
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showIntro]);

  // Cleanup chatbot timeouts on unmount
  useEffect(() => {
    return () => {
      chatbotTimeoutIds.current.forEach((id) => clearTimeout(id));
      chatbotTimeoutIds.current = [];
    };
  }, []);

  // Handle external trigger for chatbot
  useEffect(() => {
    if (triggerChatbot) {
      // Clear any existing timeouts
      chatbotTimeoutIds.current.forEach((id) => clearTimeout(id));
      chatbotTimeoutIds.current = [];

      // Run the chatbot loading animation
      chatbotTimeoutIds.current.push(
        setTimeout(() => {
          addLineImmediate(`${TERMINAL_CONFIG.prompt} chatbot`, "command-line");
        }, 0)
      );
      chatbotTimeoutIds.current.push(
        setTimeout(() => {
          addLineImmediate("", undefined);
        }, 50)
      );
      chatbotTimeoutIds.current.push(
        setTimeout(() => {
          addLineImmediate("Initializing Neural Bark Network...", "info");
        }, 130)
      );
      chatbotTimeoutIds.current.push(
        setTimeout(() => {
          addLineImmediate("[#####-----] 50%", "info");
        }, 450)
      );
      chatbotTimeoutIds.current.push(
        setTimeout(() => {
          addLineImmediate("[##########] 100%", "info");
        }, 850)
      );
      chatbotTimeoutIds.current.push(
        setTimeout(() => {
          addLineImmediate("Woof! Connection established.", "info");
        }, 1250)
      );
      chatbotTimeoutIds.current.push(
        setTimeout(() => {
          onTriggerHandled?.();
          onSwitchToChatbot();
        }, 1550)
      );
    }

    return () => {
      chatbotTimeoutIds.current.forEach((id) => clearTimeout(id));
      chatbotTimeoutIds.current = [];
    };
  }, [triggerChatbot, onSwitchToChatbot, onTriggerHandled]);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [outputLines]);

  // Focus input on click
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const addLine = (text: string, className?: string, delay = 0): NodeJS.Timeout => {
    const timeoutId = setTimeout(() => {
      setLineIdCounter((prev) => {
        const newId = prev + 1;
        setOutputLines((lines) => [...lines, { id: newId, text, className }]);
        return newId;
      });
    }, delay);
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
    setOutputLines([]);
  };

  const handleCommand = (cmd: string) => {
    const normalizedCmd = cmd.toLowerCase().trim();

    // Add command to history
    if (cmd.trim()) {
      setCommandHistory((prev) => [...prev, cmd]);
      setHistoryIndex(-1);
    }

    // Add the command line to output
    addLine(`${TERMINAL_CONFIG.prompt} ${cmd}`, "command-line", 0);

    // Handle password mode
    if (isPasswordMode) {
      if (cmd === TERMINAL_CONFIG.password) {
        addLines(COMMANDS.social, 80);
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
        setTimeout(() => {
          onBatmanTheme?.();
          // Scroll to top after theme switch
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 1500);
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
        case "clear":
          clearTerminal();
          return;

        case "history":
          addLine("", undefined, 0);
          commandHistory.forEach((histCmd, index) => {
            addLine(`  ${index + 1}  ${histCmd}`, undefined, (index + 1) * 50);
          });
          addLine("", undefined, (commandHistory.length + 1) * 50);
          return;

        case "email":
          addLine("Opening email client...", "info", 80);
          setTimeout(() => {
            window.open(SOCIAL_LINKS.email, "_blank");
          }, 500);
          return;

        case "resume":
          addLine("Opening resume...", "info", 80);
          setTimeout(() => {
            window.open("/resume", "_blank");
          }, 500);
          return;

        case "code":
          addLine("Opening code editor...", "info", 80);
          onSourceDiver?.();
          setTimeout(() => {
            onSwitchToEditor();
          }, 300);
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
            setTimeout(() => {
              onSwitchToChatbot();
            }, 1500)
          );
          return;

        case "game":
          addLine("", undefined, 0);
          addLine("Loading Games Menu...", "info", 80);
          addLine("[##########] 100%", "info", 400);
          setTimeout(() => {
            onSwitchToGameMenu();
          }, 600);
          return;

        case "sudo":
          addLine("Enter password:", "info", 80);
          setIsPasswordMode(true);
          return;

        case "exitbat":
          addLine("", undefined, 0);
          addLine("Deactivating Dark Knight Protocol...", "info", 80);
          addLine("Returning to normal mode.", "info", 400);
          setTimeout(() => {
            onExitBatman?.();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 600);
          return;
      }
    }

    // Handle regular commands
    const output = getCommandOutput(normalizedCmd);
    if (output) {
      onValidCommand?.(normalizedCmd);
      if (normalizedCmd === "secret") {
        onSecretDiscovered?.();
      }
      addLines(output, 80);
    } else {
      addLine(`Command not found: ${cmd}. Type 'help' for available commands.`, "error", 80);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
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
      className="terminal-wrapper h-full overflow-auto rounded-b-md bg-white dark:bg-[#1e1e1e]"
      onClick={handleTerminalClick}
      ref={terminalRef}
    >
      <div className="terminal-content p-3 font-mono text-[13px] leading-relaxed">
        {/* Output Lines */}
        {outputLines.map((line) => (
          <div
            key={line.id}
            className={`terminal-line ${line.className || ""}`}
            dangerouslySetInnerHTML={{ __html: line.text || "&nbsp;" }}
          />
        ))}

        {/* Input Line - inline with output */}
        <div className="terminal-input-line flex items-center font-mono text-[13px]">
          <span className="prompt select-none whitespace-nowrap text-[#0d7377] dark:text-[#4EC9B0]">
            {TERMINAL_CONFIG.prompt}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="terminal-input ml-1 flex-1 border-none bg-transparent text-[#383a42] outline-none dark:text-[#D4D4D4]"
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
        }

        .terminal-line {
          color: #383a42;
          white-space: pre-wrap;
          word-break: break-word;
          min-height: 1.5em;
        }

        :global(.dark) .terminal-line {
          color: #d4d4d4;
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
