import { AchievementProvider } from "components/achievements";
import { trpc } from "components/_app/trpc";
import { ContextProviders } from "components/_stores/_context-providers";
import { LoadInitialData } from "components/_stores/_load-initial-data";

import { Footer } from "components/layout/footer";
import { Header } from "components/layout/header";
import { SEO } from "content/seo";
import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import "styles/tailwind.css";

const Loaders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ContextProviders>
      <LoadInitialData>{children}</LoadInitialData>
    </ContextProviders>
  );
};

const App = ({ pageProps, Component }: AppProps) => {
  const router = useRouter();
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
      <AchievementProvider>
        <DefaultSeo
          {...SEO}
          canonical={`${SEO.url}${router.asPath}`}
          twitter={SEO.twitter}
          title={SEO.title}
          description={SEO.description}
          openGraph={SEO.openGraph}
        />
        <Header />
        <AnimatePresence mode="wait">
          <motion.main
            key={router.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="min-h-screen print:!mx-auto print:!w-[1024px]"
          >
            <Component {...pageProps} />
          </motion.main>
        </AnimatePresence>
        <Footer />
        {/*<Stars />*/}
      </AchievementProvider>
    </Loaders>
  );
};

export default trpc.withTRPC(App);
