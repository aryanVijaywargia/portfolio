import { useEffect, useState } from "react";

const HOLD_MS = 1600;
const FADE_MS = 260;

/**
 * Cycles the hero's role qualifier once through the list and settles on the
 * last entry, cross-fading between them.
 *
 * Returns the current label plus the opacity to render it at, so the caller
 * owns the markup and the fade is a plain CSS transition rather than an
 * animation library.
 */
export const useRoleCycle = (roles: readonly string[], suffix: string) => {
  const finalIndex = Math.max(roles.length - 1, 0);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (query?.matches) setReduced(true);
  }, []);

  useEffect(() => {
    if (reduced || index >= finalIndex) return;

    const fade = window.setTimeout(() => setVisible(false), HOLD_MS);
    const swap = window.setTimeout(
      () => {
        setIndex((current) => Math.min(current + 1, finalIndex));
        setVisible(true);
      },
      HOLD_MS + FADE_MS
    );

    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(swap);
    };
  }, [index, finalIndex, reduced]);

  const qualifier = roles[reduced ? finalIndex : index] ?? "";
  const article = qualifier === "AI" || qualifier === "" ? "an" : "a";

  // Split so the caller can keep the final word glued to its trailing period.
  // The role itself is free to wrap; only "Engineer." must not break apart.
  const lead = `${article}${qualifier ? ` ${qualifier}` : ""}`;
  const label = `${lead} ${suffix}`;

  return { lead, suffix, label, opacity: visible ? 1 : 0, fadeMs: FADE_MS };
};
