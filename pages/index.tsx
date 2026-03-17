import { AchievementsSection, ConstellationSection } from "components/achievements";
import { About } from "components/sections/about";
import { Experience } from "components/sections/experience";
import { Hero } from "components/sections/hero";
import { PortfolioPreview } from "components/sections/portfolio-preview";
import { Quiz } from "components/sections/quiz";
import { Timeline } from "components/sections/timeline";
import party from "party-js";
import { FC } from "react";

party.settings.respectReducedMotion = false;

export const Index: FC = () => {
  return (
    <>
      <Hero />
      <About />
      <Timeline />
      <Experience />
      <PortfolioPreview />
      <AchievementsSection />
      <ConstellationSection />
      <Quiz />
    </>
  );
};

export default Index;
