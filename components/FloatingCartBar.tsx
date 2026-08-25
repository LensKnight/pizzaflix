"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/lib/CartContext";

export default function FloatingCartBar() {
  const { cart, total } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);

  // Hide on checkout page AND all admin pages
  if (pathname === "/checkout" || pathname.startsWith("/admin")) return null;

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-60 max-w-md mx-auto"
        >
          <button
            onClick={() => router.push("/checkout")}
            className="
              w-full
              bg-red-600 
              text-white
              rounded-xl
              px-4 py-3.5
              flex items-center justify-between
              shadow-[0_8px_30px_rgb(0,0,0,0.4)]
              active:scale-[0.98]
              transition-transform
            "
          >
            {/* Left Side: Icon & Price */}
            <div className="flex items-center gap-3">
              <div className="bg-black/15 p-2 rounded-lg">
                <ShoppingBag size={22} className="text-white" />
              </div>
              <div className="text-left flex flex-col justify-center">
                <p className="text-white/90 font-semibold text-xs tracking-wide">
                  {itemCount} ITEM{itemCount > 1 ? "S" : ""}
                </p>
                <p className="text-white font-bold text-lg leading-none mt-1">
                  ₹{total}
                </p>
              </div>
            </div>

            {/* Right Side: Action Text & Arrow */}
            <div className="flex items-center gap-1 font-bold text-base pr-1">
              View cart
              <ChevronRight size={20} className="mt-0.5" />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}