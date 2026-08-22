"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Gift, Copy, Check, Sparkles } from "lucide-react";

const prizes = [
  { label: "10% OFF", code: "SPIN10", color: "#dc2626" },
  { label: "Free Drink", code: "FREEDRINK", color: "#111111" },
  { label: "15% OFF", code: "SPIN15", color: "#dc2626" },
  { label: "Try Again", code: null, color: "#111111" },
  { label: "20% OFF", code: "SPIN20", color: "#dc2626" },
  { label: "Free Momo", code: "FREEMOMO", color: "#111111" },
  { label: "5% OFF", code: "SPIN5", color: "#dc2626" },
  { label: "Best Luck", code: null, color: "#111111" },
];

const segmentAngle = 360 / prizes.length;

export default function SpinWheel() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    setCopied(false);

    const prizeIndex = Math.floor(Math.random() * prizes.length);
    // spin multiple full rotations + land on the chosen segment (pointer at top = 0deg)
    const targetAngle =
      360 * 6 + (360 - prizeIndex * segmentAngle - segmentAngle / 2);

    setRotation((prev) => prev + targetAngle);

    setTimeout(() => {
      setSpinning(false);
      setHasSpun(true);
      setResult(prizes[prizeIndex]);
    }, 4000);
  };

  const handleCopy = () => {
    if (!result?.code) return;
    navigator.clipboard.writeText(result.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="relative px-6 py-24 md:py-32 bg-neutral-900 text-white overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-red-600 uppercase tracking-[5px] font-semibold mb-3 text-sm">
            Try Your Luck
          </p>
          <h2 className="text-4xl md:text-6xl font-(--font-bebas) leading-none">
            SPIN THE WHEEL
            <br />
            <span className="bg-linear-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
              WIN A TREAT
            </span>
          </h2>
          <p className="text-gray-400 mt-4 text-sm md:text-base">
            One free spin per visit — good luck! 🍀
          </p>
        </motion.div>

        {/* Wheel */}
        <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto mt-14">
          {/* Pointer */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[14px] border-r-[14px] border-t-[24px] border-l-transparent border-r-transparent border-t-red-600 drop-shadow-lg" />

          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-red-600/30 blur-2xl" />

          {/* Wheel itself */}
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.17, 0.67, 0.2, 1] }}
            className="relative w-full h-full rounded-full border-4 border-white/10 shadow-2xl overflow-hidden"
            style={{
              background: `conic-gradient(${prizes
                .map(
                  (p, i) =>
                    `${p.color} ${i * segmentAngle}deg ${
                      (i + 1) * segmentAngle
                    }deg`
                )
                .join(", ")})`,
            }}
          >
            {prizes.map((prize, i) => {
              const angle = i * segmentAngle + segmentAngle / 2;
              return (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-1/2 origin-left flex items-center justify-end pr-4"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <span
                    className="text-white text-[10px] md:text-xs font-bold uppercase tracking-wide whitespace-nowrap"
                    style={{ transform: "rotate(180deg)" }}
                  >
                    {prize.label}
                  </span>
                </div>
              );
            })}
          </motion.div>

          {/* Center hub */}
          <button
            onClick={handleSpin}
            disabled={spinning}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600 border-4 border-black flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-xl disabled:opacity-70 active:scale-95 transition-transform z-10"
          >
            {spinning ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={20} />
              </motion.span>
            ) : (
              "SPIN"
            )}
          </button>
        </div>

        {/* Result reveal */}
        <div className="mt-10 min-h-[100px] flex items-center justify-center">
          {!hasSpun && !spinning && (
            <p className="text-gray-500 text-sm">
              Tap the wheel to spin and reveal your prize
            </p>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-full"
            >
              {result.code ? (
                <div className="inline-flex flex-col items-center gap-3 bg-black border border-red-600/40 rounded-2xl px-8 py-6">
                  <div className="flex items-center gap-2 text-red-600">
                    <Gift size={20} />
                    <span className="font-(--font-bebas) text-2xl tracking-wide">
                      YOU WON {result.label}!
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 transition-colors rounded-lg px-5 py-2.5 font-mono font-bold text-sm active:scale-95"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {result.code}
                  </button>
                  <span className="text-gray-500 text-xs">
                    Show this at checkout — valid today only
                  </span>
                </div>
              ) : (
                <div className="inline-flex flex-col items-center gap-2 bg-black border border-white/10 rounded-2xl px-8 py-6">
                  <span className="font-(--font-bebas) text-2xl text-white">
                    {result.label}
                  </span>
                  <span className="text-gray-500 text-sm">
                    Come back tomorrow for another spin!
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}