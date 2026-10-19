import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck } from 'lucide-react';
import { FEATURED_PLATFORMS } from '../../config/platforms';

interface HeroSectionProps {
  selectedPlatformId?: string | null;
  onSelectPlatform: (platformId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedPlatformId,
  onSelectPlatform,
}) => {
  return (
    <section className="relative pt-4 sm:pt-10 pb-4 sm:pb-6 text-center max-w-4xl mx-auto px-3 sm:px-4">
      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-heading font-black text-3xl sm:text-5xl md:text-6xl tracking-tight text-white leading-[1.15] sm:leading-[1.12]"
      >
        Universal Archiving &{' '}
        <span
          className="text-transparent bg-clip-text transition-all duration-500"
          style={{
            backgroundImage:
              'var(--cbx-gradient, linear-gradient(135deg, #00F2FE 0%, #6366F1 50%, #EC4899 100%))',
          }}
        >
          Social Media Downloader
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-3 sm:mt-4 text-xs sm:text-base md:text-lg text-white/60 max-w-2xl mx-auto font-normal leading-relaxed px-1"
      >
        Download <span className="text-white font-medium">4K / 8K HDR</span> videos, extract lossless{' '}
        <span className="text-white font-medium">320kbps MP3s</span> with cover art, bundle multi-photo{' '}
        <span className="text-white font-medium">carousels into ZIP</span>, and clip custom timestamp ranges.
      </motion.p>

      {/* Feature Highlights Mini-Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-6 text-[11px] sm:text-xs text-white/50"
      >
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Ultra-Fast DASH Merging
        </span>
        <span>•</span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> No Watermarks / No Ads
        </span>
        <span>•</span>
        <span>Zero Lossy Compression</span>
      </motion.div>

      {/* Interactive Platform Badges */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-5 sm:mt-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-3xl mx-auto"
      >
        <span className="text-xs text-white/40 font-medium mr-1">Supported:</span>
        {FEATURED_PLATFORMS.map((plat) => {
          const isSelected = selectedPlatformId === plat.id;
          return (
            <button
              key={plat.id}
              onClick={() => onSelectPlatform(plat.id)}
              className={`group flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-medium transition-all active:scale-95 sm:hover:scale-105 focus:outline-none ${
                isSelected
                  ? 'glass-pill-selected'
                  : 'glass-pill hover:bg-white/[0.08]'
              }`}
              style={
                isSelected
                  ? {
                      borderColor: plat.color,
                      boxShadow: `0 0 16px -2px ${plat.color}60`,
                    }
                  : undefined
              }
              title={`Select ${plat.name}`}
            >
              <span
                className="w-2 h-2 rounded-full transition-transform group-hover:scale-125"
                style={{ backgroundColor: plat.color }}
              />
              <span
                className={`transition-colors ${
                  isSelected ? 'text-white font-semibold' : 'text-white/70 group-hover:text-white'
                }`}
              >
                {plat.name}
              </span>
            </button>
          );
        })}
      </motion.div>
    </section>
  );
};
