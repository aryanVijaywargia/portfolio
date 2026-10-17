import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseConfig, getSupabaseHeaders, readScratchpadNotes } from "lib/scratchpad";
import type { ScratchpadNote } from "lib/scratchpad";
import { createRateLimiter, getClientIp } from "lib/rate-limit";

type ScratchpadResponse =
  | { notes: ScratchpadNote[] }
  | { note: ScratchpadNote }
  | { error: string };

const MAX_NOTE_LENGTH = 280;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX_WRITES = 3;
const takeWriteAttempt = createRateLimiter(RATE_LIMIT_MAX_WRITES, RATE_LIMIT_WINDOW_MS);

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ScratchpadResponse>
) {
  const config = getSupabaseConfig();
  if (!config) {
    return response.status(503).json({
      error: "The shared scratchpad is not connected yet. Please try again soon.",
    });
  }

  if (request.method === "GET") {
    try {
      const notes = await readScratchpadNotes(config);
      response.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=30");
      return response.status(200).json({ notes });
    } catch (error) {
      console.error("Could not read scratchpad notes", error);
      return response.status(502).json({ error: "Could not open the shared file." });
    }
  }

  if (request.method === "POST") {
    const message = typeof request.body?.message === "string" ? request.body.message.trim() : "";
    const honeypot = typeof request.body?.website === "string" ? request.body.website.trim() : "";
    const characterCount = Array.from(message).length;

    if (honeypot) {
      return response.status(400).json({ error: "Your note could not be saved." });
    }
    if (!message) {
      return response.status(400).json({ error: "Write something before hitting Enter." });
    }
    if (characterCount > MAX_NOTE_LENGTH) {
      return response.status(400).json({ error: "Keep the note under 280 characters." });
    }
    const limit = takeWriteAttempt(getClientIp(request));
    if (!limit.allowed) {
      response.setHeader("Retry-After", limit.retryAfter);
      return response.status(429).json({
        error: "A few notes are enough for now. Try again in five minutes.",
      });
    }

    try {
      const databaseResponse = await fetch(`${config.url}/rest/v1/scratchpad_notes`, {
        method: "POST",
        headers: {
          ...getSupabaseHeaders(config.serviceRoleKey),
          Prefer: "return=representation",
        },
        body: JSON.stringify({ message }),
      });

      if (!databaseResponse.ok) {
        throw new Error(`Supabase returned ${databaseResponse.status}`);
      }

      const createdNotes = (await databaseResponse.json()) as ScratchpadNote[];
      const note = createdNotes[0];
      if (!note) throw new Error("Supabase did not return the created note");

      return response.status(201).json({ note });
    } catch (error) {
      console.error("Could not save scratchpad note", error);
      return response.status(502).json({ error: "Your note could not be saved." });
    }
  }

  response.setHeader("Allow", "GET, POST");
  return response.status(405).json({ error: "Method not allowed." });
}
