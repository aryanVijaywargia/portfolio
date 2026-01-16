# Terminal-Integrated Chatbot Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the terminal into a retro-styled chatbot interface when user types `chatbot` or clicks the header

**Architecture:** Add `"chatbot"` mode to existing terminal mode switching. When activated, terminal expands to center screen with backdrop, renders ASCII dog + IRC-style chat interface

**Tech Stack:** React, Zustand (existing store), Framer Motion (for expand animation), existing Anthropic API route

---

## Cleanup: Remove BytePanel Slide-out (No Longer Needed)

Before implementing the new terminal-integrated chatbot, we need to remove the slide-out panel components that are no longer used.

**Files to Delete:**
- `components/byte-chat/byte-panel.tsx`
- `components/byte-chat/index.tsx`

**Files to Modify:**
- `pages/_app.tsx` - Remove BytePanel import and usage
- `components/sections/hero.tsx` - Remove useChatbot import and openChat usage (button will work differently)
- `components/layout/header.settings.tsx` - Remove chat button from navbar

**Keep:**
- `components/_stores/chatbot-store.tsx` - Still useful for chat state
- `content/byte-knowledge.ts` - Still used by API
- `pages/api/chat.ts` - Still used as backend

---

## Task 1: Cleanup - Remove BytePanel and Related Wiring

**Files:**
- Delete: `components/byte-chat/byte-panel.tsx`
- Delete: `components/byte-chat/index.tsx`
- Modify: `pages/_app.tsx`
- Modify: `components/sections/hero.tsx`
- Modify: `components/layout/header.settings.tsx`

**Step 1: Remove BytePanel from _app.tsx**

In `pages/_app.tsx`, remove the BytePanel import and component:

```typescript
// REMOVE this import
import { BytePanel } from "components/byte-chat";

// REMOVE <BytePanel /> from the JSX (after Footer)
```

**Step 2: Remove chat button wiring from hero.tsx**

In `components/sections/hero.tsx`, remove the chatbot store usage:

```typescript
// REMOVE this import
import { useChatbot } from "components/_stores/chatbot-store";

// REMOVE this line inside the component
const { openChat } = useChatbot();

// REMOVE onClick={openChat} from the button (keep the button, just remove onClick)
```

**Step 3: Remove chat button from header.settings.tsx**

In `components/layout/header.settings.tsx`, remove the chat button entirely:

```typescript
// REMOVE the ChatBubbleLeftRightIcon import
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";

// REMOVE the useChatbot import
import { useChatbot } from "components/_stores/chatbot-store";

// REMOVE const { openChat } = useChatbot();

// REMOVE the entire chat button JSX block
```

**Step 4: Delete byte-chat directory**

```bash
rm -rf components/byte-chat/
```

**Step 5: Verify build**

```bash
npm run build
```

**Step 6: Commit**

```bash
git add -A
git commit -m "refactor: remove slide-out BytePanel in favor of terminal integration"
```

---

## Task 2: Add `chatbot` Mode to Terminal Index

**Files:**
- Modify: `components/interactive-terminal/index.tsx`

**Step 1: Update mode type and add expanded state**

At line 12, change the mode type:

```typescript
const [mode, setMode] = useState<"terminal" | "editor" | "chatbot">("terminal");
const [isExpanded, setIsExpanded] = useState(false);
```

**Step 2: Add chatbot mode handlers**

After line 20, add:

```typescript
const handleSwitchToChatbot = () => {
  setMode("chatbot");
  setIsExpanded(true);
};

const handleExitChatbot = () => {
  setMode("terminal");
  setIsExpanded(false);
};
```

**Step 3: Update title logic**

Change line 22:

```typescript
const title = mode === "terminal"
  ? "aryan@macbook — zsh"
  : mode === "editor"
    ? "/index.tsx"
    : "🐕 Byte v1.0 (Connected)";
```

**Step 4: Add header click handler**

Wrap the title span (lines 68-72) with click handler:

```typescript
<div
  className="flex-1 text-center cursor-pointer"
  onClick={mode === "terminal" ? handleSwitchToChatbot : undefined}
  title={mode === "terminal" ? "Launch Byte" : undefined}
>
  <span className="text-[#9d9d9d] text-xs font-medium select-none">
    {title}
  </span>
</div>
```

**Step 5: Update traffic light buttons for chatbot mode**

The red button should exit chatbot mode. Update lines 31-42:

```typescript
<button
  onClick={mode === "editor" ? handleSwitchToTerminal : mode === "chatbot" ? handleExitChatbot : undefined}
  className={`traffic-light w-3 h-3 rounded-full bg-[#ff5f57] flex items-center justify-center group ${
    mode !== "terminal" ? "cursor-pointer" : ""
  }`}
  aria-label={mode !== "terminal" ? "Close" : undefined}
>
  {mode !== "terminal" && (
    <svg className="w-2 h-2 text-[#4a0002] opacity-0 group-hover:opacity-100" viewBox="0 0 12 12" fill="currentColor">
      <path d="M6 4.586L9.293 1.293a1 1 0 111.414 1.414L7.414 6l3.293 3.293a1 1 0 01-1.414 1.414L6 7.414l-3.293 3.293a1 1 0 01-1.414-1.414L4.586 6 1.293 2.707a1 1 0 011.414-1.414L6 4.586z"/>
    </svg>
  )}
</button>
```

**Step 6: Pass callback to Terminal component**

Update line 88:

```typescript
<Terminal onSwitchToEditor={handleSwitchToEditor} onSwitchToChatbot={handleSwitchToChatbot} />
```

**Step 7: Commit**

```bash
git add components/interactive-terminal/index.tsx
git commit -m "feat: add chatbot mode and header click handler to terminal"
```

---

## Task 3: Add `chatbot` Command to Terminal

**Files:**
- Modify: `components/interactive-terminal/terminal-commands.ts`
- Modify: `components/interactive-terminal/terminal.tsx`

**Step 1: Add chatbot to SPECIAL_COMMANDS**

In `terminal-commands.ts`, line 182:

```typescript
export const SPECIAL_COMMANDS = ["clear", "history", "email", "resume", "code", "sudo", "education", "chatbot"];
```

**Step 2: Add chatbot to help menu**

In the `help` command array (around line 38), add:

```typescript
{ text: '<span class="command">chatbot</span>        Launch Byte, the AI companion' },
```

**Step 3: Update Terminal props type**

In `terminal.tsx`, update TerminalProps (line 17):

```typescript
type TerminalProps = {
  onSwitchToEditor: () => void;
  onSwitchToChatbot: () => void;
};
```

**Step 4: Destructure new prop**

Line 21:

```typescript
export const Terminal: FC<TerminalProps> = ({ onSwitchToEditor, onSwitchToChatbot }) => {
```

**Step 5: Add chatbot command handler**

In the special commands switch (after the `code` case, around line 130):

> **Important:** The chatbot loading sequence schedules multiple setTimeouts. To prevent memory leaks and state updates after unmount, store all timeout IDs in a ref (e.g., `chatbotTimeoutIds`) and clear them in a useEffect cleanup or before starting a new sequence.

```typescript
// At the component level, add a ref to track timeout IDs:
const chatbotTimeoutIds = useRef<NodeJS.Timeout[]>([]);

// Add cleanup in useEffect:
useEffect(() => {
  return () => {
    chatbotTimeoutIds.current.forEach((id) => clearTimeout(id));
    chatbotTimeoutIds.current = [];
  };
}, []);

// In the switch case:
case "chatbot":
  // Clear any existing chatbot timeouts
  chatbotTimeoutIds.current.forEach((id) => clearTimeout(id));
  chatbotTimeoutIds.current = [];

  chatbotTimeoutIds.current.push(addLine("", undefined, 0));
  chatbotTimeoutIds.current.push(addLine("Initializing Neural Bark Network...", "info", 80));
  chatbotTimeoutIds.current.push(addLine("[#####-----] 50%", "info", 400));
  chatbotTimeoutIds.current.push(addLine("[##########] 100%", "info", 800));
  chatbotTimeoutIds.current.push(addLine("Woof! Connection established.", "info", 1200));
  chatbotTimeoutIds.current.push(
    setTimeout(() => {
      onSwitchToChatbot();
    }, 1500)
  );
  return;
```

> **Note:** Modify the `addLine` function to return the timeout ID so it can be tracked.

**Step 6: Commit**

```bash
git add components/interactive-terminal/terminal-commands.ts components/interactive-terminal/terminal.tsx
git commit -m "feat: add chatbot command with loading animation"
```

---

## Environment & Setup Prerequisites

Before implementing the chatbot, ensure the following environment setup is complete:

### Required Environment Variables

The `/api/chat` endpoint requires an `ANTHROPIC_API_KEY` to function. Set this in `.env.local`:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

### Behavior When API Key is Missing

- **Production:** The API will return a 500 error with message "API key not configured"
- **Development/Mock Mode:** Set `MOCK_CHATBOT=true` in `.env.local` to enable mock responses without an API key

### Affected Runtime Components

1. **`/api/chat` endpoint** - Requires the API key to call Anthropic Claude
2. **`TerminalChatbot.sendMessage`** - Will receive error responses if API key is missing

### Mock Mode (Optional)

To run the chatbot without an API key (for UI development/testing):

1. Set `MOCK_CHATBOT=true` in `.env.local`
2. The API will return predefined mock responses instead of calling Anthropic
3. Useful for frontend development and CI testing

---

## Task 4: Create TerminalChatbot Component

**Files:**
- Create: `components/interactive-terminal/terminal-chatbot.tsx`

**Step 1: Create the retro-styled chatbot component**

```typescript
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
```

**Step 2: Commit**

```bash
git add components/interactive-terminal/terminal-chatbot.tsx
git commit -m "feat: create retro-styled terminal chatbot component"
```

---

## Task 5: Add Expand Animation and Chatbot Rendering

**Files:**
- Modify: `components/interactive-terminal/index.tsx`

**Step 1: Add imports**

At the top of the file:

```typescript
import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "./terminal";
import { TerminalChatbot } from "./terminal-chatbot";
import { CopyButton } from "components/copy-button";
import { Code, CodeGroupProps } from "components/typography/code";
```

**Step 2: Wrap figure with AnimatePresence and motion**

Replace the entire `<figure>` element with an animated version. The key change is:
- When `isExpanded` is true, show backdrop and center the terminal
- Use `motion.figure` with layout animation

```typescript
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
          ? "fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl h-[80vh]"
          : "w-full h-full min-h-[380px]"
      }`}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      {/* ... rest of the component (header and main) ... */}
    </motion.figure>
  </>
);
```

**Step 3: Add chatbot rendering in main**

Update the main content area (lines 86-94):

```typescript
<main className="terminal-content flex-1 bg-[#1e1e1e] overflow-hidden">
  {mode === "terminal" ? (
    <Terminal onSwitchToEditor={handleSwitchToEditor} onSwitchToChatbot={handleSwitchToChatbot} />
  ) : mode === "editor" ? (
    <div className="h-full overflow-auto p-3">
      <Code className="text-[13px]" code={code} language={language} />
    </div>
  ) : (
    <TerminalChatbot onExit={handleExitChatbot} />
  )}
</main>
```

**Step 4: Commit**

```bash
git add components/interactive-terminal/index.tsx
git commit -m "feat: add expand animation and chatbot mode rendering"
```

---

## Task 6: Handle Exit Command in Chatbot

**Files:**
- Modify: `components/interactive-terminal/terminal-chatbot.tsx`

**Step 1: Add exit command detection with proper cleanup**

The exit flow uses setTimeout without cancellation and lacks a guard against further input. Fix by:

1. Adding an `isExiting` ref to prevent actions during exit
2. Storing the timeout ID for cleanup
3. Clearing the timeout on unmount or new messages

In the `sendMessage` function, before the API call:

```typescript
// At component level, add refs:
const isExitingRef = useRef(false);
const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

// Cleanup on unmount
useEffect(() => {
  return () => {
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
    }
  };
}, []);

const sendMessage = async (content: string) => {
  // Block actions while exiting
  if (isExitingRef.current) return;
  if (!content.trim() || isLoading) return;

  // Handle exit command
  if (content.trim().toLowerCase() === "exit") {
    isExitingRef.current = true;
    addMessage({ role: "user", content: "exit" });
    addMessage({ role: "assistant", content: "*yawns* Connection terminated. Companion sleeping. 💤" });

    // Store timeout for cleanup
    exitTimeoutRef.current = setTimeout(() => {
      if (isExitingRef.current) {
        clearMessages();
        onExit();
      }
    }, 1000);
    return;
  }

  // ... rest of the function
};
```

> **Key improvements:**
> - `isExitingRef` prevents further input during the exit sequence
> - `exitTimeoutRef` allows cleanup on unmount
> - Conditional check in timeout ensures exit only happens if still exiting

**Step 2: Commit**

```bash
git add components/interactive-terminal/terminal-chatbot.tsx
git commit -m "feat: add exit command handling in chatbot"
```

---

## Task 7: Test Full Flow

**Step 1: Start dev server**

```bash
npm run dev
```

**Step 2: Test chatbot command**

1. Type `chatbot` in terminal
2. Verify loading animation shows: "Initializing Neural Bark Network..."
3. Verify terminal expands to center with backdrop
4. Verify ASCII dog and retro chat interface appears

**Step 3: Test header click**

1. Refresh page
2. Click on terminal title "aryan@macbook — zsh"
3. Verify chatbot opens (same as typing command)

**Step 4: Test chat functionality**

1. Click a quick action button
2. Verify message sends and response appears
3. Type a custom message and press Enter
4. Verify response appears

**Step 5: Test exit**

1. Type "exit" in chatbot
2. Verify exit message shows
3. Verify chatbot closes and terminal returns
4. Test clicking red traffic light (should also exit)
5. Test pressing Escape key (should also exit)
6. Test clicking backdrop (should also exit)

**Step 6: Commit**

```bash
git add -A
git commit -m "test: verify terminal chatbot integration"
```

---

## Task 8: Add Help Text for Chatbot Discovery

**Files:**
- Modify: `components/interactive-terminal/terminal-commands.ts`

**Step 1: Update banner to hint at chatbot**

In the `banner` command, add a hint:

```typescript
banner: [
  { text: "" },
  { text: '    _                           ____          _           ' },
  { text: '   / \\   _ __ _   _  __ _ _ __ / ___|___   __| | ___  ___ ' },
  { text: "  / _ \\ | '__| | | |/ _` | '_ \\ |   / _ \\ / _` |/ _ \\/ __|" },
  { text: ' / ___ \\| |  | |_| | (_| | | | | |__| (_) | (_| |  __/\\__ \\' },
  { text: '/_/   \\_\\_|   \\__, |\\__,_|_| |_|\\____\\___/ \\__,_|\\___||___/' },
  { text: '              |___/                                        ' },
  { text: "" },
  { text: "Welcome to my interactive terminal portfolio!" },
  { text: 'Type <span class="command">help</span> for a list of available commands.' },
  { text: 'Or type <span class="command">chatbot</span> to talk to Byte, my AI companion! 🐕' },
  { text: "" },
],
```

**Step 2: Commit**

```bash
git add components/interactive-terminal/terminal-commands.ts
git commit -m "feat: add chatbot hint to terminal banner"
```

---

## Summary of Reused vs New Code

**Reused from feature/chatbot:**
- `components/_stores/chatbot-store.tsx` - State management (unchanged)
- `content/byte-knowledge.ts` - Byte's personality and knowledge (unchanged)
- `pages/api/chat.ts` - Anthropic API route (unchanged)

**Deleted:**
- `components/byte-chat/byte-panel.tsx` - No longer needed
- `components/byte-chat/index.tsx` - No longer needed

**New/Modified:**
- `components/interactive-terminal/index.tsx` - Added chatbot mode, expand animation
- `components/interactive-terminal/terminal.tsx` - Added chatbot command callback
- `components/interactive-terminal/terminal-commands.ts` - Added chatbot command
- `components/interactive-terminal/terminal-chatbot.tsx` - New retro chat UI

---

## Execution Choice

**Plan complete and saved to `docs/plans/2025-01-16-terminal-chatbot.md`. Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
