"use client";

import { useState, useEffect } from "react";
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
}

const statusDisplay: Record<string, StatusDisplayConfig> = {
  pending: {
    label: "Order Placed",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    icon: Clock,
    message: "Waiting for the counter to accept your order.",
  },
  preparing: {
    label: "Accepted — Preparing",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: ChefHat,
    message: "Your order has been accepted and is being prepared!",
  },
  ready: {
    label: "Ready for Pickup",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    icon: Package,
    message: "Your order is ready! Please collect it at the counter.",
  },
  completed: {
    label: "Completed",
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    icon: PartyPopper,
    message: "Order completed. Thank you for choosing PizzaFlix!",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: XCircle,
    message: "This order has been cancelled.",
  },
};

export default function OrderReceiptPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", params.id)
        .maybeSingle();

      if (error) console.error("Fetch order error:", error);

      if (data) {
        setOrder(data);
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
          setOrder(payload.new as Order);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-500">Loading order...</p>
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
  const StatusIcon = currentStatus.icon;

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="h-18" />

      <section className="px-6 py-16 max-w-md mx-auto">
        {isExpired ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="text-center mb-8"
            >
              <CheckCircle2 size={56} className="text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-(--font-bebas)">ORDER PLACED!</h1>
              <p className="text-gray-400 text-sm mt-2">
                Show this token at the counter to collect your order.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="bg-red-600 text-center py-6">
                <p className="text-white/70 text-xs uppercase tracking-widest">Your Token</p>
                <h2 className="text-4xl font-(--font-bebas) text-white mt-1 tracking-wide">
                  {order.order_number}
                </h2>
              </div>

              <div className="p-6">
                <div className="flex justify-between text-sm text-gray-400 mb-4">
                  <span>{order.customer_name}</span>
                  <span>{order.phone}</span>
                </div>

                <div className="space-y-2 border-t border-white/10 pt-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-300">{item.qty}x {item.name}</span>
                      <span className="text-white">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-4">
                  <span className="text-gray-400">Total</span>
                  <span className="text-2xl font-bold">₹{order.total}</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={order.status}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`flex flex-col items-center gap-2 justify-center mt-6 ${currentStatus.bg} border ${currentStatus.border} rounded-xl py-4 px-4`}
                  >
                    <div className="flex items-center gap-2">
                      <StatusIcon size={18} className={currentStatus.color} />
                      <span className={`${currentStatus.color} text-sm font-bold uppercase tracking-wide`}>
                        {currentStatus.label}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs text-center">
                      {currentStatus.message}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {order.expires_at && order.status !== "completed" && (
                  <p className="text-gray-600 text-xs text-center mt-4">
                    Valid until{" "}
                    {new Date(order.expires_at).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </motion.div>

            <p className="text-gray-600 text-xs text-center mt-6">
              Please pay at the counter. This is not a payment confirmation.
            </p>
          </>
        )}
      </section>

      <Footer />
    </main>
  );
}