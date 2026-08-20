import type { NextApiRequest, NextApiResponse } from "next";

type KeepaliveResponse =
  | { ok: true }
  | {
      ok: false;
      error: "Unauthorized" | "Method not allowed" | "Not configured" | "Supabase request failed";
    };

const getSupabaseConfig = () => {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;
  return { serviceRoleKey, url };
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<KeepaliveResponse>
) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.authorization !== `Bearer ${cronSecret}`) {
    return response.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const config = getSupabaseConfig();
  if (!config) {
    return response.status(503).json({ ok: false, error: "Not configured" });
  }

  try {
    // A minimal read creates database activity without inserting a note that could appear in the UI.
    const databaseResponse = await fetch(
      `${config.url}/rest/v1/scratchpad_notes?select=id&limit=1`,
      {
        headers: {
          apikey: config.serviceRoleKey,
          Authorization: `Bearer ${config.serviceRoleKey}`,
        },
      }
    );

    if (!databaseResponse.ok) {
      throw new Error(`Supabase returned ${databaseResponse.status}`);
    }

    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error("Supabase keepalive failed", error);
    return response.status(502).json({ ok: false, error: "Supabase request failed" });
  }
}
