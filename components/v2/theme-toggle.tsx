import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { FC, useEffect, useState } from "react";
import { useAchievementActions } from "components/achievements";
import { V2_CONTROL_CLASS } from "components/v2/primitives";

/* The v1 site draws these as thin outlines rather than solid glyphs, which is
   what makes its controls read as part of the interface instead of filled
   blobs. Same path data as components/darkmode-icon. */
const SunGlyph: FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path
      d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MoonGlyph: FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path
      d="M21 12.79A8.5 8.5 0 1 1 11.21 3 6.6 6.6 0 0 0 21 12.79Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Shared theme state. next-themes is the site-wide source; the token layer
 * keys off the `dark` class it writes onto <html>, so switching is pure CSS.
 *
 * `mounted` gates the glyph only: the server cannot know the stored theme, but
 * the page's colours are already correct on the first paint.
 */
const useThemeSwitch = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { trackAchievementEvent } = useAchievementActions();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const toggle = () => {
    setTheme(isDark ? "light" : "dark");
    trackAchievementEvent({ type: "hero:theme-toggled" });
  };

  return { isDark, toggle };
};

/**
 * Theme toggle.
 *
 * The header draws it as a bare icon and the hero rail as a round ringed
 * button, so the presentation comes in from the caller — only the behaviour is
 * shared. The two places stay visually distinct, as they do on the v1 site.
 */
export const V2ThemeToggle: FC<{ className?: string; glyphClassName?: string }> = ({
  className,
  glyphClassName,
}) => {
  const { isDark, toggle } = useThemeSwitch();
  const Glyph = isDark ? MoonGlyph : SunGlyph;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch colour theme"
      className={className ?? V2_CONTROL_CLASS}
    >
      <span className="sr-only">Switch colour theme</span>
      <Glyph className={clsx("h-5 w-5", glyphClassName)} />
    </button>
  );
};

/**
 * The hero's wide-screen toggle: a track with a sliding knob.
 *
 * Deliberately a different object from the icon button — the v1 site draws
 * these two places differently. Below v2sm the rail uses the icon form instead,
 * where a 64px track crowds the three-button cluster.
 */
export const V2ThemeSwitch: FC<{ className?: string }> = ({ className }) => {
  const { isDark, toggle } = useThemeSwitch();

  return (
    <Switch
      checked={isDark}
      onChange={toggle}
      className={clsx(
        "relative h-9 w-16 shrink-0 cursor-pointer rounded-full p-0.5",
        "border border-[rgb(var(--v2-line-2))] bg-[rgb(var(--v2-accent)/0.16)]",
        "transition-colors duration-200 ease-in-out focus:outline-none",
        "focus-visible:ring-2 focus-visible:ring-[rgb(var(--v2-accent))]",
        className
      )}
    >
      <span className="sr-only">Switch colour theme</span>
      <span
        aria-hidden="true"
        className={clsx(
          // Explicit 2rem box rather than aspect-square: this project's Tailwind
          // config does not emit that utility, so the knob would size to the
          // remaining track width and push the rail past the viewport.
          "pointer-events-none relative block h-8 w-8 rounded-full",
          "bg-[rgb(var(--v2-fg))] shadow transition-transform duration-200 ease-in-out",
          isDark ? "translate-x-[1.75rem]" : "translate-x-0"
        )}
      >
        <span
          className={clsx(
            "absolute inset-0 flex items-center justify-center transition-opacity",
            isDark ? "opacity-0 duration-100 ease-out" : "opacity-100 duration-200 ease-in"
          )}
        >
          <SunGlyph className="h-[15px] w-[15px] text-[rgb(var(--v2-hue-brass))]" />
        </span>
        <span
          className={clsx(
            "absolute inset-0 flex items-center justify-center transition-opacity",
            isDark ? "opacity-100 duration-200 ease-in" : "opacity-0 duration-100 ease-out"
          )}
        >
          <MoonGlyph className="h-[15px] w-[15px] text-[rgb(var(--v2-bg))]" />
        </span>
      </span>
    </Switch>
  );
};
