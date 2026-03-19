import { AchievementsSection } from "components/achievements";
import { About } from "components/sections/about";
import { Contact } from "components/sections/contact";
import { Experience } from "components/sections/experience";
import { Hero } from "components/sections/hero";
import { PortfolioPreview } from "components/sections/portfolio-preview";
import { Quiz } from "components/sections/quiz";
import { Timeline } from "components/sections/timeline";
import { BatmanHome } from "components/batman/batman-home";
import { usePortfolioMode } from "components/_stores/portfolio-mode-context";
import party from "party-js";
import { FC } from "react";

party.settings.respectReducedMotion = false;

export const Index: FC = () => {
  const { mode } = usePortfolioMode();

  if (mode === "batman") {
    return <BatmanHome />;
  }

  return (
    <>
      <Hero />
      <About />
      <Timeline />
      <Experience />
      <PortfolioPreview />
      <AchievementsSection />
      {/* <Quiz /> */}
      <Contact />
    </>
  );
};

export default Index;
