import React, { useState } from 'react';
import { Layers, Play, CheckSquare, Square, AlertCircle, Loader2, Download, Trash2 } from 'lucide-react';
import { apiService, extractErrorMessage } from '../../services/api';
import { BatchAnalyzeResponse, BatchAnalyzeItemResult } from '../../types/media';

interface BatchPlaylistViewProps {
  onQueueBatchDownloads: (items: { url: string; title: string; thumbnail?: string | null; platform: any }[]) => void;
  onClose: () => void;
}

export const BatchPlaylistView: React.FC<BatchPlaylistViewProps> = ({
  onQueueBatchDownloads,
  onClose,
}) => {
  const [urlsInput, setUrlsInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchResult, setBatchResult] = useState<BatchAnalyzeResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());

  const handleBatchAnalyze = async () => {
    const rawLines = urlsInput
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 5);

    if (rawLines.length === 0) {
      setErrorMsg('Please paste at least one valid media URL (one per line).');
      return;
    }

    if (rawLines.length > 50) {
      setErrorMsg('Maximum 50 URLs can be processed in a single batch.');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const res = await apiService.batchAnalyzeUrls(rawLines);
      setBatchResult(res);
      // Default: select all successful items
      const successSet = new Set(
        res.items.filter((it) => it.success && it.data).map((it) => it.url)
      );
      setSelectedUrls(successSet);
    } catch (err) {
      setErrorMsg(extractErrorMessage(err));
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleSelect = (url: string) => {
    setSelectedUrls((prev) => {
      const next = new Set(prev);
      if (next.has(url)) {
        next.delete(url);
      } else {
        next.add(url);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (!batchResult) return;
    const successItems = batchResult.items.filter((it) => it.success && it.data);
    if (selectedUrls.size === successItems.length) {
      setSelectedUrls(new Set());
    } else {
      setSelectedUrls(new Set(successItems.map((it) => it.url)));
    }
  };

  const handleQueueAllSelected = () => {
    if (!batchResult) return;
    const toQueue = batchResult.items
      .filter((it) => it.success && it.data && selectedUrls.has(it.url))
      .map((it) => ({
        url: it.url,
        title: it.data!.title,
        thumbnail: it.data!.thumbnail,
        platform: it.data!.platform,
      }));

    if (toQueue.length > 0) {
      onQueueBatchDownloads(toQueue);
      onClose();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-8">
      <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-glass space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Batch & Playlist Downloader</h3>
              <p className="text-xs text-white/50">
                Queue up to 50 URLs or entire playlists for concurrent metadata extraction and downloading.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-xs text-white/50 hover:text-white px-3 py-1.5 rounded-lg glass-pill transition-colors focus:outline-none"
          >
            Switch to Single URL
          </button>
        </div>

        {/* URL Multi-line Textarea */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-medium text-white/70">
              Paste URLs (One per line)
            </label>
            <span className="text-white/40">
              {urlsInput.split('\n').filter((l) => l.trim().length > 0).length} / 50 URLs
            </span>
          </div>

          <textarea
            value={urlsInput}
            onChange={(e) => setUrlsInput(e.target.value)}
            disabled={isProcessing}
            rows={5}
            placeholder={`https://www.youtube.com/watch?v=dQw4w9WgXcQ\nhttps://www.tiktok.com/@user/video/123456789\nhttps://www.instagram.com/reel/C32sL3iL-4A/`}
            className="w-full p-3 rounded-xl glass-input text-xs font-mono text-white placeholder-white/25 focus:outline-none resize-y"
          />
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Analyze Batch CTA */}
        <div className="flex justify-end gap-3">
          {urlsInput && (
            <button
              onClick={() => {
                setUrlsInput('');
                setBatchResult(null);
              }}
              className="px-3 py-2 rounded-xl text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          <button
            onClick={handleBatchAnalyze}
            disabled={isProcessing || urlsInput.trim().length < 5}
            className="btn-chameleon px-5 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting Batch Metadata...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Analyze Batch Queue</span>
              </>
            )}
          </button>
        </div>

        {/* Batch Results List */}
        {batchResult && (
          <div className="pt-4 border-t border-white/5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg glass-pill text-white/80 hover:text-white"
                >
                  {selectedUrls.size === batchResult.successful ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-white/40" />
                  )}
                  <span>Select All Successful ({batchResult.successful})</span>
                </button>
                <span className="text-white/60">
                  Total: {batchResult.total} | Successful:{' '}
                  <span className="text-emerald-400 font-bold">{batchResult.successful}</span> | Failed:{' '}
                  <span className="text-rose-400 font-bold">{batchResult.failed}</span>
                </span>
              </div>

              <button
                onClick={handleQueueAllSelected}
                disabled={selectedUrls.size === 0}
                className="btn-chameleon flex items-center gap-2 px-4 py-1.5 rounded-xl text-white font-bold text-xs disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Start Downloading Selected ({selectedUrls.size})</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {batchResult.items.map((item: BatchAnalyzeItemResult, index: number) => {
                const isSelected = selectedUrls.has(item.url);

                return (
                  <div
                    key={index}
                    className={`p-3 rounded-xl glass-card flex items-center justify-between gap-3 border ${
                      item.success
                        ? isSelected
                          ? 'border-indigo-500/50 bg-indigo-950/20'
                          : 'border-white/5'
                        : 'border-rose-500/30 bg-rose-950/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.success && (
                        <button
                          type="button"
                          onClick={() => toggleSelect(item.url)}
                          className="shrink-0 text-white/60 hover:text-white focus:outline-none"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      )}

                      {/* Item Thumbnail */}
                      {item.data?.thumbnail ? (
                        <img
                          src={apiService.getProxyUrl(item.data.thumbnail)}
                          alt={item.data.title}
                          className="w-12 h-12 rounded-lg object-cover bg-black/40 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-white/20 text-xs shrink-0 font-mono">
                          #{index + 1}
                        </div>
                      )}

                      {/* Title & Info */}
                      <div className="min-w-0">
                        <h5 className="font-heading font-semibold text-xs text-white truncate">
                          {item.success && item.data ? item.data.title : item.url}
                        </h5>
                        <div className="flex items-center gap-2 text-[10px] text-white/50 mt-0.5">
                          {item.success && item.data ? (
                            <>
                              <span className="text-indigo-400 font-medium">
                                {item.data.platform.name}
                              </span>
                              <span>•</span>
                              <span>{item.data.duration_formatted}</span>
                              {item.data.uploader && (
                                <>
                                  <span>•</span>
                                  <span className="truncate max-w-[140px]">{item.data.uploader}</span>
                                </>
                              )}
                            </>
                          ) : (
                            <span className="text-rose-400">{item.error || 'Extraction Failed'}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div className="shrink-0 text-right">
                      {item.success ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Ready
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          Failed
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
