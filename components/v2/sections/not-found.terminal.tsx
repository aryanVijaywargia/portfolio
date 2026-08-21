import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------
   The 404's right-hand column: a fake shell that explains the miss.

   Everything it prints is a line in `lines`. Commands are plain functions that
   return the lines they want appended, so adding one is a table entry rather
   than a branch — the two that need to mutate the log after the fact (clear,
   portal) are the documented exceptions and run through `effect`.
   ------------------------------------------------------------------------- */

type LineKind = "cmd" | "err" | "out" | "dim" | "link" | "rick" | "spin";

type Line = {
  id: number;
  kind: LineKind;
  text: string;
  /** `link` lines render as anchors; everything else ignores this. */
  href?: string;
};

type Draft = Omit<Line, "id">;

const BOOT: Draft[] = [
  { kind: "cmd", text: "GET /the-page-you-wanted" },
  { kind: "err", text: "resolver: no such route" },
  { kind: "dim", text: "matched 0 of 5 handlers · 3ms · 0 bytes served" },
  { kind: "out", text: "nothing to serve here. running diagnostics…" },
  { kind: "dim", text: "…something is coming through the portal" },
  { kind: "rick", text: "Hey! Hey you — why are you running away? Help me find this page, Morty!" },
  { kind: "dim", text: "type a command, or use the bar below" },
];

const BOOT_DELAY_MS = 300;
const BOOT_STEP_MS = 260;

const RICK_LINES = [
  "Wubba lubba dub dub — you broke the URL, not the universe.",
  "Listen up: this page doesn't exist in ANY dimension. I checked. Twice.",
  "You wanna know the secret? *burp* The page was never real, Morty.",
  "I'm not saying it's your fault, but I'm looking right at you.",
  "Portal gun says: go home. The home button. Right there. Use it.",
  "404 dimensions explored. All empty. Great job, everybody.",
];

const PORTAL_FRAMES = ["( ·  )", "( ○  )", "( ◍  )", "( ◉  )", "( ◍ ◍)", "( ◉ ◉)"];
const PORTAL_FRAME_MS = 150;
const PORTAL_DESTINATIONS = [
  { label: "/projects", href: "/#portfolio" },
  { label: "/experience", href: "/#experience" },
  { label: "/contact", href: "/#contact" },
  { label: "/llms.txt", href: "/llms.txt" },
];

/** Commands whose whole job is to print. Keys are matched after lowercasing. */
const RESPONSES: Record<string, Draft[]> = {
  trace: [
    { kind: "dim", text: "hop  layer            code  note" },
    { kind: "out", text: " 1   cdn/edge          200  cache miss" },
    { kind: "out", text: " 2   router            404  no handler" },
    { kind: "out", text: " 3   fallback          200  this page" },
    { kind: "dim", text: "resolved in 3ms · nothing was harmed" },
  ],
  logs: [
    { kind: "dim", text: "last requests to this route:" },
    { kind: "out", text: "/wp-login.php      bot   11m ago" },
    { kind: "out", text: "/admin             bot    4m ago" },
    { kind: "out", text: "/hire-aryan        you   just now" },
    { kind: "dim", text: "1 of those is worth answering" },
  ],
  hire: [
    { kind: "out", text: "aryan — backend & ml, go · c# · typescript · python" },
    { kind: "out", text: "shipped: continua · precursor detection · forex nlp" },
    { kind: "dim", text: "notice period: shorter than this outage" },
    {
      kind: "link",
      text: "→ aryanvijaywargia@gmail.com",
      href: "mailto:aryanvijaywargia@gmail.com",
    },
  ],
  whereami: [
    { kind: "out", text: "/404 — a page that resolves to nothing" },
    { kind: "dim", text: "referrer: unknown · uptime: fine · panic: none" },
  ],
  help: [{ kind: "out", text: "trace · logs · portal · hire · whereami · home · rick · clear" }],
  ls: [{ kind: "dim", text: "not that kind of shell — try trace or logs" }],
  "sudo make it work": [{ kind: "err", text: "nice try" }],
};

/** Spellings that resolve to the same entry in RESPONSES. */
const ALIASES: Record<string, string> = {
  dir: "ls",
  pwd: "whereami",
  "sudo hire aryan": "hire",
  "cd ~": "home",
  "cd /": "home",
};

const KIND_CLASS: Record<LineKind, string> = {
  cmd: "font-semibold text-[rgb(var(--v2-fg))]",
  err: "text-[rgb(var(--v2-term-err))]",
  out: "text-[rgb(var(--v2-fg-2))]",
  dim: "text-[rgb(var(--v2-fg-4))]",
  link: "text-[rgb(var(--v2-accent))] underline decoration-transparent underline-offset-2 hover:decoration-current",
  rick: "text-[rgb(var(--v2-accent))]",
  /* The portal spinner is redrawn in place, so its glyph columns must not
     reflow — hence `whitespace-pre` rather than the wrapping default. */
  spin: "whitespace-pre tracking-[0.06em] text-[rgb(var(--v2-accent))]",
};

/* Wrapping is per-kind, so it cannot live in KIND_CLASS beside a competing
   `whitespace-*` and be decided by stylesheet order. */
const wrapClass = (kind: LineKind) => (kind === "spin" ? "" : "whitespace-pre-wrap break-words");

const COMMAND_BAR = ["trace", "logs", "portal", "hire", "home", "rick", "clear"];

export const V2NotFoundTerminal: FC = () => {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([]);
  const [draft, setDraft] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(0);
  const rickIndex = useRef(0);
  /** Every pending timeout, so unmounting mid-animation cannot set state. */
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    },
    []
  );

  const push = useCallback((drafts: Draft[]) => {
    setLines((prev) => [
      ...prev,
      ...drafts.map((d) => {
        nextId.current += 1;
        return { ...d, id: nextId.current };
      }),
    ]);
  }, []);

  /* The log is a scroll container that only ever grows downward, so pinning it
     to the bottom after each append is the whole scroll behaviour. */
  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [lines]);

  useEffect(() => {
    BOOT.forEach((line, i) => after(BOOT_DELAY_MS + i * BOOT_STEP_MS, () => push([line])));
  }, [after, push]);

  /* Replaces the last line in place. Used by the portal spinner, which is one
     row redrawn per frame rather than six rows of scrollback. */
  const replaceLast = useCallback((text: string) => {
    setLines((prev) => {
      if (!prev.length) return prev;
      const next = prev.slice(0, -1);
      return [...next, { ...prev[prev.length - 1], text }];
    });
  }, []);

  const portal = useCallback(() => {
    push([{ kind: "spin", text: `${PORTAL_FRAMES[0]}  spinning up portal…` }]);
    PORTAL_FRAMES.slice(1).forEach((frame, i) => {
      after((i + 1) * PORTAL_FRAME_MS, () => replaceLast(`${frame}  spinning up portal…`));
    });
    after(PORTAL_FRAMES.length * PORTAL_FRAME_MS, () => {
      const dest = PORTAL_DESTINATIONS[Math.floor(Math.random() * PORTAL_DESTINATIONS.length)];
      replaceLast("( ◉ ◉)  portal open");
      push([
        { kind: "out", text: `dropping you at ${dest.label}` },
        { kind: "link", text: `→ aryanvijaywargia.com${dest.label}`, href: dest.href },
        { kind: "dim", text: "run portal again for a different dimension" },
      ]);
    });
  }, [after, push, replaceLast]);

  const run = useCallback((raw: string) => {
    const input = raw.trim().toLowerCase();
    if (!input) return;
    push([{ kind: "cmd", text: input }]);

    const cmd = ALIASES[input] ?? input;

    if (cmd === "clear") {
      setLines([]);
      return;
    }
    if (cmd === "portal") {
      portal();
      return;
    }
    if (cmd === "rick") {
      rickIndex.current = (rickIndex.current + 1) % RICK_LINES.length;
      push([
        { kind: "rick", text: RICK_LINES[rickIndex.current] },
        { kind: "dim", text: "run rick again for another one" },
      ]);
      return;
    }
    if (cmd === "home") {
      push([
        { kind: "out", text: "redirecting to / …" },
        { kind: "link", text: "→ aryanvijaywargia.com", href: "/" },
      ]);
      after(700, () => router.push("/"));
      return;
    }

    const response = RESPONSES[cmd];
    if (response) {
      push(response);
      return;
    }

    push([
      { kind: "err", text: `command not found: ${input}` },
      { kind: "dim", text: "try: trace · logs · portal · hire · rick" },
    ]);
  }, [after, portal, push, router]);

  const submit = useCallback(() => {
    run(draft);
    setDraft("");
  }, [draft, run]);

  return (
    <section className="relative overflow-hidden border border-[rgb(var(--v2-line-2))] bg-[rgb(var(--v2-term))]">
      {/* CRT sweep. Purely decorative, and the reduced-motion rule stops it. */}
      <span
        aria-hidden="true"
        className="v2-animate-scan pointer-events-none absolute inset-x-0 top-0 z-[3] h-3.5 opacity-55"
        style={{
          background: "linear-gradient(180deg, rgb(var(--v2-accent-soft)), transparent)",
        }}
      />

      <div className="flex h-10 items-center justify-between border-b border-[rgb(var(--v2-line))] bg-[rgb(var(--v2-surface-2))] px-3.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[rgb(var(--v2-fg-4))] opacity-55" />
          <span className="h-2.5 w-2.5 rounded-full bg-[rgb(var(--v2-accent))]" />
        </span>
        <span className="font-[family-name:var(--v2-font-mono)] text-[11px] font-semibold tracking-[0.06em] text-[rgb(var(--v2-fg-3))]">
          route-resolver — 404
        </span>
      </div>

      <div
        ref={bodyRef}
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
        className="v2-scrollbar-none h-[252px] overflow-y-auto p-3.5 font-[family-name:var(--v2-font-mono)] text-[12.5px] leading-[1.72] text-[rgb(var(--v2-fg-2))] v2sm:h-[376px]"
      >
        <div className="flex flex-col gap-0.5" aria-live="polite" aria-label="Terminal output">
          {lines.map((line) =>
            line.kind === "rick"
              ? <div
                  key={line.id}
                  className="my-1.5 flex gap-2 border border-[rgb(var(--v2-line-2))] bg-[rgb(var(--v2-surface))] px-2.5 py-2.5"
                >
                  <span aria-hidden="true" className="shrink-0 text-[rgb(var(--v2-accent))]">
                    (•⌣•)
                  </span>
                  <span className="whitespace-pre-wrap break-words leading-relaxed text-[rgb(var(--v2-fg-2))]">
                    {line.text}
                  </span>
                </div>
              : <div key={line.id} className={`${wrapClass(line.kind)} ${KIND_CLASS[line.kind]}`}>
                  {line.kind === "link" && line.href
                    ? <a href={line.href}>{line.text}</a>
                    : <>
                        {line.kind === "cmd" ? "$ " : line.kind === "err" ? "✗ " : ""}
                        {line.text}
                      </>}
                </div>
          )}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-[rgb(var(--v2-accent))]">visitor@site</span>
          <span className="-ml-2 text-[rgb(var(--v2-fg-4))]">:</span>
          <span className="-ml-2 text-[rgb(var(--v2-fg-3))]">~$</span>
          <input
            ref={inputRef}
            type="text"
            aria-label="Type a command"
            placeholder="type a command"
            spellCheck={false}
            autoComplete="off"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              e.preventDefault();
              submit();
            }}
            className="min-w-0 flex-1 border-0 bg-transparent font-[family-name:var(--v2-font-mono)] text-[12.5px] text-[rgb(var(--v2-fg))] outline-none placeholder:text-[rgb(var(--v2-fg-4))]"
          />
          <span
            aria-hidden="true"
            className="v2-animate-blink inline-block h-3.5 w-[7px] bg-[rgb(var(--v2-accent))]"
          />
        </div>
      </div>

      <div className="v2-scrollbar-none flex h-[46px] items-center gap-0.5 overflow-x-auto border-t border-[rgb(var(--v2-line))] bg-[rgb(var(--v2-surface-2))] pl-3 pr-5">
        {COMMAND_BAR.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => {
              run(cmd);
              inputRef.current?.focus({ preventScroll: true });
            }}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 border-0 bg-transparent px-2.5 font-[family-name:var(--v2-font-mono)] text-[11.5px] text-[rgb(var(--v2-fg-3))] transition-colors hover:text-[rgb(var(--v2-accent))]"
          >
            <span aria-hidden="true" className="opacity-50">
              ›
            </span>
            {cmd}
          </button>
        ))}
      </div>
    </section>
  );
};
