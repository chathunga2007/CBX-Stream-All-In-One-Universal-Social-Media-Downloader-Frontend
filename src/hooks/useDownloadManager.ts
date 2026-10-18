import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { apiService, extractErrorMessage } from '../services/api';
import { wsService } from '../services/ws';
import {
  ActiveDownloadItem,
  DownloadRequest,
  TrimRequest,
  CarouselZipRequest,
  PlatformTheme,
  DownloadProgressEvent,
} from '../types/media';

const STORAGE_KEY = 'cbx_stream_download_history_v1';

export function useDownloadManager() {
  const [activeDownloads, setActiveDownloads] = useState<ActiveDownloadItem[]>([]);
  const [historyDownloads, setHistoryDownloads] = useState<ActiveDownloadItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Keep ref for WebSocket subscriptions
  const unsubscribeMap = useRef<Map<string, () => void>>(new Map());

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(historyDownloads.slice(0, 50)));
    } catch (e) {
      console.warn('[History Storage Error]', e);
    }
  }, [historyDownloads]);

  // Clean up all subscriptions on unmount
  useEffect(() => {
    const subs = unsubscribeMap.current;
    return () => {
      subs.forEach((unsub) => unsub());
      subs.clear();
      wsService.disconnectAll();
    };
  }, []);

  const triggerCompletionConfetti = () => {
    try {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#00F2FE', '#6366F1', '#EC4899', '#10B981'],
        disableForReducedMotion: true,
      });
    } catch {
      // Confetti fallback
    }
  };

  /**
   * Internal handler for incoming WebSocket progress events
   */
  const handleProgressUpdate = useCallback(
    (taskId: string, event: DownloadProgressEvent) => {
      setActiveDownloads((prev) =>
        prev.map((item) => {
          if (item.taskId !== taskId) return item;

          const isNowCompleted = event.status === 'completed' || event.progress_percent >= 100;
          const isNowFailed = event.status === 'failed';

          const updated: ActiveDownloadItem = {
            ...item,
            status: event.status,
            progressPercent: event.progress_percent,
            downloadedFormatted: event.downloaded_formatted || item.downloadedFormatted,
            totalFormatted: event.total_formatted || item.totalFormatted,
            speed: event.speed,
            eta: event.eta,
            filename: event.filename || item.filename,
            streamUrl: event.stream_url || item.streamUrl,
            error: event.error || item.error,
          };

          if (isNowCompleted && item.status !== 'completed') {
            updated.completedAt = Date.now();
            triggerCompletionConfetti();
            // Automatically trigger file download if streamUrl is available
            if (updated.streamUrl) {
              apiService.triggerFileDownload(updated.streamUrl, updated.filename || undefined);
            }
            // Move to history
            setHistoryDownloads((hist) => [updated, ...hist.filter((h) => h.taskId !== taskId)]);
            // Unsubscribe WebSocket
            const unsub = unsubscribeMap.current.get(taskId);
            if (unsub) {
              unsub();
              unsubscribeMap.current.delete(taskId);
              wsService.releaseTask(taskId);
            }
          }

          if (isNowFailed) {
            // Unsubscribe on failure
            const unsub = unsubscribeMap.current.get(taskId);
            if (unsub) {
              unsub();
              unsubscribeMap.current.delete(taskId);
              wsService.releaseTask(taskId);
            }
          }

          return updated;
        })
      );
    },
    []
  );

  /**
   * Subscribes a newly created task to real-time progress
   */
  const subscribeTask = useCallback(
    (taskId: string) => {
      // Connect WebSocket
      const unsub = wsService.subscribeToTask(
        taskId,
        (event) => handleProgressUpdate(taskId, event),
        () => {
          // Fallback poll on error
          apiService
            .getDownloadStatus(taskId)
            .then((res) => handleProgressUpdate(taskId, res))
            .catch(() => {});
        }
      );

      unsubscribeMap.current.set(taskId, unsub);

      // Initial status check after 500ms
      setTimeout(() => {
        apiService
          .getDownloadStatus(taskId)
          .then((res) => handleProgressUpdate(taskId, res))
          .catch(() => {});
      }, 500);
    },
    [handleProgressUpdate]
  );

  /**
   * Start a standard media download task
   */
  const startDownloadTask = async (
    req: DownloadRequest,
    meta: { title: string; thumbnail?: string | null; platform: PlatformTheme; formatLabel: string }
  ): Promise<string> => {
    try {
      const res = await apiService.startDownload(req);
      const taskId = res.task_id;

      const newItem: ActiveDownloadItem = {
        taskId,
        url: req.url,
        title: meta.title,
        thumbnail: meta.thumbnail,
        platform: meta.platform,
        formatLabel: meta.formatLabel,
        status: 'queued',
        progressPercent: 0,
        downloadedFormatted: '0 B',
        totalFormatted: 'Calculating...',
        createdAt: Date.now(),
      };

      setActiveDownloads((prev) => [newItem, ...prev.filter((i) => i.taskId !== taskId)]);
      setIsDrawerOpen(true);
      subscribeTask(taskId);
      return taskId;
    } catch (err) {
      const msg = extractErrorMessage(err);
      throw new Error(msg);
    }
  };

  /**
   * Start precision timestamp clipping task
   */
  const trimMediaTask = async (
    req: TrimRequest,
    meta: { title: string; thumbnail?: string | null; platform: PlatformTheme; formatLabel: string }
  ): Promise<string> => {
    try {
      const res = await apiService.trimMedia(req);
      const taskId = res.task_id;

      const newItem: ActiveDownloadItem = {
        taskId,
        url: req.url || 'Trim Clip',
        title: meta.title,
        thumbnail: meta.thumbnail,
        platform: meta.platform,
        formatLabel: `Trim (${req.start_time} - ${req.end_time})`,
        status: 'completed',
        progressPercent: 100,
        downloadedFormatted: res.duration_formatted,
        totalFormatted: res.duration_formatted,
        filename: res.filename,
        streamUrl: res.stream_url,
        createdAt: Date.now(),
        completedAt: Date.now(),
      };

      triggerCompletionConfetti();
      apiService.triggerFileDownload(res.stream_url, res.filename);
      setActiveDownloads((prev) => [newItem, ...prev]);
      setHistoryDownloads((prev) => [newItem, ...prev]);
      setIsDrawerOpen(true);
      return taskId;
    } catch (err) {
      const msg = extractErrorMessage(err);
      throw new Error(msg);
    }
  };

  /**
   * Start multi-photo/video carousel ZIP package download
   */
  const bundleCarouselTask = async (
    req: CarouselZipRequest,
    meta: { title: string; thumbnail?: string | null; platform: PlatformTheme; fileCount: number }
  ): Promise<string> => {
    try {
      const res = await apiService.bundleCarouselZip(req);
      const taskId = res.task_id;

      const newItem: ActiveDownloadItem = {
        taskId,
        url: req.post_url || 'Carousel ZIP',
        title: `${meta.title} (${res.file_count} Slides ZIP)`,
        thumbnail: meta.thumbnail,
        platform: meta.platform,
        formatLabel: `ZIP Archive (${res.total_size_formatted})`,
        status: 'completed',
        progressPercent: 100,
        downloadedFormatted: res.total_size_formatted,
        totalFormatted: res.total_size_formatted,
        filename: `${req.custom_filename || 'carousel_package'}.zip`,
        streamUrl: res.zip_url,
        createdAt: Date.now(),
        completedAt: Date.now(),
      };

      triggerCompletionConfetti();
      apiService.triggerFileDownload(res.zip_url, newItem.filename || undefined);
      setActiveDownloads((prev) => [newItem, ...prev]);
      setHistoryDownloads((prev) => [newItem, ...prev]);
      setIsDrawerOpen(true);
      return taskId;
    } catch (err) {
      const msg = extractErrorMessage(err);
      throw new Error(msg);
    }
  };

  /**
   * Remove active or history task
   */
  const removeTask = (taskId: string) => {
    const unsub = unsubscribeMap.current.get(taskId);
    if (unsub) {
      unsub();
      unsubscribeMap.current.delete(taskId);
      wsService.releaseTask(taskId);
    }
    setActiveDownloads((prev) => prev.filter((i) => i.taskId !== taskId));
    setHistoryDownloads((prev) => prev.filter((i) => i.taskId !== taskId));
  };

  /**
   * Clear all completed history
   */
  const clearHistory = () => {
    setHistoryDownloads([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // LocalStorage access
    }
  };

  return {
    activeDownloads,
    historyDownloads,
    isDrawerOpen,
    setIsDrawerOpen,
    startDownloadTask,
    trimMediaTask,
    bundleCarouselTask,
    removeTask,
    clearHistory,
  };
}
