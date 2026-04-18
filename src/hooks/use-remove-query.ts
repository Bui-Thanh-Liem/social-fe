import { useLocation, useNavigate } from "react-router-dom";

export function useRemoveQuery() {
  const location = useLocation();
  const navigate = useNavigate();

  return (keys: string | string[]) => {
    const params = new URLSearchParams(location.search);

    const list = Array.isArray(keys) ? keys : [keys];
    list.forEach((key) => params.delete(key));

    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };
}
