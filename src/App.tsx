import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AmbientBackground } from './components/layout/AmbientBackground';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/hero/HeroSection';
import { SpotlightCommandBar } from './components/hero/SpotlightCommandBar';
import { MediaBentoDashboard } from './components/media/MediaBentoDashboard';
import { BatchPlaylistView } from './components/batch/BatchPlaylistView';
import { DownloadQueueDrawer } from './components/progress/DownloadQueueDrawer';
import { CreatorSpotlightModal } from './components/creator/CreatorSpotlightModal';
import { useChameleonTheme } from './hooks/useChameleonTheme';
import { useDownloadManager } from './hooks/useDownloadManager';
import { useClipboardDetect } from './hooks/useClipboardDetect';
import { detectClientPlatform, isValidMediaUrl, PLATFORM_THEMES } from './config/platforms';
import { apiService, extractErrorMessage } from './services/api';
import { MediaAnalyzeResponse } from './types/media';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useBackendHealth } from './hooks/useBackendHealth';

export const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedMedia, setAnalyzedMedia] = useState<MediaAnalyzeResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const lastAttemptedUrlRef = useRef<string>('');

  // Cloud backend live health & auto-reconnect engine
  const backendHealth = useBackendHealth();
  const prevBackendStatusRef = useRef(backendHealth.status);

  // Synchronous client-side platform detection (or analyzed media platform / selected platform when input is empty)
  const detectedPlatform = useMemo(() => {
    if (url.trim()) {
      const clientDetected = detectClientPlatform(url);
      if (clientDetected.id !== 'generic') {
        return clientDetected;
      }
    }
    if (analyzedMedia?.platform && analyzedMedia.platform.id !== 'generic') {
      return analyzedMedia.platform;
    }
    if (selectedPlatformId && PLATFORM_THEMES[selectedPlatformId]) {
      return PLATFORM_THEMES[selectedPlatformId];
    }
    return analyzedMedia?.platform || PLATFORM_THEMES.generic;
  }, [url, selectedPlatformId, analyzedMedia]);

  // Dynamic chameleon color injection
  const { updateTheme } = useChameleonTheme(detectedPlatform);

  // Download lifecycle and WebSocket progress manager
  const {
    activeDownloads,
    historyDownloads,
    isDrawerOpen,
    setIsDrawerOpen,
    startDownloadTask,
    trimMediaTask,
    bundleCarouselTask,
    removeTask,
    clearHistory,
  } = useDownloadManager();

  // Clipboard detector
  const { pasteClipboard } = useClipboardDetect();

  // Sync theme whenever client detected platform changes
  useEffect(() => {
    updateTheme(detectedPlatform);
  }, [detectedPlatform, updateTheme]);

  // When backend returns media with enriched platform theme, sync that theme
  useEffect(() => {
    if (analyzedMedia?.platform) {
      updateTheme(analyzedMedia.platform);
    }
  }, [analyzedMedia, updateTheme]);

  /**
   * Handle user editing the URL input - clear stale errors when a new URL is typed
   */
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    if (newUrl.trim() !== lastAttemptedUrlRef.current && analysisError) {
      setAnalysisError(null);
    }
  };

  /**
   * Main analyze submission handler (supports URL override and force retry)
   */
  const handleAnalyze = useCallback(
    async (overrideUrl?: string, forceRetry = false) => {
      const targetUrl = (overrideUrl || url).trim();
      if (!targetUrl || targetUrl.length < 5 || isAnalyzing) return;

      // Avoid re-analyzing if this exact URL is already loaded
      if (!forceRetry && analyzedMedia && analyzedMedia.url === targetUrl) {
        return;
      }

      // Avoid automatic re-analyzing if this exact URL was already attempted and failed
      if (!forceRetry && lastAttemptedUrlRef.current === targetUrl) {
        return;
      }

      // If backend engine is not ready (sleeping / checking), trigger wake-up and wait
      if (!backendHealth.isHealthy) {
        backendHealth.wakeUp();
        return;
      }

      lastAttemptedUrlRef.current = targetUrl;
      setIsAnalyzing(true);
      setAnalysisError(null);

      try {
        const result = await apiService.analyzeUrl(targetUrl);
        setAnalyzedMedia(result);
      } catch (err) {
        setAnalysisError(extractErrorMessage(err));
        setAnalyzedMedia(null);
        // If cold start/network drop, trigger fast wake-up polling loop
        if (backendHealth.status !== 'healthy') {
          backendHealth.wakeUp();
        }
      } finally {
        setIsAnalyzing(false);
      }
    },
    [url, isAnalyzing, analyzedMedia, backendHealth]
  );

  /**
   * Smart paste from clipboard and auto-analyze (or queue if engine is waking up)
   */
  const handleSmartPaste = async () => {
    const text = await pasteClipboard();
    if (text && text.trim()) {
      const clean = text.trim();
      setUrl(clean);
      setAnalysisError(null);
      if (backendHealth.isHealthy && isValidMediaUrl(clean)) {
        handleAnalyze(clean, true);
      }
    }
  };

  /**
   * Auto-analyze when user enters or pastes a valid media URL (with 600ms debounce),
   * strictly guarded until backend engine is verified online and healthy,
   * and never re-triggering for an already attempted URL.
   */
  useEffect(() => {
    const trimmed = url.trim();
    if (!trimmed || isAnalyzing || isBatchMode || !backendHealth.isHealthy) return;

    if (isValidMediaUrl(trimmed)) {
      if (lastAttemptedUrlRef.current === trimmed || (analyzedMedia && analyzedMedia.url === trimmed)) {
        return;
      }

      const timer = setTimeout(() => {
        handleAnalyze(trimmed);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [url, isAnalyzing, isBatchMode, analyzedMedia, backendHealth.isHealthy, handleAnalyze]);

  // Auto-resume analysis or focus input strictly when backend engine transitions from waking/checking to healthy
  useEffect(() => {
    const prevStatus = prevBackendStatusRef.current;
    prevBackendStatusRef.current = backendHealth.status;

    if (prevStatus !== 'healthy' && backendHealth.status === 'healthy') {
      const trimmed = url.trim();
      if (
        trimmed &&
        isValidMediaUrl(trimmed) &&
        lastAttemptedUrlRef.current !== trimmed &&
        (!analyzedMedia || analyzedMedia.url !== trimmed)
      ) {
        handleAnalyze(trimmed);
      } else if (!analyzedMedia) {
        inputRef.current?.focus();
      }
    }
  }, [backendHealth.status, url, analyzedMedia, handleAnalyze]);

  /**
   * Complete reset: clears input URL, removes analyzed video results & errors, resets platform selection
   */
  const handleClear = useCallback(() => {
    setUrl('');
    lastAttemptedUrlRef.current = '';
    setAnalyzedMedia(null);
    setAnalysisError(null);
    setSelectedPlatformId(null);
    updateTheme(PLATFORM_THEMES.generic);
    inputRef.current?.focus();
  }, [updateTheme]);

  /**
   * Quick select target platform from hero badges
   */
  const handleSelectPlatform = (platformId: string) => {
    // If clicking the currently selected platform and input is empty, toggle back to generic
    if (selectedPlatformId === platformId && !url.trim()) {
      setSelectedPlatformId(null);
      updateTheme(PLATFORM_THEMES.generic);
      return;
    }

    setSelectedPlatformId(platformId);

    // If an existing URL belongs to a different platform, clear it
    if (url.trim()) {
      const currentUrlPlatform = detectClientPlatform(url);
      if (currentUrlPlatform.id !== platformId) {
        setUrl('');
        lastAttemptedUrlRef.current = '';
        setAnalyzedMedia(null);
        setAnalysisError(null);
      }
    }

    const theme = PLATFORM_THEMES[platformId];
    if (theme) {
      updateTheme(theme);
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  /**
   * Video stream download initiator
   */
  const handleDownloadVideo = async (
    formatId: string,
    label: string,
    customFilename?: string
  ) => {
    if (!analyzedMedia) return;

    try {
      await startDownloadTask(
        {
          url: analyzedMedia.url,
          format_id: formatId,
          custom_filename: customFilename || undefined,
          extract_audio: false,
        },
        {
          title: analyzedMedia.title,
          thumbnail: analyzedMedia.thumbnail,
          platform: analyzedMedia.platform,
          formatLabel: label,
        }
      );
    } catch (err) {
      alert(`Download initiation failed: ${extractErrorMessage(err)}`);
    }
  };

  /**
   * Audio stream extraction initiator
   */
  const handleDownloadAudio = async (
    format: 'mp3' | 'm4a' | 'flac' | 'wav' | 'opus',
    quality: '320' | '256' | '192' | '128',
    embedMeta: boolean,
    embedCover: boolean,
    customFilename?: string
  ) => {
    if (!analyzedMedia) return;

    try {
      await startDownloadTask(
        {
          url: analyzedMedia.url,
          extract_audio: true,
          audio_format: format,
          audio_quality: quality,
          embed_metadata: embedMeta,
          embed_thumbnail: embedCover,
          custom_filename: customFilename || undefined,
        },
        {
          title: analyzedMedia.title,
          thumbnail: analyzedMedia.thumbnail,
          platform: analyzedMedia.platform,
          formatLabel: `${format.toUpperCase()} (${quality}kbps)`,
        }
      );
    } catch (err) {
      alert(`Audio extraction failed: ${extractErrorMessage(err)}`);
    }
  };

  /**
   * Precision clipper initiator with format, quality and audio options
   */
  const handleTrimMedia = async (
    startTime: string,
    endTime: string,
    extractAudio: boolean,
    audioFormat: 'mp3' | 'm4a' | 'wav' | 'flac',
    formatId?: string,
    audioQuality?: '320' | '256' | '192' | '128',
    customFilename?: string
  ) => {
    if (!analyzedMedia) return;

    try {
      await trimMediaTask(
        {
          url: analyzedMedia.url,
          start_time: startTime,
          end_time: endTime,
          format_id: formatId || 'bestvideo+bestaudio/best',
          extract_audio: extractAudio,
          audio_format: audioFormat,
          audio_quality: audioQuality,
          custom_filename: customFilename || undefined,
        },
        {
          title: analyzedMedia.title,
          thumbnail: analyzedMedia.thumbnail,
          platform: analyzedMedia.platform,
          formatLabel: extractAudio
            ? `Audio (${audioFormat.toUpperCase()} ${audioQuality || '320'}k) [${startTime}-${endTime}]`
            : `Video Clip [${startTime}-${endTime}]`,
        }
      );
    } catch (err) {
      alert(`Precision trim failed: ${extractErrorMessage(err)}`);
    }
  };

  /**
   * Carousel ZIP packager initiator
   */
  const handleDownloadCarouselZip = async (
    selectedUrls: string[],
    customFilename?: string
  ) => {
    if (!analyzedMedia) return;

    try {
      await bundleCarouselTask(
        {
          media_urls: selectedUrls,
          custom_filename: customFilename || undefined,
          post_url: analyzedMedia.url,
        },
        {
          title: analyzedMedia.title,
          thumbnail: analyzedMedia.thumbnail,
          platform: analyzedMedia.platform,
          fileCount: selectedUrls.length,
        }
      );
    } catch (err) {
      alert(`ZIP bundling failed: ${extractErrorMessage(err)}`);
    }
  };

  /**
   * Batch download queue initiator
   */
  const handleQueueBatchDownloads = (
    items: { url: string; title: string; thumbnail?: string | null; platform: any }[]
  ) => {
    items.forEach((item) => {
      startDownloadTask(
        {
          url: item.url,
          format_id: 'bestvideo+bestaudio/best',
        },
        {
          title: item.title,
          thumbnail: item.thumbnail,
          platform: item.platform,
          formatLabel: 'Best Video (Auto)',
        }
      ).catch(() => {});
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Dynamic Ambient Background */}
      <AmbientBackground />

      {/* Top Sticky Glass Navigation */}
      <Navbar
        activeCount={activeDownloads.filter((t) => t.status !== 'completed' && t.status !== 'failed').length}
        currentThemeId={detectedPlatform.id}
        onSelectTheme={(themeId) => {
          setSelectedPlatformId(themeId);
          const theme = PLATFORM_THEMES[themeId];
          if (theme) updateTheme(theme);
        }}
        onOpenQueue={() => setIsDrawerOpen(true)}
        onOpenCreator={() => setIsCreatorModalOpen(true)}
        backendHealth={backendHealth}
      />

      {/* Main App Content Flow */}
      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <HeroSection
          selectedPlatformId={
            detectedPlatform.id !== 'generic'
              ? detectedPlatform.id
              : selectedPlatformId
          }
          onSelectPlatform={handleSelectPlatform}
        />

        {/* Command Search Bar or Batch Mode View */}
        {isBatchMode ? (
          <BatchPlaylistView
            onQueueBatchDownloads={handleQueueBatchDownloads}
            onClose={() => setIsBatchMode(false)}
            backendHealth={backendHealth}
          />
        ) : (
          <SpotlightCommandBar
            url={url}
            setUrl={handleUrlChange}
            inputRef={inputRef}
            detectedPlatform={detectedPlatform}
            isAnalyzing={isAnalyzing}
            onAnalyze={handleAnalyze}
            isBatchMode={isBatchMode}
            onToggleBatchMode={() => setIsBatchMode(true)}
            onSmartPaste={handleSmartPaste}
            hasAnalyzedMedia={Boolean(analyzedMedia)}
            onClear={handleClear}
            backendHealth={backendHealth}
          />
        )}

        {/* Analysis Error Banner */}
        {analysisError && !isBatchMode && (
          <div className="w-full max-w-4xl mx-auto px-4 mt-6">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs sm:text-sm flex items-start gap-3 backdrop-blur-xl shadow-lg">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h5 className="font-heading font-bold text-white mb-0.5">Media Extraction Unsuccessful</h5>
                <p className="text-white/70 leading-relaxed">{analysisError}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleAnalyze(undefined, true)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold text-xs transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                  <span className="text-[11px] text-white/40">
                    If this is an age-restricted YouTube link, ensure cookies are loaded in the backend.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bento Dashboard Result Display */}
        {analyzedMedia && !isBatchMode && (
          <MediaBentoDashboard
            media={analyzedMedia}
            onClearMedia={handleClear}
            onDownloadVideo={handleDownloadVideo}
            onDownloadAudio={handleDownloadAudio}
            onTrimMedia={handleTrimMedia}
            onDownloadCarouselZip={handleDownloadCarouselZip}
          />
        )}
      </main>

      {/* Slide-over Queue Drawer */}
      <DownloadQueueDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeDownloads={activeDownloads}
        historyDownloads={historyDownloads}
        onRemoveTask={removeTask}
        onClearHistory={clearHistory}
      />

      {/* Creator Spotlight Modal */}
      <CreatorSpotlightModal
        isOpen={isCreatorModalOpen}
        onClose={() => setIsCreatorModalOpen(false)}
      />

      {/* Premium Glass Footer */}
      <Footer onOpenCreator={() => setIsCreatorModalOpen(true)} />
    </div>
  );
};

export default App;
