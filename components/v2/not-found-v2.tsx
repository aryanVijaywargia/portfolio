import Link from "next/link";
import { useTheme } from "next-themes";
import { FC, useEffect, useRef } from "react";
import { V2Brand } from "components/v2/brand";
import { V2ThemeToggle } from "components/v2/theme-toggle";
import { V2Footer } from "components/v2/sections/footer";
import { V2NotFound } from "components/v2/sections/not-found";
import { V2_NOT_FOUND } from "content/v2";

/**
 * The 404 page.
 *
 * One tree serves all three skins. It deliberately does NOT stamp
 * `data-v2-variant` on its root: the skin is resolved before first paint and
 * written onto <html> (see lib/not-found-skin), and a variant here would win
 * over what is inherited from there. Everything below reads tokens, so nothing
 * needs to know which skin is active.
 *
 * It has no sections to scroll-spy, so it does not use <V2Header>: the bar here
 * is a static strip with the mark and the theme toggle.
 */
export const NotFoundV2: FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // Overscroll rubber-banding reveals <body>, which paints the canvas behind
  // the page. Tokens resolve on <html>, so the colour is read off this subtree
  // and mirrored down. See components/v2/portfolio-v2 for the same treatment.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const { body } = document;
    const previous = body.style.backgroundColor;
    body.style.backgroundColor = getComputedStyle(root).backgroundColor;

    return () => {
      body.style.backgroundColor = previous;
    };
  }, [resolvedTheme]);

  return (
    <div ref={rootRef} data-v2="" className="flex min-h-screen flex-col bg-[rgb(var(--v2-bg))]">
      <header className="sticky top-0 z-20 border-b border-[rgb(var(--v2-line))] bg-[rgb(var(--v2-bg-blur))] backdrop-blur-lg">
        <div className="mx-auto flex max-w-[var(--v2-max-w)] items-center justify-between gap-3 px-[var(--v2-gutter)] py-3.5">
          <Link href="/">
            <a
              className="group/brand flex items-center text-[rgb(var(--v2-fg))]"
              aria-label="Back to home"
            >
              <V2Brand className="h-[30px] w-[30px]" />
            </a>
          </Link>
          <V2ThemeToggle />
        </div>
      </header>

      <V2NotFound />

      <V2Footer note={V2_NOT_FOUND.footerNote} />
    </div>
  );
};
