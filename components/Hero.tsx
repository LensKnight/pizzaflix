"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Pizza, PartyPopper, Coffee, MapPin, Clock } from "lucide-react";

const quickInfo = [
  { icon: Pizza, text: "Fresh Ingredients, Every Day" },
  { icon: PartyPopper, text: "Perfect for Friends' Gatherings" },
  { icon: Coffee, text: "Cozy Indoor & Outdoor Seating" },
];

export default function StoreShowcase() {
  const today = new Date().getDay(); // 0 = Sunday ... 6 = Saturday
  const isClosedToday = today === 6;

  return (
    <section id="home" className="relative min-h-screen flex items-center px-6 pt-32 pb-20 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-black bg-center bg-cover"
        style={{ backgroundImage: "url('store.jpg')" }}
      />

      {/* Dark transparent overlay */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-black/40" />
      <div className="absolute inset-0 bg-linear-to-r from-black/50 via-transparent to-black/30" />

      {/* Content — contained like other sections */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-24">
        {/* Left — main content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="max-w-lg"
        >
          <p className="text-red-600 uppercase tracking-[5px] font-semibold">
            Visit Us
          </p>

          <h2 className="text-7xl text-white font-(--font-bebas) leading-none mt-5">
            STEP INSIDE
            <br />
            OUR KITCHEN
          </h2>

          <p className="text-gray-300 mt-6 text-lg max-w-sm">
            A space built for good food and good company.
          </p>

          {/* Divider */}
          <div className="w-30 h-0.5 bg-red-600 mt-8" />

          <div className="flex flex-col gap-4 mt-8 text-gray-300">
            <span className="flex items-center gap-3">
              <MapPin size={18} className="text-red-600 shrink-0" />
              Ananda Nagar, Adabari, Guwahati, Assam 781012
            </span>
            <span className="flex items-center gap-3">
              <Clock size={18} className="text-red-600 shrink-0" />
              {isClosedToday ? (
                <span className="text-red-500 font-semibold">
                  Closed Today (Saturday)
                </span>
              ) : (
                "Open Today · 06:00 PM – 10:30 PM"
              )}
            </span>
          </div>

          <div className="flex gap-5 mt-10">
            <Link href="https://www.google.com/maps/place/PizzaFlix/@26.1608399,91.6857895,19z/data=!4m7!3m6!1s0x375a5b8ff66379b5:0xbff821b786c40048!4b1!8m2!3d26.1609145!4d91.6861516!16s%2Fg%2F11z73szrl2!5m1!1e2?entry=ttu&g_ep=EgoyMDI2MDgxOS4wIKXMDSoASAFQAw%3D%3D">
            <motion.button
              whileHover={{ scale: 1.08 }}
              className="bg-red-600 px-8 py-3 rounded-md text-white"
            >
              Get Directions
            </motion.button>
            </Link>
            <Link href="/menu">
            <motion.button
              whileHover={{ scale: 1.08 }}
              className="border border-white px-8 py-3 rounded-md text-white"
            >
              View Menu
            </motion.button>
            </Link>
          </div>

          {/* Trust row */}
          <div className="flex items-center gap-6 mt-12">
            <div className="flex -space-x-3">
              {["V", "d", "A", "R"].map((initial, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-black bg-neutral-800 text-white font-semibold flex items-center justify-center text-sm"
                >
                  {initial}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="flex text-red-500 text-sm">★★★★★</div>
                <span className="text-white font-semibold text-sm">4.7</span>
              </div>
              <p className="text-gray-400 text-sm mt-0.5">
                1K+ happy customers
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right — quick info, minimal no-card style */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="hidden md:flex flex-col gap-10 pl-10 border-l border-white/20"
        >
          {quickInfo.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <Icon size={26} className="text-red-600" />
                <span className="text-white text-lg">{item.text}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}