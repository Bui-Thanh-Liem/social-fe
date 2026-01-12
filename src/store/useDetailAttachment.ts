import { create } from "zustand";
import type { IMedia } from "~/shared/interfaces/schemas/media.interface";

interface State {
  mediaList?: IMedia[];
  mediaSelected?: IMedia;

  setMediaList: (media?: IMedia[]) => void;
  setMediaSelected: (m?: IMedia) => void;
}

export const useDetailAttachment = create<State>((set) => ({
  mediaList: undefined,
  mediaSelected: undefined,

  setMediaList: (val) => set({ mediaList: val }),
  setMediaSelected: (val) => set({ mediaSelected: val }),
}));
