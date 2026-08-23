"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Check, X, Trash2, RefreshCw, MessageSquare, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  approved: boolean;
  created_at: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setReviews(data);
    if (error) console.error("Fetch reviews error:", error);
    setLoading(false);
  }

  async function togglePost(id: string, current: boolean) {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approved: !current } : r))
    );

    const { error } = await supabase
      .from("reviews")
      .update({ approved: !current })
      .eq("id", id);

    if (error) {
      console.error("Toggle error:", error);
      fetchReviews();
    }
  }

  async function deleteReview(id: string) {
    setReviews((prev) => prev.filter((r) => r.id !== id));

    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) {
      console.error("Delete error:", error);
      fetchReviews();
    }
  }

  const pending = reviews.filter((r) => !r.approved);
  const posted = reviews.filter((r) => r.approved);

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden selection:bg-red-500/30">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex items-center justify-between mb-10 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-red-500 text-xs font-bold tracking-widest uppercase mb-1">
              <MessageSquare size={14} /> Moderation Portal
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
              REVIEWS MANAGEMENT
            </h1>
          </div>
          <button
            onClick={fetchReviews}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs font-semibold hover:border-white/20 hover:bg-neutral-800 transition-all text-neutral-300 hover:text-white active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </header>

        {/* Analytics Summary Banner */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="p-5 rounded-2xl bg-neutral-900/50 border border-yellow-500/20 backdrop-blur-xl">
            <div className="text-xs font-semibold text-yellow-500 uppercase tracking-wider mb-1">
              Awaiting Approval
            </div>
            <div className="text-3xl font-black text-white">{pending.length}</div>
          </div>
          <div className="p-5 rounded-2xl bg-neutral-900/50 border border-emerald-500/20 backdrop-blur-xl">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              Published Reviews
            </div>
            <div className="text-3xl font-black text-white">{posted.length}</div>
          </div>
        </div>

        {/* Pending Reviews Section */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <h2 className="text-yellow-500 font-bold text-xs uppercase tracking-widest">
              Pending Approval ({pending.length})
            </h2>
          </div>

          <div className="space-y-4">
            {pending.length === 0 && (
              <div className="p-8 text-center rounded-2xl border border-white/5 bg-neutral-950/40 text-neutral-500 text-sm">
                No pending reviews moderation required.
              </div>
            )}
            <AnimatePresence>
              {pending.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onToggle={() => togglePost(review.id, review.approved)}
                  onDelete={() => deleteReview(review.id)}
                  isPending
                />
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Posted Reviews Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h2 className="text-emerald-400 font-bold text-xs uppercase tracking-widest">
              Live on Site ({posted.length})
            </h2>
          </div>

          <div className="space-y-4">
            {posted.length === 0 && (
              <div className="p-8 text-center rounded-2xl border border-white/5 bg-neutral-950/40 text-neutral-500 text-sm">
                No active published reviews.
              </div>
            )}
            <AnimatePresence>
              {posted.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onToggle={() => togglePost(review.id, review.approved)}
                  onDelete={() => deleteReview(review.id)}
                  isPending={false}
                />
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </main>
  );
}

function ReviewCard({
  review,
  onToggle,
  onDelete,
  isPending,
}: {
  review: Review;
  onToggle: () => void;
  onDelete: () => void;
  isPending: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative overflow-hidden rounded-2xl p-6 backdrop-blur-md border transition-all duration-300 ${
        isPending
          ? "border-yellow-500/20 bg-neutral-900/60 hover:border-yellow-500/40"
          : "border-emerald-500/20 bg-neutral-900/40 hover:border-emerald-500/40"
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
        <div>
          <h3 className="font-bold text-base text-white tracking-wide flex items-center gap-2">
            {review.name}
            {!isPending && (
              <ShieldCheck size={16} className="text-emerald-400 inline" />
            )}
          </h3>
          <p className="text-neutral-400 text-xs font-mono">{review.email}</p>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < review.rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-neutral-700"
              }
            />
          ))}
        </div>
      </div>

      <p className="text-neutral-300 text-sm leading-relaxed mb-5 font-normal bg-black/20 p-3.5 rounded-xl border border-white/5">
        "{review.comment}"
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-[11px] text-neutral-500 font-mono">
          {new Date(review.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>

        <div className="flex items-center gap-2">
          {isPending ? (
            <button
              onClick={onToggle}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-lg shadow-emerald-500/10 active:scale-95 cursor-pointer"
            >
              <Check size={14} />
              Approve & Post
            </button>
          ) : (
            <button
              onClick={onToggle}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all border border-white/10 active:scale-95 cursor-pointer"
            >
              <X size={14} />
              Unpublish
            </button>
          )}

          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}