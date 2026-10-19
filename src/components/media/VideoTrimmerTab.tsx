import React, { useState, useMemo } from 'react';
import { Scissors, Clock, Film, Music, Sparkles, AlertCircle, Loader2, Zap, Sliders, Check } from 'lucide-react';
import { MediaAnalyzeResponse, MediaFormat } from '../../types/media';

interface VideoTrimmerTabProps {
  media: MediaAnalyzeResponse;
  onTrim: (
    startTime: string,
    endTime: string,
    extractAudio: boolean,
    audioFormat: 'mp3' | 'm4a' | 'wav' | 'flac',
    formatId?: string,
    audioQuality?: '320' | '256' | '192' | '128',
    customFilename?: string
  ) => Promise<void> | void;
}

export const VideoTrimmerTab: React.FC<VideoTrimmerTabProps> = ({ media, onTrim }) => {
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState(
    media.duration_formatted && media.duration_formatted !== '00:00'
      ? media.duration_formatted
      : '00:30'
  );
  const [exportMode, setExportMode] = useState<'video' | 'audio'>('video');
  const [selectedFormatId, setSelectedFormatId] = useState<string>('bestvideo+bestaudio/best');
  const [selectedVideoQualityLabel, setSelectedVideoQualityLabel] = useState<string>('Best Available (Auto DASH)');
  const [audioFormat, setAudioFormat] = useState<'mp3' | 'm4a' | 'wav' | 'flac'>('mp3');
  const [audioQuality, setAudioQuality] = useState<'320' | '256' | '192' | '128'>('320');
  const [customFilename, setCustomFilename] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isTrimming, setIsTrimming] = useState(false);

  // Parse distinct available video resolutions from media
  const availableVideoQualities = useMemo(() => {
    const formats = media.video_formats && media.video_formats.length > 0
      ? media.video_formats
      : media.formats.filter((f) => !f.is_audio_only);

    const map = new Map<string, { formatId: string; label: string; height: number; resolution: string }>();

    // Always include Best Auto DASH option
    map.set('best', {
      formatId: 'bestvideo+bestaudio/best',
      label: 'Best Available (Auto DASH)',
      height: 9999,
      resolution: 'Max Res',
    });

    formats.forEach((fmt: MediaFormat) => {
      const h = fmt.height;
      if (h && h >= 240) {
        const key = `${h}p`;
        if (!map.has(key)) {
          map.set(key, {
            formatId: fmt.format_id,
            label: fmt.quality_label || `${h}p`,
            height: h,
            resolution: fmt.resolution,
          });
        }
      }
    });

    return Array.from(map.values()).sort((a, b) => b.height - a.height);
  }, [media]);

  /**
   * Converts timestamp string ("01:30" or "01:15:20" or "90") into total seconds
   */
  const parseSeconds = (val: string): number => {
    const clean = val.trim();
    if (!clean) return 0;
    if (!clean.includes(':')) {
      const num = parseFloat(clean);
      return isNaN(num) ? 0 : num;
    }
    const parts = clean.split(':').map((p) => parseFloat(p) || 0);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  };

  /**
   * Formats seconds into MM:SS or HH:MM:SS
   */
  const formatSec = (sec: number): string => {
    const total = Math.max(0, Math.floor(sec));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalDuration = media.duration || Math.max(60, parseSeconds(media.duration_formatted));
  const startSec = parseSeconds(startTime);
  const endSec = parseSeconds(endTime);
  const clipDuration = Math.max(0, endSec - startSec);

  // Timeline percentage for visualization
  const startPercent = Math.min(100, Math.max(0, (startSec / (totalDuration || 1)) * 100));
  const endPercent = Math.min(100, Math.max(0, (endSec / (totalDuration || 1)) * 100));
  const clipPercent = Math.max(2, endPercent - startPercent);

  const handleApplyPreset = (start: number, end: number) => {
    setStartTime(formatSec(start));
    setEndTime(formatSec(end));
    setErrorMsg(null);
  };

  const handleSubmit = async () => {
    if (endSec <= startSec) {
      setErrorMsg(`End timestamp (${endTime}) must be greater than start timestamp (${startTime}).`);
      return;
    }
    setErrorMsg(null);
    setIsTrimming(true);

    try {
      await onTrim(
        startTime,
        endTime,
        exportMode === 'audio',
        audioFormat,
        exportMode === 'video' ? selectedFormatId : undefined,
        exportMode === 'audio' ? audioQuality : undefined,
        customFilename.trim() || undefined
      );
    } finally {
      setIsTrimming(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header Info */}
      <div className="p-3.5 sm:p-4 rounded-xl glass-panel border border-white/10 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 font-mono">
            <Scissors className="w-4 h-4 text-indigo-400" />
            Precision Keyframe Clipper
          </h4>
          <span className="text-[11px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded-md">
            Source Duration: {media.duration_formatted || 'Unknown'}
          </span>
        </div>
        <p className="text-xs text-white/60 leading-relaxed">
          Trim highlight clips with sub-second accuracy. Export as high-definition MP4 video or pristine studio-quality MP3 audio without watermark or quality loss.
        </p>
      </div>

      {/* Visual Timeline Bar */}
      <div className="p-3 sm:p-3.5 rounded-xl glass-card space-y-2">
        <div className="flex items-center justify-between text-xs text-white/60">
          <span className="font-mono text-[11px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Start: <strong className="text-white">{startTime}</strong>
          </span>
          <span className="font-mono text-[11px] text-indigo-300 font-bold">
            Clip: {formatSec(clipDuration)} ({clipDuration.toFixed(1)}s)
          </span>
          <span className="font-mono text-[11px] flex items-center gap-1">
            End: <strong className="text-white">{endTime}</strong>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          </span>
        </div>

        {/* Scrub bar container */}
        <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/10">
          {/* Active selection track */}
          <div
            className="absolute top-0 bottom-0 rounded-full transition-all duration-200"
            style={{
              left: `${startPercent}%`,
              width: `${clipPercent}%`,
              background: 'linear-gradient(90deg, #10B981 0%, #6366F1 50%, #EC4899 100%)',
              boxShadow: '0 0 12px rgba(99, 102, 241, 0.6)',
            }}
          />
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
        <span className="text-white/40 mr-1 flex items-center gap-1 text-[11px]">
          <Sparkles className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        <button
          type="button"
          onClick={() => handleApplyPreset(0, Math.min(15, totalDuration))}
          className="px-2.5 py-1 rounded-lg glass-pill hover:bg-white/10 text-white/80 transition-colors focus:outline-none text-xs active:scale-95"
        >
          First 15s (Story)
        </button>
        <button
          type="button"
          onClick={() => handleApplyPreset(0, Math.min(30, totalDuration))}
          className="px-2.5 py-1 rounded-lg glass-pill hover:bg-white/10 text-white/80 transition-colors focus:outline-none text-xs active:scale-95"
        >
          First 30s (Shorts/Reels)
        </button>
        <button
          type="button"
          onClick={() => handleApplyPreset(0, Math.min(60, totalDuration))}
          className="px-2.5 py-1 rounded-lg glass-pill hover:bg-white/10 text-white/80 transition-colors focus:outline-none text-xs active:scale-95"
        >
          First 60s (TikTok)
        </button>
        {totalDuration > 90 && (
          <button
            type="button"
            onClick={() => handleApplyPreset(30, Math.min(90, totalDuration))}
            className="px-2.5 py-1 rounded-lg glass-pill hover:bg-white/10 text-white/80 transition-colors focus:outline-none text-xs active:scale-95"
          >
            Hook (00:30 - 01:30)
          </button>
        )}
      </div>

      {/* Timestamp Inputs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Start Time */}
        <div className="p-3 sm:p-3.5 rounded-xl glass-card space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-white/80 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Start Timestamp
            </label>
            <span className="font-mono text-white/40 text-[11px]">{startSec}s</span>
          </div>
          <input
            type="text"
            value={startTime}
            onChange={(e) => {
              setStartTime(e.target.value);
              setErrorMsg(null);
            }}
            placeholder="00:00"
            className="w-full px-3 py-2 text-base font-mono font-bold rounded-xl glass-input text-white text-center focus:outline-none"
          />
          <div className="flex justify-between gap-1 text-[10px] text-white/50 pt-1">
            <button
              type="button"
              onClick={() => setStartTime('00:00')}
              className="hover:text-white px-1.5 py-0.5 rounded bg-white/5"
            >
              Reset 00:00
            </button>
            <button
              type="button"
              onClick={() => setStartTime(formatSec(Math.max(0, startSec - 5)))}
              className="hover:text-white px-1.5 py-0.5 rounded bg-white/5"
            >
              -5s
            </button>
            <button
              type="button"
              onClick={() => setStartTime(formatSec(startSec + 5))}
              className="hover:text-white px-1.5 py-0.5 rounded bg-white/5"
            >
              +5s
            </button>
          </div>
        </div>

        {/* End Time */}
        <div className="p-3 sm:p-3.5 rounded-xl glass-card space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-white/80 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              End Timestamp
            </label>
            <span className="font-mono text-white/40 text-[11px]">{endSec}s</span>
          </div>
          <input
            type="text"
            value={endTime}
            onChange={(e) => {
              setEndTime(e.target.value);
              setErrorMsg(null);
            }}
            placeholder="00:30"
            className="w-full px-3 py-2 text-base font-mono font-bold rounded-xl glass-input text-white text-center focus:outline-none"
          />
          <div className="flex justify-between gap-1 text-[10px] text-white/50 pt-1">
            <button
              type="button"
              onClick={() => setEndTime(formatSec(Math.max(startSec + 1, endSec - 5)))}
              className="hover:text-white px-1.5 py-0.5 rounded bg-white/5"
            >
              -5s
            </button>
            <button
              type="button"
              onClick={() => setEndTime(formatSec(endSec + 5))}
              className="hover:text-white px-1.5 py-0.5 rounded bg-white/5"
            >
              +5s
            </button>
            {media.duration_formatted && (
              <button
                type="button"
                onClick={() => setEndTime(media.duration_formatted)}
                className="hover:text-white px-1.5 py-0.5 rounded bg-white/5"
              >
                Full End
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Format & Quality Configuration Box */}
      <div className="p-3.5 sm:p-4 rounded-xl glass-card space-y-4 border border-white/10">
        {/* Step 1: Video vs Audio Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Select Output Type:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setExportMode('video')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                exportMode === 'video'
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-glow-sm'
                  : 'glass-pill border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Video (.MP4)</span>
            </button>

            <button
              type="button"
              onClick={() => setExportMode('audio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                exportMode === 'audio'
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-glow-sm'
                  : 'glass-pill border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Audio (.MP3)</span>
            </button>
          </div>
        </div>

        {/* Step 2A: Video Quality Picker (when Video mode is chosen) */}
        {exportMode === 'video' && (
          <div className="pt-3 border-t border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/70 font-medium">Select Video Quality:</span>
              <span className="font-mono text-indigo-300 text-[11px] font-bold">
                {selectedVideoQualityLabel}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {availableVideoQualities.map((q) => {
                const isSelected = selectedFormatId === q.formatId;
                return (
                  <button
                    key={q.formatId}
                    type="button"
                    onClick={() => {
                      setSelectedFormatId(q.formatId);
                      setSelectedVideoQualityLabel(q.label);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-glow-sm'
                        : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-indigo-400" />}
                    <span>{q.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2B: Audio Format & Bitrate Quality Pickers (when Audio mode is chosen) */}
        {exportMode === 'audio' && (
          <div className="pt-3 border-t border-white/5 space-y-3">
            {/* Audio Container Format */}
            <div className="space-y-1.5">
              <span className="text-xs text-white/70 font-medium">Audio Container:</span>
              <div className="flex flex-wrap items-center gap-2">
                {(['mp3', 'm4a', 'wav', 'flac'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setAudioFormat(fmt)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all border ${
                      audioFormat === fmt
                        ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-glow-sm'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {fmt === 'mp3' ? 'MP3 (Universal)' : fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Bitrate Quality */}
            <div className="space-y-1.5">
              <span className="text-xs text-white/70 font-medium">Audio Quality (Bitrate):</span>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { q: '320' as const, label: '320 kbps (Master)' },
                  { q: '256' as const, label: '256 kbps (High)' },
                  { q: '192' as const, label: '192 kbps (Standard)' },
                  { q: '128' as const, label: '128 kbps (Compact)' },
                ].map((tier) => (
                  <button
                    key={tier.q}
                    type="button"
                    onClick={() => setAudioQuality(tier.q)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
                      audioQuality === tier.q
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-glow-sm'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Custom Filename */}
        <div className="pt-3 border-t border-white/5">
          <label className="block text-[11px] text-white/50 mb-1">Custom File Name (Optional)</label>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              placeholder={`clip_${startTime.replace(':', 'm')}s_to_${endTime.replace(':', 'm')}s`}
              className="flex-1 px-3 py-2 text-xs rounded-lg glass-input text-white focus:outline-none"
            />
            <span className="font-mono text-xs text-white/40 px-2 py-1.5 rounded-md bg-white/5 border border-white/10 shrink-0">
              .{exportMode === 'video' ? 'mp4' : audioFormat}
            </span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Trigger Button with Live Loading State */}
      <button
        onClick={handleSubmit}
        disabled={clipDuration <= 0 || isTrimming}
        className="btn-chameleon w-full py-3 px-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none shadow-glow-sm hover:scale-[1.01]"
      >
        {isTrimming ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Trimming & Packaging Clip ({formatSec(clipDuration)})...</span>
          </>
        ) : (
          <>
            <Scissors className="w-4 h-4 text-white" />
            <span>
              Trim & Download {exportMode === 'video' ? `Video (MP4 • ${selectedVideoQualityLabel.split(' ')[0]})` : `Audio (${audioFormat.toUpperCase()} • ${audioQuality}k)`} (
              {formatSec(clipDuration)})
            </span>
          </>
        )}
      </button>

      {/* Processing Notice */}
      {isTrimming && (
        <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-center text-xs text-indigo-300 flex items-center justify-center gap-2 animate-pulse">
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>Processing high-precision FFmpeg keyframe cut... Please keep this window open.</span>
        </div>
      )}
    </div>
  );
};
