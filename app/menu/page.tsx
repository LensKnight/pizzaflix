"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pizza,
  Soup,
  Sandwich,
  Drumstick,
  IceCream2,
  CupSoda,
  X,
  Plus,
  Crown,
  Flame,
  Search,
} from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const categories = [
  { id: "pizza", label: "Pizza", icon: Pizza },
  { id: "momo", label: "Momo", icon: Soup },
  { id: "burger", label: "Burger", icon: Sandwich },
  { id: "chicken", label: "Fried Chicken", icon: Drumstick },
  { id: "dessert", label: "Dessert", icon: IceCream2 },
  { id: "drinks", label: "Drinks", icon: CupSoda },
];

// Added isVeg tag and descriptions to all items
const menuData = {
  pizza: [
    { name: "Margherita Pizza", price: 69, original: 89, off: 22, isVeg: true, description: "Classic delight with 100% real mozzarella cheese." },
    { name: "Corn & Cheese Pizza", price: 79, original: 99, off: 20, isVeg: true, description: "A combination of sweet juicy corn & mozzarella cheese." },
    { name: "Farm Fresh Veggie", price: 89, original: 109, off: 18, isVeg: true, description: "Loaded with crunchy onions, crisp capsicum, and tomatoes." },
    { name: "Tandoori Paneer Veg Pizza", price: 109, original: 149, off: 27, isVeg: true, description: "Spiced paneer, onions, and red paprika on a tandoori sauce base." },
    { name: "Chicken Golden Delight Pizza", price: 109, original: 149, off: 27, top: 1, isVeg: false, description: "Double pepper barbeque chicken, golden corn and extra cheese." },
    { name: "Tandoori Chicken Pizza", price: 119, original: 159, off: 25, isVeg: false, description: "Chicken tikka, onions, and spicy red paprika." },
    { name: "Paneer Supreme (Pizzaflix Special)", price: 149, original: 185, off: 20, isVeg: true, description: "Our signature crust loaded with premium paneer cubes." },
    { name: "Chicken Supreme (Pizzaflix Special)", price: 159, original: 199, off: 20, isVeg: false, description: "The ultimate meaty pizza packed with assorted chicken toppings." },
  ],
  momo: [
    { name: "Veg Momo", price: 40, original: 60, off: 33, isVeg: true, description: "Steamed dumplings stuffed with finely chopped fresh vegetables." },
    { name: "Chicken Momo", price: 50, original: 70, off: 29, isVeg: false, description: "Juicy steamed dumplings stuffed with minced chicken and spices." },
    { name: "Mutton Momo", price: 70, original: 100, off: 30, top: 3, isVeg: false, description: "Premium mutton mince wrapped in a delicate steamed dough." },
    { name: "Veg Kurkure Momo", price: 60, original: 80, off: 25, isVeg: true, description: "Crunchy, deep-fried momos with a flavorful veggie filling." },
    { name: "Chicken Kurkure Momo", price: 70, original: 100, off: 30, isVeg: false, description: "Crispy fried chicken momos tossed in special seasoning." },
    { name: "Mutton Kurkure Momo", price: 90, original: 120, off: 25, isVeg: false, description: "Extra crunchy mutton momos perfect for evening snacks." },
  ],
  burger: [
    { name: "Veg Burger", price: 50, original: 70, off: 29, isVeg: true, description: "Crispy potato patty with fresh lettuce and creamy mayo." },
    { name: "Chicken Burger", price: 70, original: 100, off: 30, isVeg: false, description: "Juicy fried chicken patty topped with secret sauces." },
  ],
  chicken: [
    { name: "Chicken Popcorn", price: 50, original: 70, off: 29, isVeg: false, description: "Bite-sized, crunchy fried chicken pieces." },
    { name: "Chicken Hot Wings", price: 70, original: 100, off: 30, isVeg: false, description: "Spicy and crispy chicken wings tossed in hot sauce." },
    { name: "Chicken Drumstick", price: 100, original: 150, off: 33, top: 2, isVeg: false, description: "Classic crispy fried chicken drumsticks." },
  ],
  dessert: [
    { name: "Classic Cinnamon Churros", price: 50, original: 70, off: 29, isVeg: true, description: "Crispy fried dough dusted with cinnamon sugar." },
    { name: "Chocolate Waffle", price: 70, original: 100, off: 30, isVeg: true, description: "Freshly baked waffle loaded with melted chocolate." },
  ],
  drinks: [
    { name: "Masala Coke", price: 50, original: 70, off: 29, isVeg: true, description: "Refreshing cola mixed with Indian spices." },
    { name: "Lime Soda", price: 70, original: 100, off: 30, isVeg: true, description: "Sweet and salty fizzy lemon drink." },
  ],
};

// Swiggy style Veg/Non-veg icon
function DietTag({ isVeg }) {
  return (
    <div className={`border w-4 h-4 flex items-center justify-center rounded-sm ${isVeg ? 'border-green-600' : 'border-red-600'}`}>
      <div className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
    </div>
  );
}

function ItemRow({ item, onClick, index }) {
  return (
    <motion.button
      onClick={() => onClick(item)}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      viewport={{ once: true }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-start gap-4 py-6 text-left border-b border-white/10"
    >
      <div className="flex-1 min-w-0">
        {/* Diet Tag */}
        <div className="mb-1.5">
          <DietTag isVeg={item.isVeg} />
        </div>
        
        <h3 className="text-white font-semibold text-lg leading-snug">
          {item.name}
        </h3>
        
        <div className="flex items-center gap-2 mt-1">
          <span className="text-white font-bold text-base">₹{item.price}</span>
          <span className="text-gray-500 text-sm line-through">₹{item.original}</span>
          <span className="text-green-500 text-xs font-bold">{item.off}% OFF</span>
        </div>
        
        {/* Description */}
        <p className="text-gray-400 text-sm mt-2 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Thumbnail & Add Button */}
      <div className="relative w-28 h-28 rounded-2xl bg-neutral-900 flex flex-col items-center justify-center shrink-0 overflow-hidden shadow-lg border border-white/5">
        <Pizza size={32} className="text-red-600/40 mb-3" />
        
        {item.top && (
          <span className="absolute top-0 left-0 w-full bg-red-600 text-[10px] font-bold text-center py-0.5 shadow-md">
            TOP #{item.top}
          </span>
        )}

        <button 
          onClick={(e) => { e.stopPropagation(); onClick(item); }}
          className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 bg-white text-black font-extrabold text-sm px-6 py-1.5 rounded-lg shadow-lg border border-gray-200 uppercase tracking-wide hover:bg-gray-100 transition-colors"
        >
          Add
        </button>
      </div>
    </motion.button>
  );
}

function ItemModal({ item, onClose }) {
  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center md:justify-center"
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full md:max-w-md bg-neutral-950 rounded-t-3xl md:rounded-3xl border-t md:border border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 md:hidden">
            <span className="w-10 h-1 bg-white/20 rounded-full" />
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white"
          >
            <X size={18} />
          </button>

          <div className="relative h-64 flex items-center justify-center overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-linear-to-br from-red-600/20 via-black to-black" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-red-600/20 rounded-full blur-[80px]" />
            <motion.div
              initial={{ scale: 0.7, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative z-10"
            >
              <Pizza size={110} className="text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]" />
            </motion.div>

            {item.top && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-red-600 rounded-full px-3 py-1.5 z-10">
                <Crown size={14} className="text-white" />
                <span className="text-white text-xs font-bold">
                  #{item.top} Top Order
                </span>
              </div>
            )}
          </div>

          <div className="p-6 pb-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame size={14} className="text-red-600" />
                <span className="text-red-600 text-xs uppercase tracking-widest font-semibold">
                  {item.off}% OFF Today
                </span>
              </div>
              <DietTag isVeg={item.isVeg} />
            </div>

            <h2 className="text-3xl font-(--font-bebas) text-white leading-none">
              {item.name}
            </h2>

            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              {item.description}
            </p>

            <div className="flex items-center gap-3 mt-6">
              <span className="text-4xl font-bold text-white">₹{item.price}</span>
              <span className="text-gray-500 text-lg line-through">₹{item.original}</span>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Add to Cart
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function MenuPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVegOnly, setIsVegOnly] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      {/* 1. Add your Navbar component here */}
      <Navbar />
      <div className="h-18" aria-hidden="true" />

      {/* Header */}
      <div className="px-6 pt-10 pb-4 text-center">
        <p className="text-yellow-400 uppercase tracking-[5px] font-semibold text-xs">
          Order Now
        </p>
        <h1 className="text-4xl font-(--font-bebas) mt-2 leading-none">
          EXPLORE{" "}
          <span className="bg-linear-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            PIZZAFLIX
          </span>
        </h1>
        <p className="text-gray-600 text-xs">
          Disclaimer: Prices may vary online and offline
        </p>
      </div>

      {/* 2. Change 'top-0' to 'top-16' (or your Navbar height) so it sticks right below it */}
      <div className="sticky top-24 z-30 bg-black/95 backdrop-blur-md border-b border-white/10 px-6 py-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-600/50 transition-colors"
          />
        </div>

        {/* Veg/Non-Veg Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsVegOnly(!isVegOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
              isVegOnly 
                ? "border-green-600 bg-green-600/10 text-green-500" 
                : "border-white/20 bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            <DietTag isVeg={true} />
            Veg Only
          </button>
        </div>
      </div>

      {/* Item List with Between-Headers */}
      <div className="px-6 mt-6">
        {categories.map((category) => {
          // Filter items based on search and veg toggle
          const filteredItems = menuData[category.id].filter((item) => {
            const matchesSearch = 
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
              item.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesVeg = isVegOnly ? item.isVeg === true : true;
            
            return matchesSearch && matchesVeg;
          });

          // Don't render category if no items match
          if (filteredItems.length === 0) return null;

          const CategoryIcon = category.icon;

          return (
            <div key={category.id} className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-white/10 flex items-center gap-3">
                <CategoryIcon size={24} className="text-red-600" />
                {category.label}
              </h2>
              
              <div className="flex flex-col">
                {filteredItems.map((item, index) => (
                  <ItemRow
                    key={item.name}
                    item={item}
                    index={index}
                    onClick={setSelectedItem}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {categories.every(cat => 
          menuData[cat.id].filter(item => 
            (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (isVegOnly ? item.isVeg : true)
          ).length === 0
        ) && (
          <div className="text-center py-20 text-gray-500">
            <Search size={48} className="mx-auto mb-4 opacity-20" />
            <p>No dishes found matching your search.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedItem && (
        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
      <Footer />
      
    </main>
  );
}