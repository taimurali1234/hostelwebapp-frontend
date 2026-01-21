import { motion, AnimatePresence } from "framer-motion";

const AboutHero = () => {
  return (
    <section
      className="relative h-[70vh] flex items-center justify-center text-center"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1505693416388-ac5ce068fe85)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 text-white max-w-3xl px-6"
      > 
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          About Our Hostel
        </h1>
        <p className="text-sm md:text-lg text-gray-200">
          Providing a safe, comfortable, and welcoming living environment for
          students.
        </p>
      </motion.div>
    </section>
  );
};

export default AboutHero;
