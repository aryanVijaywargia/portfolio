/**
 * Live counts for the About stats.
 *
 * These were hardcoded strings in content/about, so they drifted the moment
 * more work shipped. The PR count comes from GitHub's search API, which serves
 * public results without credentials; a GITHUB_TOKEN, if configured, widens it
 * to private repositories and lifts the rate limit.
 */
export type GitHubStats = {
  mergedPullRequests: number | null;
  commits: number | null;
};

const GITHUB_USER = "AryanVijaywargia";

/**
 * "230+" / "1.5K+" — always rounded down, so the figure never overstates.
 *
 * Thousands step in halves: 1K, 1.5K, 2K. Finer than that (1.1K, 1.2K) reads
 * as a measurement rather than a milestone, and coarser leaves the same "1K+"
 * on screen for a thousand commits.
 */
export const formatCount = (value: number): string => {
  if (value >= 1000) {
    const halves = Math.floor(value / 500) / 2;
    return `${Number.isInteger(halves) ? halves : halves.toFixed(1)}K+`;
  }
  if (value >= 100) return `${Math.floor(value / 10) * 10}+`;
  return `${Math.floor(value / 5) * 5}+`;
};

export const fetchGitHubStats = async (): Promise<GitHubStats> => {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "aryan-portfolio",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const total = async (path: string): Promise<number | null> => {
    try {
      const response = await fetch(`https://api.github.com/search/${path}&per_page=1`, { headers });
      if (!response.ok) return null;
      const body = (await response.json()) as { total_count?: number };
      return typeof body.total_count === "number" ? body.total_count : null;
    } catch {
      // Offline, rate-limited or GitHub is down: the caller keeps its static copy.
      return null;
    }
  };

  const author = encodeURIComponent(`author:${GITHUB_USER}`);
  const [mergedPullRequests, commits] = await Promise.all([
    total(`issues?q=${encodeURIComponent(`is:pr author:${GITHUB_USER} is:merged`)}`),
    total(`commits?q=${author}`),
  ]);

  return { mergedPullRequests, commits };
};

/**
 * Both counts cover public repositories only unless GITHUB_TOKEN is set, so the
 * tooltip has to say which it is rather than repeating a figure authored by
 * hand — the old copy claimed 1,875 commits and had no way to stay true.
 */
export const describeScope = (): string =>
  process.env.GITHUB_TOKEN ? "including private repositories" : "across public repositories";
