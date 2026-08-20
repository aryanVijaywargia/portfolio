import clsx from "clsx";
import { FC, PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import { ArrowLongLeftIcon, ArrowLongRightIcon } from "@heroicons/react/24/solid";
import { scrollToX } from "utils/scroll-to";

type V2ScrollRailProps = {
  /** Width of one item, used to size a prev/next step. */
  itemWidth: number;
  gapWidth: number;
  /** Changing this scrolls the rail back to the start — e.g. a new filter. */
  resetKey?: string;
  label: string;
};

const STEP_MS = 200;

const ARROW_CLASS =
  "inline-flex items-center gap-2 bg-transparent py-1 font-[family-name:var(--v2-font-mono)] " +
  "text-[11px] uppercase tracking-[0.14em] text-[rgb(var(--v2-fg-3))] transition-colors " +
  "hover:text-[rgb(var(--v2-fg))] disabled:text-[rgb(var(--v2-fg-4))] disabled:opacity-40";

/**
 * The horizontal card rail, matching the v1 portfolio gallery: snap points,
 * edge-to-edge scrolling, and prev/next steps on wide screens.
 *
 * Snapping has to be switched off for the duration of a programmatic scroll.
 * `scroll-snap-type: mandatory` re-snaps on every frame the animation writes,
 * which pins the rail in place — the same reason the v1 gallery toggles the
 * class around its own steps.
 */
export const V2ScrollRail: FC<PropsWithChildren<V2ScrollRailProps>> = ({
  itemWidth,
  gapWidth,
  resetKey,
  label,
  children,
}) => {
  const railRef = useRef<HTMLDivElement>(null);
  const [nav, setNav] = useState({ prev: false, next: false });
  const busyRef = useRef(false);

  const step = useCallback((direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail || busyRef.current) return;
    busyRef.current = true;
    rail.classList.remove("snap-x");
    const target = Math.max(0, rail.scrollLeft + direction * (itemWidth + gapWidth));
    scrollToX(STEP_MS, target, rail, () => {
      busyRef.current = false;
      rail.classList.add("snap-x");
    });
  }, [gapWidth, itemWidth]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const update = () => {
      const max = Math.max(rail.scrollWidth - rail.clientWidth, 0);
      setNav({ prev: rail.scrollLeft > 1, next: max - rail.scrollLeft > 1 });
    };

    update();
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      rail.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [resetKey]);

  // A filter change leaves the reader looking at wherever the old set ended.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || rail.scrollLeft === 0) return;
    rail.classList.remove("snap-x");
    scrollToX(STEP_MS, 0, rail, () => rail.classList.add("snap-x"));
  }, [resetKey]);

  return (
    <div>
      <div
        ref={railRef}
        role="group"
        aria-label={label}
        className={clsx(
          "v2-scrollbar-none flex snap-x snap-mandatory items-stretch overflow-x-auto",
          // Breaks the container gutter so the rail runs to the edge while the
          // first card stays aligned with the heading above it.
          "-mx-[var(--v2-gutter)] gap-5 px-[var(--v2-gutter)] pb-1",
          "scroll-pl-[var(--v2-gutter)]"
        )}
      >
        {children}
      </div>

      {/* Always drawn on wide screens and disabled at the ends — the v1
          gallery keeps them visible whether or not the current set
          overflows, so the control never disappears on the reader. */}
      <div className="mt-4 hidden items-center justify-between v2md:flex">
        <button type="button" className={ARROW_CLASS} onClick={() => step(-1)} disabled={!nav.prev}>
          <ArrowLongLeftIcon className="h-4 w-4" aria-hidden="true" />
          prev
        </button>
        <button type="button" className={ARROW_CLASS} onClick={() => step(1)} disabled={!nav.next}>
          next
          <ArrowLongRightIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
