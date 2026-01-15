// pages/api/chat.ts
import Anthropic from "@anthropic-ai/sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import { BYTE_KNOWLEDGE, BYTE_PERSONALITY } from "content/byte-knowledge";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequest = {
  messages: Message[];
};

type ChatResponse = {
  message: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "", error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: "", error: "API key not configured" });
  }

  try {
    const { messages } = req.body as ChatRequest;

    const client = new Anthropic({ apiKey });

    const systemPrompt = `${BYTE_PERSONALITY}

Here is information about Aryan that you know:
${BYTE_KNOWLEDGE}

Remember: You are Byte the dog. Stay in character. Be helpful but with personality.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const textContent = response.content.find((c) => c.type === "text");
    const message = textContent ? textContent.text : "woof?";

    return res.status(200).json({ message });
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({
      message: "",
      error: "Something went wrong. Even dogs have bad days."
    });
  }
}
