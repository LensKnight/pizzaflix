"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  XCircle,
  ChefHat,
  Package,
  PartyPopper,
  LucideIcon,
  Loader2,
  Utensils,
  Volume2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface OrderItem {
  name: string;
  price: number;
  qty: number;
}

interface Order {
  order_number: string;
  customer_name: string;
  phone: string;
  items: OrderItem[];
  total: number;
  status: string;
  created_at: string;
  expires_at: string | null;
}

interface StatusDisplayConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: LucideIcon;
  message: string;
  stepIndex: number;
}

const statusDisplay: Record<string, StatusDisplayConfig> = {
  pending: {
    label: "Order Placed",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: Clock,
    message: "Waiting for the counter to accept your order...",
    stepIndex: 0,
  },
  preparing: {
    label: "Accepted — Preparing",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: ChefHat,
    message: "Your order is baking freshly in our oven right now!",
    stepIndex: 1,
  },
  ready: {
    label: "Ready for Pickup",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    icon: Package,
    message: "Your order is hot & ready! Please collect at counter.",
    stepIndex: 2,
  },
  completed: {
    label: "Completed",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: PartyPopper,
    message: "Order completed. Enjoy your delicious pizza!",
    stepIndex: 3,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: XCircle,
    message: "This order was cancelled by the store.",
    stepIndex: -1,
  },
};

const steps = ["Placed", "Preparing", "Ready", "Enjoy!"];

export default function OrderReceiptPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);

  // Sound ref & previous status tracking
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevStatusRef = useRef<string | null>(null);

  useEffect(() => {
    // MP3 Audio Initialize
    audioRef.current = new Audio("/accept.mp3");

    async function fetchOrder() {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", params.id)
        .maybeSingle();

      if (error) console.error("Fetch order error:", error);

      if (data) {
        setOrder(data);
        prevStatusRef.current = data.status;
        if (data.expires_at) {
          setIsExpired(new Date(data.expires_at) < new Date());
        }
      }
      setLoading(false);
    }
    fetchOrder();

    const channel = supabase
      .channel(`order-${params.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `order_number=eq.${params.id}`,
        },
        (payload) => {
          const newOrder = payload.new as Order;
          
          // Trigger audio only when order changes to 'ready'
          if (newOrder.status === "ready" && prevStatusRef.current !== "ready") {
            playAlertSound();
          }

          prevStatusRef.current = newOrder.status;
          setOrder(newOrder);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [params.id]);

  // Audio trigger helper function
  const playAlertSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        // Handle browser autoplay restriction silently
        console.warn("Autoplay audio blocked by browser policy:", err);
      });
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-red-600" size={32} />
        <p className="text-gray-400 text-sm">Fetching order receipt...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="h-18" />
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
          <XCircle size={48} className="text-gray-700 mb-4" />
          <h2 className="text-2xl font-(--font-bebas)">ORDER NOT FOUND</h2>
          <p className="text-gray-500 text-sm mt-2">
            This order token doesn't exist or the link is incorrect.
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  const currentStatus = statusDisplay[order.status] || statusDisplay.pending;

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="h-18" />

      <section className="px-6 py-12 max-w-md mx-auto">
        {isExpired ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
            <XCircle size={56} className="text-red-600 mx-auto mb-4" />
            <h1 className="text-3xl font-(--font-bebas)">TOKEN EXPIRED</h1>
            <p className="text-gray-400 text-sm mt-3 max-w-xs mx-auto">
              This order token ({order.order_number}) is no longer valid. If
              you haven't collected your order, please contact the counter.
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6"
            >
              <CheckCircle2 size={48} className="text-green-500 mx-auto mb-3" />
              <h1 className="text-3xl font-(--font-bebas) tracking-wider">ORDER PLACED</h1>
              <p className="text-gray-400 text-xs mt-1">
                Show this token at the counter to collect your order.
              </p>
            </motion.div>

            {/* Step Tracker */}
            {currentStatus.stepIndex >= 0 && (
              <div className="mb-6 px-2">
                <div className="flex justify-between items-center relative">
                  <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-neutral-800 -translate-y-1/2 z-0" />
                  <div
                    className="absolute top-1/2 left-0 h-[2px] bg-red-600 -translate-y-1/2 z-0 transition-all duration-500"
                    style={{
                      width: `${(currentStatus.stepIndex / (steps.length - 1)) * 100}%`,
                    }}
                  />
                  {steps.map((step, idx) => {
                    const isPassed = idx <= currentStatus.stepIndex;
                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            isPassed
                              ? "bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                              : "bg-neutral-800 text-neutral-500 border border-neutral-700"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <span className={`text-[10px] mt-1 ${isPassed ? "text-gray-300 font-medium" : "text-neutral-600"}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Receipt Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Header Token */}
              <div className="bg-red-600 text-center py-5 relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 opacity-10 text-white">
                  <Utensils size={100} />
                </div>
                <p className="text-white/80 text-[11px] uppercase tracking-widest font-semibold">Your Order Token</p>
                <h2 className="text-4xl font-(--font-bebas) text-white mt-0.5 tracking-wider">
                  {order.order_number}
                </h2>
              </div>

              <div className="p-6">
                <div className="flex justify-between text-xs text-gray-400 mb-4 pb-3 border-b border-white/5">
                  <span className="font-medium text-gray-300">{order.customer_name}</span>
                  <span>{order.phone}</span>
                </div>

                <div className="space-y-2.5">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-300">
                        <strong className="text-red-500 font-semibold">{item.qty}x</strong> {item.name}
                      </span>
                      <span className="text-white font-medium">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-5">
                  <span className="text-gray-400 text-sm">Total Amount</span>
                  <span className="text-2xl font-bold text-white">₹{order.total}</span>
                </div>

                {/* Animated Status Section */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={order.status}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`flex flex-col items-center justify-center mt-6 ${currentStatus.bg} border ${currentStatus.border} rounded-xl p-5 relative overflow-hidden`}
                  >
                    {/* Status Visual Animation */}
                    <div className="mb-2 relative flex items-center justify-center">
                      {order.status === "pending" && (
                        <div className="relative flex items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-amber-400 opacity-30" />
                          <Clock className="text-amber-400 animate-pulse relative z-10" size={32} />
                        </div>
                      )}

                      {order.status === "preparing" && (
                        <div className="relative">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                            className="absolute -inset-2 border border-blue-500/30 rounded-full border-dashed"
                          />
                          <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            <ChefHat className="text-blue-400 relative z-10" size={34} />
                          </motion.div>
                        </div>
                      )}

                      {order.status === "ready" && (
                        <motion.div
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ repeat: Infinity, duration: 0.8 }}
                          className="relative"
                        >
                          <span className="animate-ping absolute -inset-2 rounded-full bg-orange-500/40" />
                          <Package className="text-orange-400 relative z-10" size={34} />
                        </motion.div>
                      )}

                      {order.status === "completed" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <PartyPopper className="text-emerald-400" size={34} />
                        </motion.div>
                      )}

                      {order.status === "cancelled" && (
                        <XCircle className="text-red-400" size={34} />
                      )}
                    </div>

                    <span className={`${currentStatus.color} text-sm font-bold uppercase tracking-wider`}>
                      {currentStatus.label}
                    </span>

                    {/* Test Audio Button if ready */}
                    {order.status === "ready" && (
                      <button
                        onClick={playAlertSound}
                        className="mt-2 flex items-center gap-1.5 text-[10px] text-orange-400/80 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20 hover:bg-orange-500/20 transition-all"
                      >
                        <Volume2 size={12} /> Replay Alert Sound
                      </button>
                    )}

                    {/* Animated Jumping Dots for Pending State */}
                    {order.status === "pending" && (
                      <div className="flex gap-1.5 my-1.5">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
                      </div>
                    )}

                    <p className="text-gray-300 text-xs text-center mt-1 max-w-[240px]">
                      {currentStatus.message}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {order.expires_at && order.status !== "completed" && (
                  <p className="text-gray-500 text-[11px] text-center mt-4">
                    Valid until{" "}
                    {new Date(order.expires_at).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </motion.div>

            <p className="text-gray-500 text-[11px] text-center mt-5">
              Please pay at the counter. This token acts as your receipt.
            </p>
          </>
        )}
      </section>

      <Footer />
    </main>
  );
}