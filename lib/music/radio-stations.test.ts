import assert from "node:assert/strict";
import test from "node:test";
import { RADIO_STATIONS } from "./radio-stations";

test("coding radio stations use unique direct HTTPS streams", () => {
  assert.ok(RADIO_STATIONS.length >= 4);
  assert.equal(new Set(RADIO_STATIONS.map(({ id }) => id)).size, RADIO_STATIONS.length);
  assert.equal(
    new Set(RADIO_STATIONS.map(({ streamUrl }) => streamUrl)).size,
    RADIO_STATIONS.length
  );

  RADIO_STATIONS.forEach(({ streamUrl }) => {
    const url = new URL(streamUrl);
    assert.equal(url.protocol, "https:");
    assert.equal(url.hostname, "ice.somafm.com");
  });
});
