import { NextSeo } from "next-seo";
import type { InferGetStaticPropsType } from "next";
import { FC } from "react";
import { PortfolioV2 } from "components/v2/portfolio-v2";
import { getV2StaticProps } from "lib/v2-page";

export const getStaticProps = getV2StaticProps;

/** The public portfolio uses the Graphite variant. */
const HomePage: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  initialScratchpadNotes,
}) => (
  <>
    <NextSeo title="Aryan Vijaywargia | Portfolio" />
    <PortfolioV2 variant="graphite" initialScratchpadNotes={initialScratchpadNotes} />
  </>
);

export default HomePage;
