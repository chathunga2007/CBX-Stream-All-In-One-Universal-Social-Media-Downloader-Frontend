/**
 * Exact TypeScript interfaces matching the FastAPI Backend schemas
 * CBX-Stream Universal Social Media Downloader
 */

export interface PlatformTheme {
  id: string;
  name: string;
  icon: string;
  badge_text: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  gradient_css: string;
  glass_border: string;
  glass_shadow: string;
  glow_color: string;
  text_color?: string;
}

export interface MediaFormat {
  format_id: string;
  ext: string;
  resolution: string;
  quality_label: string;
  height?: number | null;
  fps?: number | null;
  filesize?: number | null;
  filesize_formatted: string;
  vcodec: string;
  acodec: string;
  is_video_only: boolean;
  is_audio_only: boolean;
  has_video_and_audio: boolean;
  tbr?: number | null;
  url?: string | null;
}

export interface CarouselMediaItem {
  index: number;
  url: string;
  thumbnail?: string | null;
  media_type: 'image' | 'video';
  width?: number | null;
  height?: number | null;
  caption?: string | null;
}

export interface MediaAnalyzeRequest {
  url: string;
  extract_flat?: boolean;
}

export interface MediaAnalyzeResponse {
  url: string;
  title: string;
  description?: string | null;
  uploader?: string | null;
  uploader_id?: string | null;
  uploader_url?: string | null;
  duration?: number | null;
  duration_formatted: string;
  thumbnail?: string | null;
  is_live: boolean;
  view_count?: number | null;
  like_count?: number | null;
  upload_date?: string | null;
  platform: PlatformTheme;
  formats: MediaFormat[];
  video_formats: MediaFormat[];
  audio_formats: MediaFormat[];
  is_carousel: boolean;
  carousel_items: CarouselMediaItem[];
}

export interface BatchAnalyzeRequest {
  urls: string[];
}

export interface BatchAnalyzeItemResult {
  url: string;
  success: boolean;
  data?: MediaAnalyzeResponse | null;
  error?: string | null;
}

export interface BatchAnalyzeResponse {
  total: number;
  successful: number;
  failed: number;
  items: BatchAnalyzeItemResult[];
}

export interface DownloadRequest {
  url: string;
  format_id?: string;
  custom_filename?: string;
  extract_audio?: boolean;
  audio_format?: 'mp3' | 'm4a' | 'flac' | 'wav' | 'opus';
  audio_quality?: '320' | '256' | '192' | '128';
  embed_metadata?: boolean;
  embed_thumbnail?: boolean;
  start_time?: string;
  end_time?: string;
}

export interface DownloadTaskResponse {
  task_id: string;
  status: 'queued' | 'downloading' | 'processing' | 'completed' | 'failed';
  message: string;
  stream_url?: string | null;
  ws_url: string;
}

export interface DownloadProgressEvent {
  task_id: string;
  status: 'queued' | 'downloading' | 'processing' | 'completed' | 'failed';
  progress_percent: number;
  downloaded_bytes: number;
  total_bytes: number;
  downloaded_formatted: string;
  total_formatted: string;
  speed?: string | null;
  eta?: string | null;
  filename?: string | null;
  stream_url?: string | null;
  error?: string | null;
}

export interface TrimRequest {
  task_id?: string;
  url?: string;
  start_time: string;
  end_time: string;
  format_id?: string;
  extract_audio?: boolean;
  audio_format?: 'mp3' | 'm4a' | 'wav' | 'flac';
  custom_filename?: string;
}

export interface TrimResponse {
  task_id: string;
  status: string;
  filename: string;
  stream_url: string;
  duration: number;
  duration_formatted: string;
}

export interface CarouselZipRequest {
  media_urls: string[];
  custom_filename?: string;
  post_url?: string;
}

export interface CarouselZipResponse {
  task_id: string;
  zip_url: string;
  file_count: number;
  total_size_bytes: number;
  total_size_formatted: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  uptime_seconds: number;
  active_tasks: number;
  disk_free_gb: number;
  disk_total_gb: number;
  ffmpeg_available: boolean;
  ffmpeg_path: string;
  python_version: string;
}

export interface ErrorResponse {
  success: boolean;
  error_code: string;
  detail: string;
  timestamp?: string;
}

/**
 * Frontend UI State representation for active and history download items
 */
export interface ActiveDownloadItem {
  taskId: string;
  url: string;
  title: string;
  thumbnail?: string | null;
  platform: PlatformTheme;
  formatLabel: string;
  status: 'queued' | 'downloading' | 'processing' | 'completed' | 'failed';
  progressPercent: number;
  downloadedFormatted: string;
  totalFormatted: string;
  speed?: string | null;
  eta?: string | null;
  filename?: string | null;
  streamUrl?: string | null;
  error?: string | null;
  createdAt: number;
  completedAt?: number;
}
