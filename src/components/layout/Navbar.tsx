import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Sparkles,
  Activity,
  ShieldCheck,
  AlertCircle,
  HardDrive,
  Palette,
  Check,
} from 'lucide-react';
import { apiService } from '../../services/api';
import { HealthResponse } from '../../types/media';

interface NavbarProps {
  activeCount: number;
  currentThemeId: string;
  onSelectTheme: (themeId: string) => void;
  onOpenQueue: () => void;
  onOpenCreator: () => void;
}

const THEME_OPTIONS = [
  { id: 'generic', name: 'Universal Aurora', color: '#6366F1', glow: 'rgba(99, 102, 241, 0.5)' },
  { id: 'youtube', name: 'YouTube Crimson', color: '#FF0000', glow: 'rgba(255, 0, 0, 0.5)' },
  { id: 'tiktok', name: 'TikTok Cyber Neon', color: '#00F2FE', glow: 'rgba(0, 242, 254, 0.5)' },
  { id: 'instagram', name: 'Instagram Sunset', color: '#E1306C', glow: 'rgba(225, 48, 108, 0.5)' },
  { id: 'spotify', name: 'Spotify Emerald', color: '#1DB954', glow: 'rgba(29, 185, 84, 0.5)' },
  { id: 'twitch', name: 'Twitch Violet', color: '#9146FF', glow: 'rgba(145, 70, 255, 0.5)' },
  { id: 'twitter', name: 'Twitter / X Azure', color: '#1DA1F2', glow: 'rgba(29, 161, 242, 0.5)' },
  { id: 'facebook', name: 'Facebook Royal', color: '#1877F2', glow: 'rgba(24, 119, 242, 0.5)' },
  { id: 'soundcloud', name: 'SoundCloud Amber', color: '#FF5500', glow: 'rgba(255, 85, 0, 0.5)' },
  { id: 'pinterest', name: 'Pinterest Scarlet', color: '#E60023', glow: 'rgba(230, 0, 35, 0.5)' },
  { id: 'reddit', name: 'Reddit Flame', color: '#FF4500', glow: 'rgba(255, 69, 0, 0.5)' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeCount,
  currentThemeId,
  onSelectTheme,
  onOpenQueue,
  onOpenCreator,
}) => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthStatus, setHealthStatus] = useState<'checking' | 'healthy' | 'offline'>('checking');
  const [showHealthTooltip, setShowHealthTooltip] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Close theme menu on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchHealth = async () => {
      try {
        const data = await apiService.getHealth();
        if (isMounted) {
          setHealth(data);
          setHealthStatus(data.status === 'healthy' ? 'healthy' : 'checking');
        }
      } catch {
        if (isMounted) {
          setHealthStatus('offline');
        }
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const activeThemeObj = THEME_OPTIONS.find((t) => t.id === currentThemeId) || THEME_OPTIONS[0];

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 backdrop-blur-2xl bg-obsidian-950/75 border-b border-white/[0.07] transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <a
            href="/"
            className="flex items-center gap-2.5 sm:gap-3.5 group focus:outline-none"
            aria-label="CBX-Stream Home"
          >
            {/* Glowing Neon Emblem Logo */}
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-2xl p-1 bg-gradient-to-br from-white/15 via-obsidian-900/90 to-black/80 border border-white/20 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.35)] group-hover:shadow-[0_0_28px_rgba(0,242,254,0.6)] transition-all duration-300 group-hover:scale-105 shrink-0">
              {/* Dynamic Chameleon Gradient Ambient Glow */}
              <div
                className="absolute inset-0 opacity-40 group-hover:opacity-80 transition-opacity duration-300 blur-sm pointer-events-none"
                style={{
                  background: 'var(--cbx-gradient, linear-gradient(135deg, #00F2FE 0%, #6366F1 100%))',
                }}
              />
              <img
                src="/Neon-Glass-Play-Emblem-Logo.png"
                alt="CBX-Stream Emblem Logo"
                className="w-full h-full object-contain relative z-10 drop-shadow-[0_2px_8px_rgba(0,242,254,0.45)] group-hover:rotate-3 transition-transform duration-300"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-heading font-black text-lg sm:text-xl tracking-tight text-white">
                  CBX<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-teal-300 drop-shadow-[0_0_12px_rgba(99,102,241,0.4)]">Stream</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase rounded-md bg-gradient-to-r from-indigo-500/20 to-sky-500/20 text-sky-300 border border-sky-400/30 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                  PRO
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-white/55 tracking-wide font-medium hidden md:flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                Universal Social Media Engine
              </span>
            </div>
          </a>
        </div>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Dynamic Theme Switcher Dropdown */}
          <div className="relative" ref={themeMenuRef}>
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl glass-pill hover:bg-white/[0.09] transition-all text-xs font-semibold focus:outline-none"
              style={{
                borderColor: `${activeThemeObj.color}66`,
              }}
              title={`Active Theme: ${activeThemeObj.name}`}
            >
              <Palette className="w-3.5 h-3.5 shrink-0" style={{ color: activeThemeObj.color }} />
              <span className="hidden sm:inline font-mono text-[11px]">{activeThemeObj.name.split(' ')[0]}</span>
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: activeThemeObj.color }}
              />
            </button>

            {isThemeMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-obsidian-900/95 border border-white/15 text-xs text-white/90 z-50 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-2 border-b border-white/10 flex items-center justify-between text-white/60 font-mono text-[10px] uppercase font-bold tracking-wider">
                  <span>Chameleon RGB Themes</span>
                  <span className="text-white/40">{THEME_OPTIONS.length} Presets</span>
                </div>

                <div className="max-h-64 overflow-y-auto p-1 space-y-1">
                  {THEME_OPTIONS.map((theme) => {
                    const isCurrent = currentThemeId === theme.id || (currentThemeId === '' && theme.id === 'generic');

                    return (
                      <button
                        key={theme.id}
                        onClick={() => {
                          onSelectTheme(theme.id);
                          setIsThemeMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                          isCurrent
                            ? 'bg-white/10 text-white font-bold border border-white/10'
                            : 'hover:bg-white/5 text-white/70 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                            style={{
                              backgroundColor: theme.color,
                              boxShadow: isCurrent ? `0 0 8px ${theme.color}` : 'none',
                            }}
                          />
                          <span>{theme.name}</span>
                        </div>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Live Backend Health Pill */}
          <div className="relative">
            <button
              onClick={() => setShowHealthTooltip(!showHealthTooltip)}
              onMouseEnter={() => setShowHealthTooltip(true)}
              onMouseLeave={() => setShowHealthTooltip(false)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium glass-pill hover:bg-white/[0.08] transition-colors focus:outline-none"
              title="Backend Engine Health Status"
            >
              <span className="relative flex h-2 w-2">
                {healthStatus === 'healthy' && (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </>
                )}
                {healthStatus === 'checking' && (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                )}
                {healthStatus === 'offline' && (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                )}
              </span>

              <span className="hidden lg:inline text-white/80">
                {healthStatus === 'healthy' && 'Engine Online'}
                {healthStatus === 'checking' && 'Connecting...'}
                {healthStatus === 'offline' && 'Backend Offline'}
              </span>
            </button>

            {/* Health Diagnostics Tooltip */}
            {showHealthTooltip && (
              <div className="absolute right-0 top-full mt-2 w-64 p-3 rounded-2xl bg-obsidian-900/95 border border-white/15 text-xs text-white/90 z-50 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                  <span className="font-semibold flex items-center gap-1.5 text-white">
                    <Activity className="w-3.5 h-3.5 text-indigo-400" />
                    FastAPI Engine
                  </span>
                  <span
                    className={`font-semibold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded ${
                      healthStatus === 'healthy'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {healthStatus}
                  </span>
                </div>

                {health ? (
                  <div className="space-y-1.5 text-white/70">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" /> FFmpeg DASH:
                      </span>
                      <span className="font-mono text-emerald-400 font-medium">
                        {health.ffmpeg_available ? 'Available' : 'Missing'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3 text-sky-400" /> Disk Free:
                      </span>
                      <span className="font-mono text-white/90 font-medium">
                        {health.disk_free_gb} GB / {health.disk_total_gb} GB
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Tasks:</span>
                      <span className="font-mono text-white/90 font-medium">{health.active_tasks}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-white/40 pt-1 border-t border-white/5">
                      <span>Python {health.python_version}</span>
                      <span>v{health.version}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-white/60 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Backend is starting or unreachable at port 8000.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Queue Drawer Button */}
          <button
            onClick={onOpenQueue}
            className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl glass-pill hover:bg-white/[0.08] transition-all text-xs font-medium text-white/90 focus:outline-none"
            aria-label="Open Download Queue"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Downloads</span>
            {activeCount > 0 && (
              <span className="flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-[10px] font-bold bg-indigo-500 text-white shadow-glow-sm animate-pulse">
                {activeCount}
              </span>
            )}
          </button>

          {/* Architect Spotlight Button */}
          <button
            onClick={onOpenCreator}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold transition-all shadow-glow-sm hover:shadow-glow-md focus:outline-none"
            title="Meet the Architect — Chathunga Bimsara"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow shrink-0" />
            <span className="hidden sm:inline">Architect</span>
          </button>
        </div>
      </div>
    </header>
  );
};
