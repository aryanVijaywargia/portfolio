import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { scrollToX } from "utils/scroll-to";

type ScrollRailOptions = {
  /** Width of one item; a step moves by this plus the gap. */
  itemWidth: number;
  gapWidth: number;
  /** Changing this returns the rail to the start — e.g. a new filter. */
  resetKey?: string;
};

const STEP_MS = 200;

/**
 * Drives a horizontal snap rail: which directions can still be stepped, and
 * the eased step itself.
 *
 * Separate from the markup because the controls do not live next to the rail —
 * they sit up beside the section heading — and both need the same state.
 *
 * Snapping has to come off for the duration of a programmatic scroll:
 * `scroll-snap-type: mandatory` re-snaps on every frame the animation writes,
 * which pins the rail in place. The v1 gallery toggles the class for the same
 * reason.
 */
export const useScrollRail = (
  railRef: RefObject<HTMLElement>,
  { itemWidth, gapWidth, resetKey }: ScrollRailOptions
) => {
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
  }, [gapWidth, itemWidth, railRef]);

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
  }, [railRef, resetKey]);

  // A filter change otherwise leaves the reader looking at wherever the old
  // set happened to end.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || rail.scrollLeft === 0) return;
    rail.classList.remove("snap-x");
    scrollToX(STEP_MS, 0, rail, () => rail.classList.add("snap-x"));
  }, [railRef, resetKey]);

  return { canStepBack: nav.prev, canStepForward: nav.next, step };
};
