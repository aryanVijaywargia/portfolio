import { FC, useState } from "react";
import { Terminal } from "./terminal";
import { CopyButton } from "components/copy-button";
import { Code, CodeGroupProps } from "components/typography/code";

type InteractiveTerminalProps = {
  code: string | string[];
  language: CodeGroupProps["language"];
};

export const InteractiveTerminal: FC<InteractiveTerminalProps> = ({ code, language }) => {
  const [mode, setMode] = useState<"terminal" | "editor">("terminal");

  const handleSwitchToEditor = () => {
    setMode("editor");
  };

  const handleSwitchToTerminal = () => {
    setMode("terminal");
  };

  const title = mode === "terminal" ? "aryan@macbook — zsh" : "/index.tsx";

  return (
    <figure className="terminal-window relative w-full h-full min-h-[380px] flex flex-col overflow-hidden rounded-lg shadow-2xl">
      {/* macOS Window Title Bar */}
      <header className="terminal-titlebar flex items-center h-8 px-3 bg-[#3c3c3c] rounded-t-lg border-b border-[#2a2a2a]">
        {/* Traffic Light Buttons */}
        <div className="flex items-center gap-2">
          {/* Red - Close */}
          <button
            onClick={mode === "editor" ? handleSwitchToTerminal : undefined}
            className={`traffic-light w-3 h-3 rounded-full bg-[#ff5f57] flex items-center justify-center group ${
              mode === "editor" ? "cursor-pointer" : ""
            }`}
            aria-label={mode === "editor" ? "Close" : undefined}
          >
            {mode === "editor" && (
              <svg className="w-2 h-2 text-[#4a0002] opacity-0 group-hover:opacity-100" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 4.586L9.293 1.293a1 1 0 111.414 1.414L7.414 6l3.293 3.293a1 1 0 01-1.414 1.414L6 7.414l-3.293 3.293a1 1 0 01-1.414-1.414L4.586 6 1.293 2.707a1 1 0 011.414-1.414L6 4.586z"/>
              </svg>
            )}
          </button>
          {/* Yellow - Minimize */}
          <button
            className="traffic-light w-3 h-3 rounded-full bg-[#febc2e] flex items-center justify-center group"
            aria-label="Minimize"
          >
            <svg className="w-2 h-2 text-[#985700] opacity-0 group-hover:opacity-100" viewBox="0 0 12 12" fill="currentColor">
              <rect x="1" y="5.5" width="10" height="1"/>
            </svg>
          </button>
          {/* Green - Maximize/Zoom */}
          <button
            onClick={mode === "editor" ? handleSwitchToTerminal : undefined}
            className={`traffic-light w-3 h-3 rounded-full bg-[#28c840] flex items-center justify-center group ${
              mode === "editor" ? "cursor-pointer" : ""
            }`}
            aria-label={mode === "editor" ? "Exit fullscreen" : "Fullscreen"}
          >
            <svg className="w-2 h-2 text-[#006500] opacity-0 group-hover:opacity-100" viewBox="0 0 12 12" fill="currentColor">
              <path d="M5 1H1v4h1V2.707l3.146 3.147.708-.708L2.707 2H5V1zm6 5h-1v2.293L6.854 5.146l-.708.708L9.293 9H7v1h4V6z"/>
            </svg>
          </button>
        </div>

        {/* Window Title */}
        <div className="flex-1 text-center">
          <span className="text-[#9d9d9d] text-xs font-medium select-none">
            {title}
          </span>
        </div>

        {/* Right side - Copy button for editor mode */}
        <div className="w-14 flex justify-end">
          {mode === "editor" && (
            <CopyButton
              content={Array.isArray(code) ? code.join("\n") : code}
              className="text-gray-400 hover:text-white"
            />
          )}
        </div>
      </header>

      {/* Terminal/Editor Content */}
      <main className="terminal-content flex-1 bg-[#1e1e1e] overflow-hidden">
        {mode === "terminal" ? (
          <Terminal onSwitchToEditor={handleSwitchToEditor} />
        ) : (
          <div className="h-full overflow-auto p-3">
            <Code className="text-[13px]" code={code} language={language} />
          </div>
        )}
      </main>

      <style jsx>{`
        .terminal-window {
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.1),
            0 4px 6px rgba(0, 0, 0, 0.1),
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
  );
};

export default InteractiveTerminal;
