import assert from "node:assert/strict";
import test from "node:test";
import { extractYouTubeId, tracksFromRedditListings } from "./reddit-playlist";

test("extractYouTubeId supports common YouTube URL formats", () => {
  assert.equal(extractYouTubeId("https://youtu.be/jfKfPfyJRdk?t=10"), "jfKfPfyJRdk");
  assert.equal(
    extractYouTubeId("https://music.youtube.com/watch?v=4xDzrJKXOOY&list=radio"),
    "4xDzrJKXOOY"
  );
  assert.equal(extractYouTubeId("https://www.youtube.com/embed/5_eVVjn-ipo"), "5_eVVjn-ipo");
  assert.equal(extractYouTubeId("https://example.com/not-youtube"), null);
});

test("tracksFromRedditListings filters, deduplicates, and sorts posts", () => {
  const tracks = tracksFromRedditListings([
    {
      data: {
        children: [
          {
            data: {
              id: "lower",
              title: "Lower score",
              url: "https://youtu.be/jfKfPfyJRdk",
              permalink: "/r/code/lower",
              subreddit: "code",
              score: 2,
            },
          },
          {
            data: {
              id: "higher",
              title: "Higher score",
              selftext: "Play https://www.youtube.com/watch?v=4xDzrJKXOOY while coding",
              permalink: "/r/programmer/higher",
              subreddit: "programmer",
              score: 10,
            },
          },
          {
            data: {
              id: "duplicate",
              title: "Duplicate video",
              url_overridden_by_dest: "https://youtu.be/jfKfPfyJRdk",
              score: 100,
            },
          },
        ],
      },
    },
  ]);

  assert.deepEqual(
    tracks.map(({ id }) => id),
    ["higher", "lower"]
  );
  assert.equal(tracks[0].redditUrl, "https://www.reddit.com/r/programmer/higher");
});
