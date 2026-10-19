import React from 'react';
import {
  Github,
  Linkedin,
  Twitter,
  Globe,
  Heart,
  GraduationCap,
  Shield,
  MessageCircle,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { CREATOR_PROFILE } from '../../config/creator';

interface FooterProps {
  onOpenCreator: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCreator }) => {
  return (
    <footer className="w-full mt-20 border-t border-white/[0.08] bg-obsidian-950/90 backdrop-blur-2xl relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/[0.06]">
          {/* Col 1: Brand & Open Source Mission */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-xl p-0.5 bg-gradient-to-br from-white/15 to-obsidian-900 border border-white/20 flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                <img
                  src="/Neon-Glass-Play-Emblem-Logo.png"
                  alt="CBX-Stream Logo"
                  className="w-full h-full object-contain drop-shadow-[0_2px_6px_rgba(0,242,254,0.4)]"
                />
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
                CBX<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-teal-300">Stream</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-md bg-white/[0.08] text-indigo-300 border border-indigo-500/20">
                Universal Edition
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/60 max-w-md leading-relaxed">
              State-of-the-art media archiving suite engineered for frictionless 4K DASH video downloads,
              studio-grade 320kbps MP3 audio extraction, multi-photo carousel bundling, and precision trimming.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Shield className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>100% Free, Private & Open-Source Universal Media Architecture</span>
            </div>
          </div>

          {/* Col 2: The Architect */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 font-mono">
              The Architect
            </h4>
            <div className="space-y-2">
              <button
                onClick={onOpenCreator}
                className="text-left group flex flex-col focus:outline-none"
              >
                <span className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  {CREATOR_PROFILE.name}
                  <span className="text-xs text-indigo-400 font-mono">(@{CREATOR_PROFILE.handle})</span>
                </span>
                <span className="text-xs text-white/50">{CREATOR_PROFILE.tagline}</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs text-white/60 bg-white/[0.04] p-2.5 rounded-xl border border-white/5">
                <GraduationCap className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{CREATOR_PROFILE.instituteFull}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Connect & Profiles */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 font-mono">
              Connect & Profiles
            </h4>
            <div className="flex flex-col gap-2 text-xs">
              {/* GitHub Profile */}
              <a
                href={CREATOR_PROFILE.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4 text-white/60 shrink-0" />
                <span>GitHub Profile</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-40 ml-auto" />
              </a>

              {/* LinkedIn */}
              <a
                href={CREATOR_PROFILE.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>LinkedIn Profile</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-40 ml-auto" />
              </a>

              {/* Twitter / X */}
              <a
                href={CREATOR_PROFILE.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4 text-sky-300 shrink-0" />
                <span>Twitter / X</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-40 ml-auto" />
              </a>

              {/* Portfolio */}
              <a
                href={CREATOR_PROFILE.socialLinks.portfolio}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Portfolio Website</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-40 ml-auto" />
              </a>

              {/* WhatsApp Contact */}
              <a
                href={CREATOR_PROFILE.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                title="Send a message on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp Contact</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-50 ml-auto" />
              </a>

              {/* Email Contact */}
              <a
                href={CREATOR_PROFILE.socialLinks.email}
                className="flex items-center gap-2 text-indigo-300 hover:text-indigo-200 transition-colors font-medium"
                title="Send an email"
              >
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Email Developer</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-50 ml-auto" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40 text-center sm:text-left">
          <p className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
            Architected with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" /> by{' '}
            <button
              onClick={onOpenCreator}
              className="text-white hover:text-indigo-400 font-semibold underline underline-offset-2 transition-colors focus:outline-none"
            >
              Chathunga Bimsara
            </button>
            .
          </p>
          <div className="flex items-center gap-3 text-[11px] text-white/40 flex-wrap justify-center">
            <span>FastAPI + yt-dlp + FFmpeg</span>
            <span>•</span>
            <span>React 18 + Vite + TypeScript</span>
            <span>•</span>
            <span>Galle, Sri Lanka</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
