"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "Menu", href: "/menu" },
  { label: "Offers", href: "/#Offers" },
  { label: "Feedback", href: "/feedback" },
  { label: "About Us", href: "/#aboutus" },
  { label: "Cart", href: "/checkout"}
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 px-6 md:px-10 py-4 flex justify-between items-center transition-all duration-500 ${
          scrolled
            ? "bg-black/30 backdrop-blur-md border-b border-white/5 py-3"
            : "bg-transparent backdrop-blur-[2px] py-5"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="inline-block relative z-10">
          <Image
            src="/hero-pizza copy.png"
            alt="PIZZAFLIX Logo"
            width={130}
            height={40}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
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

        {/* Desktop CTA */}
        <a
          href="https://www.swiggy.com/city/guwahati/pizzaflix-maligaon-rest1390396"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 bg-orange-600/90 hover:bg-orange-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shadow-[0_0_20px_rgba(220,38,38,0.3)] backdrop-blur-sm"
        >
          <MessageCircle size={16} />
          Order Now
        </a>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden text-white z-10"
        >
          <Menu size={26} />
        </button>
      </motion.nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-lg flex flex-col"
          >
            <div className="flex justify-between items-center px-6 py-5">
              <Image
                src="/hero-pizza copy.png"
                alt="PIZZAFLIX Logo"
                width={120}
                height={36}
                className="object-contain"
              />
              <button onClick={() => setMenuOpen(false)} className="text-white">
                <X size={28} />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-4xl font-(--font-bebas) text-white hover:text-red-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                href="https://www.swiggy.com/city/guwahati/pizzaflix-maligaon-rest1390396"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 bg-orange-600 text-white font-semibold px-8 py-4 rounded-full mt-4"
              >
                <MessageCircle size={18} />
                Order on WhatsApp
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}