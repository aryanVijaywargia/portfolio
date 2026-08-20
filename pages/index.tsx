import { AchievementProvider } from "components/achievements";
import { Hero } from "components/sections/hero";
import { getSupabaseConfig, readScratchpadNotes } from "lib/scratchpad";
import type { ScratchpadNote } from "lib/scratchpad";
import dynamic from "next/dynamic";
import type { GetStaticProps } from "next";
import { FC } from "react";

const About = dynamic(() => import("components/sections/about").then((mod) => mod.About));
const Timeline = dynamic(() => import("components/sections/timeline").then((mod) => mod.Timeline));
const Experience = dynamic(() =>
  import("components/sections/experience").then((mod) => mod.Experience)
);
const PortfolioPreview = dynamic(() =>
  import("components/sections/portfolio-preview").then((mod) => mod.PortfolioPreview)
);
const Contact = dynamic(() => import("components/sections/contact").then((mod) => mod.Contact));
const Quiz = dynamic(() => import("components/quiz").then((mod) => mod.Quiz), { ssr: false });

type IndexProps = {
  initialScratchpadNotes: ScratchpadNote[] | null;
};

export const Index: FC<IndexProps> = ({ initialScratchpadNotes }) => {
  return (
    <AchievementProvider>
      <Hero initialScratchpadNotes={initialScratchpadNotes} />
      <About />
      <Timeline />
      <Experience />
      <PortfolioPreview />
      <Contact />
      <Quiz />
    </AchievementProvider>
  );
};

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
  const config = getSupabaseConfig();
  if (!config) {
    return { props: { initialScratchpadNotes: null }, revalidate: 60 };
  }

  try {
    const initialScratchpadNotes = await readScratchpadNotes(config);
    return { props: { initialScratchpadNotes }, revalidate: 60 };
  } catch (error) {
    console.error("Could not preload scratchpad notes", error);
    return { props: { initialScratchpadNotes: null }, revalidate: 30 };
  }
};

export default Index;
