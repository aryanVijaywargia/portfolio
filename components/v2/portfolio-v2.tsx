import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { FC, useEffect, useRef } from "react";
import { AchievementProvider } from "components/achievements";
import type { ScratchpadNote } from "lib/scratchpad";
import { V2Variant, V2VariantProvider } from "components/v2/variant";
import { V2Header } from "components/v2/sections/header";
import { V2Hero } from "components/v2/sections/hero";
import { V2Footer } from "components/v2/sections/footer";

/* Below-the-fold sections are split out so the hero and terminal are the only
   things on the initial payload, matching how "/" is assembled. */
const V2About = dynamic(() => import("components/v2/sections/about").then((m) => m.V2About));
const V2Experience = dynamic(() =>
  import("components/v2/sections/experience").then((m) => m.V2Experience)
);
const V2Projects = dynamic(() =>
  import("components/v2/sections/projects").then((m) => m.V2Projects)
);
const V2Contact = dynamic(() => import("components/v2/sections/contact").then((m) => m.V2Contact));
const V2Quiz = dynamic(() => import("components/v2/sections/quiz").then((m) => m.V2Quiz), {
  ssr: false,
});
const AmbientMessages = dynamic(
  () => import("components/ambient-messages").then((m) => m.AmbientMessages),
  { ssr: false }
);
const MobileExperienceNotice = dynamic(
  () => import("components/layout/mobile-experience-notice").then((m) => m.MobileExperienceNotice),
  { ssr: false }
);

type PortfolioV2Props = {
  variant: V2Variant;
  initialScratchpadNotes: ScratchpadNote[] | null;
};

/**
 * The v2 portfolio page.
 *
 * One tree serves both variants: `data-v2-variant` selects a token set in
 * styles/v2-theme.css and nothing below this point branches on it. Light and
 * dark come from the `dark` class next-themes puts on <html>, so the mode is
 * already correct on the first paint.
 */
export const PortfolioV2: FC<PortfolioV2Props> = ({ variant, initialScratchpadNotes }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // This subtree paints the page background, but overscroll rubber-banding
  // reveals the canvas behind it, which <body> owns. The tokens are scoped to
  // the v2 root, so the resolved colour is read off that node and mirrored onto
  // <body> rather than referencing a custom property that is out of scope there.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const { body } = document;
    const previous = body.style.backgroundColor;
    body.style.backgroundColor = getComputedStyle(root).backgroundColor;

    // The terminal portals its expanded modes (Byte, games, scratchpad) to
    // <body>, which sits outside this subtree. Mirroring the markers there lets
    // those layers resolve the same tokens and match the v2 skin.
    body.setAttribute("data-v2", "");
    body.setAttribute("data-v2-variant", variant);

    return () => {
      body.style.backgroundColor = previous;
      body.removeAttribute("data-v2");
      body.removeAttribute("data-v2-variant");
    };
  }, [variant, resolvedTheme]);

  return (
    <V2VariantProvider variant={variant}>
      <AchievementProvider>
        <div ref={rootRef} data-v2="" data-v2-variant={variant} className="min-h-screen">
          <V2Header />
          <V2Hero initialScratchpadNotes={initialScratchpadNotes} />
          <V2About />
          <V2Experience />
          <V2Projects />
          <V2Contact />
          <V2Quiz />
          <V2Footer />
          {/* Inside the token scope so the v2 skin reaches them. */}
          <AmbientMessages />
          {/* Wrapper gives the v1 notice a hook for the v2 skin below. */}
          <div className="v2-mobile-notice">
            <MobileExperienceNotice />
          </div>
        </div>
      </AchievementProvider>
    </V2VariantProvider>
  );
};
