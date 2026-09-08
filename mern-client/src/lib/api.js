const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const apiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
