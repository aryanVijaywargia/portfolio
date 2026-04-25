import { ContextProviders } from "components/_stores/_context-providers";
import { LoadInitialData } from "components/_stores/_load-initial-data";
import { PortfolioModeProvider, usePortfolioMode } from "components/_stores/portfolio-mode-context";

import { Footer } from "components/layout/footer";
import { Header } from "components/layout/header";
import { MobileExperienceNotice } from "components/layout/mobile-experience-notice";
import { BatTransition } from "components/batman/bat-transition";
import { SEO } from "content/seo";
import dynamic from "next/dynamic";
import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { FC, PropsWithChildren } from "react";
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
  const { mode, showTransition } = usePortfolioMode();
  const isBatman = mode === "batman";

  return (
    <>
      <DefaultSeo
        {...SEO}
        canonical={`${SEO.url}${router.asPath}`}
        twitter={SEO.twitter}
        title={isBatman ? "Aryan Vijaywargia | The Dark Knight" : SEO.title}
        description={SEO.description}
        openGraph={SEO.openGraph}
      />
      {isBatman ? <BatmanHeader /> : <Header />}
      <main className="min-h-screen print:!mx-auto print:!w-[1024px]">
        <Component {...pageProps} />
      </main>
      {isBatman ? <BatmanFooter /> : <Footer />}
      <MobileExperienceNotice />
      {showTransition ? <BatTransition /> : null}
      {isBatman ? <BatScrollFollower /> : null}
    </>
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
