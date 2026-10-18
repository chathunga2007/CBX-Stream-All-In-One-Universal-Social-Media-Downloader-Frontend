import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, History, Trash2, CheckCircle2 } from 'lucide-react';
import { ActiveDownloadItem } from '../../types/media';
import { ActiveDownloadCard } from './ActiveDownloadCard';

interface DownloadQueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeDownloads: ActiveDownloadItem[];
  historyDownloads: ActiveDownloadItem[];
  onRemoveTask: (taskId: string) => void;
  onClearHistory: () => void;
}

export const DownloadQueueDrawer: React.FC<DownloadQueueDrawerProps> = ({
  isOpen,
  onClose,
  activeDownloads,
  historyDownloads,
  onRemoveTask,
  onClearHistory,
}) => {
  const [tab, setTab] = useState<'active' | 'history'>('active');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-over Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-obsidian-900/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Download className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-base text-white">Download Center</h3>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs: Active Tasks vs History */}
            <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTab('active')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus:outline-none ${
                    tab === 'active'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-white/60 hover:text-white glass-pill'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Active Tasks</span>
                  {activeDownloads.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono">
                      {activeDownloads.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setTab('history')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus:outline-none ${
                    tab === 'history'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-white/60 hover:text-white glass-pill'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>History</span>
                  {historyDownloads.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono">
                      {historyDownloads.length}
                    </span>
                  )}
                </button>
              </div>

              {tab === 'history' && historyDownloads.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="flex items-center gap-1 text-[11px] text-white/40 hover:text-rose-400 transition-colors"
                  title="Clear history"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Drawer Body Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {tab === 'active' && (
                <>
                  {activeDownloads.length === 0 ? (
                    <div className="py-20 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mx-auto text-white/30">
                        <Download className="w-6 h-6" />
                      </div>
                      <h4 className="font-heading font-semibold text-sm text-white/80">
                        No Active Downloads
                      </h4>
                      <p className="text-xs text-white/40 max-w-xs mx-auto">
                        Analyze any video or audio stream and pick a format to start instant live downloading.
                      </p>
                    </div>
                  ) : (
                    activeDownloads.map((item) => (
                      <ActiveDownloadCard
                        key={item.taskId}
                        item={item}
                        onRemove={onRemoveTask}
                      />
                    ))
                  )}
                </>
              )}

              {tab === 'history' && (
                <>
                  {historyDownloads.length === 0 ? (
                    <div className="py-20 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mx-auto text-white/30">
                        <History className="w-6 h-6" />
                      </div>
                      <h4 className="font-heading font-semibold text-sm text-white/80">
                        History is Empty
                      </h4>
                      <p className="text-xs text-white/40 max-w-xs mx-auto">
                        Completed downloads and saved media packages will appear here.
                      </p>
                    </div>
                  ) : (
                    historyDownloads.map((item) => (
                      <ActiveDownloadCard
                        key={item.taskId}
                        item={item}
                        onRemove={onRemoveTask}
                      />
                    ))
                  )}
                </>
              )}
            </div>

            {/* Footer Stats */}
            <div className="p-3.5 border-t border-white/5 bg-obsidian-950/60 text-xs text-white/40 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                DASH Auto-Muxing Active
              </span>
              <span className="font-mono text-[11px]">CBX-Stream Engine</span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
