import React from 'react';
import { motion } from 'framer-motion';

/**
 * Ultra-Premium Chameleon Ambient Background
 * Features responsive dynamic RGB aurora orbs, subtle cyber grid,
 * and glowing mesh gradients that transition with the selected platform.
 */
export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-obsidian-950 select-none">
      {/* Dynamic Aurora Mesh Blob 1 - Top Left (Chameleon Primary) */}
      <motion.div
        animate={{
          x: [0, 70, -50, 0],
          y: [0, -60, 50, 0],
          scale: [1, 1.18, 0.92, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-[20%] -left-[15%] w-[65vw] h-[65vw] rounded-full opacity-35 blur-[140px] transition-colors duration-700"
        style={{
          background: 'radial-gradient(circle, var(--cbx-primary, #6366F1) 0%, transparent 70%)',
        }}
      />

      {/* Dynamic Aurora Mesh Blob 2 - Top Right (Chameleon Secondary) */}
      <motion.div
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 70, -50, 0],
          scale: [1, 1.15, 0.94, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-[15%] -right-[20%] w-[65vw] h-[65vw] rounded-full opacity-30 blur-[150px] transition-colors duration-700"
        style={{
          background: 'radial-gradient(circle, var(--cbx-secondary, #4F46E5) 0%, transparent 70%)',
        }}
      />

      {/* Dynamic Aurora Mesh Blob 3 - Center Bottom Accent (Chameleon Accent) */}
      <motion.div
        animate={{
          x: [0, 50, -60, 0],
          y: [0, -50, 40, 0],
          scale: [1, 1.25, 0.88, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[40%] left-[20%] w-[55vw] h-[55vw] rounded-full opacity-25 blur-[160px] transition-colors duration-700"
        style={{
          background: 'radial-gradient(circle, var(--cbx-accent, #818CF8) 0%, transparent 65%)',
        }}
      />

      {/* Dynamic RGB Rainbow Flow Orb - Bottom Right for Subtle Chromatic Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.12, 0.22, 0.12],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-[20%] right-[10%] w-[50vw] h-[50vw] rounded-full blur-[160px]"
        style={{
          background: 'radial-gradient(circle, #00f2fe 0%, #7928ca 50%, transparent 75%)',
        }}
      />

      {/* Floating Star Dust Micro-Particles */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-[12%] left-[18%] w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <div className="absolute top-[28%] right-[22%] w-1 h-1 rounded-full bg-indigo-300 animate-ping" />
        <div className="absolute top-[65%] left-[8%] w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse" />
        <div className="absolute top-[82%] right-[15%] w-1 h-1 rounded-full bg-pink-300 animate-pulse" />
        <div className="absolute top-[45%] right-[35%] w-1 h-1 rounded-full bg-teal-300 animate-ping" />
      </div>

      {/* Cyber Grid Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Radial Edge Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 35%, rgba(3, 5, 9, 0.8) 100%)',
        }}
      />
    </div>
  );
};
