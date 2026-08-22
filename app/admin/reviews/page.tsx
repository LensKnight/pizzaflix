"use client";

import { useState, useEffect } from "react";
import { Star, Check, X, Trash2, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

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
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (authed) fetchReviews();
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

  async function fetchReviews() {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setReviews(data);
    if (error) console.error(error);
  }

  async function togglePost(id: string, current: boolean) {
    await supabase.from("reviews").update({ approved: !current }).eq("id", id);
    fetchReviews();
  }

  async function deleteReview(id: string) {
    await supabase.from("reviews").delete().eq("id", id);
    fetchReviews();
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
          {loginError && (
            <p className="text-red-500 text-sm mb-4">{loginError}</p>
          )}
          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg">
            Login
          </button>
        </form>
      </main>
    );
  }

  const pending = reviews.filter((r) => !r.approved);
  const posted = reviews.filter((r) => r.approved);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-(--font-bebas) mb-8">REVIEWS ADMIN</h1>

        <h2 className="text-red-600 font-semibold text-sm uppercase tracking-wide mb-4">
          Pending ({pending.length})
        </h2>
        <div className="space-y-4 mb-12">
          {pending.length === 0 && (
            <p className="text-gray-600 text-sm">No pending reviews.</p>
          )}
          {pending.map((review) => (
            <div key={review.id} className="border border-white/10 bg-neutral-900 rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold">{review.name}</h3>
                  <p className="text-gray-500 text-xs">{review.email}</p>
                </div>
                <div className="flex text-red-600">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-red-600" />
                  ))}
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">{review.comment}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => togglePost(review.id, review.approved)}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold bg-green-600 text-white"
                >
                  <Check size={14} />
                  Post to Website
                </button>
                <button
                  onClick={() => deleteReview(review.id)}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold bg-red-600/20 text-red-500"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-green-500 font-semibold text-sm uppercase tracking-wide mb-4">
          Posted ({posted.length})
        </h2>
        <div className="space-y-4">
          {posted.map((review) => (
            <div key={review.id} className="border border-green-600/30 bg-green-600/5 rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{review.name}</h3>
                <div className="flex text-red-600">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-red-600" />
                  ))}
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">{review.comment}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => togglePost(review.id, review.approved)}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold bg-white/10 text-gray-300"
                >
                  <X size={14} />
                  Unpost
                </button>
                <button
                  onClick={() => deleteReview(review.id)}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold bg-red-600/20 text-red-500"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}