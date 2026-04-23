import { TWEETS } from "content/tweets";
import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "twitter-api-sdk";

type TweetsFunction = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

const CACHE_TTL_MS = 15 * 60 * 1000;
let cache: { payload: string; expiresAt: number } | null = null;

export const Tweets: TweetsFunction = async (req, res) => {
  res.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=3600");

  if (cache && cache.expiresAt > Date.now()) {
    res.status(200).send(cache.payload);
    return;
  }

  const client = new Client(process.env.TWITTER_CLIENT_BEARER_TOKEN as string);
  const twitterData = await client.tweets.findTweetsById({
    ids: TWEETS,
    expansions: ["author_id"],
    "user.fields": ["description", "name"],
    "tweet.fields": ["created_at", "in_reply_to_user_id", "text", "withheld"],
  });

  const payload = JSON.stringify(twitterData, null, 4);
  cache = { payload, expiresAt: Date.now() + CACHE_TTL_MS };
  res.status(200).send(payload);
};

export default Tweets;
