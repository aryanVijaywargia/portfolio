import { NextSeo } from "next-seo";
import { FC } from "react";
import { NotFoundV2 } from "components/v2/not-found-v2";

const NotFoundPage: FC = () => (
  <>
    <NextSeo title="404 — This route was never deployed" noindex nofollow />
    <NotFoundV2 />
  </>
);

export default NotFoundPage;
