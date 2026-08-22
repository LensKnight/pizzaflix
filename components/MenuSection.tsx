"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

// 5 items selected from different categories with their respective offers and real image links
const menuItems = [
  {
    name: "Chicken Golden Delight Pizza",
    description: "Double pepper barbeque chicken, golden corn and extra cheese.",
    price: 109,
    original: 149,
    off: 27,
    isVeg: false,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop",
  },
  {
    name: "Mutton Momo",
    description: "Premium mutton mince wrapped in a delicate steamed dough.",
    price: 70,
    original: 100,
    off: 30,
    isVeg: false,
    image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=500&auto=format&fit=crop",
  },
  {
    name: "Veg Burger",
    description: "Crispy potato patty with fresh lettuce and creamy mayo.",
    price: 50,
    original: 70,
    off: 29,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop",
  },
  {
    name: "Chicken Drumstick",
    description: "Classic crispy fried chicken drumsticks.",
    price: 100,
    original: 150,
    off: 33,
    isVeg: false,
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&auto=format&fit=crop",
  },
  {
    name: "Chocolate Waffle",
    description: "Freshly baked waffle loaded with melted chocolate.",
    price: 70,
    original: 100,
    off: 30,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&auto=format&fit=crop",
  },
];

interface DietTagProps {
  isVeg: boolean;
}

// Simple Veg/Non-Veg Tag for the list
function DietTag({ isVeg }: DietTagProps) {
  return (
    <div className={`border w-3 h-3 flex items-center justify-center rounded-sm shrink-0 ${isVeg ? 'border-green-600' : 'border-red-600'}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
    </div>
  );
}

export default function MenuSection() {
  return (
    <section className="px-6 py-20 md:py-28 bg-black text-white">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <p className="text-red-600 uppercase tracking-[5px] font-semibold mb-3 text-sm">
            Delicious Menu
          </p>

          <h2 className="text-4xl md:text-6xl font-(--font-bebas) leading-none">
            ORDER YOUR FAVORITE
            <br />
            <span className="bg-linear-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
              PIZZA & MORE
            </span>
          </h2>
        </motion.div>

        <div className="flex flex-col divide-y divide-white/10">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 py-5"
            >
              {/* Thumbnail */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 bg-neutral-900 border border-white/5">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  unoptimized // External Unsplash domain ke liye
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <DietTag isVeg={item.isVeg} />
                  <h3 className="text-lg md:text-xl font-bold font-(--font-bebas) tracking-wide truncate">
                    {item.name}
                  </h3>
                </div>
                
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                  {item.description}
                </p>
                
                {/* Offer & Pricing */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-white font-bold text-base">₹{item.price}</span>
                  <span className="text-gray-500 text-sm line-through">₹{item.original}</span>
                  <span className="text-green-500 text-xs font-bold bg-green-500/10 px-1.5 py-0.5 rounded">
                    {item.off}% OFF
                  </span>
                </div>
              </div>

              {/* Add button */}
              <button className="shrink-0 flex items-center gap-1 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all">
                <Plus size={16} />
                <span className="hidden sm:inline">Add</span>
              </button>
            </motion.div>
          ))}
        </div>

        {/* View Full Menu CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex justify-center mt-10"
        >
          <Link href="/menu">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-10 py-3 rounded-md font-semibold transition-colors"
            >
              View Full Menu
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}