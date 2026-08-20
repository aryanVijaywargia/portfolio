/**
 * The eased in-page scroll used when a nav item is clicked.
 *
 * The browser's own `scroll-behavior: smooth` is not used because its duration
 * is fixed: a jump to the next section and a jump to the bottom of the page
 * take the same time, which reads as sluggish for one and frantic for the
 * other. Duration is scaled by distance instead, within bounds, matching the
 * v1 header.
 */
const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const MIN_MS = 400;
const MAX_MS = 800;
const MS_PER_PX = 0.3;

/** Scrolls a section to the top of the viewport, allowing for the pinned header. */
export const smoothScrollToElement = (
  element: HTMLElement,
  offset = 0,
  onDone?: () => void
): void => {
  const startY = window.scrollY;
  /**
   * Re-measured every frame rather than fixed at the start.
   *
   * On small screens the sections between here and the destination carry
   * `content-visibility: auto`, so they swap their reserved intrinsic height
   * for their real height as the viewport approaches — the page grows under
   * the animation and a target measured once lands hundreds of pixels short.
   */
  const measureTarget = () =>
    Math.max(0, element.getBoundingClientRect().top + window.scrollY - offset);

  const diff = measureTarget() - startY;
  if (diff === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, measureTarget());
    onDone?.();
    return;
  }

  const duration = Math.min(MAX_MS, Math.max(MIN_MS, Math.abs(diff) * MS_PER_PX));
  let start: number | null = null;

  const step = (timestamp: number) => {
    if (start === null) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const target = measureTarget();
    window.scrollTo(0, startY + (target - startY) * easeInOutCubic(progress));
    if (progress < 1) {
      window.requestAnimationFrame(step);
      return;
    }
    // One last correction: the final frame's own scroll can reveal the last
    // deferred section and move the destination again.
    window.requestAnimationFrame(() => {
      window.scrollTo(0, measureTarget());
      onDone?.();
    });
  };

  window.requestAnimationFrame(step);
};
