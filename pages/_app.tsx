import { AchievementProvider } from "components/achievements";
import { ContextProviders } from "components/_stores/_context-providers";
import { LoadInitialData } from "components/_stores/_load-initial-data";
import { PortfolioModeProvider, usePortfolioMode } from "components/_stores/portfolio-mode-context";

import { Footer } from "components/layout/footer";
import { Header } from "components/layout/header";
import { BatmanHeader } from "components/layout/batman-header";
import { BatmanFooter } from "components/layout/batman-footer";
import { BatTransition } from "components/batman/bat-transition";
import { BatScrollFollower } from "components/batman/bat-scroll-follower";
import { SEO } from "content/seo";
import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import "styles/tailwind.css";
import "@xyflow/react/dist/style.css";

const Loaders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ContextProviders>
      <LoadInitialData>{children}</LoadInitialData>
    </ContextProviders>
  );
};

const AppShell: FC<{ pageProps: any; Component: any }> = ({ pageProps, Component }) => {
  const router = useRouter();
  const { mode } = usePortfolioMode();
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
      <AnimatePresence mode="wait">
        <motion.main
          key={router.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="min-h-screen print:!mx-auto print:!w-[1024px]"
        >
          <Component {...pageProps} />
        </motion.main>
      </AnimatePresence>
      {isBatman ? <BatmanFooter /> : <Footer />}
      <BatTransition />
      <BatScrollFollower />
    </>
  );
};

const App = ({ pageProps, Component }: AppProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window) {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <></>;
  }

  return (
    <Loaders>
      <PortfolioModeProvider>
        <AchievementProvider>
          <AppShell pageProps={pageProps} Component={Component} />
          {/*<Stars />*/}
        </AchievementProvider>
      </PortfolioModeProvider>
    </Loaders>
  );
};

export default App;
