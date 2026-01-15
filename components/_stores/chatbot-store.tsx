// components/_stores/chatbot-store.tsx
import create from "zustand";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

type ChatbotStore = {
  isOpen: boolean;
  triggerChatbot: boolean; // Triggers the terminal loading animation
  messages: ChatMessage[];
  isLoading: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  requestChatbot: () => void; // Request chatbot with loading animation
  clearTrigger: () => void;
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
};

export const useChatbot = create<ChatbotStore>((set) => ({
  isOpen: false,
  triggerChatbot: false,
  messages: [],
  isLoading: false,
  openChat: () => set({ isOpen: true, triggerChatbot: false }),
  closeChat: () => set({ isOpen: false }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  requestChatbot: () => set({ triggerChatbot: true }),
  clearTrigger: () => set({ triggerChatbot: false }),
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          timestamp: Date.now(),
        },
      ],
    })),
  setLoading: (isLoading) => set({ isLoading }),
  clearMessages: () => set({ messages: [] }),
}));
