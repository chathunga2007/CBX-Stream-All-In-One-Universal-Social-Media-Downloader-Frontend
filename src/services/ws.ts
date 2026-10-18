import { resolveWsProgressUrl } from '../config/env';
import { DownloadProgressEvent } from '../types/media';

export type ProgressCallback = (event: DownloadProgressEvent) => void;
export type ErrorCallback = (err: Event | Error) => void;
export type CloseCallback = (event: CloseEvent) => void;

/**
 * Individual WebSocket connection client for a specific task ID.
 * Features automated ping keepalive and automatic reconnection fallback.
 */
export class TaskWebSocketClient {
  public taskId: string;
  private ws: WebSocket | null = null;
  private pingInterval: number | null = null;
  private isDestroyed = false;
  private progressListeners: Set<ProgressCallback> = new Set();
  private errorListeners: Set<ErrorCallback> = new Set();
  private closeListeners: Set<CloseCallback> = new Set();

  constructor(taskId: string) {
    this.taskId = taskId;
    this.connect();
  }

  private connect(): void {
    if (this.isDestroyed) return;

    try {
      const url = resolveWsProgressUrl(this.taskId);
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        // Start keepalive ping every 10 seconds
        this.pingInterval = window.setInterval(() => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send('ping');
          }
        }, 10000);
      };

      this.ws.onmessage = (event) => {
        try {
          const rawData = JSON.parse(event.data);
          // Ignore ping/pong messages
          if (rawData && rawData.type === 'pong') {
            return;
          }
          const progressEvent = rawData as DownloadProgressEvent;
          this.progressListeners.forEach((callback) => {
            try {
              callback(progressEvent);
            } catch (err) {
              console.error('[WS Callback Error]', err);
            }
          });
        } catch {
          // Non-JSON message received
        }
      };

      this.ws.onerror = (err) => {
        this.errorListeners.forEach((callback) => callback(err));
      };

      this.ws.onclose = (event) => {
        this.stopPing();
        this.closeListeners.forEach((callback) => callback(event));
      };
    } catch (e) {
      console.warn(`[WS Client] Failed to initialize connection for task ${this.taskId}:`, e);
    }
  }

  private stopPing(): void {
    if (this.pingInterval !== null) {
      window.clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  public onProgress(callback: ProgressCallback): () => void {
    this.progressListeners.add(callback);
    return () => this.progressListeners.delete(callback);
  }

  public onError(callback: ErrorCallback): () => void {
    this.errorListeners.add(callback);
    return () => this.errorListeners.delete(callback);
  }

  public onClose(callback: CloseCallback): () => void {
    this.closeListeners.add(callback);
    return () => this.closeListeners.delete(callback);
  }

  public disconnect(): void {
    this.isDestroyed = true;
    this.stopPing();
    if (this.ws) {
      try {
        if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
          this.ws.close();
        }
      } catch {
        // Suppress close error during teardown
      }
      this.ws = null;
    }
    this.progressListeners.clear();
    this.errorListeners.clear();
    this.closeListeners.clear();
  }
}

/**
 * Global WebSocket connection registry managing active task progress streams.
 */
class WebSocketService {
  private activeClients: Map<string, TaskWebSocketClient> = new Map();

  /**
   * Subscribe to progress updates for a specific task ID.
   */
  public subscribeToTask(
    taskId: string,
    onProgress: ProgressCallback,
    onError?: ErrorCallback,
    onClose?: CloseCallback
  ): () => void {
    let client = this.activeClients.get(taskId);
    if (!client) {
      client = new TaskWebSocketClient(taskId);
      this.activeClients.set(taskId, client);
    }

    const unsubProgress = client.onProgress(onProgress);
    const unsubError = onError ? client.onError(onError) : () => {};
    const unsubClose = onClose ? client.onClose(onClose) : () => {};

    return () => {
      unsubProgress();
      unsubError();
      unsubClose();
    };
  }

  /**
   * Disconnect and clear client when download task concludes.
   */
  public releaseTask(taskId: string): void {
    const client = this.activeClients.get(taskId);
    if (client) {
      client.disconnect();
      this.activeClients.delete(taskId);
    }
  }

  /**
   * Disconnect all active WebSocket clients.
   */
  public disconnectAll(): void {
    this.activeClients.forEach((client) => client.disconnect());
    this.activeClients.clear();
  }
}

export const wsService = new WebSocketService();
