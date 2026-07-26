import assert from "node:assert/strict";
import test from "node:test";
import { getMusicRequestKind, pickRandomStationIndex, RADIO_STATIONS } from "./radio-stations";

test("Spotify top ten uses unique public preview streams", () => {
  assert.equal(RADIO_STATIONS.length, 10);
  assert.equal(new Set(RADIO_STATIONS.map(({ id }) => id)).size, RADIO_STATIONS.length);
  const allStreamUrls = RADIO_STATIONS.map(({ streamUrl }) => streamUrl);
  assert.equal(new Set(allStreamUrls).size, RADIO_STATIONS.length);

  allStreamUrls.forEach((streamUrl) => {
    const url = new URL(streamUrl);
    assert.equal(url.protocol, "https:");
    assert.equal(url.hostname, "p.scdn.co");
    assert.match(url.pathname, /^\/mp3-preview\/[a-f0-9]{40}$/);
  });

  RADIO_STATIONS.forEach(({ id, spotifyUrl }) => {
    assert.equal(spotifyUrl, `https://open.spotify.com/track/${id}`);
  });

  for (let index = 1; index < RADIO_STATIONS.length; index += 1) {
    assert.ok(RADIO_STATIONS[index - 1].playCount >= RADIO_STATIONS[index].playCount);
  }
});

test("recognizes chatbot requests to play music", () => {
  assert.equal(getMusicRequestKind("spin up a tune"), "play");
  assert.equal(getMusicRequestKind("Can you play some coding music?"), "play");
  assert.equal(getMusicRequestKind("music please"), "play");
  assert.equal(getMusicRequestKind("What is Aryan's favourite music?"), "favorite");
  assert.equal(getMusicRequestKind("tell me about his projects"), null);
});

test("selects a deterministic random station within the playlist", () => {
  assert.equal(
    pickRandomStationIndex(() => 0),
    0
  );
  assert.equal(
    pickRandomStationIndex(() => 0.999999),
    RADIO_STATIONS.length - 1
  );
});
