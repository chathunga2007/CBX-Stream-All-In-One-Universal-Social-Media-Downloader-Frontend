import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Music, Scissors, Archive, RotateCcw } from 'lucide-react';
import { MediaAnalyzeResponse } from '../../types/media';
import { MediaPreviewCard } from './MediaPreviewCard';
import { VideoFormatsTab } from './VideoFormatsTab';
import { AudioFormatsTab } from './AudioFormatsTab';
import { VideoTrimmerTab } from './VideoTrimmerTab';
import { CarouselGalleryTab } from './CarouselGalleryTab';

interface MediaBentoDashboardProps {
  media: MediaAnalyzeResponse;
  onClearMedia: () => void;
  onDownloadVideo: (formatId: string, label: string, customFilename?: string) => void;
  onDownloadAudio: (
    format: 'mp3' | 'm4a' | 'flac' | 'wav' | 'opus',
    quality: '320' | '256' | '192' | '128',
    embedMeta: boolean,
    embedCover: boolean,
    customFilename?: string
  ) => void;
  onTrimMedia: (
    startTime: string,
    endTime: string,
    extractAudio: boolean,
    audioFormat: 'mp3' | 'm4a' | 'wav' | 'flac',
    customFilename?: string
  ) => void;
  onDownloadCarouselZip: (selectedUrls: string[], customFilename?: string) => void;
}

export const MediaBentoDashboard: React.FC<MediaBentoDashboardProps> = ({
  media,
  onClearMedia,
  onDownloadVideo,
  onDownloadAudio,
  onTrimMedia,
  onDownloadCarouselZip,
}) => {
  // If post has carousel items, default to carousel tab, otherwise video
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'trim' | 'carousel'>(
    media.is_carousel && media.carousel_items && media.carousel_items.length > 0
      ? 'carousel'
      : 'video'
  );

  const videoCount = media.video_formats ? media.video_formats.length : media.formats.filter((f) => !f.is_audio_only).length;

  const TABS = [
    {
      id: 'video' as const,
      label: 'Video',
      icon: Film,
      badge: `${videoCount} ${videoCount === 1 ? 'Stream' : 'Streams'}`,
    },
    {
      id: 'audio' as const,
      label: 'Studio Audio',
      icon: Music,
      badge: '320k MP3',
    },
    {
      id: 'trim' as const,
      label: 'Trimmer',
      icon: Scissors,
      badge: 'Clip',
    },
    ...(media.is_carousel || (media.carousel_items && media.carousel_items.length > 0)
      ? [
          {
            id: 'carousel' as const,
            label: 'Album Slides',
            icon: Archive,
            badge: `${media.carousel_items.length} ZIP`,
          },
        ]
      : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-6xl mx-auto px-4 mt-6 sm:mt-8"
    >
      {/* Top Session Bar with Platform Status & Clear Action */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 text-xs">
          <span
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: media.platform.primary_color }}
          />
          <span className="text-white font-bold tracking-wide">Active Stream Extraction</span>
          <span className="text-white/30">•</span>
          <span
            className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold"
            style={{
              backgroundColor: `${media.platform.primary_color}22`,
              color: media.platform.accent_color,
              border: `1px solid ${media.platform.primary_color}44`,
            }}
          >
            {media.platform.name}
          </span>
        </div>

        <button
          onClick={onClearMedia}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-pill hover:bg-rose-500/20 text-white/70 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 text-xs font-semibold transition-all focus:outline-none hover:scale-105"
          title="Dismiss current stream and reset input"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear & New Search</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* Left Column (5 Cols): Media Preview & Metadata Card */}
        <div className="lg:col-span-5 w-full flex flex-col">
          <MediaPreviewCard media={media} />
        </div>

        {/* Right Column (7 Cols): Multi-Action Bento Panel */}
        <div
          className="lg:col-span-7 w-full glass-panel rounded-2xl p-4 sm:p-6 border transition-all duration-300 flex flex-col shadow-glass"
          style={{
            borderColor: `${media.platform.primary_color}33`,
            boxShadow: `0 12px 35px -10px rgba(0,0,0,0.7), 0 0 25px -8px ${media.platform.glow_color}`,
          }}
        >
          {/* Action Tabs Header */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-obsidian-900/95 border border-white/10 overflow-x-auto mb-5 scrollbar-none">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-3 sm:px-3.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap focus:outline-none flex-1 ${
                    isActive ? 'text-white shadow-md' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeBentoTab"
                      className="absolute inset-0 rounded-lg shadow-sm"
                      style={{
                        background: `linear-gradient(135deg, ${media.platform.primary_color}CC 0%, ${media.platform.secondary_color}CC 100%)`,
                        border: `1px solid ${media.platform.primary_color}`,
                      }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10 shrink-0" />
                  <span className="relative z-10">{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`relative z-10 text-[10px] font-mono px-1.5 py-0.2 rounded-md hidden sm:inline ${
                        isActive ? 'bg-white/20 text-white font-bold' : 'bg-white/5 text-white/45'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'video' && (
                <motion.div
                  key="video"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  <VideoFormatsTab
                    media={media}
                    onDownload={onDownloadVideo}
                    onDownloadAudio={onDownloadAudio}
                  />
                </motion.div>
              )}

              {activeTab === 'audio' && (
                <motion.div
                  key="audio"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  <AudioFormatsTab media={media} onDownloadAudio={onDownloadAudio} />
                </motion.div>
              )}

              {activeTab === 'trim' && (
                <motion.div
                  key="trim"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  <VideoTrimmerTab media={media} onTrim={onTrimMedia} />
                </motion.div>
              )}

              {activeTab === 'carousel' && (
                <motion.div
                  key="carousel"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  <CarouselGalleryTab media={media} onDownloadZip={onDownloadCarouselZip} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
