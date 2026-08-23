"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, User, LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AccountModal from "@/components/AccountModal";
import AuthModal from "@/components/AuthModal";

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "Menu", href: "/menu" },
  { label: "Offers", href: "/#Offers" },
  { label: "Feedback", href: "/feedback" },
  { label: "About Us", href: "/#aboutus" },
  { label: "Cart", href: "/checkout" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Auth & Account States
  const [session, setSession] = useState<any>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    // Initial Auth session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Realtime auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 px-6 md:px-10 flex justify-between items-center transition-all duration-300 ${
          scrolled
            ? "bg-black/40 backdrop-blur-md border-b border-white/5 py-2.5"
            : "bg-transparent backdrop-blur-[2px] py-3"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="inline-block relative z-10 shrink-0">
          <Image
            src="/hero-pizza copy.png"
            alt="PIZZAFLIX Logo"
            width={110}
            height={34}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative text-white/90 hover:text-white transition-colors group text-sm font-medium tracking-wide"
            >
              {link.label}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-600 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Desktop Account / Login Button */}
        <div className="hidden md:flex items-center">
          {session ? (
            <button
              onClick={() => setIsAccountOpen(true)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/10 transition-colors backdrop-blur-sm cursor-pointer"
            >
              <User size={15} className="text-red-500" />
              <span>Account</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.3)]"
            >
              <LogIn size={15} />
              <span>Log In</span>
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden text-white z-10 p-1"
        >
          <Menu size={24} />
        </button>
      </motion.nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-lg flex flex-col"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
              <Image
                src="/hero-pizza copy.png"
                alt="PIZZAFLIX Logo"
                width={110}
                height={34}
                className="object-contain"
              />
              <button onClick={() => setMenuOpen(false)} className="text-white">
                <X size={26} />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-3xl font-(--font-bebas) text-white hover:text-red-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Account / Login Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-2"
              >
                {session ? (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setIsAccountOpen(true);
                    }}
                    className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold px-6 py-3 rounded-full text-sm border border-white/10"
                  >
                    <User size={16} className="text-red-500" />
                    <span>My Account</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setIsAuthOpen(true);
                    }}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-full text-sm"
                  >
                    <LogIn size={16} />
                    <span>Log In</span>
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account Profile Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onLogout={() => setSession(null)}
      />

      {/* Auth Sign-In Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => setIsAuthOpen(false)}
      />
    </>
  );
}