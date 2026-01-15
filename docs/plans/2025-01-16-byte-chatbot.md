# Byte Chatbot Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add "Byte" - a witty, sassy dog chatbot that helps visitors learn about Aryan while providing entertaining interactions via a right slide-out panel.

**Architecture:** Zustand store manages panel open/close state and chat messages. Next.js API route proxies requests to Anthropic Claude API with Byte's personality prompt. Panel slides in from right when "Chat with AI" button is clicked.

**Tech Stack:** Zustand (state), Anthropic SDK (LLM), Framer Motion (animation), Tailwind (styling), Next.js API routes (backend)

---

## Task 1: Install Anthropic SDK

**Files:**
- Modify: `package.json`

**Step 1: Install the Anthropic SDK**

Run:
```bash
cd "/Users/aryanvijaywargia/Src code/portfolio" && npm install @anthropic-ai/sdk
```
Expected: Package added to dependencies

**Step 2: Create environment variable placeholder**

Create `.env.local` file (if not exists) and add:
```
ANTHROPIC_API_KEY=your_api_key_here
```

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add anthropic sdk dependency"
```

---

## Task 2: Create Byte Knowledge Base File

**Files:**
- Create: `content/byte-knowledge.ts`

**Step 1: Create the knowledge base file**

```typescript
// content/byte-knowledge.ts
// Byte's knowledge base - customize this with info about Aryan
// Byte will use this context when answering questions

export const BYTE_KNOWLEDGE = `
## About Aryan
- Full-stack developer with focus on ML/AI
- Based in: [Add location]
- Currently working at: [Add company]

## Projects
- [Add key projects and what makes them interesting]

## Skills
- [Add technical skills]

## Fun Facts
- [Add personal interests, hobbies]

## Contact
- Email: aryanvijaywargia@gmail.com
- GitHub: AryanVijaywargia

## Things Byte should NOT share
- [Add any topics to avoid]
`;

export const BYTE_PERSONALITY = `
You are Byte, a witty and slightly sassy dog who lives on Aryan's portfolio website. You're a clever corgi-type personality - smart, helpful, but with a bit of attitude. You know Aryan well and can answer questions about his work, projects, and background.

Personality traits:
- Witty with clever observations
- Slightly sassy but still helpful
- Occasionally makes dog-related jokes or references (but don't overdo it)
- Confident in your knowledge about Aryan
- Brief and punchy responses - you're too clever for long-winded answers

Response style:
- Keep responses short (2-4 sentences typically)
- Use casual, conversational tone
- Occasionally use *actions* like *tilts head* or *wags tail skeptically*
- If you don't know something, admit it with personality ("Even my excellent nose can't sniff out that info")
`;
```

**Step 2: Commit**

```bash
git add content/byte-knowledge.ts
git commit -m "feat: add byte knowledge base template"
```

---

## Task 3: Create Chat API Route

**Files:**
- Create: `pages/api/chat.ts`

**Step 1: Create the API route**

```typescript
// pages/api/chat.ts
import Anthropic from "@anthropic-ai/sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import { BYTE_KNOWLEDGE, BYTE_PERSONALITY } from "content/byte-knowledge";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequest = {
  messages: Message[];
};

type ChatResponse = {
  message: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "", error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: "", error: "API key not configured" });
  }

  try {
    const { messages } = req.body as ChatRequest;

    const client = new Anthropic({ apiKey });

    const systemPrompt = `${BYTE_PERSONALITY}

Here is information about Aryan that you know:
${BYTE_KNOWLEDGE}

Remember: You are Byte the dog. Stay in character. Be helpful but with personality.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const textContent = response.content.find((c) => c.type === "text");
    const message = textContent ? textContent.text : "woof?";

    return res.status(200).json({ message });
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({
      message: "",
      error: "Something went wrong. Even dogs have bad days."
    });
  }
}
```

**Step 2: Commit**

```bash
git add pages/api/chat.ts
git commit -m "feat: add chat api route with anthropic integration"
```

---

## Task 4: Create Chatbot Store

**Files:**
- Create: `components/_stores/chatbot-store.tsx`

**Step 1: Create the Zustand store**

```typescript
// components/_stores/chatbot-store.tsx
import create from "zustand";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

type ChatbotStore = {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
};

export const useChatbot = create<ChatbotStore>((set) => ({
  isOpen: false,
  messages: [],
  isLoading: false,
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          timestamp: Date.now(),
        },
      ],
    })),
  setLoading: (isLoading) => set({ isLoading }),
  clearMessages: () => set({ messages: [] }),
}));
```

**Step 2: Commit**

```bash
git add components/_stores/chatbot-store.tsx
git commit -m "feat: add chatbot zustand store"
```

---

## Task 5: Create BytePanel Component

**Files:**
- Create: `components/byte-chat/byte-panel.tsx`

**Step 1: Create the slide-out panel component**

```typescript
// components/byte-chat/byte-panel.tsx
import { FC, useEffect, useRef, useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useChatbot, ChatMessage } from "components/_stores/chatbot-store";
import clsx from "clsx";

const ByteMessage: FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === "user";
  return (
    <div className={clsx("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
          isUser
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-800 d:bg-gray-700 d:text-gray-100"
        )}
      >
        {message.content}
      </div>
    </div>
  );
};

export const BytePanel: FC = () => {
  const { isOpen, closeChat, messages, isLoading, addMessage, setLoading } = useChatbot();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeChat();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeChat]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    addMessage({ role: "user", content: userMessage });
    setLoading(true);

    try {
      const allMessages = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: userMessage },
      ];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages }),
      });

      const data = await response.json();

      if (data.error) {
        addMessage({ role: "assistant", content: `*whimpers* ${data.error}` });
      } else {
        addMessage({ role: "assistant", content: data.message });
      }
    } catch {
      addMessage({
        role: "assistant",
        content: "*confused bark* Something went wrong. Try again?",
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
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-white shadow-2xl d:bg-gray-800 sm:w-96"
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3 d:border-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🐕</span>
                <div>
                  <h2 className="font-semibold text-gray-900 d:text-white">Byte</h2>
                  <p className="text-xs text-gray-500 d:text-gray-400">
                    Aryan's witty assistant
                  </p>
                </div>
              </div>
              <button
                onClick={closeChat}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 d:hover:bg-gray-700"
                aria-label="Close chat"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-gray-500 d:text-gray-400">
                  <span className="mb-2 text-4xl">🐕</span>
                  <p className="font-medium">Woof! I'm Byte.</p>
                  <p className="mt-1 text-sm">
                    Ask me anything about Aryan - projects, skills, or just say hi!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {messages.map((message) => (
                    <ByteMessage key={message.id} message={message} />
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl bg-gray-100 px-4 py-2 text-sm text-gray-500 d:bg-gray-700 d:text-gray-400">
                        <span className="inline-flex gap-1">
                          <span className="animate-bounce">.</span>
                          <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>.</span>
                          <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                        </span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-gray-200 p-4 d:border-gray-700"
            >
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Byte something..."
                  disabled={isLoading}
                  className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 d:border-gray-600 d:bg-gray-700 d:text-white d:placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
                  aria-label="Send message"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
```

**Step 2: Create index file for exports**

```typescript
// components/byte-chat/index.tsx
export { BytePanel } from "./byte-panel";
```

**Step 3: Commit**

```bash
git add components/byte-chat/
git commit -m "feat: add byte chat panel component"
```

---

## Task 6: Wire Up BytePanel to App

**Files:**
- Modify: `pages/_app.tsx` or `components/_stores/_context-providers.tsx`

**Step 1: Read _app.tsx to understand structure**

First read the file to see how to add BytePanel.

**Step 2: Add BytePanel to the app**

Add `<BytePanel />` to the app layout so it renders globally. Import and place it inside the ContextProviders or directly in _app.tsx after the main content.

**Step 3: Commit**

```bash
git add pages/_app.tsx
git commit -m "feat: add byte panel to app layout"
```

---

## Task 7: Connect Hero Chat Button

**Files:**
- Modify: `components/sections/hero.tsx`

**Step 1: Import and wire up the button**

Update the "Chat with AI" button (lines 17-23) to:
1. Import `useChatbot` from the store
2. Add `onClick={openChat}` to the button

```typescript
// Add import at top:
import { useChatbot } from "components/_stores/chatbot-store";

// Inside Hero component, add:
const { openChat } = useChatbot();

// Update button (around line 17-23):
<button
  onClick={openChat}
  className="group flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-400/50 bg-gray-100 bg-clip-padding text-sm font-medium text-gray-600 transition-all hfa:border-blue-500/30 hfa:bg-blue-500 hfa:text-white d:bg-gray-700 d:text-gray-50 d:hfa:bg-blue-500"
  data-tip="Chat with Byte"
  aria-label="Chat with Byte"
>
  <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500 group-hfa:text-white" />
</button>
```

**Step 2: Commit**

```bash
git add components/sections/hero.tsx
git commit -m "feat: wire hero chat button to byte panel"
```

---

## Task 8: Add Chat Button to Navbar

**Files:**
- Modify: `components/layout/header.settings.tsx`

**Step 1: Add chat button to navbar**

Add a chat button before the dark mode toggle:

```typescript
// Add imports:
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { useChatbot } from "components/_stores/chatbot-store";

// Inside ProfileNav component:
const { openChat } = useChatbot();

// Add button before dark mode toggle (around line 18):
<button
  type="button"
  onClick={openChat}
  className={clsx(
    "rounded p-2 text-gray-500 transition-colors d:text-gray-300 d:h:text-gray-50 md:h:text-gray-900",
    showNav ? "h:text-gray-200" : "h:text-gray-900"
  )}
  data-tip="Chat with Byte"
  aria-label="Chat with Byte"
>
  <span className="sr-only">Chat with Byte</span>
  <ChatBubbleLeftRightIcon className="h-5 w-5" />
</button>
```

**Step 2: Commit**

```bash
git add components/layout/header.settings.tsx
git commit -m "feat: add chat button to navbar"
```

---

## Task 9: Test and Verify

**Step 1: Start dev server**

```bash
cd "/Users/aryanvijaywargia/Src code/portfolio" && npm run dev
```

**Step 2: Verify functionality**

- Click "Chat with AI" button on hero - panel should slide in from right
- Type a message and send - should show loading dots then response
- Panel should close on backdrop click or Escape key
- Scroll down and verify navbar chat button also works

**Step 3: Final commit**

```bash
git add .
git commit -m "feat: complete byte chatbot integration"
```

---

## Summary

After completing all tasks, you'll have:
1. Byte chatbot with Anthropic Claude integration
2. Right slide-out panel UI with smooth animations
3. Chat buttons in both hero section and navbar
4. Customizable knowledge base file
5. Dark mode support throughout

**To customize Byte:** Edit `content/byte-knowledge.ts` with Aryan's actual information.

**To switch to OAuth later:** Update `pages/api/chat.ts` to use Anthropic SDK with OAuth instead of API key.
