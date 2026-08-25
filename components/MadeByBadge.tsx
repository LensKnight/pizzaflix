"use client";

import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function MadeByBadge() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href="https://wa.me/916003131035?text=Hi! I saw your work on PizzaFlix's website."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-80 group flex items-center gap-2 bg-black/80 backdrop-blur-xl border border-white/10 hover:border-red-600/40 text-white px-4 py-2.5 rounded-full shadow-2xl transition-all hover:scale-105"
    >
      <Sparkles size={14} className="text-red-600 group-hover:animate-pulse" />
      <span className="text-xs font-semibold">
        Made by{" "}
        <span className="bg-linear-to-r from-red-600 to-red-400 bg-clip-text text-transparent font-bold">
          VISHAL
        </span>
      </span>
    </a>
  );
}