import { AchievementProvider } from "components/achievements";
import { Hero } from "components/sections/hero";
import dynamic from "next/dynamic";
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
export const Index: FC = () => {
  return (
    <AchievementProvider>
      <Hero />
      <About />
      <Timeline />
      <Experience />
      <PortfolioPreview />
      <Contact />
      <Quiz />
    </AchievementProvider>
  );
};

export default Index;
