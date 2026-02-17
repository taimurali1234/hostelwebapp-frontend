import { useEffect, useState } from "react";
import Button from "../../common/Button";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "https://res.cloudinary.com/taimurali/image/upload/f_webp,q_auto,w_1200/estateapp/cppqzckli7g92t5vk05e",
  "https://res.cloudinary.com/taimurali/image/upload/f_webp,q_auto,w_1200/estateapp/kloohuynoyoy9sprxy0q",
  "https://res.cloudinary.com/taimurali/image/upload/f_webp,q_auto,w_1200/estateapp/y7nms245pi5azbfjlh2m",
  "https://res.cloudinary.com/taimurali/image/upload/f_webp,q_auto,w_1200/estateapp/wkt2tbc7kiz8svqnzehw",
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000); // slower = better perf
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      
      {/* Slider */}
      <AnimatePresence>
        <motion.img
          key={index}
          src={images[index]}
          alt="Hostel rooms"
          loading={index === 0 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : "auto"}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl text-white"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Comfortable Rooms for Students & Visitors
          </h1>

          <p className="text-lg text-gray-200 mb-8">
            Discover affordable, modern hostel accommodations designed
            for your comfort and convenience. Book your perfect room today!
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
