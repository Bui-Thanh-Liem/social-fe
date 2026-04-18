import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { IResTodayNewsOrOutstanding } from "~/shared/dtos/res/trending.dto";

interface State {
  trendingItem?: IResTodayNewsOrOutstanding;
  setTrendingItem: (val?: IResTodayNewsOrOutstanding) => void;
}

export const useTrendingStore = create<State>()(
  persist(
    (set) => ({
      trendingItem: undefined,
      setTrendingItem: (val) => set({ trendingItem: val }),
    }),
    {
      name: "trending_storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
