import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { z } from "zod";

const DEFAULT_CONTACT_EMAIL = "aryanvijaywargia@gmail.com";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
});

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const createMailer = () => {
  const host = process.env.EMAIL_SERVER_HOST?.trim();
  const portValue = process.env.EMAIL_SERVER_PORT?.trim();
  const port = portValue ? Number(portValue) : null;
  const smtpUser = process.env.EMAIL_SERVER_USER?.trim();
  const smtpPass = process.env.EMAIL_SERVER_PASSWORD?.trim();
  const legacyUser = process.env.EMAIL_USER?.trim();
  const legacyPass = process.env.EMAIL_PASS?.trim();
  const user = smtpUser || legacyUser;
  const pass = smtpPass || legacyPass;
  const from = process.env.EMAIL_FROM?.trim() || user;
  const configuredTo = process.env.CONTACT_EMAIL_TO?.trim() || process.env.EMAIL_TO?.trim();
  const to = configuredTo || DEFAULT_CONTACT_EMAIL;

  if (!from) {
    return null;
  }

  if (host) {
    if (!port || !Number.isFinite(port)) {
      return null;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
    });

    const isPlaceholderConfig =
      host === "localhost" &&
      port === 587 &&
      smtpUser === "dev@example.com" &&
      smtpPass === "dev-password" &&
      from === "noreply@example.com";

    return { from, isPlaceholderConfig, to, transporter };
  }

  if (user && pass) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    const isPlaceholderConfig = user === "dev@example.com" && pass === "dev-password";

    return { from, isPlaceholderConfig, to, transporter };
  }

  return null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  const { name, email, message } = parsed.data;

  try {
    const mailer = createMailer();

    if (!mailer || mailer.isPlaceholderConfig) {
      console.error("Contact email is not configured with a real SMTP provider.");
      return res.status(500).json({ error: "Contact form email is not configured on the server." });
    }

    await mailer.transporter.sendMail({
      from: mailer.from,
      to: mailer.to,
      replyTo: email,
      subject: `Portfolio Contact: ${name}`,
      text: `From: ${name} (${email})\n\n${message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(
        email
      )})</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to send contact email.", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
