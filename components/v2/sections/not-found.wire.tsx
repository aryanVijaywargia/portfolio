import { FC, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------
   The 404's right-hand column: a newsroom wire desk reporting the missing
   page. It runs on its own — there is nothing to type at — so the whole
   component is one timer appending bulletins and one CSS marquee.
   ------------------------------------------------------------------------- */

type Tone = "out" | "dim" | "rick";

type Bulletin = {
  /** Desk the item came from. BREAKING is coloured as an alert. */
  tag: string;
  tone: Tone;
  text: string;
};

const WIRE: Bulletin[] = [
  { tag: "DESK", tone: "out", text: "Page reported missing from /the-page-you-wanted." },
  { tag: "FIELD", tone: "dim", text: "Router questioned. Claims it never had the file." },
  { tag: "SOURCES", tone: "dim", text: "A crawler placed at the scene declines to comment." },
  { tag: "WEATHER", tone: "dim", text: "Server room 21°C, calm, no packets expected." },
  { tag: "MARKETS", tone: "out", text: "Uptime holds at 99.9%. Panic futures down sharply." },
  {
    tag: "BREAKING",
    tone: "rick",
    text: "Man in lab coat interrupts broadcast, demands portal fluid.",
  },
  { tag: "SPORTS", tone: "dim", text: "Day 214 of the no-downtime streak. Crowd unmoved." },
  { tag: "DESK", tone: "out", text: "Editors conclude: the page was never written." },
  {
    tag: "CULTURE",
    tone: "dim",
    text: "Critics call this 404 'the best page here', citing brevity.",
  },
  { tag: "LATE", tone: "out", text: "Search called off. Everyone went home. Bulletin continues." },
];

const TICKER = [
  "no pages were harmed in the making of this error",
  "the server is fine · the link was not",
  "404 is just 200 with better boundaries",
  "this bulletin runs forever, unlike the page you wanted",
];

/* Two passes so the -50% marquee lands on the start of the second copy. */
const TICKER_TEXT = `${TICKER.join("   ·   ")}   ·   `.repeat(2);

const FIRST_DELAY_MS = 400;
const NEXT_DELAY_MS = 2300;
/* An item that draws its own box gets longer on screen to read. */
const NEXT_DELAY_BOXED_MS = 3400;
/* Each bulletin is stamped a minute later than the one before it. */
const STAMP_STEP_MS = 61_000;

const TONE_CLASS: Record<Tone, string> = {
  out: "text-[rgb(var(--v2-fg-2))]",
  dim: "text-[rgb(var(--v2-fg-4))]",
  rick: "text-[rgb(var(--v2-fg-2))]",
};

type Row = Bulletin & { id: number; stamp: string };

const clock = (offsetMs: number) => {
  const d = new Date(Date.now() + offsetMs);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export const V2NotFoundWire: FC = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const index = useRef(0);

  const push = useCallback(() => {
    const i = index.current;
    const item = WIRE[i % WIRE.length];
    index.current = i + 1;
    setRows((prev) => [...prev, { ...item, id: i, stamp: clock(i * STAMP_STEP_MS) }]);
    timer.current = setTimeout(push, item.tone === "rick" ? NEXT_DELAY_BOXED_MS : NEXT_DELAY_MS);
  }, []);

  useEffect(() => {
    timer.current = setTimeout(push, FIRST_DELAY_MS);
    return () => clearTimeout(timer.current);
  }, [push]);

  /* The box is a fixed height that never scrolls: bulletins arrive at the
     bottom and the oldest are dropped once they no longer fit. Rows are
     measured rather than counted, since a row's height depends on how far its
     text wraps.

     The children are summed instead of read off scrollHeight. This is a
     `justify-end` column, so surplus content overflows past the *top* edge,
     which scrollHeight does not report — it stays pinned at clientHeight while
     the row list grows without bound. */
  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box || box.children.length < 2) return;

    const kids = Array.from(box.children) as HTMLElement[];
    const gap = parseFloat(getComputedStyle(box).rowGap) || 0;
    let height = kids.reduce((sum, el) => sum + el.offsetHeight, 0) + gap * (kids.length - 1);
    if (height <= box.clientHeight) return;

    let drop = 0;
    while (height > box.clientHeight && drop < kids.length - 1) {
      // The gap above a row leaves with it.
      height -= kids[drop].offsetHeight + gap;
      drop += 1;
    }
    if (drop > 0) setRows((prev) => prev.slice(drop));
  }, [rows]);

  return (
    <section className="relative overflow-hidden rounded-[var(--v2-radius-md)] border border-[rgb(var(--v2-line-2))] bg-[rgb(var(--v2-term))]">
      {/* CRT sweep. Decorative; the reduced-motion rule parks it. */}
      <span
        aria-hidden="true"
        className="v2-animate-scan pointer-events-none absolute inset-x-0 top-0 z-[3] h-3.5 opacity-50"
        style={{ background: "linear-gradient(180deg, rgb(var(--v2-accent-soft)), transparent)" }}
      />

      <div className="flex h-10 items-center justify-between border-b border-[rgb(var(--v2-line))] bg-[rgb(var(--v2-surface-2))] px-3.5">
        <span className="flex items-center gap-2 font-[family-name:var(--v2-font-mono)] text-[11px] font-bold tracking-[0.08em] text-[rgb(var(--v2-term-err))]">
          <span
            aria-hidden="true"
            className="v2-animate-pulse-dot h-[7px] w-[7px] rounded-full bg-[rgb(var(--v2-term-err))]"
          />
          LIVE
        </span>
        <span className="font-[family-name:var(--v2-font-mono)] text-[11px] font-semibold tracking-[0.06em] text-[rgb(var(--v2-fg-3))]">
          404 wire desk
        </span>
      </div>

      {/* Not a live region: the wire loops forever, so announcing each new
          bulletin would talk over the page indefinitely. */}
      <div
        ref={boxRef}
        aria-label="404 wire bulletin"
        className="flex h-[268px] flex-col justify-end gap-2.5 overflow-hidden p-3.5 font-[family-name:var(--v2-font-mono)] text-[12.5px] leading-[1.6] v2sm:h-[376px]"
      >
        {rows.map((row) => (
          <div
            key={row.id}
            className={`v2-wire-row flex items-start gap-[9px] ${
              row.tone === "rick"
                ? "border border-[rgb(var(--v2-line-2))] bg-[rgb(var(--v2-surface))] px-[9px] py-2"
                : ""
            }`}
          >
            <span className="shrink-0 text-[rgb(var(--v2-fg-4))]">{row.stamp}</span>
            <span
              className={`shrink-0 font-bold tracking-[0.06em] ${
                row.tag === "BREAKING"
                  ? "text-[rgb(var(--v2-term-err))]"
                  : "text-[rgb(var(--v2-accent))]"
              }`}
            >
              {row.tag}
            </span>
            <span className={`leading-[1.55] ${TONE_CLASS[row.tone]}`}>{row.text}</span>
          </div>
        ))}
      </div>

      <div className="flex h-10 items-center overflow-hidden border-t border-[rgb(var(--v2-line))] bg-[rgb(var(--v2-surface-2))]">
        <span className="inline-flex h-full shrink-0 items-center bg-[rgb(var(--v2-accent))] px-[11px] font-[family-name:var(--v2-font-mono)] text-[10px] font-bold tracking-[0.12em] text-[rgb(var(--v2-btn-fg))]">
          TICKER
        </span>
        <div className="flex-1 overflow-hidden whitespace-nowrap">
          <div className="v2-animate-marquee inline-block whitespace-nowrap font-[family-name:var(--v2-font-mono)] text-[11px] text-[rgb(var(--v2-fg-3))]">
            {TICKER_TEXT}
          </div>
        </div>
      </div>
    </section>
  );
};
