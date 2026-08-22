"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Send, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !rating || !comment) return;

    setLoading(true);
    await supabase.from("reviews").insert([
      { name, email, rating, comment, approved: false },
    ]);
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <CheckCircle2 size={64} className="text-red-600 mx-auto mb-6" />
            <h1 className="text-4xl font-(--font-bebas) mb-3">THANK YOU!</h1>
            <p className="text-gray-400 max-w-sm">
              Your feedback means a lot to us. It might get featured on our
              website soon!
            </p>
          </motion.div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="h-18" aria-hidden="true" />

      <section className="relative px-6 py-16 md:py-24 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10 max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="text-red-600 uppercase tracking-[5px] font-semibold text-sm">
              We'd Love to Hear
            </p>
            <h1 className="text-4xl md:text-5xl font-(--font-bebas) mt-3 leading-none">
              SHARE YOUR
              <br />
              <span className="bg-linear-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                EXPERIENCE
              </span>
            </h1>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-600/50"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Your Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-600/50"
                placeholder="you@example.com"
              />
              <p className="text-gray-600 text-xs mt-1.5">
                We'll never display your email publicly.
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-3 block">Rate Your Experience</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="active:scale-90 transition-transform"
                  >
                    <Star
                      size={36}
                      className={
                        star <= (hoverRating || rating)
                          ? "fill-red-600 text-red-600"
                          : "text-neutral-700"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Your Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={5}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-600/50 resize-none"
                placeholder="Tell us about your experience..."
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={!name || !email || !rating || !comment || loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Send size={18} />
              {loading ? "Submitting..." : "Submit Feedback"}
            </motion.button>
          </motion.form>
        </div>
      </section>

      <Footer />
    </main>
  );
}