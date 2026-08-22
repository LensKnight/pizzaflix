"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Clock, CheckCircle2, XCircle, Phone, MapPin, Package } from "lucide-react";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

// TODO: replace with real type once Supabase table is ready
interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  created_at: string;
}

// TODO: remove — placeholder data until API/Supabase is connected
const dummyOrders: Order[] = [
  {
    id: "ord_1",
    customerName: "Rahul Sharma",
    phone: "+91 98765 43210",
    address: "Ananda Nagar, Adabari, Guwahati",
    items: [
      { name: "Margherita Pizza", qty: 1, price: 69 },
      { name: "Chicken Momo", qty: 2, price: 50 },
    ],
    total: 169,
    status: "pending",
    created_at: new Date().toISOString(),
  },
  {
    id: "ord_2",
    customerName: "Priya Das",
    phone: "+91 91234 56789",
    address: "Zoo Road, Guwahati",
    items: [{ name: "Chicken Golden Delight Pizza", qty: 1, price: 109 }],
    total: 109,
    status: "preparing",
    created_at: new Date().toISOString(),
  },
];

const statusConfig = {
  pending: { label: "Pending", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30", icon: Clock },
  preparing: { label: "Preparing", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30", icon: Package },
  out_for_delivery: { label: "Out for Delivery", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30", icon: Package },
  delivered: { label: "Delivered", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/30", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30", icon: XCircle },
};

const statusFlow: Order["status"][] = ["pending", "preparing", "out_for_delivery", "delivered"];

export default function AdminOrders() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");

  useEffect(() => {
    if (authed) fetchOrders();
  }, [authed]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      setLoginError("Incorrect password");
    }
  }

  function fetchOrders() {
    // TODO: replace with real fetch, e.g.
    // const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    // if (data) setOrders(data);
    setOrders(dummyOrders);
  }

  function updateStatus(id: string, newStatus: Order["status"]) {
    // TODO: replace with real update, e.g.
    // await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
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

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-(--font-bebas) mb-8">ORDERS ADMIN</h1>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto mb-8 pb-2">
          {(["all", "pending", "preparing", "out_for_delivery", "delivered", "cancelled"] as const).map(
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
                className={`border rounded-xl p-5 ${config.border} bg-neutral-900`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{order.customerName}</h3>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1">
                      <Phone size={12} />
                      {order.phone}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1">
                      <MapPin size={12} />
                      {order.address}
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
                  {upcoming && order.status !== "cancelled" && (
                    <button
                      onClick={() => updateStatus(order.id, upcoming)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                    >
                      Mark as {statusConfig[upcoming].label}
                    </button>
                  )}
                  {order.status !== "delivered" && order.status !== "cancelled" && (
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