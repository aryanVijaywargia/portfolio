import clsx from "clsx";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { TIMELINEOBJECT } from "content/timeline";
import { useAchievementActions } from "components/achievements";
import { useDebouncedEffect } from "components/_hooks/use-debounce-effect";
import { scrollToX } from "utils/scroll-to";

const COLUMN_WIDTH = 120;
const ADVANCE_MS = 2400;
const RESUME_AUTO_MS = 10000;

const YEARS = Object.entries(TIMELINEOBJECT);

const keyFor = (year: string, index: number) => `${year}-${index}`;

/** Flat ordering so auto-advance can walk across year boundaries. */
const ORDER = YEARS.flatMap(([year, events]) => events.map((_, index) => keyFor(year, index)));

/**
 * Horizontal career rail, nested inside About the way the design lays it out.
 *
 * Advances on its own while in view, and hands control to the reader on any
 * interaction — resuming only after a idle period so a deliberate hover is
 * never yanked away mid-read.
 */
export const V2Timeline: FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inView = useInView(scrollRef);
  const { trackAchievementEvent } = useAchievementActions();
  const [selected, setSelected] = useState(ORDER[0] ?? "");
  const [autoAdvance, setAutoAdvance] = useState(true);

  const handleSelect = useCallback((year: string, index: number) => {
    setAutoAdvance(false);
    setSelected(keyFor(year, index));
    trackAchievementEvent({ type: "timeline:year-viewed", year });
  }, [trackAchievementEvent]);

  // Step forward, keeping the active marker inside the scroll viewport.
  useDebouncedEffect(
    () => {
      if (!autoAdvance || !inView) return;

      const position = ORDER.indexOf(selected);
      if (position < 0 || position >= ORDER.length - 1) return;

      const container = scrollRef.current;
      if (container) {
        const target = position * COLUMN_WIDTH;
        const isOffscreen =
          container.scrollLeft > target - COLUMN_WIDTH ||
          target > container.scrollLeft + container.clientWidth - COLUMN_WIDTH * 2;
        if (isOffscreen) scrollToX(200, target, container);
      }

      setSelected(ORDER[position + 1]);
    },
    ADVANCE_MS,
    [selected, autoAdvance, inView]
  );

  // Resume drifting once the reader has been idle for a while.
  useDebouncedEffect(() => setAutoAdvance(true), RESUME_AUTO_MS, [autoAdvance]);

  return (
    <div
      id="timeline"
      data-screen-label="Timeline"
      className="mt-12 scroll-mt-24 border-t border-[rgb(var(--v2-line))] pt-9"
    >
      <div ref={scrollRef} className="v2-scrollbar-none flex h-[340px] overflow-x-auto px-6 py-4">
        {YEARS.map(([year, events], yearIndex) => (
          <div key={year} className="relative">
            <header className="absolute left-0 -translate-x-1/2 select-none font-[family-name:var(--v2-font-mono)] text-[11px] text-[rgb(var(--v2-fg-4))]">
              {year}
            </header>
            <div
              className="mt-6 grid"
              style={{ gridTemplateColumns: `repeat(${events.length}, ${COLUMN_WIDTH}px)` }}
            >
              {events.map(({ heading, description, Icon }, index) => {
                const isActive = selected === keyFor(year, index);
                // The leading card has no room to its left; centring it would
                // push half of it outside the scroll container.
                const isFirstOverall = yearIndex === 0 && index === 0;
                return (
                  <section key={heading} className="relative">
                    <button
                      type="button"
                      className="absolute flex -translate-x-1/2 flex-col items-center border-0 bg-transparent px-3"
                      onMouseOver={() => handleSelect(year, index)}
                      onFocus={() => handleSelect(year, index)}
                      onClick={() => handleSelect(year, index)}
                    >
                      <span className="sr-only">{`${year} — ${heading}`}</span>
                      <span
                        className={clsx(
                          "block w-px transition-all duration-300",
                          isActive
                            ? "h-[80px] bg-[rgb(var(--v2-accent))]"
                            : "h-[28px] bg-[rgb(var(--v2-fg-4))]"
                        )}
                      />
                      <Icon
                        className={clsx(
                          "mt-2 h-5 w-5 transition-colors duration-300",
                          isActive ? "text-[rgb(var(--v2-fg))]" : "text-[rgb(var(--v2-fg-4))]"
                        )}
                      />
                    </button>
                    <div
                      aria-hidden
                      className="absolute left-px top-0 h-px bg-[rgb(var(--v2-line))]"
                      style={{ width: COLUMN_WIDTH - 1 }}
                    />
                    <main
                      className={clsx(
                        "pointer-events-none relative mt-[118px] w-[17rem] transition-opacity duration-300",
                        isFirstOverall ? "text-left" : "-translate-x-1/2 text-center",
                        isActive ? "opacity-100" : "opacity-0"
                      )}
                    >
                      <h3 className="whitespace-nowrap text-base font-bold tracking-[-0.015em] text-[rgb(var(--v2-fg))]">
                        {heading}
                      </h3>
                      <p className="mt-1.5 text-sm leading-[1.6] text-[rgb(var(--v2-fg-3))]">
                        {description}
                      </p>
                    </main>
                  </section>
                );
              })}
            </div>
          </div>
        ))}

        <div className="relative">
          <header className="absolute left-0 -translate-x-1/2 font-[family-name:var(--v2-font-mono)] text-[11px] text-[rgb(var(--v2-accent))]">
            today
          </header>
          <div className="mt-6">
            <span className="block h-[28px] w-px bg-[rgb(var(--v2-accent))]" />
          </div>
        </div>
      </div>
    </div>
  );
};
