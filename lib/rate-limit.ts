import type { NextApiRequest } from "next";

const MAX_TRACKED_IPS = 10_000;

export const getClientIp = (request: NextApiRequest) => {
  const forwardedFor = request.headers["x-forwarded-for"];
  const realIp = request.headers["x-real-ip"];
  const forwardedIp = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)
    ?.split(",")[0]
    ?.trim();

  // Vercel supplies these headers. Other hosts must overwrite untrusted values.
  return (
    forwardedIp ||
    (Array.isArray(realIp) ? realIp[0] : realIp)?.trim() ||
    request.socket.remoteAddress ||
    "unknown"
  );
};

/** Best effort only: counters are per serverless instance and reset on cold starts. */
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const attempts = new Map<string, number[]>();
  let lastCleanup = 0;

  return (ip: string, now = Date.now()) => {
    const cutoff = now - windowMs;
    if (now - lastCleanup >= Math.min(windowMs, 60_000) || attempts.size >= MAX_TRACKED_IPS) {
      attempts.forEach((timestamps, key) => {
        if (timestamps[timestamps.length - 1] <= cutoff) attempts.delete(key);
      });
      lastCleanup = now;
    }

    const recentAttempts = (attempts.get(ip) || []).filter((timestamp) => timestamp > cutoff);
    if (recentAttempts.length >= maxRequests) {
      return {
        allowed: false,
        retryAfter: Math.max(1, Math.ceil((recentAttempts[0] + windowMs - now) / 1000)),
      };
    }

    // Bound memory without evicting active counters and letting repeat callers through.
    if (!attempts.has(ip) && attempts.size >= MAX_TRACKED_IPS) {
      return { allowed: false, retryAfter: Math.ceil(windowMs / 1000) };
    }

    recentAttempts.push(now);
    attempts.set(ip, recentAttempts);
    return { allowed: true, retryAfter: 0 };
  };
};
