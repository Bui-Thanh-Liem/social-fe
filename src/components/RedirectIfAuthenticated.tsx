import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useBackUrlStore } from "~/store/useBackUrlStore";
import { useUserStore } from "~/store/useUserStore";

export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const user = useUserStore((state) => state.user);
  const { backUrl } = useBackUrlStore();

  if (user) {
    if (backUrl) {
      return <Navigate to={backUrl} replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return children;
}
