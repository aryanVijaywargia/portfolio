// components/interactive-terminal/terminal-chatbot.tsx
import { FC, useState, useRef, useEffect, KeyboardEvent } from "react";
import { useChatbot } from "components/_stores/chatbot-store";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_ACTIONS = [
  { label: "about", message: "Who is Aryan?" },
  { label: "skills", message: "What are Aryan's technical skills?" },
  { label: "projects", message: "Tell me about Aryan's projects" },
  { label: "contact", message: "How can I contact Aryan?" },
];

type TerminalChatbotProps = {
  onExit: () => void;
  onMessageSent?: (message: string) => void;
};

export const TerminalChatbot: FC<TerminalChatbotProps> = ({ onExit, onMessageSent }) => {
  const [input, setInput] = useState("");
  const messages = useChatbot((state) => state.messages);
  const isLoading = useChatbot((state) => state.isLoading);
  const addMessage = useChatbot((state) => state.addMessage);
  const setLoading = useChatbot((state) => state.setLoading);
  const clearMessages = useChatbot((state) => state.clearMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    if (content.trim().toLowerCase() === "exit") {
      addMessage({ role: "user", content: "exit" });
      addMessage({ role: "assistant", content: "Woof! Goodbye! *curls up to sleep* 💤" });
      setTimeout(
        () => {
          clearMessages();
          onExit();
        },
        800
      );
      return;
    }

    addMessage({ role: "user", content: content.trim() });
    onMessageSent?.(content.trim());
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: content.trim() }].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      if (data.error) {
        addMessage({ role: "assistant", content: data.error });
      } else {
        addMessage({ role: "assistant", content: data.message });
      }
    } catch (error) {
      addMessage({
        role: "assistant",
        content: "*whimpers* Connection error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    } else if (e.key === "Escape") {
      onExit();
    }
  };

  return (
    <div className="terminal-chatbot flex h-full flex-col overflow-hidden bg-[#1e1e1e]">
      {/* Messages Area */}
      <div className="flex-1 overflow-auto p-3">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex h-full flex-col items-center justify-center"
          >
            {/* ASCII Dog */}
            <pre className="mb-4 text-[11px] leading-tight text-[#4EC9B0]">
              {`    / \\__
   (    @\\___
   /         O
  /   (_____/
 /_____/   U`}
            </pre>
            <div className="mb-2 text-sm text-[#D4D4D4]">
              Woof! I'm <span className="text-[#4EC9B0]">Byte</span>, Aryan's AI companion.
            </div>
            <div className="text-xs text-[#6A6A6A]">
              Ask me anything or type <span className="text-[#4EC9B0]">'exit'</span> to return.
            </div>
          </motion.div>
        )}

        <div className="space-y-3">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="terminal-message"
              >
                {/* Prompt line */}
                <div className="flex items-start gap-1">
                  <span className="select-none text-[#4EC9B0]">
                    {msg.role === "user" ? "you" : "byte"}
                  </span>
                  <span className="select-none text-[#6A6A6A]">›</span>
                  <span className={msg.role === "user" ? "text-[#D4D4D4]" : "text-[#D4D4D4]"}>
                    {msg.content}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading state */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="flex items-start gap-1"
            >
              <span className="select-none text-[#4EC9B0]">byte</span>
              <span className="select-none text-[#6A6A6A]">›</span>
              <span className="text-[#3794FF]">
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  *sniffing around*...
                </motion.span>
              </span>
            </motion.div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Commands */}
      <div className="border-t border-[#2a2a2a] px-3 py-2">
        <div className="mb-2 text-[11px] text-[#6A6A6A]">Quick commands:</div>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              onClick={() => sendMessage(action.message)}
              disabled={isLoading}
              className="rounded border border-[#3c3c3c] bg-[#2a2a2a] px-2 py-1 text-[11px] text-[#D4D4D4] transition-all duration-150 hover:border-[#4EC9B0] hover:text-[#4EC9B0] disabled:opacity-40"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-[#2a2a2a] p-3">
        <div className="flex items-center gap-1">
          <span className="select-none whitespace-nowrap text-[#4EC9B0]">you ›</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Byte something..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-[13px] text-[#D4D4D4] placeholder-[#6A6A6A] caret-[#D4D4D4] outline-none"
            autoFocus
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            className="text-[#6A6A6A] transition-colors duration-150 hover:text-[#4EC9B0] disabled:opacity-40"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] text-[#6A6A6A]">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
            <span>Connected</span>
          </div>
          <span>
            Press{" "}
            <kbd className="rounded border border-[#3c3c3c] bg-[#2a2a2a] px-1 py-0.5">Esc</kbd> to
            exit
          </span>
        </div>
      </div>

      <style jsx>{`
        .terminal-chatbot {
          font-family: "Menlo", "Monaco", "Courier New", monospace;
          font-size: 13px;
          line-height: 1.6;
        }

        .terminal-message {
          white-space: pre-wrap;
          word-break: break-word;
        }

        /* Scrollbar matching terminal */
        .terminal-chatbot ::-webkit-scrollbar {
          width: 8px;
        }
        .terminal-chatbot ::-webkit-scrollbar-track {
          background: #1e1e1e;
        }
        .terminal-chatbot ::-webkit-scrollbar-thumb {
          background: #3c3c3c;
          border-radius: 4px;
        }
        .terminal-chatbot ::-webkit-scrollbar-thumb:hover {
          background: #4c4c4c;
        }
      `}</style>
    </div>
  );
};
