import React, { useState } from 'react';
import { Archive, Download, CheckSquare, Square, Film, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { MediaAnalyzeResponse, CarouselMediaItem } from '../../types/media';
import { apiService } from '../../services/api';

interface CarouselGalleryTabProps {
  media: MediaAnalyzeResponse;
  onDownloadZip: (selectedUrls: string[], customFilename?: string) => void;
}

export const CarouselGalleryTab: React.FC<CarouselGalleryTabProps> = ({ media, onDownloadZip }) => {
  const items: CarouselMediaItem[] = media.carousel_items || [];
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
    new Set(items.map((it) => it.index))
  );
  const [customZipName, setCustomZipName] = useState('');

  const toggleSelect = (index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIndices.size === items.length) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(items.map((it) => it.index)));
    }
  };

  const handleDownloadSelectedZip = () => {
    const selectedUrls = items
      .filter((it) => selectedIndices.has(it.index))
      .map((it) => it.url);

    if (selectedUrls.length === 0) return;
    onDownloadZip(selectedUrls, customZipName || undefined);
  };

  if (items.length === 0) {
    return (
      <div className="p-8 text-center glass-panel rounded-2xl border border-white/10 space-y-3">
        <Archive className="w-10 h-10 text-white/30 mx-auto" />
        <h4 className="font-heading font-bold text-white text-base">No Carousel Gallery Detected</h4>
        <p className="text-xs text-white/50 max-w-sm mx-auto">
          This post was detected as a single media item. You can download the video or audio streams from the
          other tabs above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Gallery Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg glass-pill hover:bg-white/10 text-white/90 font-medium transition-colors focus:outline-none"
          >
            {selectedIndices.size === items.length ? (
              <>
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span>Deselect All</span>
              </>
            ) : (
              <>
                <Square className="w-4 h-4 text-white/40" />
                <span>Select All ({items.length})</span>
              </>
            )}
          </button>

          <span className="text-white/60">
            Selected: <strong className="text-white">{selectedIndices.size}</strong> of {items.length} slides
          </span>
        </div>

        {/* Bundle ZIP CTA Button */}
        <button
          onClick={handleDownloadSelectedZip}
          disabled={selectedIndices.size === 0}
          className="btn-chameleon flex items-center gap-2 px-4 py-1.5 rounded-lg text-white font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Package Selected into ZIP ({selectedIndices.size})</span>
        </button>
      </div>

      {/* Optional Custom ZIP Name */}
      <div className="px-3 py-2 rounded-xl glass-input flex items-center gap-2 text-xs">
        <span className="text-white/50 shrink-0">ZIP Archive Name:</span>
        <input
          type="text"
          value={customZipName}
          onChange={(e) => setCustomZipName(e.target.value)}
          placeholder={media.title || 'carousel_album'}
          className="w-full bg-transparent text-white focus:outline-none"
        />
        <span className="text-white/40 font-mono">.zip</span>
      </div>

      {/* Carousel Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-1">
        {items.map((item: CarouselMediaItem) => {
          const isSelected = selectedIndices.has(item.index);
          const proxiedUrl = apiService.getProxyUrl(item.thumbnail || item.url);

          return (
            <div
              key={item.index}
              onClick={() => toggleSelect(item.index)}
              className={`relative rounded-xl overflow-hidden glass-card cursor-pointer border transition-all group select-none ${
                isSelected
                  ? 'border-indigo-500 shadow-glow-sm ring-1 ring-indigo-500/50'
                  : 'border-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              {/* Media Preview Box */}
              <div className="aspect-square w-full bg-obsidian-900 relative overflow-hidden">
                <img
                  src={proxiedUrl}
                  alt={`Slide ${item.index}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Shading overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent opacity-80" />

                {/* Checkbox Selector Icon */}
                <div className="absolute top-2 left-2 z-10">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-black/50 text-white/40 border border-white/20'
                    }`}
                  >
                    {isSelected && <CheckSquare className="w-3.5 h-3.5" />}
                  </div>
                </div>

                {/* Slide Index Badge */}
                <div className="absolute top-2 right-2 z-10">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-black/60 backdrop-blur-md text-white/80 border border-white/10">
                    #{item.index}
                  </span>
                </div>

                {/* Media Type Icon & Dimensions */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white/80 z-10">
                  <span className="flex items-center gap-1 font-medium bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm">
                    {item.media_type === 'video' ? (
                      <>
                        <Film className="w-3 h-3 text-sky-400" /> Video
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-3 h-3 text-emerald-400" /> Photo
                      </>
                    )}
                  </span>

                  {item.width && item.height && (
                    <span className="font-mono text-white/60 text-[9px]">
                      {item.width}x{item.height}
                    </span>
                  )}
                </div>
              </div>

              {/* Individual Item Download Option */}
              <div className="p-2 flex items-center justify-between bg-obsidian-900/90 border-t border-white/5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(item.url, '_blank');
                  }}
                  className="text-[10px] text-white/50 hover:text-white flex items-center gap-1 focus:outline-none"
                  title="Open original media URL"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>View</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    apiService.triggerFileDownload(
                      item.url,
                      `slide_${item.index}_${media.title ? media.title.slice(0, 20) : 'media'}`
                    );
                  }}
                  className="p-1 rounded hover:bg-white/10 text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none"
                  title="Download single slide"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
