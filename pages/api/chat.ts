// pages/api/chat.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
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

// --- Input Validation ---
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 500;

function validateMessages(messages: unknown): { valid: boolean; error?: string } {
  if (!Array.isArray(messages)) {
    return { valid: false, error: "Messages must be an array." };
  }
  if (messages.length === 0) {
    return { valid: false, error: "Messages cannot be empty." };
  }
  if (messages.length > MAX_MESSAGES) {
    return { valid: false, error: `Too many messages. Max ${MAX_MESSAGES} per request.` };
  }
  for (const msg of messages) {
    if (!msg || typeof msg !== "object") {
      return { valid: false, error: "Invalid message format." };
    }
    if (msg.role !== "user" && msg.role !== "assistant") {
      return { valid: false, error: "Invalid message role." };
    }
    if (typeof msg.content !== "string" || msg.content.trim().length === 0) {
      return { valid: false, error: "Message content must be a non-empty string." };
    }
    if (msg.content.length > MAX_MESSAGE_LENGTH) {
      return { valid: false, error: `Message too long. Max ${MAX_MESSAGE_LENGTH} characters.` };
    }
  }
  return { valid: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ChatResponse>) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "", error: "Method not allowed" });
  }

  // API key check
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      message: "",
      error: "*yawns* Byte is napping right now. The chatbot is currently unavailable.",
    });
  }

  // Input validation
  const { messages } = (req.body || {}) as ChatRequest;
  const validation = validateMessages(messages);
  if (!validation.valid) {
    return res.status(400).json({ message: "", error: validation.error });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `${BYTE_PERSONALITY}

Here is information about Aryan that you know:
${BYTE_KNOWLEDGE}

Remember: You are Byte the dog. Stay in character. Be helpful but with personality.`,
    });

    // Build chat history (all messages except the last one)
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const text = result.response.text();

    return res.status(200).json({ message: text || "*tilts head* ...woof?" });
  } catch (error: unknown) {
    console.error("Chat API error:", error);

    const errorMessage = error instanceof Error ? error.message : "";

    if (errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
      return res.status(429).json({
        message: "",
        error:
          "*yawns and curls up* Byte wants to take a short nap! I'll wake up in about a minute. Try again shortly!",
      });
    }

    if (
      errorMessage.includes("API_KEY") ||
      errorMessage.includes("401") ||
      errorMessage.includes("403")
    ) {
      return res.status(503).json({
        message: "",
        error:
          "*whimpers* Something's wrong with my collar tag. The chatbot is temporarily unavailable.",
      });
    }

    return res.status(500).json({
      message: "",
      error: "*whimpers* Something went wrong. Even dogs have bad days.",
    });
  }
}
