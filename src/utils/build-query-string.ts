import type { IQuery } from "~/shared/interfaces/common/query.interface";

// Helper function để build query string
export const buildQueryString = <T>(queries: IQuery<T>): string => {
  const params = new URLSearchParams();

  Object.entries(queries).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (key === "sort" && typeof value === "object") {
        params.append(key, JSON.stringify(value));
      } else {
        params.append(key, String(value));
      }
    }
  });

  return params.toString();
};
