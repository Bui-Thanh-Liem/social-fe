import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { IReel } from "~/shared/interfaces/schemas/reel.interface";

interface State {
  reel: IReel | null;
  setReel: (reel: IReel) => void;
  clearReel: () => void;
}

export const useReelStore = create<State>()(
  persist(
    (set) => ({
      reel: null,
      setReel: (reel) => set({ reel }),
      clearReel: () => set({ reel: null }),
    }),
    {
      name: "reel_storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
