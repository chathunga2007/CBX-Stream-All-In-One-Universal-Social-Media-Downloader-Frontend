/**
 * Application environment configuration
 */

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8000/api/v1';

export const WS_BASE_URL: string =
  (import.meta.env.VITE_WS_BASE_URL as string) || 'ws://localhost:8000';

/**
 * Derives the base host origin from API_BASE_URL (e.g., http://localhost:8000)
 */
export const BACKEND_ORIGIN: string = (() => {
  try {
    const url = new URL(API_BASE_URL);
    return `${url.protocol}//${url.host}`;
  } catch {
    return 'http://localhost:8000';
  }
})();

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
