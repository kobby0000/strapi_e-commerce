export const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
export const ASSET_BASE_URL = (import.meta.env.VITE_ASSET_BASE_URL || "").replace(/\/$/, "");
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

if (!API_URL) {
  throw new Error("VITE_API_URL is required");
}

export const resolveAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("blob:")) return path;
  if (ASSET_BASE_URL) return `${ASSET_BASE_URL}${path}`;
  return `${API_URL.replace(/\/api$/, "")}${path}`;
};
