import { create } from "zustand";

interface State {
  state: number;
  trigger: () => void;
}

export const useTriggerAccessRecentStore = create<State>((set) => ({
  state: 0,
  trigger: () => set((prev) => ({ state: prev.state + 1 })),
}));
