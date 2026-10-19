import React from 'react';
import { Search, Clipboard, X, Layers, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { PlatformTheme } from '../../types/media';
import { isValidMediaUrl } from '../../config/platforms';
import { UseBackendHealthReturn } from '../../hooks/useBackendHealth';

interface SpotlightCommandBarProps {
  url: string;
  setUrl: (url: string) => void;
  detectedPlatform: PlatformTheme;
  isAnalyzing: boolean;
  onAnalyze: (overrideUrl?: string, forceRetry?: boolean) => void;
  isBatchMode: boolean;
  onToggleBatchMode: () => void;
  onSmartPaste: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  hasAnalyzedMedia?: boolean;
  onClear: () => void;
  backendHealth?: UseBackendHealthReturn;
}

export const SpotlightCommandBar: React.FC<SpotlightCommandBarProps> = ({
  url,
  setUrl,
  detectedPlatform,
  isAnalyzing,
  onAnalyze,
  isBatchMode,
  onToggleBatchMode,
  onSmartPaste,
  inputRef,
  hasAnalyzedMedia = false,
  onClear,
  backendHealth,
}) => {
  const isEngineReady = backendHealth ? backendHealth.isHealthy : true;
  const isEngineWaking = backendHealth ? backendHealth.isWaking : false;
  const isEngineChecking = backendHealth ? backendHealth.status === 'checking' : false;
  const isEngineOffline = backendHealth ? backendHealth.isOffline : false;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isAnalyzing && isEngineReady && url.trim().length > 3) {
      onAnalyze(undefined, true);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text');
    if (pasted && pasted.trim()) {
      const clean = pasted.trim();
      setUrl(clean);
      if (isEngineReady && isValidMediaUrl(clean)) {
        onAnalyze(clean, true);
      }
    }
  };

  const getPlaceholder = () => {
    if (isEngineWaking) {
      return detectedPlatform && detectedPlatform.id !== 'generic'
        ? `Paste ${detectedPlatform.name} URL (engine waking in ~15s)...`
        : 'Paste link here (cloud engine starting in ~15s)...';
    }
    if (isEngineChecking) {
      return 'Connecting to media engine... Paste URL anytime';
    }
    if (isEngineOffline) {
      return 'Cloud engine offline. Click "Retry Wake" to connect...';
    }
    if (detectedPlatform && detectedPlatform.id !== 'generic') {
      return `Paste ${detectedPlatform.name} video, audio or post URL...`;
    }
    return 'Paste video, reel, post, music, or playlist URL...';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 mt-4 sm:mt-6">
      {/* Mode Switch & Header Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 sm:mb-3 px-1 text-xs">
        {/* Left: Target Engine Tag & Live Backend Readiness Status */}
        <div className="flex items-center gap-1.5 sm:gap-2 max-w-full">
          <span className="text-white/40 text-[11px] sm:text-xs shrink-0">Target Engine:</span>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold text-[10px] sm:text-[11px] border shadow-sm transition-all truncate"
            style={{
              borderColor: detectedPlatform.primary_color,
              backgroundColor: `${detectedPlatform.primary_color}18`,
              color: detectedPlatform.primary_color,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
              style={{ backgroundColor: detectedPlatform.primary_color }}
            />
            <span className="truncate">{detectedPlatform.badge_text}</span>
          </span>

        </div>

        {/* Batch Mode Toggle Button */}
        <button
          onClick={onToggleBatchMode}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg border transition-all text-[11px] sm:text-xs font-medium focus:outline-none shrink-0 ${
            isBatchMode
              ? 'bg-indigo-600/30 border-indigo-400 text-indigo-300 shadow-glow-sm'
              : 'glass-pill hover:bg-white/[0.08] text-white/70'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>{isBatchMode ? 'Single URL Mode' : 'Batch / Playlist'}</span>
        </button>
      </div>

      {/* Main Frosted Glass Search Command Bar */}
      <div
        className={`relative group p-1 sm:p-1.5 rounded-2xl glass-panel-accent transition-all duration-300 shadow-glass ${
          !isEngineReady ? 'border-amber-400/35 shadow-[0_8px_32px_0_rgba(0,0,0,0.5),0_0_20px_-3px_rgba(245,158,11,0.2)]' : ''
        }`}
        style={{
          boxShadow: isEngineReady
            ? `0 8px 32px 0 rgba(0,0,0,0.5), 0 0 30px -5px ${detectedPlatform.glow_color}`
            : undefined,
          borderColor: isEngineReady ? detectedPlatform.primary_color : undefined,
        }}
      >
        <div className="flex items-center gap-1.5 sm:gap-2 w-full">
          {/* Leading Icon */}
          <div className="pl-2.5 sm:pl-3.5 text-white/40 group-focus-within:text-white transition-colors shrink-0">
            {isEngineWaking ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-spin" />
            ) : isEngineChecking ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 animate-spin" />
            ) : (
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </div>

          {/* URL Input */}
          <input
            ref={inputRef}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={getPlaceholder()}
            disabled={isAnalyzing}
            className="flex-1 min-w-0 bg-transparent py-2.5 sm:py-3 px-1.5 sm:px-2 text-xs sm:text-base text-white placeholder-white/35 focus:outline-none selection:bg-indigo-500/40"
            autoFocus
          />

          {/* Quick Action Buttons inside Input Bar */}
          <div className="flex items-center gap-1 sm:gap-1.5 pr-1 sm:pr-1.5 shrink-0">
            {/* Clear Button */}
            {(url || hasAnalyzedMedia) && (
              <button
                onClick={onClear}
                disabled={isAnalyzing}
                className="p-1 sm:p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors focus:outline-none shrink-0"
                title="Clear input & remove video"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Smart Paste Button */}
            <button
              onClick={onSmartPaste}
              disabled={isAnalyzing}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl glass-pill hover:bg-white/[0.1] text-xs font-medium text-white/80 transition-all focus:outline-none shrink-0"
              title="Paste from clipboard & analyze"
            >
              <Clipboard className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="hidden sm:inline">Paste</span>
            </button>

            {/* Main CTA Submit / Waking State Button */}
            {!isEngineReady ? (
              isEngineOffline ? (
                <button
                  type="button"
                  onClick={() => backendHealth?.wakeUp()}
                  className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-rose-200 bg-rose-500/20 border border-rose-500/30 hover:bg-rose-500/30 transition-all shrink-0 cursor-pointer shadow-glow-sm"
                  title="Click to reconnect cloud backend"
                >
                  <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 shrink-0" />
                  <span>Retry Wake</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-amber-200 bg-amber-500/20 border border-amber-500/30 transition-all cursor-not-allowed shrink-0"
                  title={url.trim() ? 'URL ready! Will automatically analyze the moment the engine wakes up...' : 'Cloud engine is waking from sleep (~15s)...'}
                >
                  <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-amber-400 shrink-0" />
                  <span className="hidden sm:inline">
                    {url.trim().length > 3 ? 'Queued (Waking Engine)...' : 'Waking Engine...'}
                  </span>
                  <span className="sm:hidden">
                    {url.trim().length > 3 ? 'Queued...' : 'Waking...'}
                  </span>
                </button>
              )
            ) : (
              <button
                onClick={() => onAnalyze(undefined, true)}
                disabled={isAnalyzing || url.trim().length < 3}
                className="btn-chameleon flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none shrink-0"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin shrink-0" />
                    <span className="hidden sm:inline">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Subtle Bottom Ambient Activity Pulse */}
        {!isEngineReady && (
          <div className="absolute -bottom-[1px] left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent animate-pulse rounded-full" />
        )}
      </div>
    </div>
  );
};

