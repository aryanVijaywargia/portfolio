import Head from "next/head";
import { NextSeo } from "next-seo";
import { FC } from "react";
import { NotFoundV2 } from "components/v2/not-found-v2";
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
 * Next's automatic not-found page.
 *
 * It is statically generated, so it cannot read the requested path server-side —
 * everything it says is written for a miss in general rather than for one URL.
 * The skin it wears is resolved before first paint by the inline script; see
 * lib/not-found-skin.
 */
const NotFoundPage: FC = () => (
  <>
    <NextSeo title="404 — This route was never deployed" noindex nofollow />
    <Head>
      <script dangerouslySetInnerHTML={{ __html: NOT_FOUND_SKIN_SCRIPT }} />
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: NO_SCRIPT_FALLBACK }} />
      </noscript>
    </Head>
    <NotFoundV2 />
  </>
);

export default NotFoundPage;
