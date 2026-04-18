import { useLocation, useNavigate } from "react-router-dom";

export function useUpdateQuery() {
  const location = useLocation();
  const navigate = useNavigate();

  return ({
    add = {},
    remove = [],
  }: {
    add?: Record<string, string | number | boolean>;
    remove?: string[];
  }) => {
    const params = new URLSearchParams(location.search);

    // Xóa trước
    remove.forEach((key) => params.delete(key));

    // Thêm hoặc ghi đè
    Object.entries(add).forEach(([key, value]) =>
      params.set(key, String(value))
    );

    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };
}
