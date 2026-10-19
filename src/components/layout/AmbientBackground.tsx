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
      {/* ============================================================== */}
      {/* DESKTOP (sm and above): Dynamic Framer-Motion Physics with GPU acceleration */}
      {/* ============================================================== */}
      <div className="hidden sm:block absolute inset-0">
        {/* Dynamic Aurora Mesh Blob 1 - Top Left */}
        <motion.div
          animate={{
            x: [0, 50, -40, 0],
            y: [0, -40, 40, 0],
            scale: [1, 1.12, 0.95, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-[20%] -left-[15%] w-[60vw] h-[60vw] rounded-full opacity-35 blur-[120px] transition-colors duration-700"
          style={{
            background: 'radial-gradient(circle, var(--cbx-primary, #6366F1) 0%, transparent 70%)',
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        />

        {/* Dynamic Aurora Mesh Blob 2 - Top Right */}
        <motion.div
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 50, -40, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-[15%] -right-[20%] w-[60vw] h-[60vw] rounded-full opacity-30 blur-[130px] transition-colors duration-700"
          style={{
            background: 'radial-gradient(circle, var(--cbx-secondary, #4F46E5) 0%, transparent 70%)',
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        />

        {/* Dynamic Aurora Mesh Blob 3 - Center Bottom Accent */}
        <motion.div
          animate={{
            x: [0, 40, -40, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.15, 0.92, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[40%] left-[20%] w-[50vw] h-[50vw] rounded-full opacity-25 blur-[140px] transition-colors duration-700"
          style={{
            background: 'radial-gradient(circle, var(--cbx-accent, #818CF8) 0%, transparent 65%)',
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        />

        {/* Dynamic RGB Rainbow Flow Orb - Bottom Right */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.12, 0.2, 0.12],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-[20%] right-[10%] w-[45vw] h-[45vw] rounded-full blur-[140px]"
          style={{
            background: 'radial-gradient(circle, #00f2fe 0%, #7928ca 50%, transparent 75%)',
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        />

        {/* Floating Star Dust Micro-Particles (Desktop only) */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-[12%] left-[18%] w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <div className="absolute top-[28%] right-[22%] w-1 h-1 rounded-full bg-indigo-300 animate-ping" />
          <div className="absolute top-[65%] left-[8%] w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse" />
          <div className="absolute top-[82%] right-[15%] w-1 h-1 rounded-full bg-pink-300 animate-pulse" />
          <div className="absolute top-[45%] right-[35%] w-1 h-1 rounded-full bg-teal-300 animate-ping" />
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE OPTIMIZED (< sm, iPhone 7 Plus / Android): 60FPS Silky */}
      {/* Zero JS animation thread overhead, hardware-accelerated static ambient glow */}
      {/* ============================================================== */}
      <div className="block sm:hidden absolute inset-0">
        <div
          className="absolute -top-[10%] -left-[10%] w-[90vw] h-[75vw] rounded-full opacity-35 blur-[50px] transition-colors duration-700"
          style={{
            background: 'radial-gradient(circle, var(--cbx-primary, #6366F1) 0%, transparent 70%)',
            transform: 'translateZ(0)',
          }}
        />
        <div
          className="absolute top-[35%] -right-[15%] w-[85vw] h-[70vw] rounded-full opacity-25 blur-[55px] transition-colors duration-700"
          style={{
            background: 'radial-gradient(circle, var(--cbx-accent, #818CF8) 0%, transparent 65%)',
            transform: 'translateZ(0)',
          }}
        />
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
