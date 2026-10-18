import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Linkedin, Twitter, Globe, Mail, GraduationCap, Award, Quote } from 'lucide-react';
import { CREATOR_PROFILE } from '../../config/creator';

interface CreatorSpotlightModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatorSpotlightModal: React.FC<CreatorSpotlightModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
            className="relative w-full max-w-2xl rounded-3xl glass-panel-accent border border-white/15 p-6 sm:p-8 shadow-2xl z-10 my-8 overflow-hidden"
          >
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Mesh Corner Accents */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />

            {/* Header: Avatar, Name & Bio */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left mb-6">
              {/* Profile Avatar with Neon Ring */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-2xl p-1 bg-gradient-to-tr from-indigo-500 via-sky-400 to-teal-300 shadow-glow-md">
                  <div className="w-full h-full rounded-[14px] bg-obsidian-900 overflow-hidden flex items-center justify-center">
                    <span className="font-heading font-black text-3xl text-transparent bg-clip-text bg-gradient-to-tr from-indigo-300 to-sky-200">
                      CBX
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-indigo-600 text-[10px] font-bold text-white border border-indigo-400 shadow">
                  PRO
                </div>
              </div>

              {/* Identity & Title */}
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-heading font-black text-2xl text-white tracking-tight">
                    {CREATOR_PROFILE.name}
                  </h3>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-white/10 text-indigo-300 border border-white/10">
                    @{CREATOR_PROFILE.handle}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-indigo-300 font-medium">
                  {CREATOR_PROFILE.tagline}
                </p>

                {/* Institution Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 font-medium mt-1">
                  <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
                  <span>{CREATOR_PROFILE.instituteFull}</span>
                </div>
              </div>
            </div>

            {/* Bio Narrative */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-white/70 leading-relaxed space-y-2 mb-6">
              <p>{CREATOR_PROFILE.bio}</p>

              {/* Manifesto Quote */}
              <div className="pt-2 border-t border-white/5 flex items-start gap-2 text-indigo-200/90 italic">
                <Quote className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>"{CREATOR_PROFILE.manifesto}"</span>
              </div>
            </div>

            {/* Engineering Badges */}
            <div className="space-y-2 mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 font-mono flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Architect Skillset & Competencies
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CREATOR_PROFILE.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg glass-pill text-white/80 border border-white/10"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* System Performance Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
              {CREATOR_PROFILE.stats.map((stat, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <div className="font-heading font-black text-lg text-white font-mono">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Social & Contact Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <a
                  href={CREATOR_PROFILE.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl glass-pill hover:bg-white/10 text-white/80 hover:text-white transition-all hover:scale-105"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={CREATOR_PROFILE.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl glass-pill hover:bg-white/10 text-sky-400 hover:text-sky-300 transition-all hover:scale-105"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={CREATOR_PROFILE.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl glass-pill hover:bg-white/10 text-sky-300 hover:text-sky-200 transition-all hover:scale-105"
                  title="Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href={CREATOR_PROFILE.socialLinks.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl glass-pill hover:bg-white/10 text-emerald-400 hover:text-emerald-300 transition-all hover:scale-105"
                  title="Portfolio Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </div>

              <a
                href={`mailto:${CREATOR_PROFILE.socialLinks.email}`}
                className="btn-chameleon px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-2 transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Architect</span>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
