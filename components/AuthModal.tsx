"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Mail, Phone, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // 1-Click Social Sign In Handler
  const handleSocialLogin = async (provider: "google" | "apple") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/checkout`,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, phone },
          },
        });
        if (signUpError) throw signUpError;

        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            name,
            phone,
          });
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-neutral-900 border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl text-white"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold mb-1">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-400 text-xs mb-6">
            Log in to save time during checkout.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Social Login Buttons */}
          <div className="space-y-2 mb-6">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-neutral-900 px-3 text-xs text-gray-500 uppercase font-semibold absolute">
              Or email
            </span>
          </div>

          <form onSubmit={handleAuth} className="space-y-3">
            {isSignUp && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-600"
                    required
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-600"
                    required
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-600"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all text-sm mt-2"
            >
              {loading ? "Processing..." : isSignUp ? "Sign Up" : "Log In"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-red-500 font-semibold hover:underline ml-1"
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}