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
  messages: ChatMessage[];
  isLoading: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
};

export const useChatbot = create<ChatbotStore>((set) => ({
  isOpen: false,
  messages: [],
  isLoading: false,
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
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
