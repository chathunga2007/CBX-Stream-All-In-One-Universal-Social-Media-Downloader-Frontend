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
    const metaString = `Title: ${media.title}\nUploader: ${media.uploader || 'Unknown'}\nDuration: ${media.duration_formatted}\nSource: ${media.url}`;
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
    <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 flex flex-col h-full shadow-glass">
      {/* Thumbnail Banner with Gradient Overlay */}
      <div className="relative aspect-video w-full bg-obsidian-900 overflow-hidden group">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={media.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">
            No thumbnail preview available
          </div>
        )}

        {/* Shading gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent" />

        {/* Live Badge or Duration Pill */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {media.is_live ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-600/90 text-white font-bold text-xs shadow-md animate-pulse">
              <Radio className="w-3.5 h-3.5" />
              LIVE
            </span>
          ) : (
            media.duration_formatted && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-obsidian-950/80 backdrop-blur-md text-white font-mono font-medium text-xs border border-white/10 shadow-md">
                <Clock className="w-3 h-3 text-indigo-400" />
                {media.duration_formatted}
              </span>
            )
          )}
        </div>

        {/* Platform Badge Overlay */}
        <div className="absolute top-3 left-3">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-lg backdrop-blur-md border border-white/20"
            style={{ backgroundColor: `${media.platform.primary_color}CC` }}
          >
            {media.platform.name}
          </span>
        </div>
      </div>

      {/* Content & Metadata Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Title */}
          <h3
            className="font-heading font-bold text-lg text-white line-clamp-2 leading-snug"
            title={media.title}
          >
            {media.title || 'Untitled Social Media Stream'}
          </h3>

          {/* Uploader Handle */}
          {media.uploader && (
            <div className="mt-2 flex items-center gap-2 text-xs text-white/70">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-indigo-300">
                <User className="w-3.5 h-3.5" />
              </div>
              {media.uploader_url ? (
                <a
                  href={media.uploader_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium hover:text-indigo-400 transition-colors truncate max-w-[200px]"
                >
                  {media.uploader}
                </a>
              ) : (
                <span className="font-medium truncate max-w-[200px]">{media.uploader}</span>
              )}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs text-white/60">
          <div className="flex items-center gap-1.5 bg-white/[0.03] p-2 rounded-xl">
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>{formatNumber(media.view_count)} Views</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/[0.03] p-2 rounded-xl">
            <ThumbsUp className="w-3.5 h-3.5 text-rose-400" />
            <span>{formatNumber(media.like_count)} Likes</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
          <button
            onClick={handleCopyMetadata}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-pill hover:bg-white/10 text-white/80 transition-colors focus:outline-none"
            title="Copy metadata to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
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
            className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors"
          >
            <span>Open Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
