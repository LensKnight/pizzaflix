"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Phone,
  Package,
  Hash,
  Volume2,
  VolumeX,
  Power,
  ChefHat,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  created_at: string;
}

const statusConfig = {
  pending: { label: "Pending", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30", icon: Clock },
  preparing: { label: "Preparing", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30", icon: ChefHat },
  ready: { label: "Ready for Pickup", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30", icon: Package },
  completed: { label: "Completed", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/30", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30", icon: XCircle },
};

const statusFlow: Order["status"][] = ["pending", "preparing", "ready", "completed"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [shopOpen, setShopOpen] = useState(true);
  const [togglingShop, setTogglingShop] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/notification.wav");
      audioRef.current.loop = false;
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchShopStatus();
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const hasPending = orders.some((o) => o.status === "pending");

    if (hasPending && soundEnabled && audioUnlocked) {
      if (!soundIntervalRef.current) {
        audioRef.current?.play().catch(() => {});
        soundIntervalRef.current = setInterval(() => {
          audioRef.current?.play().catch(() => {});
        }, 4000);
      }
    } else {
      if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
        soundIntervalRef.current = null;
      }
    }

    return () => {
      if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
        soundIntervalRef.current = null;
      }
    };
  }, [orders, soundEnabled, audioUnlocked]);

  function unlockAudio() {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          audioRef.current?.pause();
          audioRef.current!.currentTime = 0;
          setAudioUnlocked(true);
        })
        .catch((err) => console.error("Audio unlock failed:", err));
    }
  }

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Fetch orders error:", error);
    if (data) setOrders(data);
    setLoading(false);
  }

  async function fetchShopStatus() {
    const { data, error } = await supabase
      .from("shop_status")
      .select("is_open")
      .eq("id", 1)
      .maybeSingle();

    if (error) console.error("Fetch shop status error:", error);
    if (data) setShopOpen(data.is_open);
  }

  async function toggleShopStatus() {
    setTogglingShop(true);
    const newStatus = !shopOpen;
    const { error } = await supabase
      .from("shop_status")
      .update({ is_open: newStatus, updated_at: new Date().toISOString() })
      .eq("id", 1);

    if (!error) setShopOpen(newStatus);
    else console.error("Toggle shop status error:", error);
    setTogglingShop(false);
  }

  async function updateStatus(id: string, newStatus: Order["status"]) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Update status error:", error);
      fetchOrders();
    }
  }

  function nextStatus(current: Order["status"]) {
    const idx = statusFlow.indexOf(current);
    if (idx === -1 || idx === statusFlow.length - 1) return null;
    return statusFlow[idx + 1];
  }

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Sound unlock banner */}
      {!audioUnlocked && (
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={unlockAudio}
          className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black text-sm font-bold py-2.5 text-center hover:bg-yellow-400 transition-colors"
        >
          🔊 Click to Enable Sound Alerts
        </motion.button>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        <div className={`flex items-center justify-between mb-8 ${!audioUnlocked ? "mt-8" : ""}`}>
          <div>
            <h1 className="text-3xl font-(--font-bebas) bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">
              ORDERS ADMIN
            </h1>
            {pendingCount > 0 && (
              <motion.p
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-yellow-500 text-xs font-semibold mt-1"
              >
                {pendingCount} new order{pendingCount > 1 ? "s" : ""} waiting
              </motion.p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-gray-400 hover:text-white transition-colors"
              title={soundEnabled ? "Mute alerts" : "Unmute alerts"}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button onClick={fetchOrders} className="text-gray-400 hover:text-white text-sm transition-colors">
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Shop open/closed toggle — the main feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-2xl border p-6 mb-8 transition-colors ${
            shopOpen
              ? "border-green-600/30 bg-green-600/5"
              : "border-red-600/30 bg-red-600/5"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  shopOpen ? "bg-green-600/20" : "bg-red-600/20"
                }`}
              >
                <Power size={22} className={shopOpen ? "text-green-500" : "text-red-500"} />
              </div>
              <div>
                <h2 className="font-bold text-lg">
                  {shopOpen ? "Accepting Orders" : "Orders Paused"}
                </h2>
                <p className="text-gray-400 text-sm">
                  {shopOpen
                    ? "Customers can place orders right now"
                    : "Customers will see 'PizzaFlix is closed'"}
                </p>
              </div>
            </div>

            <button
              onClick={toggleShopStatus}
              disabled={togglingShop}
              className={`relative w-16 h-9 rounded-full transition-colors disabled:opacity-50 ${
                shopOpen ? "bg-green-600" : "bg-neutral-700"
              }`}
            >
              <motion.div
                animate={{ x: shopOpen ? 28 : 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute top-1 w-7 h-7 bg-white rounded-full shadow-md"
              />
            </button>
          </div>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto mb-8 pb-2">
          {(["all", "pending", "preparing", "ready", "completed", "cancelled"] as const).map(
            (s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
                  filter === s
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {s === "all" ? "All" : statusConfig[s].label}
              </button>
            )
          )}
        </div>

        {/* Orders list */}
        <div className="space-y-4">
          {filteredOrders.length === 0 && (
            <p className="text-gray-600 text-sm text-center py-16">No orders found.</p>
          )}

          <AnimatePresence>
            {filteredOrders.map((order) => {
              const config = statusConfig[order.status];
              const StatusIcon = config.icon;
              const upcoming = nextStatus(order.status);

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`relative overflow-hidden border rounded-2xl p-5 backdrop-blur-sm transition-all ${config.border} bg-neutral-900/60 hover:border-white/20`}
                >
                  {order.status === "pending" && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 bg-yellow-500/5 pointer-events-none"
                    />
                  )}

                  <div className="relative flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold mb-1">
                        <Hash size={12} />
                        {order.order_number}
                      </div>
                      <h3 className="font-bold text-lg">{order.customer_name}</h3>
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1">
                        <Phone size={12} />
                        {order.phone}
                      </div>
                    </div>

                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}>
                      <StatusIcon size={14} />
                      {config.label}
                    </div>
                  </div>

                  <div className="relative border-t border-white/10 pt-3 mt-3 space-y-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm text-gray-300">
                        <span>{item.qty}x {item.name}</span>
                        <span>₹{item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>

                  <div className="relative flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                    <span className="text-gray-400 text-sm">Total</span>
                    <span className="text-white font-bold text-lg">₹{order.total}</span>
                  </div>

                  <div className="relative flex gap-2 mt-4">
                    {order.status === "pending" ? (
                      <button
                        onClick={() => updateStatus(order.id, "preparing")}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors shadow-lg shadow-green-600/20"
                      >
                        Accept Order
                      </button>
                    ) : (
                      upcoming && order.status !== "cancelled" && (
                        <button
                          onClick={() => updateStatus(order.id, upcoming)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                        >
                          Mark as {statusConfig[upcoming].label}
                        </button>
                      )
                    )}
                    {order.status !== "completed" && order.status !== "cancelled" && (
                      <button
                        onClick={() => updateStatus(order.id, "cancelled")}
                        className="px-4 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold py-2.5 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}