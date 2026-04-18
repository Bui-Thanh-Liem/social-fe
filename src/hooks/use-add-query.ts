import { useLocation, useNavigate } from "react-router-dom";

export function useAddQuery() {
  const location = useLocation();
  const navigate = useNavigate();

  return (newQuery: Record<string, string | number | boolean>) => {
    const params = new URLSearchParams(location.search);

    // Gắn thêm query mới hoặc ghi đè
    Object.entries(newQuery).forEach(([key, value]) => {
      params.set(key, String(value));
    });

    // Giữ nguyên pathname hiện tại
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };
}
