import { create } from "zustand";

interface State {
  activeId: string;
  setActiveId: (id: string) => void;
}

export const useConversationActiveStore = create<State>((set) => ({
  activeId: "",
  setActiveId: (activeId) => set({ activeId }),
}));
