import { motion, AnimatePresence } from "framer-motion";

const TermsHero = () => {
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
      <div
        className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        > 
        <h1 className="text-white text-3xl md:text-5xl font-bold">
          Terms & Conditions
        </h1>
        <p className="text-white/90 mt-3 max-w-2xl text-sm md:text-base">
          Please read these terms carefully before booking.
        </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TermsHero;
