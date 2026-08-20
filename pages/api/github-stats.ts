import type { NextApiRequest, NextApiResponse } from "next";
import { describeScope, fetchGitHubStats } from "lib/github-stats";
import type { GitHubStats } from "lib/github-stats";

type Payload = GitHubStats & { scope: string };

/**
 * Serves the live About counts.
 *
 * Cached at the edge for an hour: the numbers move slowly, and GitHub's search
 * API is rate-limited hard without a token.
 */
const handler = async (_req: NextApiRequest, res: NextApiResponse<Payload>) => {
  const stats = await fetchGitHubStats();

  res.setHeader(
    "Cache-Control",
    stats.mergedPullRequests === null && stats.commits === null
      ? "public, s-maxage=60"
      : "public, s-maxage=3600, stale-while-revalidate=86400"
  );
  res.status(200).json({ ...stats, scope: describeScope() });
};

export default handler;
