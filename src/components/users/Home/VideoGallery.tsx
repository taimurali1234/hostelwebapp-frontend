import { useState } from "react";
import SectionHeader from "../../common/SectionHeader";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface VideoItem {
  id: number;
  src: string;
}

const videos: VideoItem[] = [
  { id: 1, src: "/assets/cld-sample-video.webm" },
  { id: 2, src: "/assets/sea-turtle.mp4" },
    { id: 3, src: "/assets/cld-sample-video.webm" },
    { id: 4, src: "/assets/sea-turtle.mp4" },
    { id: 5, src: "/assets/cld-sample-video.webm" },
];

const VideoGallery: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  const next = () => {
    if (activeIndex !== null && activeIndex < videos.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const prev = () => {
    if (activeIndex !== null && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <section className="bg-[#eef6f5] py-20 px-6">
      <div className="max-w-7xl mx-auto">

        <SectionHeader
          title="Life at Our Hostel"
          subtitle="Watch real moments from our guests"
        />

        {/* Video Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-20">

          {videos.map((video, index) => (
            <div
  key={video.id}
  className="relative rounded-2xl overflow-hidden shadow-lg 
  cursor-pointer group bg-white 
  transform rotate-[-6deg] 
  hover:rotate-0 hover:-translate-y-2 
  transition-all duration-300"
  onClick={() => setActiveIndex(index)}
>
              {/* Loader */}
              {loading[index] && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-600 z-10">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Video Preview (Muted, AutoPlay) */}
              <video
                src={video.src}
                muted
                autoPlay
                loop
                playsInline
                className="w-full h-[240px] object-cover"
                onLoadStart={() =>
                  setLoading((prev) => ({ ...prev, [index]: true }))
                }
                onCanPlay={() =>
                  setLoading((prev) => ({ ...prev, [index]: false }))
                }
              />

              {/* Play Overlay */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center text-black text-xl">
                  ▶
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Player */}
      {activeIndex !== null && (
  <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">

    {/* Close Button */}
    <button
      onClick={() => setActiveIndex(null)}
      className="absolute top-6 right-6 
      w-12 h-12 flex items-center justify-center
      rounded-full text-white text-2xl
      bg-black/50 cursor-pointer z-[80]
      hover:bg-green-600 transition"
    >
      ✕
    </button>

    {/* Left Arrow */}
    {activeIndex > 0 && (
      <button
        onClick={() => prev()}
        className="absolute left-6 
        w-12 h-12 flex items-center justify-center
        text-white text-3xl
        rounded-full bg-black/50
        cursor-pointer z-[80]
        hover:bg-green-600 transition"
      >
        <FaChevronLeft />
      </button>
    )}

    {/* Right Arrow */}
    {activeIndex < videos.length - 1 && (
      <button
        onClick={() => next()}
        className="absolute right-6 
        w-12 h-12 flex items-center justify-center
        text-white text-3xl
        rounded-full bg-black/50
        cursor-pointer z-[80]
        hover:bg-green-600 transition"
      >
        <FaChevronRight />
      </button>
    )}

    {/* Video Layer (Click-through) */}
    <div className="relative z-[60] pointer-events-none">
      <video
        src={videos[activeIndex].src}
        autoPlay
        controls
        className="max-w-[90%] max-h-[90%] rounded-xl pointer-events-auto"
      />
    </div>
  </div>
)}

    </section>
  );
};

export default VideoGallery;
