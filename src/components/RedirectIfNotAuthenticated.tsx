import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "~/store/useUserStore";

export function RedirectIfNotAuthenticated({
  children,
}: {
  children: ReactNode;
}) {
  const user = useUserStore((state) => state.user);

  if (!user) {
    // Xóa token
    return <Navigate to="/" replace />;
  }

  return children;
}
