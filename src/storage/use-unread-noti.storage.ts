import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ENotificationType } from "~/shared/enums/type.enum";

interface State {
  unread: number;
  unreadByType: Record<ENotificationType, number> | null;

  setUnread: (val: number) => void;
  setUnreadByType: (val: Record<ENotificationType, number>) => void;
}

export const useUnreadNotiStore = create<State>()(
  persist(
    (set) => ({
      unread: 0,
      unreadByType: null,
      setUnread: (val) => {
        return set({ unread: val });
      },
      setUnreadByType: (val) => {
        return set({ unreadByType: val });
      },
    }),
    {
      name: "unread_noti",
      partialize: (state) => ({
        unread: state.unread,
        unreadByType: state.unreadByType,
      }),
    }
  )
);
