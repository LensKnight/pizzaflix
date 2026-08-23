"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function generateOrderNumber() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `PF-${num}`;
}

export default function CheckoutPage() {
  const { cart, updateQty, removeItem, total, clearCart } = useCart();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!name || !phone || cart.length === 0) return;
    setLoading(true);

    const orderNumber = generateOrderNumber();

    const { error } = await supabase.from("orders").insert([
      {
        order_number: orderNumber,
        customer_name: name,
        phone,
        items: cart,
        total,
        status: "pending",
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Something went wrong. Please try again.");
      console.error(error);
      return;
    }

    clearCart();
    router.push(`/order/${orderNumber}`);
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="h-18" />
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
          <ShoppingBag size={48} className="text-gray-700 mb-4" />
          <h2 className="text-2xl font-(--font-bebas)">YOUR CART IS EMPTY</h2>
          <p className="text-gray-500 text-sm mt-2">Add items from the menu to get started.</p>
          <a href="/menu" className="mt-6 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-sm font-semibold transition-colors">
            Browse Menu
          </a>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="h-18" />

      <section className="px-6 py-10 max-w-2xl mx-auto">
        <h1 className="text-3xl font-(--font-bebas) mb-6">YOUR ORDER</h1>

        {/* Cart items */}
        <div className="space-y-3 mb-8">
          {cart.map((item) => (
            <div key={item.name} className="flex items-center justify-between bg-neutral-900 border border-white/10 rounded-xl p-4">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-500 text-sm">₹{item.price} each</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => updateQty(item.name, item.qty - 1)} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center">{item.qty}</span>
                <button onClick={() => updateQty(item.name, item.qty + 1)} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                  <Plus size={14} />
                </button>
                <button onClick={() => removeItem(item.name)} className="text-red-600 ml-2">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center border-t border-white/10 pt-4 mb-8">
          <span className="text-gray-400">Total</span>
          <span className="text-2xl font-bold">₹{total}</span>
        </div>

        {/* Customer details */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Your Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-600/50"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Phone Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 xxxxx xxxxx"
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-600/50"
            />
          </div>
        </div>

        <p className="text-gray-500 text-xs mb-6 text-center">
          This order is for counter pickup. You'll get a token to show at the counter.
        </p>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleConfirm}
          disabled={!name || !phone || loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-semibold py-4 rounded-xl transition-all"
        >
          {loading ? "Placing Order..." : "Confirm Order"}
        </motion.button>
      </section>

      <Footer />
    </main>
  );
}