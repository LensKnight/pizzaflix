"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, LogOut, Trash2, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function AccountModal({ isOpen, onClose, onLogout }: AccountModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadProfileData();
    }
  }, [isOpen]);

  const loadProfileData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setEmail(session.user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("name, phone")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        setName(profile.name || "");
        setPhone(profile.phone || "");
      } else {
        setName(session.user.user_metadata?.full_name || "");
      }
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { error } = await supabase.from("profiles").upsert({
        id: session.user.id,
        name,
        phone,
      });

      if (!error) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert("Failed to update profile.");
      }
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
    onClose();
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // Call RPC function created in SQL Editor
      const { error } = await supabase.rpc("delete_user_account");
      if (error) throw error;

      await supabase.auth.signOut();
      onLogout();
      onClose();
      alert("Your account has been deleted permanently.");
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else alert("Could not delete account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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

          <h2 className="text-2xl font-bold mb-1">My Account</h2>
          <p className="text-xs text-gray-400 mb-6">{email}</p>

          {saveSuccess && (
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-xs p-3 rounded-xl mb-4">
              <CheckCircle size={16} /> Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 mb-6">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-500" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 text-gray-500" size={18} />
                <input
                  type="tel"
                  placeholder="+91 xxxxx xxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>

          <div className="border-t border-white/10 pt-4 space-y-2">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              <LogOut size={16} /> Log Out
            </button>

            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full text-red-500 hover:text-red-400 font-semibold py-2 text-xs text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 size={14} /> Delete Account
              </button>
            ) : (
              <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-center space-y-2">
                <p className="text-xs text-red-400">Are you sure? This cannot be undone.</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg text-xs"
                  >
                    Yes, Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-neutral-800 text-gray-300 py-2 rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}