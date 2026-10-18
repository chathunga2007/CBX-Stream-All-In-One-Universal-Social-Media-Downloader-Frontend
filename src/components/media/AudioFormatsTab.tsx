import React, { useState } from 'react';
import { Music, Disc, Download, Image as ImageIcon, Sparkles, Check, FileAudio } from 'lucide-react';
import { MediaAnalyzeResponse } from '../../types/media';

interface AudioFormatsTabProps {
  media: MediaAnalyzeResponse;
  onDownloadAudio: (
    format: 'mp3' | 'm4a' | 'flac' | 'wav' | 'opus',
    quality: '320' | '256' | '192' | '128',
    embedMeta: boolean,
    embedCover: boolean,
    customFilename?: string
  ) => void;
}

export const AudioFormatsTab: React.FC<AudioFormatsTabProps> = ({ media, onDownloadAudio }) => {
  const [selectedFormat, setSelectedFormat] = useState<'mp3' | 'm4a' | 'flac' | 'wav' | 'opus'>('mp3');
  const [selectedQuality, setSelectedQuality] = useState<'320' | '256' | '192' | '128'>('320');
  const [embedMetadata, setEmbedMetadata] = useState(true);
  const [embedCover, setEmbedCover] = useState(true);
  const [customFilename, setCustomFilename] = useState('');

  const PRESET_TIERS = [
    {
      format: 'mp3' as const,
      quality: '320' as const,
      title: 'MP3 320 kbps (Studio Master)',
      desc: 'Maximum bit-depth MP3 with embedded high-resolution album cover art & ID3 tags.',
      tag: 'Most Popular',
      tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      format: 'mp3' as const,
      quality: '192' as const,
      title: 'MP3 192 kbps (Standard)',
      desc: 'Balanced high quality, optimal for portable storage and fast downloads.',
      tag: 'Fast & Clean',
      tagColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    },
    {
      format: 'm4a' as const,
      quality: '256' as const,
      title: 'M4A / AAC 256 kbps (Apple Pristine)',
      desc: 'Native Apple AAC container providing ultra-crisp highs and low harmonic distortion.',
      tag: 'Lossless AAC',
      tagColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    },
    {
      format: 'wav' as const,
      quality: '320' as const,
      title: 'Lossless WAV Studio Stream',
      desc: 'Uncompressed raw linear PCM audio stream for professional music production.',
      tag: 'Audiophile',
      tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Quick Studio Presets */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Mastering & Extraction Presets
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESET_TIERS.map((preset, idx) => (
            <div
              key={idx}
              className="glass-card rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-indigo-500/40 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h5 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                    <Music className="w-4 h-4 text-indigo-400" />
                    {preset.title}
                  </h5>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${preset.tagColor}`}>
                    {preset.tag}
                  </span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">{preset.desc}</p>
              </div>

              <button
                onClick={() =>
                  onDownloadAudio(preset.format, preset.quality, embedMetadata, embedCover, customFilename)
                }
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/10 hover:bg-indigo-600 text-white font-semibold text-xs transition-all duration-200 shadow-sm focus:outline-none"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Extract {preset.format.toUpperCase()} ({preset.quality}kbps)</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Transcoder Studio Panel */}
      <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-2 font-mono">
            <Disc className="w-4 h-4 text-indigo-400" />
            Custom Transcoding Control
          </h4>
          <span className="text-[11px] text-white/40">Powered by Mutagen + FFmpeg</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Format Selector */}
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">Audio Container Format</label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['mp3', 'm4a', 'flac', 'wav', 'opus'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setSelectedFormat(fmt)}
                  className={`py-1.5 text-xs font-bold uppercase rounded-lg border transition-all focus:outline-none ${
                    selectedFormat === fmt
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-glow-sm'
                      : 'glass-pill border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Quality Selector */}
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">Target Bitrate</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['320', '256', '192', '128'] as const).map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setSelectedQuality(rate)}
                  className={`py-1.5 text-xs font-mono font-bold rounded-lg border transition-all focus:outline-none ${
                    selectedQuality === rate
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-glow-sm'
                      : 'glass-pill border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  {rate}k
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Optional Custom Filename */}
        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">Custom Base Filename (Optional)</label>
          <input
            type="text"
            value={customFilename}
            onChange={(e) => setCustomFilename(e.target.value)}
            placeholder={media.title || 'audio_track'}
            className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white focus:outline-none"
          />
        </div>

        {/* Checkbox Options */}
        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-white/5 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white select-none">
            <input
              type="checkbox"
              checked={embedCover}
              onChange={(e) => setEmbedCover(e.target.checked)}
              className="w-4 h-4 rounded bg-white/10 border-white/20 text-indigo-500 focus:ring-0"
            />
            <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
            <span>Embed HD Cover Art ({media.thumbnail ? 'HQ Thumbnail' : 'Default'})</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white select-none">
            <input
              type="checkbox"
              checked={embedMetadata}
              onChange={(e) => setEmbedMetadata(e.target.checked)}
              className="w-4 h-4 rounded bg-white/10 border-white/20 text-indigo-500 focus:ring-0"
            />
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Embed ID3 Tags (Artist, Title, Album)</span>
          </label>
        </div>

        {/* CTA Button */}
        <button
          onClick={() =>
            onDownloadAudio(selectedFormat, selectedQuality, embedMetadata, embedCover, customFilename)
          }
          className="btn-chameleon w-full py-2.5 px-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all focus:outline-none"
        >
          <FileAudio className="w-4 h-4" />
          <span>
            Extract & Download {selectedFormat.toUpperCase()} ({selectedQuality} kbps)
          </span>
        </button>
      </div>
    </div>
  );
};
