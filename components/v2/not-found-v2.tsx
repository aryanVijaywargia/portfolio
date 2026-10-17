import Head from "next/head";
import Link from "next/link";
import { useTheme } from "next-themes";
import { FC, PropsWithChildren, ReactNode, useEffect, useRef } from "react";
import { V2Brand } from "components/v2/brand";
import { V2ThemeToggle } from "components/v2/theme-toggle";
import { V2Footer } from "components/v2/sections/footer";
import { V2NotFound } from "components/v2/sections/not-found";
import { V2_NOT_FOUND } from "content/v2";
import { NOT_FOUND_SKIN_SCRIPT } from "lib/not-found-skin";

/* Without JS the inline script never runs and <html> carries no skin, leaving
   the page with structure but no colour. This is the base palette, applied to
   the page's own root so it stands in until a skin is resolved. */
const NO_SCRIPT_FALLBACK = `[data-v2]:not([data-v2-variant]){
  --v2-bg:255 255 255;--v2-surface:248 250 252;--v2-surface-2:241 245 249;
  --v2-term:248 250 252;--v2-fg:15 23 42;--v2-fg-2:51 65 85;--v2-fg-3:100 116 139;
  --v2-fg-4:100 116 139;--v2-line:226 232 240;--v2-line-2:203 213 225;
  --v2-accent:14 165 233;--v2-accent-soft:14 165 233 / 0.12;--v2-btn-bg:14 165 233;
  --v2-btn-fg:255 255 255;--v2-btn-image:none;--v2-glitch-2:236 72 153;
  --v2-term-err:225 29 72;--v2-bg-blur:255 255 255 / 0.75;
  --v2-radius-sm:6px;--v2-radius-md:10px;--v2-btn-weight:500;
}`;

/**
 * Shared layout for the 404 and runtime error pages.
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
export const ErrorPageLayout: FC<PropsWithChildren<{ footerNote?: ReactNode }>> = ({
  children,
  footerNote,
}) => {
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
      <Head>
        <script dangerouslySetInnerHTML={{ __html: NOT_FOUND_SKIN_SCRIPT }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: NO_SCRIPT_FALLBACK }} />
        </noscript>
      </Head>
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

      {children}

      <V2Footer note={footerNote} />
    </div>
  );
};

export const NotFoundV2: FC = () => (
  <ErrorPageLayout footerNote={V2_NOT_FOUND.footerNote}>
    <V2NotFound />
  </ErrorPageLayout>
);
