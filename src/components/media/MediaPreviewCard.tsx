import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Eye, ThumbsUp, Clock, User, Radio } from 'lucide-react';
import { MediaAnalyzeResponse } from '../../types/media';
import { apiService } from '../../services/api';

interface MediaPreviewCardProps {
  media: MediaAnalyzeResponse;
}

export const MediaPreviewCard: React.FC<MediaPreviewCardProps> = ({ media }) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Construct proxied image URL or direct thumbnail
  const thumbnailUrl = media.thumbnail
    ? imgError
      ? media.thumbnail
      : apiService.getProxyUrl(media.thumbnail)
    : null;

  const handleCopyMetadata = () => {
    const metaString = `Title: ${media.title}\nPlatform: ${media.platform?.name || 'Social'}\nUploader: ${media.uploader || 'Unknown'}\nDuration: ${media.duration_formatted || 'N/A'}\nSource: ${media.url}`;
    navigator.clipboard.writeText(metaString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatNumber = (num?: number | null) => {
    if (!num) return '0';
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  return (
    <div
      className="glass-panel rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col h-full shadow-glass"
      style={{
        borderColor: `${media.platform.primary_color}33`,
        boxShadow: `0 12px 35px -10px rgba(0,0,0,0.7), 0 0 25px -8px ${media.platform.glow_color}`,
      }}
    >
      {/* Intelligent Responsive Thumbnail Container (Handles both 16:9 Landscape & 9:16 Portrait Reels) */}
      <div className="relative w-full overflow-hidden bg-obsidian-950 flex items-center justify-center min-h-[220px] max-h-[340px] group">
        {thumbnailUrl ? (
          <>
            {/* Ambient Blurred Aura Background (Fills pillarbox / letterbox space naturally) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                src={thumbnailUrl}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover blur-2xl opacity-40 scale-125"
              />
              <div className="absolute inset-0 bg-obsidian-950/40 backdrop-blur-sm" />
            </div>

            {/* Foreground True-Aspect Image (Never crops heads or text in portrait reels) */}
            <img
              src={thumbnailUrl}
              alt={media.title}
              onError={() => setImgError(true)}
              className="relative z-10 max-h-[320px] w-auto max-w-full object-contain rounded-lg drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:scale-[1.02] p-1.5"
              loading="lazy"
            />
          </>
        ) : (
          <div className="w-full h-48 flex items-center justify-center text-white/30 text-xs">
            No thumbnail preview available
          </div>
        )}

        {/* Subtle Top & Bottom Gradient Vignettes */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-obsidian-950/70 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-obsidian-950/80 to-transparent z-20 pointer-events-none" />

        {/* Platform Badge Overlay */}
        <div className="absolute top-3 left-3 z-30">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-lg backdrop-blur-md border border-white/20"
            style={{ backgroundColor: `${media.platform.primary_color}D9` }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {media.platform.name}
          </span>
        </div>

        {/* Live Badge or Duration Pill */}
        <div className="absolute bottom-3 right-3 z-30 flex items-center gap-2">
          {media.is_live ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-600/90 text-white font-bold text-xs shadow-lg backdrop-blur-md animate-pulse">
              <Radio className="w-3.5 h-3.5" />
              LIVE
            </span>
          ) : (
            media.duration_formatted && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-obsidian-950/85 backdrop-blur-md text-white font-mono font-medium text-xs border border-white/15 shadow-md">
                <Clock className="w-3 h-3 text-sky-400" />
                {media.duration_formatted}
              </span>
            )
          )}
        </div>
      </div>

      {/* Content & Metadata Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Title */}
          <h3
            className="font-heading font-extrabold text-base sm:text-lg text-white line-clamp-2 leading-snug tracking-tight"
            title={media.title}
          >
            {media.title || 'Untitled Social Media Stream'}
          </h3>

          {/* Uploader Handle */}
          {media.uploader && (
            <div className="flex items-center gap-2 text-xs text-white/75">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-sm"
                style={{ backgroundColor: `${media.platform.primary_color}40` }}
              >
                <User className="w-3.5 h-3.5" style={{ color: media.platform.accent_color }} />
              </div>
              {media.uploader_url ? (
                <a
                  href={media.uploader_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold hover:underline transition-colors truncate max-w-[240px] text-white/90"
                >
                  {media.uploader}
                </a>
              ) : (
                <span className="font-semibold truncate max-w-[240px] text-white/90">{media.uploader}</span>
              )}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs">
          <div className="flex items-center gap-2 bg-white/[0.04] p-2.5 rounded-xl border border-white/5 text-white/70">
            <Eye className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="font-mono font-medium">{formatNumber(media.view_count)} Views</span>
          </div>
          <div className="flex items-center gap-2 bg-white/[0.04] p-2.5 rounded-xl border border-white/5 text-white/70">
            <ThumbsUp className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-mono font-medium">{formatNumber(media.like_count)} Likes</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
          <button
            onClick={handleCopyMetadata}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-pill hover:bg-white/10 text-white/85 transition-colors focus:outline-none"
            title="Copy metadata to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-white/60" />
                <span>Copy Info</span>
              </>
            )}
          </button>

          <a
            href={media.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors py-1.5 px-2 rounded-lg hover:bg-white/5"
          >
            <span>Open Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
