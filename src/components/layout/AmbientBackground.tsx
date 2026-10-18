import React from 'react';
import { motion } from 'framer-motion';

/**
 * High-performance ambient background featuring deep obsidian canvas,
 * dynamic Chameleon Aurora blobs that respond to CSS variables, and a fine grid texture.
 */
export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-obsidian-950 select-none">
      {/* Dynamic Aurora Mesh Blob 1 - Top Left */}
      <motion.div
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -50, 40, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full opacity-30 blur-[130px]"
        style={{
          background: 'radial-gradient(circle, var(--cbx-primary, #6366F1) 0%, transparent 70%)',
        }}
      />

      {/* Dynamic Aurora Mesh Blob 2 - Top Right */}
      <motion.div
        animate={{
          x: [0, -70, 50, 0],
          y: [0, 60, -40, 0],
          scale: [1, 1.12, 0.95, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-[10%] -right-[15%] w-[60vw] h-[60vw] rounded-full opacity-25 blur-[140px]"
        style={{
          background: 'radial-gradient(circle, var(--cbx-secondary, #4F46E5) 0%, transparent 70%)',
        }}
      />

      {/* Dynamic Aurora Mesh Blob 3 - Center Bottom Accent */}
      <motion.div
        animate={{
          x: [0, 40, -50, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.2, 0.88, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[45%] left-[25%] w-[50vw] h-[50vw] rounded-full opacity-20 blur-[150px]"
        style={{
          background: 'radial-gradient(circle, var(--cbx-accent, #818CF8) 0%, transparent 65%)',
        }}
      />

      {/* Cyber Grid Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Vignette edge shading */}
      <div className="absolute inset-0 bg-radial-vignette opacity-60" />
    </div>
  );
};
