"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Lock, Clock, CheckCircle2, XCircle, Phone, Package, Hash, Volume2, VolumeX } from "lucide-react";
import { supabase } from "@/lib/supabase";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

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
  preparing: { label: "Preparing", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30", icon: Package },
  ready: { label: "Ready for Pickup", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30", icon: Package },
  completed: { label: "Completed", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/30", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30", icon: XCircle },
};

const statusFlow: Order["status"][] = ["pending", "preparing", "ready", "completed"];

export default function AdminOrders() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/notification.wav");
    audioRef.current.loop = false;
  }, []);

  useEffect(() => {
    if (authed) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 8000); // poll every 8s
      return () => clearInterval(interval);
    }
  }, [authed]);

  // Sound loop control — keeps beeping while any order is pending
  useEffect(() => {
    const hasPending = orders.some((o) => o.status === "pending");

    if (hasPending && soundEnabled) {
      if (!soundIntervalRef.current) {
        // play immediately, then every 4s
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
  }, [orders, soundEnabled]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      setLoginError("Incorrect password");
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

  if (!authed) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-6">
        <form
          onSubmit={handleLogin}
          className="bg-neutral-900 border border-white/10 rounded-2xl p-8 max-w-sm w-full"
        >
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <Lock size={20} />
            <h1 className="text-xl font-bold text-white">Admin Login</h1>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white mb-4 outline-none focus:border-red-600"
          />
          {loginError && <p className="text-red-500 text-sm mb-4">{loginError}</p>}
          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg">
            Login
          </button>
        </form>
      </main>
    );
  }

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-(--font-bebas)">ORDERS ADMIN</h1>
            {pendingCount > 0 && (
              <p className="text-yellow-500 text-xs font-semibold mt-1">
                {pendingCount} new order{pendingCount > 1 ? "s" : ""} waiting
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-gray-400 hover:text-white"
              title={soundEnabled ? "Mute alerts" : "Unmute alerts"}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button onClick={fetchOrders} className="text-gray-400 hover:text-white text-sm">
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto mb-8 pb-2">
          {(["all", "pending", "preparing", "ready", "completed", "cancelled"] as const).map(
            (s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold capitalize transition-colors ${
                  filter === s
                    ? "bg-red-600 text-white"
                    : "bg-white/5 text-gray-400 hover:text-white"
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
            <p className="text-gray-600 text-sm text-center py-10">No orders found.</p>
          )}

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
                className={`border rounded-xl p-5 ${config.border} bg-neutral-900 ${
                  order.status === "pending" ? "animate-pulse" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-3">
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

                {/* Items */}
                <div className="border-t border-white/10 pt-3 mt-3 space-y-1">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-gray-300">
                      <span>{item.qty}x {item.name}</span>
                      <span>₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                  <span className="text-gray-400 text-sm">Total</span>
                  <span className="text-white font-bold text-lg">₹{order.total}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  {order.status === "pending" ? (
                    <button
                      onClick={() => updateStatus(order.id, "preparing")}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
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
        </div>
      </div>
    </main>
  );
}