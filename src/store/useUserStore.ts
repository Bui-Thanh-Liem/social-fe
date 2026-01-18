import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";

interface State {
  user: IUser | null;
  setUser: (user: IUser) => void;
  clearUser: () => void;
}

export const useUserStore = create<State>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user_storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
