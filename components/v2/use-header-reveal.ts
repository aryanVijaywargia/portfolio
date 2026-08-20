import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { smoothScrollToElement } from "lib/smooth-scroll";

type HeaderRevealOptions = {
  headerRef: RefObject<HTMLElement>;
  /** Selector for the hero block the header hides behind until scrolled past. */
  heroSelector: string;
  /** Section ids to scroll-spy, in document order. */
  sectionIds: readonly string[];
  headerHeight?: number;
};

/**
 * Drives the v2 header, which sits at the bottom of the hero and slides up to
 * pin at the top of the viewport as the hero scrolls away.
 *
 * Position and opacity are written straight to the node as CSS custom
 * properties rather than through React state, so scrolling never re-renders.
 * Only the two pieces of state that actually gate rendering — whether the
 * header is interactive, and which nav link is active — go through React.
 */
export const useHeaderReveal = ({
  headerRef,
  heroSelector,
  sectionIds,
  headerHeight = 80,
}: HeaderRevealOptions) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  // While a nav click is animating, the spy must not fight the destination:
  // every intermediate section would otherwise flash as active and rewrite the
  // hash on the way past.
  const scrollingRef = useRef(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let frame: number | null = null;
    let heroHeight = 0;
    let lastTranslateY = Number.NaN;
    let lastOpacity = Number.NaN;
    let lastVisible = false;
    let lastActive = "";

    const measure = () => {
      const hero = document.querySelector(heroSelector);
      heroHeight = hero?.getBoundingClientRect().height ?? window.innerHeight;
    };

    /**
     * Mirrors the section in view into the address bar.
     *
     * replaceState rather than the router: pushing would fill the history
     * stack with every section the reader scrolls past, and letting the
     * browser see a hash change would trigger its native jump-to-anchor and
     * yank the viewport mid-scroll.
     */
    const syncHash = (id: string) => {
      const base = window.location.pathname;
      const target = id ? `${base}#${id}` : base;
      if (window.location.pathname + window.location.hash === target) return;
      window.history.replaceState(window.history.state, "", target);
    };

    const update = () => {
      frame = null;

      const translateY = Math.max(0, heroHeight - headerHeight - window.scrollY);
      const fadeDistance = Math.max(heroHeight * 0.3, 1);
      const opacity = translateY >= fadeDistance ? 0 : 1 - translateY / fadeDistance;

      if (translateY !== lastTranslateY) {
        header.style.setProperty("--v2-header-y", `${translateY}px`);
        lastTranslateY = translateY;
      }
      if (opacity !== lastOpacity) {
        header.style.setProperty("--v2-header-opacity", `${opacity}`);
        lastOpacity = opacity;
      }

      const visible = opacity > 0.05;
      if (visible !== lastVisible) {
        lastVisible = visible;
        setIsVisible(visible);
      }

      if (scrollingRef.current) return;

      // Scroll-spy: the section whose top sits nearest the upper third of the
      // viewport is the one the reader is looking at.
      const anchor = window.innerHeight * 0.3;
      let best = "";
      let bestDistance = Infinity;
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // Not reached yet, or already scrolled past.
        if (rect.top > anchor || rect.bottom < 0) return;
        const distance = anchor - rect.top;
        if (distance < bestDistance) {
          bestDistance = distance;
          best = id;
        }
      });
      if (best !== lastActive) {
        lastActive = best;
        setActiveId(best);
        syncHash(best);
      }
    };

    const schedule = () => {
      // No early-out once pinned: the scroll-spy shares this update, so
      // skipping frames after the header settles freezes the active nav item
      // for the rest of the page. The work is one rAF-throttled pass over four
      // elements, which is cheap enough to run on every scroll.
      if (frame !== null) return;
      frame = window.requestAnimationFrame(update);
    };

    const handleResize = () => {
      measure();
      schedule();
    };

    measure();
    update();

    const hero = document.querySelector(heroSelector);
    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(handleResize) : null;
    if (hero) observer?.observe(hero);
    observer?.observe(header);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", handleResize);
    };
  }, [headerRef, heroSelector, sectionIds, headerHeight]);

  /**
   * Scrolls to a section the way the v1 header does: an eased move whose
   * length scales with distance, with the spy suppressed until it lands so the
   * clicked item stays lit the whole way.
   */
  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    scrollingRef.current = true;
    setActiveId(id);

    const base = window.location.pathname;
    window.history.replaceState(window.history.state, "", `${base}#${id}`);

    smoothScrollToElement(el, 0, () => {
      scrollingRef.current = false;
    });
  }, []);

  return { isVisible, activeId, scrollToSection };
};
