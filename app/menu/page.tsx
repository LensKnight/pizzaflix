"use client";

import { useState, useEffect } from "react";
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
  Check,
  LucideIcon,
} from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useCart } from "@/lib/CartContext";
import { supabase } from "@/lib/supabase";

interface MenuItem {
  id: string;
  category: string;
  name: string;
  price: number;
  original_price: number;
  is_veg: boolean;
  description: string;
  image: string;
  is_top: boolean;
  is_available: boolean;
}

interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
}

const categories: Category[] = [
  { id: "pizza", label: "Pizza", icon: Pizza },
  { id: "momo", label: "Momo", icon: Soup },
  { id: "burger", label: "Burger", icon: Sandwich },
  { id: "chicken", label: "Fried Chicken", icon: Drumstick },
  { id: "dessert", label: "Dessert", icon: IceCream2 },
  { id: "drinks", label: "Drinks", icon: CupSoda },
];

function getOffPercent(price: number, original: number) {
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}

function DietTag({ isVeg }: { isVeg: boolean }) {
  return (
    <div
      className={`border w-4 h-4 flex items-center justify-center rounded-sm ${
        isVeg ? "border-green-600" : "border-red-600"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          isVeg ? "bg-green-600" : "bg-red-600"
        }`}
      />
    </div>
  );
}

interface ItemRowProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
  onAdd: (item: MenuItem) => void;
  index: number;
}

function ItemRow({ item, onClick, onAdd, index }: ItemRowProps) {
  const off = getOffPercent(item.price, item.original_price);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={() => onClick(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick(item);
      }}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      viewport={{ once: true }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-start gap-4 py-6 text-left border-b border-white/10 cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <div className="mb-1.5">
          <DietTag isVeg={item.is_veg} />
        </div>

        <h3 className="text-white font-semibold text-lg leading-snug">
          {item.name}
        </h3>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-white font-bold text-base">₹{item.price}</span>
          {item.original_price > item.price && (
            <>
              <span className="text-gray-500 text-sm line-through">
                ₹{item.original_price}
              </span>
              <span className="text-green-500 text-xs font-bold">
                {off}% OFF
              </span>
            </>
          )}
        </div>

        <p className="text-gray-400 text-sm mt-2 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>

      <div className="relative w-28 h-28 rounded-2xl bg-neutral-900 shrink-0 overflow-hidden shadow-lg border border-white/5">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />

        {item.is_top && (
          <span className="absolute top-0 left-0 w-full bg-red-600 text-[10px] font-bold text-center py-0.5 shadow-md z-10">
            TOP PICK
          </span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd(item);
          }}
          className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-white text-black font-extrabold text-xs px-5 py-1 rounded-lg shadow-lg border border-gray-200 uppercase tracking-wide hover:bg-gray-100 active:scale-95 transition-all z-10"
        >
          Add
        </button>
      </div>
    </motion.div>
  );
}

interface ItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAdd: (item: MenuItem) => void;
}

function ItemModal({ item, onClose, onAdd }: ItemModalProps) {
  if (!item) return null;
  const off = getOffPercent(item.price, item.original_price);

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
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-neutral-950 z-10" />
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />

            {item.is_top && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-red-600 rounded-full px-3 py-1.5 z-20">
                <Crown size={14} className="text-white" />
                <span className="text-white text-xs font-bold">Top Pick</span>
              </div>
            )}
          </div>

          <div className="p-6 pb-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              {off > 0 && (
                <div className="flex items-center gap-2">
                  <Flame size={14} className="text-red-600" />
                  <span className="text-red-600 text-xs uppercase tracking-widest font-semibold">
                    {off}% OFF Today
                  </span>
                </div>
              )}
              <DietTag isVeg={item.is_veg} />
            </div>

            <h2 className="text-3xl font-bold text-white leading-none">
              {item.name}
            </h2>

            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              {item.description}
            </p>

            <div className="flex items-center gap-3 mt-6">
              <span className="text-4xl font-bold text-white">₹{item.price}</span>
              {item.original_price > item.price && (
                <span className="text-gray-500 text-lg line-through">
                  ₹{item.original_price}
                </span>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onAdd(item);
                onClose();
              }}
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
  const { addItem } = useCart();
  const [menuData, setMenuData] = useState<Record<string, MenuItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isVegOnly, setIsVegOnly] = useState<boolean>(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    async function fetchMenu() {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("is_available", true)
        .order("is_top", { ascending: false })
        .order("name");

      if (error) console.error("Fetch menu error:", error);

      if (data) {
        const grouped: Record<string, MenuItem[]> = {};
        for (const item of data) {
          if (!grouped[item.category]) grouped[item.category] = [];
          grouped[item.category].push(item);
        }
        setMenuData(grouped);
      }
      setLoading(false);
    }
    fetchMenu();
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    addItem({ name: item.name, price: item.price });
    setToastMessage(`${item.name} added to cart!`);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  return (
    <main className="bg-black text-white pb-20">
      <Navbar />
      <div className="h-18" aria-hidden="true" />

      <div className="px-6 pt-10 pb-4 text-center">
        <p className="text-yellow-400 uppercase tracking-[5px] font-semibold text-xs">
          Order Now
        </p>
        <h1 className="text-4xl font-bold mt-2 leading-none">
          EXPLORE{" "}
          <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            PIZZAFLIX
          </span>
        </h1>
        <p className="text-gray-600 text-xs">
          Disclaimer: Prices may vary online and offline
        </p>
      </div>

      <div className="sticky top-18 z-40 bg-black/30 backdrop-blur-md border-b border-white/5 px-6 py-4 space-y-4">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-600/50 transition-colors"
          />
        </div>

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

      {loading ? (
        <div className="text-center py-32 text-gray-500 text-sm">
          Loading menu...
        </div>
      ) : (
        <div className="px-6 mt-6">
          {categories.map((category) => {
            const items = menuData[category.id] || [];
            const filteredItems = items.filter((item) => {
              const matchesSearch =
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase());
              const matchesVeg = isVegOnly ? item.is_veg === true : true;

              return matchesSearch && matchesVeg;
            });

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
                      key={item.id}
                      item={item}
                      index={index}
                      onClick={setSelectedItem}
                      onAdd={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {categories.every((cat) => {
            const items = menuData[cat.id] || [];
            return (
              items.filter(
                (item) =>
                  (item.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                    item.description
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())) &&
                  (isVegOnly ? item.is_veg : true)
              ).length === 0
            );
          }) && (
            <div className="text-center py-20 text-gray-500">
              <Search size={48} className="mx-auto mb-4 opacity-20" />
              <p>No dishes found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAdd={handleAddToCart}
        />
      )}

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

      <div className="px-6 py-6 text-center">
        <p className="text-gray-600 text-xs">
          Images are for representation purposes only. Actual product may vary.
        </p>
      </div>

      <Footer />
    </main>
  );
}