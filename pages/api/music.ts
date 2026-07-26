import type { NextApiRequest, NextApiResponse } from "next";
import { FALLBACK_TRACKS, MusicTrack, RedditListing, tracksFromRedditListings } from "lib/music/reddit-playlist";

type PlaylistResponse = {
  tracks: MusicTrack[];
  source: "reddit-live" | "reddit-curated";
  fetchedAt: string;
};

const REDDIT_FEEDS = [
  "https://www.reddit.com/r/programmingmusic/top.json?t=year&limit=50&raw_json=1",
  "https://www.reddit.com/r/programmer/search.json?q=music&restrict_sr=1&sort=top&t=year&limit=35&raw_json=1",
  "https://www.reddit.com/r/AskProgrammers/search.json?q=music&restrict_sr=1&sort=top&t=year&limit=35&raw_json=1",
];
const CACHE_TTL_MS = 60 * 60 * 1000;
let cache: { value: PlaylistResponse; expiresAt: number } | null = null;

async function fetchRedditFeed(url: string): Promise<RedditListing> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "aryancodes.com coding-music-player/1.0" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Reddit returned ${response.status}`);
    return (await response.json()) as RedditListing;
  } finally {
    clearTimeout(timeout);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<PlaylistResponse>) {
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");

  if (cache && cache.expiresAt > Date.now()) {
    return res.status(200).json(cache.value);
  }

  const results = await Promise.allSettled(REDDIT_FEEDS.map(fetchRedditFeed));
  const listings = results.flatMap((result) =>
    result.status === "fulfilled" ? [result.value] : []
  );
  const liveTracks = tracksFromRedditListings(listings);
  const value: PlaylistResponse = {
    tracks: liveTracks.length >= 4 ? liveTracks : FALLBACK_TRACKS,
    source: liveTracks.length >= 4 ? "reddit-live" : "reddit-curated",
    fetchedAt: new Date().toISOString(),
  };

  cache = { value, expiresAt: Date.now() + CACHE_TTL_MS };
  return res.status(200).json(value);
}
