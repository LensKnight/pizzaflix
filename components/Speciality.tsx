"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const specialities = [
  { icon: "🧀", title: "Premium Cheese", desc: "Rich, melty, imported quality" },
  { icon: "🍅", title: "Fresh Veggies", desc: "Sourced daily, never frozen" },
  { icon: "🔥", title: "Signature Sauce", desc: "Our secret family recipe" },
  { icon: "👨‍🍳", title: "Handmade Daily", desc: "Crafted fresh by our chefs" },
];

export default function Speciality() {
  return (
    <section className="relative px-6 py-32 bg-black overflow-hidden">
      {/* Background accent glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Giant faded background text */}
      <span
        className="
          absolute
          -bottom-16
          -left-10
          text-[14vw]
          font-(--font-bebas)
          text-white/[0.03]
          leading-none
          select-none
          pointer-events-none
        "
      >
        FRESH
      </span>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-20">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-xl md:sticky md:top-24 self-start"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-[2px] bg-red-600" />
            <p className="text-red-600 uppercase tracking-[5px] font-semibold text-sm">
              Our Speciality
            </p>
          </div>

          <h2 className="text-6xl text-white font-(--font-bebas) mt-6 leading-none">
            MADE WITH
            <br />
            <span className="bg-linear-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
              FRESH INGREDIENTS
            </span>
          </h2>

          <p className="text-gray-400 mt-6 text-lg leading-relaxed">
            Every pizza is handcrafted using fresh vegetables,
            premium cheese, rich sauces and carefully selected
            ingredients to deliver unforgettable flavour.
          </p>
          <Link href="/menu">
          <motion.button
            whileHover={{ gap: "14px" }}
            className="mt-8 flex items-center gap-2 text-white font-semibold group"
          >
            <span className="border-b border-red-600 pb-1 group-hover:text-red-600 transition-colors">
              Explore Our Menu
            </span>
            <span className="text-red-600">→</span>
          </motion.button>
          </Link>
        </motion.div>

        {/* Right — stylish staggered list */}
        <div className="flex-1 max-w-md">
          {specialities.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ x: 10 }}
              className="group relative flex items-center gap-6 py-7 border-b border-white/10 cursor-default overflow-hidden"
            >
              {/* Hover fill sweep */}
              <span className="absolute inset-0 bg-linear-to-r from-red-600/10 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />

              {/* Big number */}
              <span className="relative text-white/10 group-hover:text-red-600/30 font-(--font-bebas) text-6xl leading-none transition-colors duration-500">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Icon with glow on hover */}
              <span className="relative text-3xl transition-transform duration-500 group-hover:scale-125 group-hover:drop-shadow-[0_0_12px_rgba(220,38,38,0.6)]">
                {item.icon}
              </span>

              <div className="relative">
                <h3 className="text-white text-2xl font-bold group-hover:text-red-600 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                  {item.desc}
                </p>
              </div>

              {/* Arrow reveal */}
              <span className="relative ml-auto text-red-600 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                →
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}