import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Mail,
  GraduationCap,
  Award,
  Quote,
  MessageCircle,
  ExternalLink,
  FolderGit2,
  MapPin,
} from 'lucide-react';
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container with Dynamic Glow Border */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0.15 }}
            className="relative w-full max-w-3xl rounded-3xl bg-obsidian-900/95 border border-white/15 p-5 sm:p-8 shadow-2xl z-10 my-6 sm:my-8 overflow-y-auto max-h-[92vh] backdrop-blur-2xl"
            style={{
              boxShadow:
                '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 45px -10px var(--cbx-glow, rgba(99, 102, 241, 0.45))',
            }}
          >
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors focus:outline-none z-20"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Corner Aurora Accents */}
            <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-indigo-500/25 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

            {/* Header: Avatar, Name, Title & Institution */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left mb-6 relative z-10">
              {/* Profile Avatar with Neon Ring */}
              <div className="relative group shrink-0">
                <div className="w-22 h-22 sm:w-28 sm:h-28 rounded-2xl p-1 bg-gradient-to-tr from-pink-500 via-indigo-500 to-cyan-400 shadow-glow-md">
                  <div className="w-full h-full rounded-[14px] bg-obsidian-900 overflow-hidden flex items-center justify-center relative">
                    <img
                      src={CREATOR_PROFILE.avatarUrl}
                      alt={CREATOR_PROFILE.name}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center font-heading font-black text-2xl text-transparent bg-clip-text bg-gradient-to-tr from-indigo-300 to-sky-200 pointer-events-none">
                      CBX
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-pink-600 text-[10px] font-extrabold text-white border border-white/20 shadow-lg">
                  ARCHITECT
                </div>
              </div>

              {/* Identity & Title Details */}
              <div className="space-y-1.5 sm:space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
                    {CREATOR_PROFILE.name}
                  </h3>
                  <a
                    href={CREATOR_PROFILE.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-white/10 text-indigo-300 border border-white/10 hover:border-indigo-400 transition-colors"
                  >
                    @{CREATOR_PROFILE.handle}
                  </a>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Open for Projects
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-indigo-300 font-medium">
                  {CREATOR_PROFILE.tagline}
                </p>

                {/* Institution & Location Pills */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 font-medium">
                    <GraduationCap className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>{CREATOR_PROFILE.instituteFull}</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white/70">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{CREATOR_PROFILE.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Narrative & Manifesto */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-white/75 leading-relaxed space-y-2 mb-6">
              <p>{CREATOR_PROFILE.bio}</p>

              {/* Manifesto Quote */}
              <div className="pt-2 border-t border-white/5 flex items-start gap-2 text-indigo-200/90 italic">
                <Quote className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>"{CREATOR_PROFILE.manifesto}"</span>
              </div>
            </div>

            {/* Direct WhatsApp Callout Banner (Clean, no raw phone number text) */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3.5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-heading font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                    Direct Contact & WhatsApp
                    <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.2 bg-emerald-500/20 rounded">
                      24/7 Available
                    </span>
                  </h5>
                  <p className="text-[11px] text-white/60">
                    Connect directly for freelance development, system architecture, or custom inquiries.
                  </p>
                </div>
              </div>

              <a
                href={CREATOR_PROFILE.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-xs whitespace-nowrap shrink-0 shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Verified Projects & Repositories Showcase (Includes Frontend & Backend) */}
            <div className="space-y-2.5 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 font-mono flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
                  Verified Projects & Architecture Portfolio
                </span>
                <a
                  href={CREATOR_PROFILE.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>All Repos</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[240px] overflow-y-auto pr-1">
                {CREATOR_PROFILE.projects.map((proj, idx) => (
                  <a
                    key={idx}
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-white/[0.025] hover:bg-white/[0.06] border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1.5">
                        <h6 className="font-heading font-bold text-xs text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                          {proj.title}
                        </h6>
                        {proj.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                            {proj.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-white/55 mt-1 line-clamp-2 leading-snug">
                        {proj.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5 text-[10px]">
                      <div className="flex items-center gap-1 text-white/40">
                        {proj.tags.slice(0, 3).map((t, tIdx) => (
                          <span key={tIdx} className="bg-white/5 px-1 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="flex items-center gap-1 text-indigo-400 group-hover:translate-x-0.5 transition-transform font-medium">
                        View Repo <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Engineering Badges */}
            <div className="space-y-2 mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 font-mono flex items-center gap-1.5">
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

            {/* Performance Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
              {CREATOR_PROFILE.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center"
                >
                  <div className="font-heading font-black text-sm sm:text-base text-white font-mono">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Social & Contact Actions Bottom Bar (No exposed phone number or raw email string) */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <a
                  href={CREATOR_PROFILE.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl glass-pill hover:bg-white/10 text-white/80 hover:text-white transition-all hover:scale-105"
                  title="GitHub Profile (chathunga2007)"
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
                  title="Twitter / X (Chathunga2007)"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href={CREATOR_PROFILE.socialLinks.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl glass-pill hover:bg-white/10 text-emerald-400 hover:text-emerald-300 transition-all hover:scale-105"
                  title="Official Developer Portfolio"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <a
                  href={CREATOR_PROFILE.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl glass-pill hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 transition-all hover:scale-105"
                  title="Chat on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={CREATOR_PROFILE.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href={CREATOR_PROFILE.socialLinks.email}
                  className="btn-chameleon px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Architect</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
