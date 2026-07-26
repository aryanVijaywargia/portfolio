import assert from "node:assert/strict";
import test from "node:test";
import { getMusicRequestKind, pickRandomStationIndex, RADIO_STATIONS } from "./radio-stations";

test("coding radio stations use unique direct HTTPS streams", () => {
  assert.ok(RADIO_STATIONS.length >= 4);
  assert.equal(new Set(RADIO_STATIONS.map(({ id }) => id)).size, RADIO_STATIONS.length);
  const allStreamUrls = RADIO_STATIONS.flatMap(({ streamUrl, fallbackStreamUrl }) => [
    streamUrl,
    fallbackStreamUrl,
  ]);
  assert.equal(new Set(allStreamUrls).size, RADIO_STATIONS.length * 2);

  allStreamUrls.forEach((streamUrl) => {
    const url = new URL(streamUrl);
    assert.equal(url.protocol, "https:");
    assert.match(url.hostname, /^ice[25]\.somafm\.com$/);
    assert.match(url.pathname, /-128-mp3$/);
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
