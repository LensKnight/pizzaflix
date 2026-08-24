"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const foods = [
  {
    name: "Chicken Drumstick",
    tag: "Best Seller",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&auto=format&fit=crop",
  },
  {
    name: "Chicken Golden Delight Pizza",
    tag: "Fan Favourite",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop",
  },
  {
    name: "Mutton Momo",
    tag: "Value Pick",
    image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=500&auto=format&fit=crop",
  },
];

export default function FeaturedFood() {
  return (
    <section className="relative px-6 py-20 md:py-32 bg-black overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-red-600/10 rounded-full blur-[100px] md:blur-[140px] pointer-events-none" />

      {/* Giant background text — desktop only */}
      <span
        className="
          hidden md:block
          absolute
          -bottom-10
          -left-6
          text-[13vw]
          font-(--font-bebas)
          text-white/[0.03]
          leading-none
          select-none
          pointer-events-none
        "
      >
        SIGNATURE
      </span>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14"
        >
          <div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-red-600" />
              <p className="text-red-600 uppercase tracking-[5px] font-semibold text-sm">
                Featured Food
              </p>
            </div>

            <h2 className="text-4xl md:text-6xl text-white font-(--font-bebas) mt-4 leading-none">
              OUR{" "}
              <span className="bg-linear-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                SIGNATURE
              </span>{" "}
              PICKS
            </h2>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {foods.map((food, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group relative h-[320px] md:h-[420px] rounded-2xl overflow-hidden"
            >
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-110"
              />

              {/* Base gradient — always visible for text legibility */}
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

              {/* Red glow sweep — desktop hover only */}
              <div className="absolute inset-0 bg-linear-to-t from-red-600/40 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />

              {/* Disclaimer overlay watermark */}
              <span className="absolute bottom-2 right-2 text-[8px] text-white/50 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs pointer-events-none">
                *Creative visualization
              </span>

              {/* Number tag */}
              <span className="absolute top-4 left-4 text-white/20 md:group-hover:text-red-600/50 font-(--font-bebas) text-4xl md:text-5xl leading-none transition-colors duration-500">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Category tag */}
              <span className="absolute top-4 right-4 text-[10px] md:text-xs uppercase tracking-wide text-white/70 border border-white/20 rounded-full px-3 py-1 backdrop-blur-sm bg-black/20">
                {food.tag}
              </span>

              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <h3 className="text-2xl md:text-3xl text-white font-(--font-bebas) leading-none">
                  {food.name}
                </h3>

                {/* Always visible on mobile, hover-reveal on desktop */}
                <Link 
                  href="/menu"
                  className="flex items-center gap-2 mt-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-red-500 text-sm font-semibold">
                    Order Now
                  </span>
                  <span className="text-red-500 text-sm">→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}