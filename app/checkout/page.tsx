"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, Store, UserCheck, Tag, X, Check, Loader2 } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

function generateOrderNumber() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `PF-${num}`;
}

interface AppliedOffer {
  id: string;
  code: string;
  title: string;
  discount_percent: number;
}

export default function CheckoutPage() {
  const { cart, updateQty, removeItem, total, clearCart } = useCart();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [shopOpen, setShopOpen] = useState<boolean | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedOffer, setAppliedOffer] = useState<AppliedOffer | null>(null);
  const [couponError, setCouponError] = useState("");
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  useEffect(() => {
    fetchProfileAndAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        fetchProfileAndAuth();
      }
    });

    async function checkShopStatus() {
      const { data } = await supabase
        .from("shop_status")
        .select("is_open")
        .eq("id", 1)
        .maybeSingle();

      setShopOpen(data ? data.is_open : true);
    }

    checkShopStatus();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchProfileAndAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      setIsLoggedIn(true);

      const { data: profile } = await supabase
        .from("profiles")
        .select("name, phone")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        if (profile.name) setName(profile.name);
        if (profile.phone) setPhone(profile.phone);
      } else {
        const googleName = session.user.user_metadata?.full_name || session.user.user_metadata?.name;
        if (googleName) setName(googleName);
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  // ---- Coupon logic ----
  async function handleApplyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    setCheckingCoupon(true);
    setCouponError("");

    const { data, error } = await supabase
      .from("offers")
      .select("id, code, title, discount_percent, is_active, min_order_value")
      .eq("code", code)
      .maybeSingle();

    setCheckingCoupon(false);

    if (error || !data) {
      setCouponError("Invalid coupon code.");
      return;
    }

    if (!data.is_active) {
      setCouponError("This coupon is no longer active.");
      return;
    }

    if (data.min_order_value && total < data.min_order_value) {
      setCouponError(`This coupon needs a minimum order of ₹${data.min_order_value}.`);
      return;
    }

    setAppliedOffer({
      id: data.id,
      code: data.code,
      title: data.title,
      discount_percent: data.discount_percent,
    });
    setCouponInput("");
    setCouponError("");
  }

  function removeCoupon() {
    setAppliedOffer(null);
    setCouponError("");
  }

  const discountAmount = appliedOffer
    ? Math.round((total * appliedOffer.discount_percent) / 100)
    : 0;
  const finalTotal = total - discountAmount;

  const handleConfirm = async () => {
    if (!name || !phone || cart.length === 0 || !shopOpen) return;
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      await supabase.from("profiles").upsert({
        id: session.user.id,
        name,
        phone,
      });
    }

    const orderNumber = generateOrderNumber();

    const { error } = await supabase.from("orders").insert([
      {
        order_number: orderNumber,
        customer_name: name,
        phone,
        items: cart,
        total: finalTotal,
        coupon_code: appliedOffer?.code || null,
        discount_amount: discountAmount,
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
          <a
            href="/menu"
            className="mt-6 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
          >
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-(--font-bebas)">YOUR ORDER</h1>

          {!isLoggedIn ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              🔑 Log in for Faster Checkout
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-green-400 font-semibold bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg">
              <UserCheck size={14} /> Logged In
            </div>
          )}
        </div>

        {shopOpen === false && (
          <div className="mb-6 p-4 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center gap-3 text-red-500">
            <Store size={20} className="shrink-0" />
            <p className="text-sm font-semibold">
              PizzaFlix is currently closed for new orders. Please check back later.
            </p>
          </div>
        )}

        {/* Cart items */}
        <div className="space-y-3 mb-6">
          {cart.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between bg-neutral-900 border border-white/10 rounded-xl p-4"
            >
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-500 text-sm">₹{item.price} each</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQty(item.name, item.qty - 1)}
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.name, item.qty + 1)}
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Plus size={14} />
                </button>
                <button onClick={() => removeItem(item.name)} className="text-red-600 hover:text-red-500 ml-2">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon section */}
        <div className="mb-6">
          {!appliedOffer ? (
            <div>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 bg-neutral-900 border border-white/10 rounded-xl px-4 py-3">
                  <Tag size={16} className="text-gray-500 shrink-0" />
                  <input
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    placeholder="Have a coupon code?"
                    className="flex-1 bg-transparent text-white placeholder:text-gray-600 outline-none text-sm font-mono"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  disabled={!couponInput.trim() || checkingCoupon}
                  className="bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white text-sm font-semibold px-5 rounded-xl transition-colors flex items-center gap-2"
                >
                  {checkingCoupon ? <Loader2 size={16} className="animate-spin" /> : "Apply"}
                </button>
              </div>
              {couponError && (
                <p className="text-red-500 text-xs mt-2 ml-1">{couponError}</p>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-green-600/10 border border-green-600/30 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-400">
                    {appliedOffer.code} applied
                  </p>
                  <p className="text-xs text-gray-400">{appliedOffer.title}</p>
                </div>
              </div>
              <button onClick={removeCoupon} className="text-gray-400 hover:text-white p-1">
                <X size={16} />
              </button>
            </motion.div>
          )}
        </div>

        {/* Bill summary */}
        <div className="border-t border-white/10 pt-4 mb-8 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-gray-300">₹{total}</span>
          </div>

          <AnimatePresence>
            {appliedOffer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-between items-center text-sm overflow-hidden"
              >
                <span className="text-green-500">Discount ({appliedOffer.discount_percent}%)</span>
                <span className="text-green-500">−₹{discountAmount}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center pt-2 border-t border-white/10">
            <span className="text-gray-400">Total</span>
            <span className="text-2xl font-bold">₹{finalTotal}</span>
          </div>
        </div>

        {/* Customer details */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Your Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              disabled={shopOpen === false}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-600/50 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Phone Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 xxxxx xxxxx"
              disabled={shopOpen === false}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-600/50 disabled:opacity-50"
            />
          </div>
        </div>

        <p className="text-gray-500 text-xs mb-6 text-center">
          This order is for counter pickup. You'll get a token to show at the counter.
        </p>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleConfirm}
          disabled={!name || !phone || loading || shopOpen === false}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-semibold py-4 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          {loading
            ? "Placing Order..."
            : shopOpen === false
            ? "Orders Currently Closed"
            : `Confirm Order · ₹${finalTotal}`}
        </motion.button>
      </section>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={fetchProfileAndAuth}
      />

      <Footer />
    </main>
  );
}