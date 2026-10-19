/**
 * Application environment configuration
 */

function normalizeApiBaseUrl(raw?: string): string {
  const value = raw?.trim() || 'http://localhost:8000/api/v1';
  const clean = value.replace(/\/+$/, '');
  if (!clean.endsWith('/api/v1')) {
    return `${clean}/api/v1`;
  }
  return clean;
}

export const API_BASE_URL: string = normalizeApiBaseUrl(
  import.meta.env.VITE_API_BASE_URL as string | undefined
);

/**
 * Derives the base host origin from API_BASE_URL (e.g., https://cbx-stream-backend.fly.dev)
 */
export const BACKEND_ORIGIN: string = (() => {
  try {
    const url = new URL(API_BASE_URL);
    return `${url.protocol}//${url.host}`;
  } catch {
    return 'http://localhost:8000';
  }
})();

function normalizeWsBaseUrl(raw?: string): string {
  const configured = raw?.trim();
  // If user explicitly configured an external WS URL, honor it
  if (configured && !configured.includes('localhost:8000')) {
    return configured.replace(/\/+$/, '');
  }

  // If API_BASE_URL points to a remote server (e.g. Fly.io / HTTPS / Cloud), auto-derive secure WebSocket
  try {
    const url = new URL(API_BASE_URL);
    if (url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') {
      const wsProtocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${wsProtocol}//${url.host}`;
    }
  } catch {
    // ignore URL parse errors
  }

  return configured || 'ws://localhost:8000';
}

export const WS_BASE_URL: string = normalizeWsBaseUrl(
  import.meta.env.VITE_WS_BASE_URL as string | undefined
);

/**
 * Resolves a full backend media stream URL.
 * Handles both relative paths (/api/v1/stream/...) and absolute URLs.
 */
export function resolveStreamUrl(streamUrl?: string | null): string {
  if (!streamUrl) return '';
  if (streamUrl.startsWith('http://') || streamUrl.startsWith('https://')) {
    return streamUrl;
  }
  const cleanPath = streamUrl.startsWith('/') ? streamUrl : `/${streamUrl}`;
  return `${BACKEND_ORIGIN}${cleanPath}`;
}

/**
 * Resolves reverse proxy URL for images or videos to bypass CORS/hotlinking
 */
export function resolveProxyMediaUrl(remoteUrl?: string | null): string {
  if (!remoteUrl) return '';
  return `${API_BASE_URL}/proxy-media?url=${encodeURIComponent(remoteUrl)}`;
}

/**
 * Resolves full WebSocket URL for a given task ID
 */
export function resolveWsProgressUrl(taskId: string): string {
  const cleanBase = WS_BASE_URL.replace(/\/+$/, '');
  return `${cleanBase}/ws/progress/${taskId}`;
}
