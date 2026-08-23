"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/lib/CartContext";

export default function FloatingCartBar() {
  const { cart, total } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);

  // Hide on checkout page itself (no point showing "view cart" there)
  if (pathname === "/checkout") return null;

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-[60] max-w-md mx-auto"
        >
          <button
            onClick={() => router.push("/checkout")}
            className="
              w-full
              bg-red-600/70
              backdrop-blur-xl
              border border-white/20
              rounded-full
              px-5 py-3.5
              flex items-center justify-between
              shadow-2xl shadow-red-600/30
              hover:bg-red-600/80
              transition-colors
            "
          >
            <div className="flex items-center gap-3">
              <div className="relative bg-white/15 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center">
                <ShoppingCart size={18} className="text-white" />
                <span className="absolute -top-1.5 -right-1.5 bg-white text-red-600 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-red-600">
                  {itemCount}
                </span>
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-sm leading-tight">
                  {itemCount} item{itemCount > 1 ? "s" : ""}
                </p>
                <p className="text-white/80 text-xs">₹{total}</p>
              </div>
            </div>

            <span className="text-white font-bold text-sm flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              View Cart
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}