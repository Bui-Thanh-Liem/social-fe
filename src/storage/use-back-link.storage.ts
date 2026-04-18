import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface State {
  link: string | null;
  setLink: (link: string) => void;
  clearLink: () => void;
}

export const useBackLinkStore = create<State>()(
  persist(
    (set) => ({
      link: null,
      setLink: (link) => set({ link }),
      clearLink: () => set({ link: null }),
    }),
    {
      name: "back_link_storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
