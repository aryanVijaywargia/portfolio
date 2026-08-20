import { useEffect, useState } from "react";
import { formatCount } from "lib/github-stats";
import type { GitHubStats } from "lib/github-stats";

/**
 * Replaces the statically authored stat values with live ones once they land.
 *
 * Keyed by caption so the content module stays the single source of the copy,
 * captions and tooltips; only the number is overridden, and only if the fetch
 * succeeds. Anything not covered keeps the value written in content/about.
 */
type StatOverride = { statistic: string; tooltip: string };

export const useLiveStatValues = (): Record<string, StatOverride> => {
  const [values, setValues] = useState<Record<string, StatOverride>>({});

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch("/api/github-stats");
        if (!response.ok) return;
        const stats = (await response.json()) as GitHubStats & { scope?: string };
        if (cancelled) return;

        const scope = stats.scope ?? "across public repositories";
        const next: Record<string, StatOverride> = {};
        if (stats.mergedPullRequests !== null) {
          next["PRs Merged"] = {
            statistic: formatCount(stats.mergedPullRequests),
            tooltip: `${stats.mergedPullRequests.toLocaleString()} pull requests merged ${scope}`,
          };
        }
        if (stats.commits !== null) {
          next["Git Commits"] = {
            statistic: formatCount(stats.commits),
            tooltip: `${stats.commits.toLocaleString()} authored commits ${scope}`,
          };
        }
        setValues(next);
      } catch {
        // Keep the authored values.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return values;
};
