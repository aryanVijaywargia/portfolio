import { NextSeo } from "next-seo";
import type { InferGetStaticPropsType } from "next";
import { FC } from "react";
import { PortfolioV2 } from "components/v2/portfolio-v2";
import { getV2StaticProps } from "lib/v2-page";

export const getStaticProps = getV2StaticProps;

/** Redesign preview — softly rounded, green accent. See components/v2. */
const GraphitePage: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  initialScratchpadNotes,
}) => (
  <>
    <NextSeo title="Aryan Vijaywargia | Portfolio (Graphite)" noindex nofollow />
    <PortfolioV2 variant="graphite" initialScratchpadNotes={initialScratchpadNotes} />
  </>
);

export default GraphitePage;
