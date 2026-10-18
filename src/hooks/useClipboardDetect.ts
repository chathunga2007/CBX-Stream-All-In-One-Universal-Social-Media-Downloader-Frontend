import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to inspect system clipboard for valid social media URLs and provide one-click paste
 */
export function useClipboardDetect() {
  const [clipboardUrl, setClipboardUrl] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  const isValidUrl = (text: string): boolean => {
    try {
      const url = new URL(text.trim());
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const checkClipboard = useCallback(async () => {
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      setIsSupported(false);
      return;
    }

    try {
      const text = await navigator.clipboard.readText();
      if (text && isValidUrl(text)) {
        setClipboardUrl(text.trim());
      } else {
        setClipboardUrl(null);
      }
    } catch {
      // Browser permission prompt ignored or denied
      setClipboardUrl(null);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'clipboard' in navigator) {
      // Check on window focus
      window.addEventListener('focus', checkClipboard);
      return () => {
        window.removeEventListener('focus', checkClipboard);
      };
    } else {
      setIsSupported(false);
    }
  }, [checkClipboard]);

  const pasteClipboard = useCallback(async (): Promise<string | null> => {
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      return null;
    }
    try {
      const text = await navigator.clipboard.readText();
      const trimmed = text.trim();
      if (isValidUrl(trimmed)) {
        setClipboardUrl(trimmed);
        return trimmed;
      }
      return trimmed.length > 0 ? trimmed : null;
    } catch (err) {
      console.warn('[Clipboard] Read access denied or unsupported:', err);
      return null;
    }
  }, []);

  return {
    clipboardUrl,
    hasValidUrl: Boolean(clipboardUrl),
    isSupported,
    checkClipboard,
    pasteClipboard,
  };
}
