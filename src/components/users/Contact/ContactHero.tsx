import { motion, AnimatePresence } from "framer-motion";

const ContactHero = () => {
  return (
    <section
      className="relative h-[65vh] flex items-center justify-center text-center"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1566073771259-6a8506099945)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 text-white px-6 max-w-3xl"
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-3">Contact Us</h1>
        <p className="text-gray-200 text-sm md:text-lg">
          Get in touch with us or find our hostel location easily.
        </p>
      </motion.div>
    </section>
  );
};

export default ContactHero;
