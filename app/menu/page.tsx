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
  Check,
  ShoppingCart,
  LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useCart } from "@/lib/CartContext";

// TypeScript Interfaces
interface MenuItem {
  name: string;
  price: number;
  original: number;
  off: number;
  isVeg: boolean;
  description: string;
  image: string;
  top?: number;
}

interface Category {
  id: keyof typeof menuData;
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

const menuData: Record<string, MenuItem[]> = {
  pizza: [
    { name: "Margherita Pizza", price: 69, original: 89, off: 22, isVeg: true, description: "Classic delight with 100% real mozzarella cheese.", image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/FOOD_CATALOG/IMAGES/CMS/2026/6/21/9879cbe4-5a59-4ba1-8e76-bea7aa384886_e6a7842d-d1c7-441c-b31d-4b699bea27af.jpg" },
    { name: "Corn & Cheese Pizza", price: 79, original: 99, off: 20, isVeg: true, description: "A combination of sweet juicy corn & mozzarella cheese.", image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/FOOD_CATALOG/IMAGES/CMS/2026/6/21/79303b56-3dfe-4c20-8f43-7e8dcb8441c0_319ff08f-73da-49b0-9659-ff2362e6357b.jpg" },
    { name: "Farm Fresh Veggie", price: 89, original: 109, off: 18, isVeg: true, description: "Loaded with crunchy onions, crisp capsicum, and tomatoes.", image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/FOOD_CATALOG/IMAGES/CMS/2026/6/21/b8e35f12-ed67-4e18-8682-e6bf141acf18_d857e9f3-e90f-4afb-9817-36b26de1b499.jpg" },
    { name: "Tandoori Paneer Veg Pizza", price: 109, original: 149, off: 27, isVeg: true, description: "Spiced paneer, onions, and red paprika on a tandoori sauce base.", image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/FOOD_CATALOG/IMAGES/CMS/2024/8/21/13fec3ef-dfc9-4e23-9c93-ee05643ba986_82c544ac-3e08-4021-840d-60c2464765d8.jpg" },
    { name: "Chicken Golden Delight Pizza", price: 109, original: 149, off: 27, top: 1, isVeg: false, description: "Double pepper barbeque chicken, golden corn and extra cheese.", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop" },
    { name: "Tandoori Chicken Pizza", price: 119, original: 159, off: 25, isVeg: false, description: "Chicken tikka, onions, and spicy red paprika.", image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/FOOD_CATALOG/IMAGES/CMS/2026/6/21/52730462-be2c-4811-806f-d7af464d5b13_d235496a-9361-48c3-a0fc-d01b91d29d71.jpg" },
    { name: "Paneer Supreme (Pizzaflix Special)", price: 149, original: 185, off: 20, isVeg: true, description: "Our signature crust loaded with premium paneer cubes.", image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/FOOD_CATALOG/IMAGES/CMS/2026/6/21/3cffbe52-fbfc-48a0-af28-79f7734ca0a4_cfe729de-d7e5-4faa-8a38-1e780a168b45.jpg" },
    { name: "Chicken Supreme (Pizzaflix Special)", price: 159, original: 199, off: 20, isVeg: false, description: "The ultimate meaty pizza packed with assorted chicken toppings.", image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/FOOD_CATALOG/IMAGES/CMS/2026/6/21/4620b8f1-fde4-499c-ae53-ce8ed659858e_914e1467-c9c2-471b-91e4-2ff1855528c2.jpg" },
  ],
  momo: [
    { name: "Veg Momo", price: 40, original: 60, off: 33, isVeg: true, description: "Steamed dumplings stuffed with finely chopped fresh vegetables.", image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/FOOD_CATALOG/IMAGES/CMS/2026/6/21/563fac89-9a4c-498a-bece-0be6f2dc21a1_6d49a9f4-e271-496d-b232-2b064a1d76bd.png_compressed" },
    { name: "Chicken Momo", price: 50, original: 70, off: 29, isVeg: false, description: "Juicy steamed dumplings stuffed with minced chicken and spices.", image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/FOOD_CATALOG/IMAGES/CMS/2026/6/21/7ed5a8b9-0ae3-4311-87be-069fd9ec3e16_f3ea1293-dada-4761-ace0-e33216e00c6a.jpg" },
    { name: "Mutton Momo", price: 70, original: 100, off: 30, top: 3, isVeg: false, description: "Premium mutton mince wrapped in a delicate steamed dough.", image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=500&auto=format&fit=crop" },
    { name: "Veg Kurkure Momo", price: 60, original: 80, off: 25, isVeg: true, description: "Crunchy, deep-fried momos with a flavorful veggie filling.", image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/FOOD_CATALOG/IMAGES/CMS/2026/6/21/386898a9-d0e3-4af5-901f-0aa9288aca9f_d0aeeae7-1219-49ca-a4a8-d95251de0941.png_compressed" },
    { name: "Chicken Kurkure Momo", price: 70, original: 100, off: 30, isVeg: false, description: "Crispy fried chicken momos tossed in special seasoning.", image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/FOOD_CATALOG/IMAGES/CMS/2026/6/21/b199cefc-9b12-426a-ae29-d22604949cd5_d78983c9-a1ce-42d8-8c58-d5e5b153ddb4.png_compressed" },
    { name: "Mutton Kurkure Momo", price: 90, original: 120, off: 25, isVeg: false, description: "Extra crunchy mutton momos perfect for evening snacks.", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop" },
  ],
  burger: [
    { name: "Veg Burger", price: 50, original: 70, off: 29, isVeg: true, description: "Crispy potato patty with fresh lettuce and creamy mayo.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop" },
    { name: "Chicken Burger", price: 70, original: 100, off: 30, isVeg: false, description: "Juicy fried chicken patty topped with secret sauces.", image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500&auto=format&fit=crop" },
  ],
  chicken: [
    { name: "Chicken Popcorn", price: 50, original: 70, off: 29, isVeg: false, description: "Bite-sized, crunchy fried chicken pieces.", image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop" },
    { name: "Chicken Hot Wings", price: 70, original: 100, off: 30, isVeg: false, description: "Spicy and crispy chicken wings tossed in hot sauce.", image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&auto=format&fit=crop" },
    { name: "Chicken Drumstick", price: 100, original: 150, off: 33, top: 2, isVeg: false, description: "Classic crispy fried chicken drumsticks.", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&auto=format&fit=crop" },
  ],
  dessert: [
    { name: "Classic Cinnamon Churros", price: 50, original: 70, off: 29, isVeg: true, description: "Crispy fried dough dusted with cinnamon sugar.", image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500&auto=format&fit=crop" },
    { name: "Chocolate Waffle", price: 70, original: 100, off: 30, isVeg: true, description: "Freshly baked waffle loaded with melted chocolate.", image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&auto=format&fit=crop" },
  ],
  drinks: [
    { name: "Masala Coke", price: 50, original: 70, off: 29, isVeg: true, description: "Refreshing cola mixed with Indian spices.", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop" },
    { name: "Lime Soda", price: 70, original: 100, off: 30, isVeg: true, description: "Sweet and salty fizzy lemon drink.", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop" },
  ],
};

function DietTag({ isVeg }: { isVeg: boolean }) {
  return (
    <div className={`border w-4 h-4 flex items-center justify-center rounded-sm ${isVeg ? 'border-green-600' : 'border-red-600'}`}>
      <div className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
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

        {item.top && (
          <span className="absolute top-0 left-0 w-full bg-red-600 text-[10px] font-bold text-center py-0.5 shadow-md z-10">
            TOP #{item.top}
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
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-neutral-950 z-10" />
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />

            {item.top && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-red-600 rounded-full px-3 py-1.5 z-20">
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
              onClick={() => onAdd(item)}
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
  const { cart, addItem, total } = useCart();
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isVegOnly, setIsVegOnly] = useState<boolean>(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);

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

      <div className="sticky top-23 z-40 bg-black/30 backdrop-blur-md border-b border-white/5 px-6 py-4 space-y-4">
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

      <div className="px-6 mt-6">
        {categories.map((category) => {
          const items = menuData[category.id] || [];
          const filteredItems = items.filter((item) => {
            const matchesSearch =
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesVeg = isVegOnly ? item.isVeg === true : true;

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
                    key={item.name}
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

        {categories.every(cat => {
          const items = menuData[cat.id] || [];
          return items.filter(item =>
            (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (isVegOnly ? item.isVeg : true)
          ).length === 0;
        }) && (
          <div className="text-center py-20 text-gray-500">
            <Search size={48} className="mx-auto mb-4 opacity-20" />
            <p>No dishes found matching your search.</p>
          </div>
        )}
      </div>

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