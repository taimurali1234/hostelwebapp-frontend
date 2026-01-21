import { useState } from "react";
import SectionHeader from "../../common/SectionHeader";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

const galleryImages = [
  "https://res.cloudinary.com/taimurali/image/upload/c_scale,w_1920/f_webp/estateapp/cppqzckli7g92t5vk05e",
  "https://res.cloudinary.com/taimurali/image/upload/c_scale,w_1920/f_webp/estateapp/kloohuynoyoy9sprxy0q",
  "https://res.cloudinary.com/taimurali/image/upload/c_scale,w_1920/f_webp/estateapp/kloohuynoyoy9sprxy0q",
  "https://res.cloudinary.com/taimurali/image/upload/c_scale,w_1920/f_webp/estateapp/kloohuynoyoy9sprxy0q",
  "https://res.cloudinary.com/taimurali/image/upload/c_scale,w_1920/f_webp/estateapp/kloohuynoyoy9sprxy0q",
  "https://res.cloudinary.com/taimurali/image/upload/c_scale,w_1920/f_webp/estateapp/kloohuynoyoy9sprxy0q",
   "https://res.cloudinary.com/taimurali/image/upload/c_scale,w_1920/f_webp/estateapp/kloohuynoyoy9sprxy0q",
];

const GallerySection: React.FC = () => {
  const [index, setIndex] = useState<number>(-1);

  return (
    <section className="bg-[#f3f7f6] border-t border-b border-gray-200 py-20 px-6">
      <div className="max-w-6xl mx-auto">

        <SectionHeader
          title="Gallery"
          subtitle="Take a virtual tour of our facilities and rooms"
        />

        {/* Masonry Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 auto-rows-[180px] mt-14">

  {/* Left Tall Image */}
  <div
    className="lg:row-span-2 lg:col-span-1 cursor-pointer"
    onClick={() => setIndex(0)}
  >
    <img
      src={galleryImages[0]}
      className="rounded-2xl w-full h-full object-cover"
    />
  </div>

  {/* Top Right (2 Images) */}
  <div
    className="cursor-pointer"
    onClick={() => setIndex(1)}
  >
    <img
      src={galleryImages[1]}
      className="rounded-2xl w-full h-full object-cover"
    />
  </div>

  <div
    className="cursor-pointer"
    onClick={() => setIndex(2)}
  >
    <img
      src={galleryImages[2]}
      className="rounded-2xl w-full h-full object-cover"
    />
  </div>

  {/* Bottom Row (3 Images) */}
  {galleryImages.slice(3, 7).map((img, i) => (
    <div
      key={i}
      className="cursor-pointer"
      onClick={() => setIndex(i + 3)}
    >
      <img
        src={img}
        className="rounded-2xl w-full h-full object-cover"
      />
    </div>
  ))}
</div>
      </div>

      {/* Lightbox with Zoom */}
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={galleryImages.map((src) => ({ src }))}
        plugins={[Zoom]}
      />
    </section>
  );
};

export default GallerySection;
