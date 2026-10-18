import React, { useState } from 'react';
import { Download, Film, Zap, CheckCircle2, HardDrive, Edit3 } from 'lucide-react';
import { MediaFormat, MediaAnalyzeResponse } from '../../types/media';

interface VideoFormatsTabProps {
  media: MediaAnalyzeResponse;
  onDownload: (formatId: string, label: string, customFilename?: string) => void;
}

export const VideoFormatsTab: React.FC<VideoFormatsTabProps> = ({ media, onDownload }) => {
  const [customFilename, setCustomFilename] = useState('');
  const [showFilenameInput, setShowFilenameInput] = useState(false);

  // Default to media.video_formats or fallback to any format containing video
  const videoFormats =
    media.video_formats && media.video_formats.length > 0
      ? media.video_formats
      : media.formats.filter((f) => !f.is_audio_only);

  const getQualityBadgeColor = (height?: number | null) => {
    if (!height) return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
    if (height >= 2160) return 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-glow-sm';
    if (height >= 1440) return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    if (height >= 1080) return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
    if (height >= 720) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    return 'bg-white/10 text-white/70 border-white/15';
  };

  return (
    <div className="space-y-4">
      {/* Top Controls: Best Quality Quick Action & Custom Filename Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
        <div className="flex items-center gap-2 text-white/70">
          <Film className="w-4 h-4 text-indigo-400" />
          <span>
            <strong className="text-white">{videoFormats.length}</strong> Video Stream Profiles Detected
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilenameInput(!showFilenameInput)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg glass-pill hover:bg-white/10 text-white/80 transition-colors focus:outline-none"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>{showFilenameInput ? 'Hide Filename' : 'Custom Name'}</span>
          </button>

          {/* Quick Best Video Download Button */}
          <button
            onClick={() => onDownload('bestvideo+bestaudio/best', 'Best Available (Auto DASH)', customFilename)}
            className="btn-chameleon flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white font-bold transition-all focus:outline-none"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Download Best Video</span>
          </button>
        </div>
      </div>

      {/* Optional Custom Filename Input */}
      {showFilenameInput && (
        <div className="p-3 rounded-xl glass-input flex items-center gap-2 text-xs">
          <span className="text-white/50 shrink-0">Save As:</span>
          <input
            type="text"
            value={customFilename}
            onChange={(e) => setCustomFilename(e.target.value)}
            placeholder="Optional custom filename (e.g. My_Favorite_Trip)..."
            className="w-full bg-transparent text-white focus:outline-none text-xs"
          />
          <span className="text-white/40 font-mono shrink-0">.mp4</span>
        </div>
      )}

      {/* Formats Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
        {videoFormats.map((fmt: MediaFormat, index: number) => (
          <div
            key={`${fmt.format_id}-${index}`}
            className="glass-card rounded-xl p-4 flex flex-col justify-between space-y-3 group hover:border-indigo-500/40 transition-all shadow-sm"
          >
            {/* Format Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${getQualityBadgeColor(
                    fmt.height
                  )}`}
                >
                  {fmt.quality_label || `${fmt.height}p`}
                </span>
                <div className="text-xs font-mono text-white/60 mt-1 flex items-center gap-2">
                  <span>{fmt.resolution}</span>
                  {fmt.fps && <span>• {fmt.fps} fps</span>}
                </div>
              </div>

              {/* File size pill */}
              <div className="flex items-center gap-1 text-xs font-mono font-medium text-white/80 bg-white/5 px-2 py-1 rounded-md">
                <HardDrive className="w-3 h-3 text-indigo-400" />
                <span>{fmt.filesize_formatted}</span>
              </div>
            </div>

            {/* Codec Details */}
            <div className="flex items-center gap-2 text-[11px] text-white/50">
              <span className="uppercase font-mono bg-white/[0.04] px-1.5 py-0.5 rounded">
                {fmt.ext}
              </span>
              <span>Codec: {fmt.vcodec !== 'none' ? fmt.vcodec.split('.')[0] : 'auto'}</span>
              {fmt.has_video_and_audio ? (
                <span className="flex items-center gap-1 text-emerald-400 ml-auto">
                  <CheckCircle2 className="w-3 h-3" /> Audio Included
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sky-400 ml-auto">
                  <Zap className="w-3 h-3" /> Auto DASH Merged
                </span>
              )}
            </div>

            {/* Download CTA Button */}
            <button
              onClick={() => onDownload(fmt.format_id, fmt.quality_label, customFilename)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/10 hover:bg-indigo-600 text-white font-semibold text-xs transition-all duration-200 group-hover:bg-indigo-600 shadow-sm focus:outline-none"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {fmt.quality_label}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
