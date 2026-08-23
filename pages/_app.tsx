import { ContextProviders } from "components/_stores/_context-providers";
import { LoadInitialData } from "components/_stores/_load-initial-data";
import { PortfolioModeProvider, usePortfolioMode } from "components/_stores/portfolio-mode-context";

import { AmbientMessages } from "components/ambient-messages";
import { Footer } from "components/layout/footer";
import { Header } from "components/layout/header";
import { MobileExperienceNotice } from "components/layout/mobile-experience-notice";
import { BatTransition } from "components/batman/bat-transition";
import { isV2Route } from "components/v2/routes";
import { SEO } from "content/seo";
import dynamic from "next/dynamic";
import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { FC, PropsWithChildren, useEffect } from "react";
import "styles/tailwind.css";

const BatmanHeader = dynamic(
  () => import("components/layout/batman-header").then((mod) => mod.BatmanHeader),
  { ssr: false }
);
const BatmanFooter = dynamic(
  () => import("components/layout/batman-footer").then((mod) => mod.BatmanFooter),
  { ssr: false }
);
const BatScrollFollower = dynamic(
  () => import("components/batman/bat-scroll-follower").then((mod) => mod.BatScrollFollower),
  { ssr: false }
);

const Loaders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ContextProviders>
      <LoadInitialData>{children}</LoadInitialData>
    </ContextProviders>
  );
};

const AppShell: FC<{ pageProps: any; Component: any }> = ({ pageProps, Component }) => {
  const router = useRouter();
  const { showTransition } = usePortfolioMode();
  const isBatman = router.pathname === "/batman";
  // The v2 routes render their own header, footer and ambient chrome.
  const isV2 = isV2Route(router.pathname);
  const canonicalPath = router.asPath.split(/[?#]/)[0] || "/";

  // Pages outside the portfolio — the resume, for one — are shared with "/",
  // so they cannot carry a skin of their own. A `?theme=` on the link opts them
  // in, which keeps the unadorned URL identical to production.
  const requestedTheme = typeof router.query.theme === "string" ? router.query.theme : undefined;
  const v2Variant =
    requestedTheme === "signal" || requestedTheme === "graphite" ? requestedTheme : undefined;

  // <body> paints the canvas behind the page and is an ancestor of the marker
  // below, so the skin has to be mirrored up for it to take. The portfolio
  // routes do this themselves; this covers the shared pages.
  useEffect(() => {
    const root = document.documentElement;
    const { body } = document;
    if (!v2Variant) return undefined;

    root.setAttribute("data-v2", "");
    root.setAttribute("data-v2-variant", v2Variant);
    body.setAttribute("data-v2", "");
    body.setAttribute("data-v2-variant", v2Variant);

    return () => {
      [root, body].forEach((el) => {
        el.removeAttribute("data-v2");
        el.removeAttribute("data-v2-variant");
      });
    };
  }, [v2Variant]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Initial scroll restoration runs in an inline <script> in _document.tsx
    // before first paint to avoid the landing-page flash. This effect only
    // wires up the save-on-unload side so the inline script has data to read.
    const saveScroll = () => {
      sessionStorage.setItem(`scrollPos:${window.location.pathname}`, String(window.scrollY));
    };
    window.addEventListener("pagehide", saveScroll);
    return () => {
      window.removeEventListener("pagehide", saveScroll);
    };
  }, []);

  return (
    <div
      data-portfolio-mode={isBatman ? "batman" : undefined}
      data-v2={v2Variant ? "" : undefined}
      data-v2-variant={v2Variant}
    >
      <DefaultSeo
        {...SEO}
        canonical={`${SEO.url}${canonicalPath}`}
        twitter={SEO.twitter}
        title={isBatman ? "Aryan Vijaywargia | The Dark Knight" : SEO.title}
        description={SEO.description}
        openGraph={SEO.openGraph}
      />
      {isV2 ? null : isBatman ? <BatmanHeader /> : <Header />}
      <main className="relative z-10 min-h-screen print:!mx-auto print:!w-[1024px]">
        <Component {...pageProps} />
      </main>
      {isV2 ? null : isBatman ? <BatmanFooter /> : <Footer />}
      {!isV2 && (router.pathname === "/graphite" || isBatman) ? <MobileExperienceNotice /> : null}
      {showTransition ? <BatTransition /> : null}
      {isBatman ? <BatScrollFollower /> : null}
      {!isV2 && !isBatman && router.pathname === "/graphite" ? <AmbientMessages /> : null}
    </div>
  );
};

const App = ({ pageProps, Component }: AppProps) => {
  return (
    <Loaders>
      <PortfolioModeProvider>
        <AppShell pageProps={pageProps} Component={Component} />
        {/*<Stars />*/}
      </PortfolioModeProvider>
    </Loaders>
  );
};

export default App;
