import axios, { AxiosError } from 'axios';
import { API_BASE_URL, resolveStreamUrl, resolveProxyMediaUrl } from '../config/env';
import {
  MediaAnalyzeRequest,
  MediaAnalyzeResponse,
  BatchAnalyzeRequest,
  BatchAnalyzeResponse,
  DownloadRequest,
  DownloadTaskResponse,
  DownloadProgressEvent,
  TrimRequest,
  TrimResponse,
  CarouselZipRequest,
  CarouselZipResponse,
  HealthResponse,
  ErrorResponse,
} from '../types/media';

/**
 * Pre-configured Axios instance communicating with the FastAPI backend
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for metadata extraction
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Standardizes API error messages from FastAPI ErrorResponse or network drops
 */
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<ErrorResponse | { detail?: string }>;
    if (axiosErr.response?.data) {
      const data = axiosErr.response.data;
      if (typeof data === 'object' && 'detail' in data && data.detail) {
        const rawMsg = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
        
        // Clean up and humanize common YouTube anti-bot / player errors
        if (
          rawMsg.includes('Video unavailable') ||
          rawMsg.includes('This video is unavailable') ||
          rawMsg.toLowerCase().includes('video is unavailable')
        ) {
          return 'This video is unavailable, deleted, or removed on YouTube.';
        }
        if (rawMsg.includes('Private video') || rawMsg.includes('This video is private')) {
          return 'This video is marked private on YouTube and cannot be accessed anonymously.';
        }
        if (
          rawMsg.includes('The page needs to be reloaded') ||
          rawMsg.includes("confirm you're not a bot") ||
          rawMsg.includes('Sign in to confirm') ||
          rawMsg.includes('UNPLAYABLE')
        ) {
          return "YouTube Anti-Bot Challenge: YouTube blocked automated extraction for this video on the cloud server ('The page needs to be reloaded'). This occurs when YouTube flags cloud datacenter IPs. Please try a different YouTube link or test other platforms (TikTok, Instagram, Facebook, SoundCloud, etc.).";
        }
        if (rawMsg.includes('Join this channel') || rawMsg.includes('members-only')) {
          return 'This video is members-only and requires authenticated channel membership.';
        }

        return rawMsg;
      }
    }
    if (
      axiosErr.message === 'Network Error' ||
      axiosErr.code === 'ECONNABORTED' ||
      axiosErr.response?.status === 502 ||
      axiosErr.response?.status === 503
    ) {
      return 'The backend engine is currently waking up from idle sleep or temporarily unreachable. Please allow a few seconds for the cloud instance to start.';
    }
    if (axiosErr.code === 'ETIMEDOUT' || axiosErr.message?.toLowerCase().includes('timeout')) {
      return 'The request timed out while analyzing media streams. The upstream platform may be throttling requests.';
    }
    return axiosErr.message || 'An unexpected network error occurred.';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error occurred while processing request.';
}

export const apiService = {
  /**
   * Analyze a single media URL to extract title, thumbnails, platform theme, video & audio streams.
   */
  async analyzeUrl(url: string, extractFlat = false): Promise<MediaAnalyzeResponse> {
    const payload: MediaAnalyzeRequest = { url, extract_flat: extractFlat };
    const response = await apiClient.post<MediaAnalyzeResponse>('/analyze', payload);
    return response.data;
  },

  /**
   * Concurrently analyze multiple URLs or playlist entries.
   */
  async batchAnalyzeUrls(urls: string[]): Promise<BatchAnalyzeResponse> {
    const payload: BatchAnalyzeRequest = { urls };
    const response = await apiClient.post<BatchAnalyzeResponse>('/batch-analyze', payload);
    return response.data;
  },

  /**
   * Initiate an asynchronous media download or DASH merger job.
   */
  async startDownload(payload: DownloadRequest): Promise<DownloadTaskResponse> {
    const response = await apiClient.post<DownloadTaskResponse>('/download', payload);
    return response.data;
  },

  /**
   * Query current task status via REST fallback.
   */
  async getDownloadStatus(taskId: string): Promise<DownloadProgressEvent> {
    const response = await apiClient.get<DownloadProgressEvent>(`/download/status/${taskId}`);
    return response.data;
  },

  /**
   * Precision trim video or audio between start and end timestamps.
   */
  async trimMedia(payload: TrimRequest): Promise<TrimResponse> {
    const response = await apiClient.post<TrimResponse>('/trim', payload, {
      timeout: 180000, // 3 minutes timeout for FFmpeg clipping & downloading
    });
    return response.data;
  },

  /**
   * Bundle multiple carousel images and videos into a single ZIP archive.
   */
  async bundleCarouselZip(payload: CarouselZipRequest): Promise<CarouselZipResponse> {
    const response = await apiClient.post<CarouselZipResponse>('/carousel/zip', payload);
    return response.data;
  },

  /**
   * System health check and diagnostic metrics.
   * Default timeout is 15s to allow cloud containers (Fly.io / Render) to wake up.
   */
  async getHealth(timeoutMs = 15000): Promise<HealthResponse> {
    const response = await apiClient.get<HealthResponse>('/health', { timeout: timeoutMs });
    return response.data;
  },

  /**
   * Check status of YouTube cookies for bot bypass.
   */
  async getCookiesStatus(): Promise<{ configured: boolean; cookies_path: string | null; instructions: string }> {
    const response = await apiClient.get('/cookies', { timeout: 8000 });
    return response.data;
  },

  /**
   * Upload cookies.txt to backend to bypass YouTube bot detection.
   */
  async uploadCookies(file: File): Promise<{ success: boolean; message: string; file_size_bytes: number }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/cookies', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Generate direct stream or download URL for completed task.
   */
  getStreamUrl(taskId: string, inline = false): string {
    return resolveStreamUrl(`/api/v1/stream/${taskId}?inline=${inline}`);
  },

  /**
   * Reverse proxy media URL to bypass hotlinking or CORS restrictions.
   */
  getProxyUrl(remoteUrl?: string | null): string {
    return resolveProxyMediaUrl(remoteUrl);
  },

  /**
   * Trigger direct browser download for a completed stream URL.
   */
  triggerFileDownload(streamUrl: string, filename?: string): void {
    const fullUrl = resolveStreamUrl(streamUrl);
    const anchor = document.createElement('a');
    anchor.href = fullUrl;
    if (filename) {
      anchor.setAttribute('download', filename);
    }
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    setTimeout(() => {
      document.body.removeChild(anchor);
    }, 150);
  },
};
