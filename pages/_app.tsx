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
      if (process.env.NODE_ENV !== "development") {
        console.log(
          "%cHEY YOU! I see you sneaking in my code. This Page is custom built by Aryan Vijaywargia. I mainly used Next.js, TailwindCSS, Typescript, Vercel, and TRPC as the main tech here. Questions? Just drop me an email at aryanvijaywargia@gmail.com! You can find me on GitHub: https://github.com/AryanVijaywargia",
          "background: rgb(0,0,0);color: #fafafa;font-size: 24px;font-weight: bold;padding: 25px 10px;text-align: center;text-shadow: 2px 2px 0 rgba(45, 45, 45);"
        );
      }
    }
  }, []);

  if (loading) {
    return <></>;
  }

  return (
    <Loaders>
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
    </Loaders>
  );
};

export default trpc.withTRPC(App);
