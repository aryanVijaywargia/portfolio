import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
});

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
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "aryanvijaywargia@gmail.com",
      replyTo: email,
      subject: `Portfolio Contact: ${name}`,
      text: `From: ${name} (${email})\n\n${message}`,
      html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message.replace(
        /\n/g,
        "<br>"
      )}</p>`,
    });

    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ error: "Failed to send email" });
  }
}
