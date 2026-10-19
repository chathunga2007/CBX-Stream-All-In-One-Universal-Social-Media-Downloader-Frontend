import React, { useState } from 'react';
import { Download, Film, Zap, CheckCircle2, HardDrive, Edit3, Music } from 'lucide-react';
import { MediaFormat, MediaAnalyzeResponse } from '../../types/media';

interface VideoFormatsTabProps {
  media: MediaAnalyzeResponse;
  onDownload: (formatId: string, label: string, customFilename?: string) => void;
  onDownloadAudio?: (
    format: 'mp3' | 'm4a' | 'flac' | 'wav' | 'opus',
    quality: '320' | '256' | '192' | '128',
    embedMeta: boolean,
    embedCover: boolean,
    customFilename?: string
  ) => void;
}

export const VideoFormatsTab: React.FC<VideoFormatsTabProps> = ({ media, onDownload, onDownloadAudio }) => {
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

  const isSingleFormat = videoFormats.length === 1;
  const singleFmt = isSingleFormat ? videoFormats[0] : null;

  return (
    <div className="space-y-4">
      {/* Top Header: Stream Info & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
        <div className="flex items-center gap-2 text-white/80">
          <Film className="w-4 h-4 text-indigo-400" />
          <span>
            <strong className="text-white">{videoFormats.length}</strong>{' '}
            {videoFormats.length === 1 ? 'Stream Profile Ready' : 'Stream Profiles Detected'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setShowFilenameInput(!showFilenameInput)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg glass-pill hover:bg-white/10 text-white/80 transition-colors focus:outline-none text-xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>{showFilenameInput ? 'Hide Filename' : 'Custom Name'}</span>
          </button>

          {!isSingleFormat && (
            <button
              onClick={() => onDownload('bestvideo+bestaudio/best', 'Best Available (Auto DASH)', customFilename)}
              className="btn-chameleon flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-white font-bold transition-all focus:outline-none shadow-glow-sm active:scale-95 sm:hover:scale-[1.02] text-xs"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Download Best Video</span>
            </button>
          )}
        </div>
      </div>

      {/* Optional Custom Filename Input */}
      {showFilenameInput && (
        <div className="p-3 rounded-xl glass-input flex items-center gap-2 text-xs animate-in fade-in duration-200">
          <span className="text-white/50 shrink-0 font-medium">Save As:</span>
          <input
            type="text"
            value={customFilename}
            onChange={(e) => setCustomFilename(e.target.value)}
            placeholder="Optional custom filename (e.g. My_Favorite_Clip)..."
            className="w-full bg-transparent text-white focus:outline-none text-xs"
          />
          <span className="text-white/40 font-mono shrink-0">.mp4</span>
        </div>
      )}

      {/* CASE 1: Single Format Showcase (Eliminates empty void & provides rich layout) */}
      {isSingleFormat && singleFmt && (
        <div className="space-y-3.5">
          {/* Hero Single Video Download Card */}
          <div
            className="glass-card rounded-2xl p-5 sm:p-6 border flex flex-col justify-between space-y-4 shadow-glass transition-all"
            style={{
              borderColor: `${media.platform.primary_color}4D`,
              boxShadow: `0 8px 30px -10px ${media.platform.glow_color}`,
            }}
          >
            {/* Header with Quality Badge & File Size */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-extrabold border ${getQualityBadgeColor(
                      singleFmt.height
                    )}`}
                  >
                    {singleFmt.quality_label || `${singleFmt.height}p HD`}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/[0.06] text-white/70 border border-white/10 uppercase">
                    {singleFmt.ext}
                  </span>
                </div>
                <div className="text-xs font-mono text-white/60 flex items-center gap-2 pt-1">
                  <span>{singleFmt.resolution}</span>
                  {singleFmt.fps && <span>• {singleFmt.fps} fps</span>}
                  <span>• Codec: {singleFmt.vcodec !== 'none' ? singleFmt.vcodec.split('.')[0] : 'Auto'}</span>
                </div>
              </div>

              {/* Filesize Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-xs font-mono font-bold text-white shrink-0">
                <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                <span>{singleFmt.filesize_formatted}</span>
              </div>
            </div>

            {/* Audio Merge Status */}
            <div className="flex items-center gap-2 text-xs text-white/60 bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
              {singleFmt.has_video_and_audio ? (
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Integrated Synchronized Audio Track</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-sky-400 font-medium">
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>Lossless DASH Video + HQ Audio Stream Merged by FFmpeg</span>
                </div>
              )}
            </div>

            {/* Prominent One-Click Download CTA */}
            <button
              onClick={() => onDownload(singleFmt.format_id, singleFmt.quality_label, customFilename)}
              className="btn-chameleon w-full py-3 sm:py-3.5 px-4 rounded-xl text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-glow-md hover:shadow-glow-lg hover:scale-[1.01] focus:outline-none"
            >
              <Download className="w-5 h-5" />
              <span>
                Download {singleFmt.quality_label || 'Video'} ({singleFmt.filesize_formatted})
              </span>
            </button>
          </div>

          {/* Quick Companion Card: Audio Extraction (Fills the dashboard smartly!) */}
          {onDownloadAudio && (
            <div className="glass-panel rounded-xl p-3.5 sm:p-4 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-white/80">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-white text-xs">Need Just The Sound?</h5>
                  <p className="text-[11px] text-white/50">Extract studio-grade 320kbps MP3 audio track</p>
                </div>
              </div>

              <button
                onClick={() => onDownloadAudio('mp3', '320', true, true, customFilename)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 focus:outline-none border border-white/15"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Extract MP3 (320k)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* CASE 2: Multi-Format Grid List */}
      {!isSingleFormat && (
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
      )}
    </div>
  );
};
