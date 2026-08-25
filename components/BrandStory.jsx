"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";

// Helper component for the counting effect
function StatCounter({ to, suffix, duration = 2 }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration, ease: "easeOut" });
      return () => controls.stop();
    }
  }, [inView, count, to, duration]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

// Separated the numbers and suffix for the animation
const stats = [
  { value: 1000, suffix: "+", label: "Happy Customers" },
  { value: 20, suffix: "+", label: "Menu Items" },
];

export default function BrandStory() {
  return (
    <section id="aboutus" className="relative px-6 py-32 bg-black overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-0 -translate-x-1/2 w-125 h-125 bg-red-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Giant decorative background text */}
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        className="
          absolute
          -top-10
          right-0
          text-[22vw]
          font-(--font-bebas)
          text-white/5
          leading-none
          select-none
          pointer-events-none
        "
      >
        "
      </motion.span>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex gap-8">
          {/* Animated vertical accent line with glow */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="hidden md:block w-0.5 bg-linear-to-b from-red-600 via-red-600 to-transparent origin-top shadow-[0_0_20px_rgba(220,38,38,0.6)]"
          />

          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center gap-3"
            >
              <span className="w-8 h-0.5 bg-red-600" />
              <p className="text-red-600 font-semibold tracking-[5px] uppercase text-sm">
                Brand Story
              </p>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-7xl text-white font-(--font-bebas) leading-none mt-6"
            >
              YOUR ONLY{" "}
              <span className="bg-linear-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                SUBSCRIPTION
              </span>
              <br />
              FOR HUNGER
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-gray-400 mt-6 max-w-xl text-lg leading-relaxed"
            >
              A place where taste meets creativity.
              Fresh ingredients, bold flavours and
              memorable moments.
            </motion.p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-x-12 gap-y-6 mt-14 pt-10 border-t border-white/10">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4 className="text-4xl font-(--font-bebas) text-white flex items-center">
                    <StatCounter to={stat.value} suffix={stat.suffix} />
                  </h4>
                  <p className="text-gray-500 text-sm mt-1 uppercase tracking-wide">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}