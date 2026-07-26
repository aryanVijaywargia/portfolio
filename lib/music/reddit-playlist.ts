export type MusicTrack = {
  id: string;
  title: string;
  youtubeId: string;
  redditUrl: string;
  subreddit: string;
  score: number;
};

type RedditPost = {
  id?: string;
  title?: string;
  permalink?: string;
  subreddit?: string;
  score?: number;
  over_18?: boolean;
  url?: string;
  url_overridden_by_dest?: string;
  selftext?: string;
  media?: { oembed?: { url?: string } };
};

export type RedditListing = {
  data?: {
    children?: Array<{ data?: RedditPost }>;
  };
};

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

export const FALLBACK_TRACKS: MusicTrack[] = [
  {
    id: "reddit-lofi-girl",
    title: "lofi hip hop radio — beats to relax/study to",
    youtubeId: "jfKfPfyJRdk",
    redditUrl:
      "https://www.reddit.com/r/code/comments/jwmwam/what_music_do_you_listen_to_when_coding/",
    subreddit: "code",
    score: 10,
  },
  {
    id: "reddit-synthwave-radio",
    title: "synthwave radio — beats to chill/game to",
    youtubeId: "4xDzrJKXOOY",
    redditUrl:
      "https://www.reddit.com/r/programmer/comments/1skhqqr/what_music_brings_out_your_inner_programmer_beast/",
    subreddit: "programmer",
    score: 5,
  },
  {
    id: "reddit-focus-coding",
    title: "lofi mix for locking in while coding",
    youtubeId: "iQdnkFPTsi8",
    redditUrl:
      "https://www.reddit.com/r/programmer/comments/1skhqqr/what_music_brings_out_your_inner_programmer_beast/",
    subreddit: "programmer",
    score: 5,
  },
  {
    id: "reddit-far-cry-ost",
    title: "Far Cry 4 OST — alert, focused coding",
    youtubeId: "5_eVVjn-ipo",
    redditUrl: "https://www.reddit.com/r/productivity/comments/ep0q90/coding_music/",
    subreddit: "productivity",
    score: 3,
  },
  {
    id: "reddit-programming-music",
    title: "Programming Music — listen while coding",
    youtubeId: "VlxKcLPHzGg",
    redditUrl: "https://www.reddit.com/r/u_PeaceMusic10/comments/h8wu1u/listen_while_coding/",
    subreddit: "u_PeaceMusic10",
    score: 1,
  },
  {
    id: "reddit-competitive-programming",
    title: "Competitive Programmers Music — focus mode",
    youtubeId: "QrH6DtLeUmg",
    redditUrl: "https://www.reddit.com/r/u_PeaceMusic10/comments/h8wu1u/listen_while_coding/",
    subreddit: "u_PeaceMusic10",
    score: 1,
  },
];

export function extractYouTubeId(input: string | undefined): string | null {
  if (!input) return null;

  try {
    const url = new URL(input);
    const hostname = url.hostname.replace(/^www\./, "").replace(/^m\./, "");

    if (hostname === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && YOUTUBE_ID.test(id) ? id : null;
    }

    if (hostname === "youtube.com" || hostname === "music.youtube.com") {
      const queryId = url.searchParams.get("v");
      if (queryId && YOUTUBE_ID.test(queryId)) return queryId;

      const parts = url.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(parts[0]) && YOUTUBE_ID.test(parts[1] || "")) {
        return parts[1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

function getCandidateUrls(post: RedditPost): string[] {
  const selftextUrls =
    post.selftext?.match(
      /https?:\/\/(?:www\.|m\.|music\.)?(?:youtube\.com|youtu\.be)\/[^\s)\]]+/g
    ) || [];

  return [post.url_overridden_by_dest, post.url, post.media?.oembed?.url, ...selftextUrls].filter(
    (value): value is string => Boolean(value)
  );
}

export function tracksFromRedditListings(listings: RedditListing[]): MusicTrack[] {
  const seenVideoIds = new Set<string>();
  const tracks: MusicTrack[] = [];

  listings.forEach((listing) => {
    listing.data?.children?.forEach(({ data: post }) => {
      if (!post || post.over_18 || !post.title || !post.id) return;

      const youtubeId = getCandidateUrls(post)
        .map(extractYouTubeId)
        .find((id): id is string => Boolean(id));

      if (!youtubeId || seenVideoIds.has(youtubeId)) return;
      seenVideoIds.add(youtubeId);

      tracks.push({
        id: post.id,
        title: post.title.trim(),
        youtubeId,
        redditUrl: post.permalink
          ? `https://www.reddit.com${post.permalink}`
          : "https://www.reddit.com/r/programmingmusic/",
        subreddit: post.subreddit || "programmingmusic",
        score: Math.max(0, post.score || 0),
      });
    });
  });

  return tracks.sort((a, b) => b.score - a.score).slice(0, 16);
}
