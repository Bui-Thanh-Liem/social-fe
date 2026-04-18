// useReloadStore.ts
import { create } from "zustand";

interface State {
  reloadKey: number;
  triggerReload: () => void;
}

export const useReloadStore = create<State>((set) => ({
  reloadKey: 0,
  triggerReload: () =>
    set((state) => ({
      reloadKey: state.reloadKey + 1,
    })),
}));
