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
    const { messages = [] } = (req.body || {}) as ChatRequest;
    const lastMessage = messages.length > 0 ? messages[messages.length - 1]?.content?.toLowerCase() || "" : "";

    // Mock mode for UI testing when using placeholder key
    if (apiKey === "your_api_key_here") {
      const mockResponses = [
        "*wags tail* Hey there! I'm Byte, Aryan's sassy assistant. I'm in demo mode right now, but once Aryan adds his API key, I'll be much smarter!",
        "*tilts head* Interesting question! In demo mode, I can only give you canned responses. But I promise I'm way wittier with a real API key.",
        "*scratches ear* You know, being a demo dog is ruff. Ask Aryan to set up the real API and I'll show you what I can really do!",
        "*yawns dramatically* I'd love to help more, but I'm running on placeholder power. The real Byte is much more impressive.",
        "*perks up* Ooh, a human! I'm Byte - part corgi, part chatbot, all sass. Currently in demo mode though!",
      ];

      // Simple keyword matching for demo
      let response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      if (lastMessage.includes("hello") || lastMessage.includes("hi") || lastMessage.includes("hey")) {
        response = "*wags tail excitedly* Woof! Hey there! I'm Byte, Aryan's witty canine assistant. I'm in demo mode right now, but feel free to test the UI!";
      } else if (lastMessage.includes("aryan") || lastMessage.includes("who")) {
        response = "*puffs chest proudly* Aryan? That's my human! He's a full-stack developer who dabbles in ML/AI. In demo mode I can't tell you much more, but the real me knows everything!";
      } else if (lastMessage.includes("project")) {
        response = "*sniffs around* Projects? Aryan has some cool ones! But in demo mode, my memory is a bit... fuzzy. Add the real API key for the full scoop!";
      }

      // Simulate slight delay for realism
      await new Promise(resolve => setTimeout(resolve, 500));
      return res.status(200).json({ message: response });
    }

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

    const textContent = response.content.find((c): c is Anthropic.TextBlock => c.type === "text");
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
