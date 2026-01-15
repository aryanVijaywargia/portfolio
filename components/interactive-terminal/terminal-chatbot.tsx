// components/interactive-terminal/terminal-chatbot.tsx
import { FC, useState, useRef, useEffect, KeyboardEvent } from "react";
import { useChatbot } from "components/_stores/chatbot-store";

const BYTE_ASCII = `
    / \\__
   (    @\\___
   /         O
  /   (_____/
 /_____/   U
`;

const QUICK_ACTIONS = [
  { label: "Who is Aryan?", message: "Who is Aryan?" },
  { label: "Fetch Skills", message: "What are Aryan's technical skills?" },
  { label: "Projects", message: "Tell me about Aryan's projects" },
  { label: "Good Boy!", message: "You're a good boy, Byte!" },
];

type TerminalChatbotProps = {
  onExit: () => void;
};

export const TerminalChatbot: FC<TerminalChatbotProps> = ({ onExit }) => {
  const [input, setInput] = useState("");
  const { messages, isLoading, addMessage, setLoading, clearMessages } = useChatbot();
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

    addMessage({ role: "user", content: content.trim() });
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: content.trim() }].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      if (data.error) {
        addMessage({ role: "assistant", content: `*whimpers* ${data.error}` });
      } else {
        addMessage({ role: "assistant", content: data.message });
      }
    } catch (error) {
      addMessage({ role: "assistant", content: "*confused bark* Something went wrong. Try again?" });
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

  const handleQuickAction = (message: string) => {
    sendMessage(message);
  };

  return (
    <div className="terminal-chatbot h-full flex flex-col bg-[#1e1e1e] font-mono text-[13px]">
      {/* ASCII Dog Header */}
      <div className="text-center py-2 border-b border-[#3c3c3c]">
        <pre className="text-[#4EC9B0] text-[10px] leading-tight inline-block">{BYTE_ASCII}</pre>
        <div className="text-[#DCDCAA] text-sm mt-1">Byte - AI Companion</div>
        <div className="text-[#6A6A6A] text-xs">Type 'exit' or press Esc to return</div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-auto p-3 space-y-2">
        {messages.length === 0 && (
          <div className="text-[#6A6A6A] text-center py-4">
            *wags tail* Woof! I'm Byte. Ask me anything about Aryan!
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            <span className={msg.role === "user" ? "text-[#D4D4D4]" : "text-[#4EC9B0]"}>
              {msg.role === "user" ? "you" : "byte"}
            </span>
            <span className="text-[#6A6A6A]"> › </span>
            <span className={msg.role === "user" ? "text-[#D4D4D4]" : "text-[#98C379]"}>
              {msg.content}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="text-[#4EC9B0] animate-pulse">
            byte <span className="text-[#6A6A6A]">›</span> <span className="text-[#98C379]">*sniffs around*...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-3 py-2 border-t border-[#3c3c3c] flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => handleQuickAction(action.message)}
            disabled={isLoading}
            className="px-2 py-1 text-xs bg-[#3c3c3c] text-[#D4D4D4] rounded hover:bg-[#4c4c4c] disabled:opacity-50 transition-colors"
          >
            [ {action.label} ]
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-[#3c3c3c]">
        <div className="flex items-center">
          <span className="text-[#4EC9B0] select-none">you ›</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Byte something..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-[#D4D4D4] outline-none border-none ml-2 placeholder-[#6A6A6A]"
            autoFocus
          />
        </div>
      </div>

      <style jsx>{`
        .terminal-chatbot {
          font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
        }
        .message {
          word-break: break-word;
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  );
};
