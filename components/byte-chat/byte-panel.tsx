import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useChatbot, ChatMessage } from "components/_stores/chatbot-store";
import clsx from "clsx";
import { FC, useEffect, useRef, useState, FormEvent } from "react";

const MessageBubble: FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={clsx(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={clsx(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
          isUser
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-800 d:bg-gray-700 d:text-gray-100"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};

const LoadingIndicator: FC = () => (
  <div className="flex justify-start">
    <div className="flex items-center gap-1.5 rounded-2xl bg-gray-100 px-4 py-3 d:bg-gray-700">
      <motion.span
        className="h-2 w-2 rounded-full bg-gray-400 d:bg-gray-500"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
      />
      <motion.span
        className="h-2 w-2 rounded-full bg-gray-400 d:bg-gray-500"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
      />
      <motion.span
        className="h-2 w-2 rounded-full bg-gray-400 d:bg-gray-500"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
      />
    </div>
  </div>
);

export const BytePanel: FC = () => {
  const { isOpen, closeChat, messages, addMessage, isLoading, setLoading } = useChatbot();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeChat();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeChat]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    // Add user message
    addMessage({ role: "user", content: trimmedInput });
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedInput }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      addMessage({ role: "assistant", content: data.response });
    } catch (error) {
      addMessage({
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={closeChat}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl d:bg-gray-800"
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3 d:border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-2xl" role="img" aria-label="Byte">
                  🤖
                </span>
                <div>
                  <h2 className="font-semibold text-gray-900 d:text-white">Byte</h2>
                  <p className="text-xs text-gray-500 d:text-gray-400">AI Assistant</p>
                </div>
              </div>
              <button
                onClick={closeChat}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 d:text-gray-400 d:hover:bg-gray-700 d:hover:text-gray-200"
                aria-label="Close chat"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </header>

            {/* Messages */}
            <main className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-3">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <span className="mb-4 text-5xl" role="img" aria-label="Wave">
                      👋
                    </span>
                    <h3 className="mb-2 text-lg font-medium text-gray-900 d:text-white">
                      Hey there!
                    </h3>
                    <p className="max-w-xs text-sm text-gray-500 d:text-gray-400">
                      I'm Byte, Aryan's AI assistant. Ask me anything about his work, skills, or experience!
                    </p>
                  </div>
                )}
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {isLoading && <LoadingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </main>

            {/* Input Form */}
            <footer className="border-t border-gray-200 p-4 d:border-gray-700">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 d:border-gray-600 d:bg-gray-700 d:text-white d:placeholder:text-gray-400 d:focus:border-blue-400"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={clsx(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-all",
                    input.trim() && !isLoading
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-200 text-gray-400 d:bg-gray-700 d:text-gray-500"
                  )}
                  aria-label="Send message"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </form>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
