import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Play } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
}

interface Props {
  images: MediaItem[];
  videos?: MediaItem[];
}

const RoomGallery: React.FC<Props> = ({ images = [], videos = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState<string | null>(null);
  const allMedia = [
    ...images.map(img => ({ ...img, type: 'image' as const })),
    ...videos.map(vid => ({ ...vid, type: 'video' as const }))
  ];

  const handleNext = () => {
    setActiveIndex((activeIndex + 1) % allMedia.length);
  };

  const handlePrev = () => {
    setActiveIndex((activeIndex - 1 + allMedia.length) % allMedia.length);
  };

  if (!allMedia.length) {
    return <p className="text-gray-500 p-2">No media available</p>;
  }

  const currentMedia = allMedia[activeIndex];

  return (
    <div className="space-y-3">
      {/* Main Image/Video - Compact */}
      <div className="relative group bg-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow ">
        {currentMedia.type === 'image' ? (
          <img
            src={currentMedia.url}
            onClick={() => setFullscreen(currentMedia.url)}
            className="w-full h-64 md:h-80 lg:h-96 object-cover cursor-pointer"
          />
        ) : (
          <div
            onClick={() => setFullscreen(currentMedia.url)}
            className="relative cursor-pointer"
          >
            <video
              src={currentMedia.url}
              muted
              className="w-full h-64 md:h-80 lg:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition flex items-center justify-center">
              <div className="bg-white/90 p-3 md:p-4 rounded-full group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 md:w-6 md:h-6 text-green-600 fill-green-600" />
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation Arrows */}
        {allMedia.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 cursor-pointer -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 cursor-pointer top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
        
        {/* Counter */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs md:text-sm font-medium">
          {activeIndex + 1} / {allMedia.length}
        </div>
      </div>

      {/* Thumbnails Grid - Compact */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-6 gap-1.5 md:gap-2 pb-2 px-2">
        {allMedia.map((media, idx) => (
          <button
            key={media.id}
            onClick={() => setActiveIndex(idx)}
            className={`relative h-16 md:h-20 rounded-lg overflow-hidden transition-all hover:scale-105 ${
              activeIndex === idx
                ? "ring-2 ring-green-600 ring-offset-1"
                : "opacity-60 hover:opacity-100 border border-gray-200"
            }`}
          >
            {media.type === 'image' ? (
              <img src={media.url} alt="thumbnail" className="w-full cursor-pointer h-full object-cover" />
            ) : (
              <>
                <video src={media.url} muted className="w-full cursor-pointer h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex cursor-pointer items-center justify-center">
                  <Play className="w-3 h-3 text-white fill-white" />
                </div>
              </>
            )}
          </button>
        ))}
      </div>

      {/* Fullscreen Viewer */}
      {fullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={() => setFullscreen(null)}
            className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition z-10"
          >
            <X size={24} />
          </button>

          {fullscreen.endsWith(".mp4") ? (
            <video src={fullscreen} controls autoPlay className="max-h-[90%] max-w-[90%]" />
          ) : (
            <img src={fullscreen} className="max-h-[90%] max-w-[90%] object-contain" />
          )}
        </div>
      )}
    </div>
  );
};

export default RoomGallery;
