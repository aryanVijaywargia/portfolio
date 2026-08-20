export type ScratchpadNote = {
  id: number;
  message: string;
  created_at: string;
};

export type SupabaseConfig = {
  serviceRoleKey: string;
  url: string;
};

export const getSupabaseConfig = (): SupabaseConfig | null => {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;
  return { serviceRoleKey, url };
};

export const getSupabaseHeaders = (serviceRoleKey: string) => ({
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  "Content-Type": "application/json",
});

export const readScratchpadNotes = async (config: SupabaseConfig) => {
  const databaseResponse = await fetch(
    `${config.url}/rest/v1/scratchpad_notes?select=id,message,created_at&order=created_at.desc&limit=50`,
    { headers: getSupabaseHeaders(config.serviceRoleKey) }
  );

  if (!databaseResponse.ok) {
    throw new Error(`Supabase returned ${databaseResponse.status}`);
  }

  return (await databaseResponse.json()) as ScratchpadNote[];
};
