"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discount_percent: number;
  valid_until: string;
  is_active: boolean;
}

function OfferCoupon({ offer, index, revealed, total }: { offer: Offer; index: number; revealed: boolean; total: number }) {
  const [copied, setCopied] = useState(false);
  const [tearing, setTearing] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(offer.code);
    setTearing(true);
    setTimeout(() => {
      setCopied(true);
      setTearing(false);
    }, 350);
    setTimeout(() => setCopied(false), 2000);
  };

  // Stacked (deck) position before reveal
  const stackOffset = {
    rotate: index % 2 === 0 ? -3 - index * 1.5 : 3 + index * 1.5,
    x: index % 2 === 0 ? -6 * index : 6 * index,
    y: -index * 10,
  };

  return (
    <motion.div
      layout
      initial={false}
      animate={
        revealed
          ? { rotate: 0, x: 0, y: 0 }
          : { rotate: stackOffset.rotate, x: stackOffset.x, y: stackOffset.y }
      }
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      style={{
        zIndex: revealed ? 1 : total - index,
        gridColumn: revealed ? undefined : "1 / -1",
        gridRow: revealed ? undefined : 1,
      }}
      className="relative flex origin-bottom"
    >
      {/* Main body */}
      <motion.div
        animate={tearing ? { x: -6 } : { x: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-1 relative rounded-l-2xl md:rounded-l-3xl bg-black border border-white/10 p-6 md:p-8 overflow-hidden shadow-xl"
      >
        <div className="absolute inset-0 bg-linear-to-br from-red-600/0 to-red-600/0 hover:from-red-600/5 hover:to-transparent transition-all duration-500" />

        <span className="text-xs md:text-sm text-red-500 uppercase tracking-widest font-semibold">
          {offer.valid_until}
        </span>

        <h3 className="text-2xl md:text-3xl font-bold mt-2 font-(--font-bebas) leading-tight">
          {offer.title}
        </h3>

        <p className="text-gray-400 mt-3 text-sm md:text-base leading-relaxed">
          {offer.description}
        </p>
      </motion.div>

      {/* Perforated divider — jagged tear look */}
      <div className="relative w-0 flex flex-col items-center justify-between py-3">
        <span className="w-4 h-4 rounded-full bg-neutral-900 -ml-2" />
        <motion.span
          animate={tearing ? { scaleY: 0.6, opacity: 0.3 } : { scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex-1 border-l-2 border-dashed border-white/20 my-1 origin-center"
          style={{ minHeight: "40px" }}
        />
        <span className="w-4 h-4 rounded-full bg-neutral-900 -ml-2" />
      </div>

      {/* Code stub — tears away on copy */}
      <motion.button
        onClick={handleCopy}
        animate={
          tearing
            ? { x: 10, rotate: 3, scale: 0.96 }
            : { x: 0, rotate: 0, scale: 1 }
        }
        transition={{ duration: 0.2 }}
        whileHover={{ scale: revealed ? 1.03 : 1 }}
        className="w-24 md:w-32 shrink-0 rounded-r-2xl md:rounded-r-3xl bg-red-600 flex flex-col items-center justify-center gap-1.5 md:gap-2 px-2 hover:bg-red-500 transition-colors active:scale-95 shadow-xl"
      >
        {copied ? (
          <Check size={18} className="text-white" />
        ) : (
          <Copy size={18} className="text-white" />
        )}
        <span className="font-mono text-white text-[11px] md:text-sm font-bold text-center break-all leading-tight">
          {offer.code}
        </span>
      </motion.button>
    </motion.div>
  );
}

export default function Offers() {
  const [revealed, setRevealed] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) console.error("Fetch offers error:", error);
      if (data) setOffers(data);
      setLoading(false);
    }
    fetchOffers();
  }, []);

  if (!loading && offers.length === 0) return null;

  return (
    <section id="Offers" className="relative px-6 py-20 md:py-32 bg-neutral-900 text-white overflow-hidden scroll-mt-20">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-red-600/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-red-600 uppercase tracking-[5px] font-semibold mb-3 text-sm">
            Special Offers
          </p>

          <h2 className="text-4xl md:text-6xl font-(--font-bebas) leading-none">
            LIMITED TIME
            <br />
            <span className="bg-linear-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
              SPECIAL OFFERS
            </span>
          </h2>
        </motion.div>

        {loading ? (
          <p className="text-center text-gray-500 text-sm">Loading offers...</p>
        ) : (
          <>
            {!revealed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setRevealed(true)}
                className="flex items-center gap-2 mx-auto mb-10 text-red-500 font-semibold text-sm uppercase tracking-wide"
              >
                <Sparkles size={16} className="animate-pulse" />
                Tap the deck to reveal offers
              </motion.button>
            )}

            <div
              className={
                revealed
                  ? "grid md:grid-cols-2 gap-6 md:gap-8"
                  : "grid place-items-center min-h-[220px] cursor-pointer"
              }
              onClick={() => !revealed && setRevealed(true)}
            >
              <AnimatePresence>
                {offers.map((offer, index) => (
                  <OfferCoupon
                    key={offer.id}
                    offer={offer}
                    index={index}
                    revealed={revealed}
                    total={offers.length}
                  />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </section>
  );
}