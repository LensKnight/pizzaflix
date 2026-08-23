"use client";

import { useEffect, useState } from "react";
import { UtensilsCrossed, Percent, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminOverviewPage() {
  const [totalItems, setTotalItems] = useState(0);
  const [activeOffers, setActiveOffers] = useState(0);

  useEffect(() => {
    async function getStats() {
      const { count: itemsCount } = await supabase
        .from("menu_items")
        .select("*", { count: "exact", head: true });
      const { count: offersCount } = await supabase
        .from("offers")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      if (itemsCount !== null) setTotalItems(itemsCount);
      if (offersCount !== null) setActiveOffers(offersCount);
    }
    getStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-white/10 p-5 rounded-2xl">
          <div className="flex justify-between items-center text-gray-400 mb-2">
            <span className="text-sm font-medium">Total Menu Items</span>
            <UtensilsCrossed size={18} />
          </div>
          <p className="text-3xl font-extrabold">{totalItems}</p>
        </div>

        <div className="bg-neutral-900 border border-white/10 p-5 rounded-2xl">
          <div className="flex justify-between items-center text-gray-400 mb-2">
            <span className="text-sm font-medium">Active Offers</span>
            <Percent size={18} />
          </div>
          <p className="text-3xl font-extrabold">{activeOffers}</p>
        </div>

        <div className="bg-neutral-900 border border-white/10 p-5 rounded-2xl">
          <div className="flex justify-between items-center text-gray-400 mb-2">
            <span className="text-sm font-medium">Pending Orders</span>
            <Clock size={18} />
          </div>
          <p className="text-3xl font-extrabold text-yellow-500">0</p>
        </div>
      </div>
    </div>
  );
}