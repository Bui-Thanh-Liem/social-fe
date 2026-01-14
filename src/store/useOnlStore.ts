import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  onlUserIds: string[];
  setOnlUserIds: (val: string[]) => void;
}

export const useOnlStore = create<State>()(
  persist(
    (set) => ({
      onlUserIds: [],
      setOnlUserIds: (val) => {
        return set({ onlUserIds: val });
      },
    }),
    {
      name: "onl_user_ids",
      partialize: (state) => ({
        onlUserIds: state.onlUserIds,
      }),
    }
  )
);
