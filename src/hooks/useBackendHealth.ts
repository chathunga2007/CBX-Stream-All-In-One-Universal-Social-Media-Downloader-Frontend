import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../services/api';
import { HealthResponse } from '../types/media';

export type BackendHealthState = 'checking' | 'waking' | 'healthy' | 'offline';

export interface UseBackendHealthReturn {
  health: HealthResponse | null;
  status: BackendHealthState;
  retryCount: number;
  maxRetries: number;
  isWaking: boolean;
  isHealthy: boolean;
  isOffline: boolean;
  wakeUp: () => Promise<boolean>;
  checkHealth: () => Promise<boolean>;
}

const MAX_WAKEUP_RETRIES = 15; // 15 attempts * 2.5s = ~37.5s for cold start
const WAKEUP_INTERVAL_MS = 2500;
const HEALTHY_POLL_INTERVAL_MS = 30000;
const OFFLINE_POLL_INTERVAL_MS = 20000;

export function useBackendHealth(): UseBackendHealthReturn {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [status, setStatus] = useState<BackendHealthState>('checking');
  const [retryCount, setRetryCount] = useState<number>(0);

  const retryCountRef = useRef(0);
  retryCountRef.current = retryCount;

  const statusRef = useRef<BackendHealthState>('checking');
  statusRef.current = status;

  const isMountedRef = useRef(true);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearScheduledCheck = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  }, []);

  const checkHealth = useCallback(async (): Promise<boolean> => {
    clearScheduledCheck();

    try {
      // 12s timeout to accommodate cold starts without premature abort
      const data = await apiService.getHealth(12000);

      if (!isMountedRef.current) return true;

      setHealth(data);
      setStatus('healthy');
      setRetryCount(0);
      retryCountRef.current = 0;

      // Schedule next periodic poll in 30s
      timeoutIdRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          checkHealth();
        }
      }, HEALTHY_POLL_INTERVAL_MS);

      return true;
    } catch {
      if (!isMountedRef.current) return false;

      const currentRetries = retryCountRef.current + 1;

      if (currentRetries <= MAX_WAKEUP_RETRIES) {
        // Still within wake-up threshold (cold start in progress)
        setRetryCount(currentRetries);
        setStatus('waking');

        timeoutIdRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            checkHealth();
          }
        }, WAKEUP_INTERVAL_MS);
      } else {
        // Exceeded retries, mark as offline and slow down polling
        setStatus('offline');
        timeoutIdRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            checkHealth();
          }
        }, OFFLINE_POLL_INTERVAL_MS);
      }

      return false;
    }
  }, [clearScheduledCheck]);

  const wakeUp = useCallback(async (): Promise<boolean> => {
    clearScheduledCheck();
    setRetryCount(0);
    retryCountRef.current = 0;
    setStatus('waking');
    return checkHealth();
  }, [checkHealth, clearScheduledCheck]);

  // Initial check on mount
  useEffect(() => {
    isMountedRef.current = true;
    checkHealth();

    // Recheck immediately when user returns to this tab/window
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && statusRef.current !== 'healthy') {
        wakeUp();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      isMountedRef.current = false;
      clearScheduledCheck();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [checkHealth, wakeUp, clearScheduledCheck]);

  return {
    health,
    status,
    retryCount,
    maxRetries: MAX_WAKEUP_RETRIES,
    isWaking: status === 'waking',
    isHealthy: status === 'healthy',
    isOffline: status === 'offline',
    wakeUp,
    checkHealth,
  };
}
