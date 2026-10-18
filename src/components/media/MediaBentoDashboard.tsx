import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Music, Scissors, Archive } from 'lucide-react';
import { MediaAnalyzeResponse } from '../../types/media';
import { MediaPreviewCard } from './MediaPreviewCard';
import { VideoFormatsTab } from './VideoFormatsTab';
import { AudioFormatsTab } from './AudioFormatsTab';
import { VideoTrimmerTab } from './VideoTrimmerTab';
import { CarouselGalleryTab } from './CarouselGalleryTab';

interface MediaBentoDashboardProps {
  media: MediaAnalyzeResponse;
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

  const TABS = [
    {
      id: 'video' as const,
      label: 'Video Streams',
      icon: Film,
      badge: media.video_formats ? `${media.video_formats.length} Quality` : 'HD/4K',
    },
    {
      id: 'audio' as const,
      label: 'Studio Audio',
      icon: Music,
      badge: '320kbps MP3',
    },
    {
      id: 'trim' as const,
      label: 'Precision Trimmer',
      icon: Scissors,
      badge: 'Clip Range',
    },
    ...(media.is_carousel || (media.carousel_items && media.carousel_items.length > 0)
      ? [
          {
            id: 'carousel' as const,
            label: 'Carousel Album',
            icon: Archive,
            badge: `${media.carousel_items.length} Slides ZIP`,
          },
        ]
      : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-6xl mx-auto px-4 mt-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 Cols): Media Preview & Metadata Card */}
        <div className="lg:col-span-5 w-full">
          <MediaPreviewCard media={media} />
        </div>

        {/* Right Column (7 Cols): Multi-Action Bento Panel */}
        <div className="lg:col-span-7 w-full glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 shadow-glass flex flex-col min-h-[500px]">
          {/* Action Tabs Header */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-obsidian-900/90 border border-white/5 overflow-x-auto mb-6">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 py-2.5 px-3.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap focus:outline-none ${
                    isActive ? 'text-white shadow-md' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeBentoTab"
                      className="absolute inset-0 rounded-lg bg-indigo-600/80 border border-indigo-400/40"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`relative z-10 text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-white/50'
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
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <VideoFormatsTab media={media} onDownload={onDownloadVideo} />
                </motion.div>
              )}

              {activeTab === 'audio' && (
                <motion.div
                  key="audio"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <AudioFormatsTab media={media} onDownloadAudio={onDownloadAudio} />
                </motion.div>
              )}

              {activeTab === 'trim' && (
                <motion.div
                  key="trim"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <VideoTrimmerTab media={media} onTrim={onTrimMedia} />
                </motion.div>
              )}

              {activeTab === 'carousel' && (
                <motion.div
                  key="carousel"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
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
