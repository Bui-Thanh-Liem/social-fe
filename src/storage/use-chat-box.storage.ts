import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IConversation } from "~/shared/interfaces/schemas/conversation.interface";

interface ChatBoxStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  conversation: IConversation | undefined;
  setConversation: (val: IConversation | undefined) => void;
}

export const useChatBoxStore = create<ChatBoxStore>()(
  persist(
    (set) => ({
      conversation: undefined,
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      setConversation: (val) => set({ conversation: val }),
    }),
    {
      name: "chatBox_storage", // tên key trong localStorage
      partialize: (state) => ({
        isOpen: state.isOpen,
        profile: state.conversation,
      }), // chỉ lưu conversation, không lưu hàm
    }
  )
);
