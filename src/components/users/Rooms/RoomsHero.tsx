import { motion, AnimatePresence } from "framer-motion";

const RoomsHero: React.FC = () => {
  return (
    <section
      className="relative h-[60vh] md:h-[70vh] w-full bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 text-center px-4 max-w-3xl"
      >
        <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight">
          Explore Our Comfortable Rooms
        </h1>

        <p className="text-gray-200 mt-4 text-base md:text-lg">
          Discover affordable, modern hostel rooms designed for students and
          visitors. Find the perfect stay that matches your comfort and budget.
        </p>
      </motion.div>
    </section>
  );
};

export default RoomsHero;
