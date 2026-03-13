export const internalApiBaseUrl =
  process.env.AGORA_INTERNAL_API_BASE_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:3001";

export const browserApiBasePath = "/api/agora";
