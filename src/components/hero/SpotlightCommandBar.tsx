import React from 'react';
import { Search, Clipboard, X, Layers, ArrowRight, Loader2 } from 'lucide-react';
import { PlatformTheme } from '../../types/media';

interface SpotlightCommandBarProps {
  url: string;
  setUrl: (url: string) => void;
  detectedPlatform: PlatformTheme;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  isBatchMode: boolean;
  onToggleBatchMode: () => void;
  onSmartPaste: () => void;
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
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isAnalyzing && url.trim().length > 3) {
      onAnalyze();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-6">
      {/* Mode Switch & Header Pills */}
      <div className="flex items-center justify-between mb-3 px-1 text-xs">
        {/* Detected Platform Tag */}
        <div className="flex items-center gap-2">
          <span className="text-white/40">Engine Target:</span>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold text-[11px] border shadow-sm transition-all"
            style={{
              borderColor: detectedPlatform.primary_color,
              backgroundColor: `${detectedPlatform.primary_color}18`,
              color: detectedPlatform.primary_color,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: detectedPlatform.primary_color }}
            />
            {detectedPlatform.badge_text}
          </span>
        </div>

        {/* Batch Mode Toggle Button */}
        <button
          onClick={onToggleBatchMode}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-all text-xs font-medium focus:outline-none ${
            isBatchMode
              ? 'bg-indigo-600/30 border-indigo-400 text-indigo-300 shadow-glow-sm'
              : 'glass-pill hover:bg-white/[0.08] text-white/70'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>{isBatchMode ? 'Switch to Single URL' : 'Batch / Playlist Mode'}</span>
        </button>
      </div>

      {/* Main Frosted Glass Search Command Bar */}
      <div
        className="relative group p-1.5 rounded-2xl glass-panel-accent transition-all duration-300 shadow-glass"
        style={{
          boxShadow: `0 8px 32px 0 rgba(0,0,0,0.5), 0 0 30px -5px ${detectedPlatform.glow_color}`,
          borderColor: detectedPlatform.primary_color,
        }}
      >
        <div className="flex items-center gap-2 w-full">
          {/* Leading Icon */}
          <div className="pl-3.5 text-white/40 group-focus-within:text-white transition-colors">
            <Search className="w-5 h-5" />
          </div>

          {/* URL Input */}
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste video, reel, song, or album URL (e.g. YouTube, TikTok, IG, X, Reddit)..."
            disabled={isAnalyzing}
            className="flex-1 bg-transparent py-3 px-2 text-sm sm:text-base text-white placeholder-white/35 focus:outline-none selection:bg-indigo-500/40"
            autoFocus
          />

          {/* Quick Action Buttons inside Input Bar */}
          <div className="flex items-center gap-1.5 pr-1.5">
            {/* Clear Button */}
            {url && (
              <button
                onClick={() => setUrl('')}
                disabled={isAnalyzing}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Smart Paste Button */}
            <button
              onClick={onSmartPaste}
              disabled={isAnalyzing}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl glass-pill hover:bg-white/[0.1] text-xs font-medium text-white/80 transition-all focus:outline-none"
              title="Paste from clipboard"
            >
              <Clipboard className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Paste</span>
            </button>

            {/* Main CTA Submit Button */}
            <button
              onClick={onAnalyze}
              disabled={isAnalyzing || url.trim().length < 3}
              className="btn-chameleon flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
