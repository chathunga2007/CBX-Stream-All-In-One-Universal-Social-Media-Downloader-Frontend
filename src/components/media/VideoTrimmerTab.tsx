import React, { useState } from 'react';
import { Scissors, Clock, Film, Music, Sparkles, AlertCircle } from 'lucide-react';
import { MediaAnalyzeResponse } from '../../types/media';

interface VideoTrimmerTabProps {
  media: MediaAnalyzeResponse;
  onTrim: (
    startTime: string,
    endTime: string,
    extractAudio: boolean,
    audioFormat: 'mp3' | 'm4a' | 'wav' | 'flac',
    customFilename?: string
  ) => void;
}

export const VideoTrimmerTab: React.FC<VideoTrimmerTabProps> = ({ media, onTrim }) => {
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState(
    media.duration_formatted && media.duration_formatted !== '00:00'
      ? media.duration_formatted
      : '00:30'
  );
  const [extractAudio, setExtractAudio] = useState(false);
  const [audioFormat, setAudioFormat] = useState<'mp3' | 'm4a' | 'wav' | 'flac'>('mp3');
  const [customFilename, setCustomFilename] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
   * Formats seconds into MM:SS
   */
  const formatSec = (sec: number): string => {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const startSec = parseSeconds(startTime);
  const endSec = parseSeconds(endTime);
  const clipDuration = Math.max(0, endSec - startSec);

  const handleApplyPreset = (start: number, end: number) => {
    setStartTime(formatSec(start));
    setEndTime(formatSec(end));
    setErrorMsg(null);
  };

  const handleSubmit = () => {
    if (endSec <= startSec) {
      setErrorMsg(`End time (${endTime}) must be greater than start time (${startTime}).`);
      return;
    }
    setErrorMsg(null);
    onTrim(startTime, endTime, extractAudio, audioFormat, customFilename);
  };

  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 font-mono">
            <Scissors className="w-4 h-4 text-indigo-400" />
            Precision Keyframe Clipper
          </h4>
          <span className="text-[11px] font-mono text-white/50">
            Total Source: {media.duration_formatted || 'Unknown'}
          </span>
        </div>
        <p className="text-xs text-white/60 leading-relaxed">
          Trim exact highlight clips with sub-second accuracy without downloading the entire stream locally first.
          Uses FFmpeg non-destructive fast seek.
        </p>
      </div>

      {/* Preset Quick Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-white/40 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Quick Clips:
        </span>
        <button
          type="button"
          onClick={() => handleApplyPreset(0, Math.min(30, media.duration || 30))}
          className="px-2.5 py-1 rounded-lg glass-pill hover:bg-white/10 text-white/80 transition-colors focus:outline-none"
        >
          First 30s (Shorts/Reels)
        </button>
        <button
          type="button"
          onClick={() => handleApplyPreset(0, Math.min(60, media.duration || 60))}
          className="px-2.5 py-1 rounded-lg glass-pill hover:bg-white/10 text-white/80 transition-colors focus:outline-none"
        >
          First 60s
        </button>
        {media.duration && media.duration > 90 && (
          <button
            type="button"
            onClick={() => handleApplyPreset(30, 90)}
            className="px-2.5 py-1 rounded-lg glass-pill hover:bg-white/10 text-white/80 transition-colors focus:outline-none"
          >
            Hook (00:30 - 01:30)
          </button>
        )}
      </div>

      {/* Timestamp Inputs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Start Time */}
        <div className="p-3.5 rounded-xl glass-card space-y-2">
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
              className="hover:text-white"
            >
              Reset 00:00
            </button>
            <button
              type="button"
              onClick={() => setStartTime(formatSec(Math.max(0, startSec - 5)))}
              className="hover:text-white"
            >
              -5s
            </button>
            <button
              type="button"
              onClick={() => setStartTime(formatSec(startSec + 5))}
              className="hover:text-white"
            >
              +5s
            </button>
          </div>
        </div>

        {/* End Time */}
        <div className="p-3.5 rounded-xl glass-card space-y-2">
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
            placeholder="01:30"
            className="w-full px-3 py-2 text-base font-mono font-bold rounded-xl glass-input text-white text-center focus:outline-none"
          />
          <div className="flex justify-between gap-1 text-[10px] text-white/50 pt-1">
            <button
              type="button"
              onClick={() => setEndTime(formatSec(Math.max(startSec + 1, endSec - 5)))}
              className="hover:text-white"
            >
              -5s
            </button>
            <button
              type="button"
              onClick={() => setEndTime(formatSec(endSec + 5))}
              className="hover:text-white"
            >
              +5s
            </button>
            {media.duration_formatted && (
              <button
                type="button"
                onClick={() => setEndTime(media.duration_formatted)}
                className="hover:text-white"
              >
                Full End
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Duration Summary Pill */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
        <span className="text-white/60">Clipped Selection Duration:</span>
        <span className="font-mono font-bold text-white flex items-center gap-1.5">
          <span className="text-indigo-400">{formatSec(clipDuration)}</span>
          <span className="text-white/40">({clipDuration.toFixed(1)} seconds)</span>
        </span>
      </div>

      {/* Format Mode: Video vs Audio */}
      <div className="p-3.5 rounded-xl glass-card space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-white/80">Clip Export Mode</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setExtractAudio(false)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold transition-all ${
                !extractAudio
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-glow-sm'
                  : 'glass-pill border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Video (.MP4)</span>
            </button>
            <button
              type="button"
              onClick={() => setExtractAudio(true)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold transition-all ${
                extractAudio
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-glow-sm'
                  : 'glass-pill border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Audio Only</span>
            </button>
          </div>
        </div>

        {extractAudio && (
          <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-xs">
            <span className="text-white/60">Audio Container:</span>
            {(['mp3', 'm4a', 'wav', 'flac'] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setAudioFormat(fmt)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase transition-all ${
                  audioFormat === fmt
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        )}

        {/* Custom Filename */}
        <div>
          <label className="block text-[11px] text-white/50 mb-1">Custom File Name (Optional)</label>
          <input
            type="text"
            value={customFilename}
            onChange={(e) => setCustomFilename(e.target.value)}
            placeholder={`clip_${startTime.replace(':', 'm')}s_to_${endTime.replace(':', 'm')}s`}
            className="w-full px-3 py-1.5 text-xs rounded-lg glass-input text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={handleSubmit}
        disabled={clipDuration <= 0}
        className="btn-chameleon w-full py-2.5 px-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
      >
        <Scissors className="w-4 h-4" />
        <span>
          Trim & Download {extractAudio ? `Audio (${audioFormat.toUpperCase()})` : 'Video Clip'} (
          {formatSec(clipDuration)})
        </span>
      </button>
    </div>
  );
};
