import { useEffect, useState } from "react";
import Button from "../../common/Button";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "https://res.cloudinary.com/taimurali/image/upload/c_scale,w_1920/f_webp/estateapp/cppqzckli7g92t5vk05e",
  "https://res.cloudinary.com/taimurali/image/upload/c_scale,w_1920/f_webp/estateapp/kloohuynoyoy9sprxy0q",
  "https://res.cloudinary.com/taimurali/image/upload/c_scale,w_1920/f_webp/estateapp/y7nms245pi5azbfjlh2m",
  "https://res.cloudinary.com/taimurali/image/upload/c_scale,w_1920/f_webp/estateapp/wkt2tbc7kiz8svqnzehw",
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden px-6 py-16">
      {/* Background Slider */}
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images[index]})` }}
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-3xl text-white"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Comfortable Rooms for Students & Visitors
          </h1>

          <p className="text-lg text-gray-200 mb-8">
            Discover affordable, modern hostel accommodations designed
            for your comfort and convenience. Book your perfect room
            today!
          </p>

          <div className="flex justify-center gap-4">
            <Button label="Book a Room" />
            <Button label="View Rooms" variant="secondary" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
