import assert from "node:assert/strict";
import test from "node:test";
import type { NextApiRequest } from "next";
import { createRateLimiter, getClientIp } from "./rate-limit";

test("limits each IP independently and returns the remaining wait in seconds", () => {
  const takeAttempt = createRateLimiter(2, 10_000);
  assert.equal(takeAttempt("first", 1000).allowed, true);
  assert.equal(takeAttempt("first", 2000).allowed, true);
  assert.deepEqual(takeAttempt("first", 2500), { allowed: false, retryAfter: 9 });
  assert.equal(takeAttempt("second", 2500).allowed, true);
});

test("uses a sliding window and does not extend it for rejected attempts", () => {
  const takeAttempt = createRateLimiter(2, 10_000);
  takeAttempt("first", 1000);
  takeAttempt("first", 2000);
  assert.equal(takeAttempt("first", 10_999).allowed, false);
  assert.equal(takeAttempt("first", 11_000).allowed, true);
  assert.deepEqual(takeAttempt("first", 11_001), { allowed: false, retryAfter: 1 });
  assert.equal(takeAttempt("first", 12_000).allowed, true);
});

test("keeps separate limiter instances independent", () => {
  const contact = createRateLimiter(1, 10_000);
  const chat = createRateLimiter(1, 10_000);
  contact("first", 1000);
  assert.equal(contact("first", 1000).allowed, false);
  assert.equal(chat("first", 1000).allowed, true);
});

test("bounds tracked IPs without evicting active limits and reclaims expired entries", () => {
  const takeAttempt = createRateLimiter(1, 10_000);
  for (let index = 0; index < 10_000; index += 1) {
    assert.equal(takeAttempt(`ip-${index}`, 1000).allowed, true);
  }
  assert.equal(takeAttempt("new-ip", 1000).allowed, false);
  assert.equal(takeAttempt("ip-0", 1000).allowed, false);
  assert.equal(takeAttempt("new-ip", 11_000).allowed, true);
});

test("reads proxy headers before falling back to the socket address", () => {
  const request = (headers: NextApiRequest["headers"]) =>
    ({
      headers,
      socket: { remoteAddress: "127.0.0.1" },
    } as NextApiRequest);

  assert.equal(
    getClientIp(request({ "x-forwarded-for": " 203.0.113.1, 203.0.113.2" })),
    "203.0.113.1"
  );
  assert.equal(
    getClientIp(request({ "x-forwarded-for": ["203.0.113.1, 203.0.113.2"] })),
    "203.0.113.1"
  );
  assert.equal(
    getClientIp(request({ "x-forwarded-for": " ", "x-real-ip": " 203.0.113.3 " })),
    "203.0.113.3"
  );
  assert.equal(getClientIp(request({ "x-real-ip": ["203.0.113.3"] })), "203.0.113.3");
  assert.equal(getClientIp(request({})), "127.0.0.1");
});
