import assert from "node:assert/strict";
import test from "node:test";
import { getMusicRequestKind, pickRandomStationIndex, RADIO_STATIONS } from "./radio-stations";

test("playlist first ten uses unique public preview streams in order", () => {
  assert.equal(RADIO_STATIONS.length, 10);
  assert.equal(new Set(RADIO_STATIONS.map(({ id }) => id)).size, RADIO_STATIONS.length);
  assert.deepEqual(
    RADIO_STATIONS.map(({ name }) => name),
    [
      "Axis",
      "NRG",
      "Kaelo",
      "Pale Light",
      "Daeo",
      "Corrupted",
      "Nuova",
      "COSMIC",
      "Lohka",
      "Hypersquare",
    ]
  );
  const allStreamUrls = RADIO_STATIONS.map(({ streamUrl }) => streamUrl);
  assert.equal(new Set(allStreamUrls).size, RADIO_STATIONS.length);

  allStreamUrls.forEach((streamUrl) => {
    const url = new URL(streamUrl);
    assert.equal(url.protocol, "https:");
    assert.ok(["p.scdn.co", "audio-ssl.itunes.apple.com"].includes(url.hostname));
  });

  RADIO_STATIONS.forEach(({ id, spotifyUrl }) => {
    assert.equal(spotifyUrl, `https://open.spotify.com/track/${id}`);
  });
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
