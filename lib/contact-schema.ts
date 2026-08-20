import { z } from "zod";

/**
 * Validation contract for the contact form, shared by any client that posts to
 * /api/contact so the client-side check cannot drift from the server's.
 *
 * The API route and the v1 contact section still declare their own copies;
 * pointing them here would remove that duplication, but it means editing the
 * live site, so it is left as a deliberate follow-up.
 */
export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
});

export type ContactStatus = "idle" | "sending" | "success" | "error";
