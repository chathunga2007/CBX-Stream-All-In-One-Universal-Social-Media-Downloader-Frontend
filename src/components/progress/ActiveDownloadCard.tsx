import React from 'react';
import { Download, CheckCircle2, AlertCircle, Loader2, HardDrive, Zap, Clock, X, ExternalLink } from 'lucide-react';
import { ActiveDownloadItem } from '../../types/media';
import { apiService } from '../../services/api';

interface ActiveDownloadCardProps {
  item: ActiveDownloadItem;
  onRemove: (taskId: string) => void;
}

export const ActiveDownloadCard: React.FC<ActiveDownloadCardProps> = ({ item, onRemove }) => {
  const isCompleted = item.status === 'completed';
  const isFailed = item.status === 'failed';
  const isDownloading = item.status === 'downloading';
  const isProcessing = item.status === 'processing';
  const isQueued = item.status === 'queued';

  const handleSaveFile = () => {
    if (item.streamUrl) {
      apiService.triggerFileDownload(item.streamUrl, item.filename || undefined);
    }
  };

  return (
    <div
      className={`relative p-3.5 rounded-2xl glass-card border transition-all ${
        isCompleted
          ? 'border-emerald-500/30 bg-emerald-950/10'
          : isFailed
          ? 'border-rose-500/30 bg-rose-950/10'
          : 'border-indigo-500/30 shadow-glow-sm'
      }`}
    >
      {/* Header: Thumbnail, Title, Platform Pill, Close Button */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          {item.thumbnail ? (
            <img
              src={apiService.getProxyUrl(item.thumbnail)}
              alt={item.title}
              className="w-11 h-11 rounded-lg object-cover bg-black/40 shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 text-indigo-400" />
            </div>
          )}

          <div className="min-w-0">
            <h5 className="font-heading font-semibold text-xs text-white truncate" title={item.title}>
              {item.title}
            </h5>
            <div className="flex items-center gap-1.5 text-[10px] text-white/50 mt-0.5">
              <span
                className="font-bold px-1.5 py-0.2 rounded"
                style={{
                  backgroundColor: `${item.platform.primary_color}20`,
                  color: item.platform.primary_color,
                }}
              >
                {item.platform.name}
              </span>
              <span>•</span>
              <span className="font-medium text-white/70">{item.formatLabel}</span>
            </div>
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.taskId)}
          className="text-white/40 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors focus:outline-none"
          title="Remove item"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress Bar & Status Line */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="flex items-center gap-1.5 font-bold">
            {isQueued && (
              <span className="text-amber-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Queued...
              </span>
            )}
            {isDownloading && (
              <span className="text-indigo-400 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Downloading {item.progressPercent.toFixed(1)}%
              </span>
            )}
            {isProcessing && (
              <span className="text-sky-400 flex items-center gap-1">
                <Zap className="w-3 h-3 animate-pulse" /> Transcoding & Merging...
              </span>
            )}
            {isCompleted && (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 100% Ready
              </span>
            )}
            {isFailed && (
              <span className="text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Failed
              </span>
            )}
          </span>

          {/* Size / Speed / ETA stats */}
          <span className="text-white/60 text-[10px]">
            {isDownloading && (
              <>
                {item.speed && <span className="text-indigo-300 font-semibold">{item.speed}</span>}
                {item.eta && <span className="ml-1.5 text-white/40">ETA {item.eta}</span>}
              </>
            )}
            {isCompleted && <span>{item.totalFormatted || item.downloadedFormatted}</span>}
          </span>
        </div>

        {/* Liquid Glass Progress Track */}
        <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all duration-300 relative ${
              isCompleted
                ? 'bg-emerald-500 shadow-glow-sm'
                : isFailed
                ? 'bg-rose-500'
                : 'bg-gradient-to-r from-indigo-500 via-sky-400 to-teal-300'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, item.progressPercent))}%` }}
          >
            {/* Shimmer pulse effect during download */}
            {(isDownloading || isProcessing) && (
              <div className="absolute inset-0 shimmer-mask opacity-60" />
            )}
          </div>
        </div>

        {/* Byte counters & Action button */}
        <div className="flex items-center justify-between pt-1 text-[10px] text-white/50">
          <span className="flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-white/40" />
            {item.downloadedFormatted} / {item.totalFormatted}
          </span>

          {isCompleted && item.streamUrl && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveFile}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold underline transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Save to Disk</span>
              </button>

              <button
                onClick={() => window.open(item.streamUrl!, '_blank')}
                className="text-white/40 hover:text-white"
                title="Open stream in browser tab"
              >
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}

          {isFailed && item.error && (
            <span className="text-rose-400 truncate max-w-[200px]" title={item.error}>
              {item.error}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
