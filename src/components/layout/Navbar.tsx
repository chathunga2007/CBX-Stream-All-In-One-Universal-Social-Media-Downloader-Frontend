import React, { useState, useEffect } from 'react';
import { Download, Sparkles, Activity, ShieldCheck, AlertCircle, HardDrive } from 'lucide-react';
import { apiService } from '../../services/api';
import { HealthResponse } from '../../types/media';

interface NavbarProps {
  activeCount: number;
  onOpenQueue: () => void;
  onOpenCreator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCount,
  onOpenQueue,
  onOpenCreator,
}) => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthStatus, setHealthStatus] = useState<'checking' | 'healthy' | 'offline'>('checking');
  const [showHealthTooltip, setShowHealthTooltip] = useState(false);

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

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8 py-3.5 backdrop-blur-xl bg-obsidian-950/70 border-b border-white/[0.06] transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="CBX-Stream Home"
          >
            <div className="relative w-10 h-10 rounded-xl bg-obsidian-900 border border-white/10 flex items-center justify-center overflow-hidden shadow-glow-sm transition-transform group-hover:scale-105">
              <div
                className="absolute inset-0 opacity-40 group-hover:opacity-75 transition-opacity"
                style={{
                  background: 'var(--cbx-gradient, linear-gradient(135deg, #00F2FE 0%, #6366F1 100%))',
                }}
              />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5 relative z-10 text-white drop-shadow"
              >
                <path
                  d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 11v8m0 0l-3-3m3 3l3-3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                  CBX<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-teal-300">Stream</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-md bg-white/[0.08] text-white/70 border border-white/10">
                  v1.0
                </span>
              </div>
              <span className="text-[11px] text-white/50 tracking-wide font-medium hidden sm:inline">
                Universal Social Media Engine
              </span>
            </div>
          </a>
        </div>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Live Backend Health Pill */}
          <div className="relative">
            <button
              onClick={() => setShowHealthTooltip(!showHealthTooltip)}
              onMouseEnter={() => setShowHealthTooltip(true)}
              onMouseLeave={() => setShowHealthTooltip(false)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium glass-pill hover:bg-white/[0.08] transition-colors focus:outline-none"
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

              <span className="hidden md:inline text-white/80">
                {healthStatus === 'healthy' && 'Engine Online'}
                {healthStatus === 'checking' && 'Connecting...'}
                {healthStatus === 'offline' && 'Backend Offline'}
              </span>
            </button>

            {/* Health Diagnostics Tooltip */}
            {showHealthTooltip && (
              <div className="absolute right-0 top-full mt-2 w-64 p-3 rounded-xl glass-panel-accent text-xs text-white/90 z-50 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
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
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>Backend is starting or unreachable at port 8000.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Queue Drawer Button */}
          <button
            onClick={onOpenQueue}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl glass-pill hover:bg-white/[0.08] transition-all text-xs font-medium text-white/90 focus:outline-none"
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

          {/* Architect / Creator Spotlight Button */}
          <button
            onClick={onOpenCreator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-medium transition-all shadow-glow-sm hover:shadow-glow-md focus:outline-none"
            title="Meet the Architect — Chathunga Bimsara"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
            <span className="font-semibold">Architect</span>
          </button>
        </div>
      </div>
    </header>
  );
};
