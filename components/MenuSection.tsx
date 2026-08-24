"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Check } from "lucide-react";
import { useCart } from "@/lib/CartContext";

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

function DietTag({ isVeg }: DietTagProps) {
  return (
    <div className={`border w-3 h-3 flex items-center justify-center rounded-sm shrink-0 ${isVeg ? 'border-green-600' : 'border-red-600'}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
    </div>
  );
}

export default function MenuSection() {
  const { cart, addItem, removeItem } = useCart();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Cart Context se specific item ki real quantity nikalne ka helper
  const getItemQuantity = (itemName: string) => {
    const item = cart.find((i: { name: string; qty: number }) => i.name === itemName);
    return item ? item.qty : 0;
  };

  const handleIncrement = (item: { name: string; price: number }) => {
    const currentQty = getItemQuantity(item.name);
    
    addItem({ name: item.name, price: item.price });
    
    if (currentQty === 0) {
      setToastMessage(`${item.name} added to cart!`);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    }
  };

  const handleDecrement = (item: { name: string; price: number }) => {
    if (removeItem) {
      // Cart context se quantity kam karega (ya 0 hone par remove karega)
      removeItem(item.name); 
    }
  };

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
          <p className="text-gray-600  font-semibold mb-5 text-sm">
            Go to our Menu page to add/remove items
          </p>
        </motion.div>

        <div className="flex flex-col divide-y divide-white/10">
          {menuItems.map((item, index) => {
            // Live Cart Context se quantity le rahe hain
            const quantity = getItemQuantity(item.name);

            return (
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
                    unoptimized
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

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-white font-bold text-base">₹{item.price}</span>
                    <span className="text-gray-500 text-sm line-through">₹{item.original}</span>
                    <span className="text-green-500 text-xs font-bold bg-green-500/10 px-1.5 py-0.5 rounded">
                      {item.off}% OFF
                    </span>
                  </div>
                </div>

                {/* Swiggy/Zomato Style Add Button */}
                <div className="shrink-0 w-24">
                  {quantity === 0 ? (
                    <button
                      onClick={() => handleIncrement(item)}
                      className="w-full flex items-center justify-center gap-1 bg-red-600/10 border border-red-600/50 hover:bg-red-600 text-red-500 hover:text-white font-bold py-2 rounded-lg transition-all"
                    >
                      ADD <Plus size={14} className="mt-0.5" />
                    </button>
                  ) : (
                    <div className="w-full flex items-center justify-between bg-red-600 text-white font-bold py-1.5 px-2 rounded-lg shadow-lg">
                      <button 
                        onClick={() => handleDecrement(item)} 
                        className="p-1 hover:bg-black/20 rounded transition-colors active:scale-95"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-sm">{quantity}</span>
                      <button 
                        onClick={() => handleIncrement(item)} 
                        className="p-1 hover:bg-black/20 rounded transition-colors active:scale-95"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
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

      {/* Toast notification */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] bg-neutral-900 border border-green-600/40 rounded-full px-5 py-3 flex items-center gap-2 shadow-2xl"
          >
            <Check size={16} className="text-green-500" />
            <span className="text-sm font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}