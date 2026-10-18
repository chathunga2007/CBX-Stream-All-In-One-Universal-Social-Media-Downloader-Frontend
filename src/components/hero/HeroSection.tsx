import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { FEATURED_PLATFORMS } from '../../config/platforms';

interface HeroSectionProps {
  onSelectPlatformSample: (sampleUrl: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectPlatformSample }) => {
  return (
    <section className="relative pt-10 pb-6 text-center max-w-4xl mx-auto px-4">
      {/* Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-white/10 text-xs font-semibold text-white/80 shadow-glow-sm mb-6"
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>Chameleon Glass UI & Real-Time DASH Transcoding</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-heading font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white leading-[1.12]"
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
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-4 text-base sm:text-lg text-white/60 max-w-2xl mx-auto font-normal leading-relaxed"
      >
        Download <span className="text-white font-medium">4K / 8K HDR</span> videos, extract lossless{' '}
        <span className="text-white font-medium">320kbps MP3s</span> with cover art, bundle multi-photo{' '}
        <span className="text-white font-medium">carousels into ZIP</span>, and clip custom timestamp ranges.
      </motion.p>

      {/* Feature Highlights Mini-Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-white/50"
      >
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" /> Ultra-Fast DASH Merging
        </span>
        <span>•</span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> No Watermarks / No Ads
        </span>
        <span>•</span>
        <span>Zero Lossy Compression</span>
      </motion.div>

      {/* Interactive Platform Badges */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto"
      >
        <span className="text-xs text-white/40 font-medium mr-1">Supported:</span>
        {FEATURED_PLATFORMS.map((plat) => (
          <button
            key={plat.id}
            onClick={() => onSelectPlatformSample(plat.sample)}
            className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium glass-pill hover:bg-white/[0.08] transition-all hover:scale-105 focus:outline-none"
            title={`Click to test sample ${plat.name} link`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: plat.color }}
            />
            <span className="text-white/70 group-hover:text-white transition-colors">
              {plat.name}
            </span>
          </button>
        ))}
      </motion.div>
    </section>
  );
};
