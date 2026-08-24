"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Automatically hide after initial load (adjust duration as needed)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black select-none pointer-events-none"
        >
          {/* Animated Glow Background */}
          <div className="absolute w-[300px] h-[300px] bg-red-600/20 rounded-full blur-[100px] pointer-events-none" />

          {/* Logo / Custom Image */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.9, 1.05, 1], opacity: 1 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="relative w-32 h-32 md:w-40 md:h-40 mb-8 z-10"
          >
            <Image
              src="/loading.png" // Replace with your image file path inside public/
              alt="Loading..."
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Progress Bar */}
          <div className="relative z-10 w-44 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{
                duration: 1.8,
                ease: "easeInOut",
              }}
              className="w-full h-full bg-red-600 rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}