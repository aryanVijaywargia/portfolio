# Interactive Terminal Feature Design

## Overview

Replace the static code editor in the hero section with an interactive terminal that allows users to explore information about Aryan through commands. The code editor remains accessible via a `code` command.

## Architecture

### Component Structure

```
components/
  interactive-terminal/
    index.tsx              # Main component with mode switching
    terminal.tsx           # Terminal view with input/output
    terminal-commands.ts   # Command definitions and handlers
```

### State Management

Uses React useState to track:
- `mode`: "terminal" | "editor" (default: terminal)
- `commandHistory`: array of past commands
- `historyIndex`: current position in command history
- `outputLines`: array of terminal output lines
- `currentInput`: string for the input field
- `isPasswordMode`: boolean for sudo command

### Integration

- Replaces `<CodeEditor>` in `components/sections/hero.tsx`
- Reuses existing `CodeEditor` component for "editor" mode
- Content sourced from v1 terminal + v2 content files

## Commands

| Command | Description |
|---------|-------------|
| `help` | Show all available commands |
| `whois` | About Aryan - bio and background |
| `whoami` | Philosophical response |
| `social` | Links to social profiles |
| `projects` | List projects |
| `skills` | Display tech stack/skills |
| `experience` | Work history summary |
| `email` | Open email client |
| `resume` | Open/download resume |
| `code` | Switch to code editor view |
| `clear` | Clear terminal output |
| `banner` | Redisplay welcome message |
| `history` | Show command history |
| `secret` | Easter egg hint (sudo) |
| `sudo` | Password-protected easter egg |

## UI/UX

### Terminal View

- macOS-style window chrome (red/yellow/green buttons)
- Title bar: `~/aryan`
- Prompt: `visitor@aryancodes.com:~$`
- Blinking block cursor (█)
- Command history navigation (up/down arrows)
- Auto-scroll to bottom on new output
- Gradient fade at bottom

### Code Editor View

- Same macOS window chrome
- Title bar: `/index.tsx`
- Red button (X) → returns to terminal
- Green button → returns to terminal (minimize)
- Uses existing `CodeEditor` component internally

### Transitions

- Smooth fade/scale transition between modes
- Output animation: lines appear sequentially (~80ms delay)

## Data Flow

```
User types → Updates currentInput state
Enter key → Parse command → Execute handler → Append output lines
Up/Down arrows → Navigate command history
```

### Content Sources

- `whois`: v1 terminal content + v2 hero content
- `social`: Actual social links (GitHub, LinkedIn, Twitter, etc.)
- `skills`: From v2's HERO.tech array
- `projects`: From v2's portfolio content
- `experience`: From v2's timeline content
- `resume`: Link to resume PDF

### Password Feature (sudo)

- Input masked with asterisks
- Correct password reveals special content
- Password: `aryancodes`

## Implementation Steps

1. Create feature branch `feature/interactive-terminal`
2. Create `components/interactive-terminal/terminal-commands.ts` with command definitions
3. Create `components/interactive-terminal/terminal.tsx` with terminal UI
4. Create `components/interactive-terminal/index.tsx` with mode switching
5. Update `components/sections/hero.tsx` to use InteractiveTerminal
6. Add terminal-specific styles
7. Test all commands and transitions
8. Update content with actual information
