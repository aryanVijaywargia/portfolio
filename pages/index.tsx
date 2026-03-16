import { AchievementsSection } from "components/achievements";
import { About } from "components/sections/about";
import { Contact } from "components/sections/contact";
import { Experience } from "components/sections/experience";
import { Hero } from "components/sections/hero";
import { PortfolioPreview } from "components/sections/portfolio-preview";
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
      <Contact />
    </>
  );
};

export default Index;
