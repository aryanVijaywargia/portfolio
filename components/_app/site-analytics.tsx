// The React entry points support Next 12; /next requires Next 13+.
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { FC } from "react";

const isProductionDeployment =
  process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
const observabilityConfig = process.env.NEXT_PUBLIC_VERCEL_OBSERVABILITY_CLIENT_CONFIG;

type SiteAnalyticsProps = {
  route: string;
  path: string;
};

export const SiteAnalytics: FC<SiteAnalyticsProps> = ({ route, path }) => {
  if (!isProductionDeployment) return null;

  return (
    <>
      <Analytics route={route} path={path} configString={observabilityConfig} />
      <SpeedInsights route={route} configString={observabilityConfig} />
    </>
  );
};
