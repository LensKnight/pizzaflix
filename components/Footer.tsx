"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { MapPin, Phone, Mail, ChevronRight } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/#home" },
  { label: "Menu", href: "/menu" },
  { label: "Offers", href: "/#Offers" },
  { label: "About Us", href: "/#aboutus" },
];

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-white py-16 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand & Delivery */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold mb-4 font-(--font-bebas) bg-linear-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
              PIZZAFLIX
            </h3>
            <p className="text-gray-400 mb-5">
              More Than Fast Food. It's an Experience.
            </p>

            <div className="flex gap-4 mb-6">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-600 transition-colors transform hover:scale-110"
              >
                <FaFacebook size={20} />
              </a>

              <a
                href="https://www.instagram.com/piz_zaflix/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-600 transition-colors transform hover:scale-110"
              >
                <FaInstagram size={20} />
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-600 transition-colors transform hover:scale-110"
              >
                <FaTwitter size={20} />
              </a>
            </div>

            {/* Swiggy Section */}
            <div className="flex flex-col items-start gap-2 mt-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Order Online On
              </span>
              <a
                href="https://www.swiggy.com/city/guwahati/pizzaflix-maligaon-rest1390396"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl transition-transform hover:scale-105 shadow-md"
              >
                <Image
                  src="/swiggy.png"
                  alt="Swiggy"
                  width={80}
                  height={24}
                  className="object-contain"
                />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1 text-gray-400 hover:text-red-600 transition-colors w-fit"
                  >
                    <ChevronRight
                      size={14}
                      className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-red-600"
                    />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Us */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://www.google.com/maps/place/PizzaFlix/@26.1609172,91.6861198,20.25z/data=!4m6!3m5!1s0x375a5b8ff66379b5:0xbff821b786c40048!8m2!3d26.1609145!4d91.6861516!16s%2Fg%2F11z73szrl2!5m1!1e2?entry=ttu&g_ep=EgoyMDI2MDgxOS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors group"
                >
                  <MapPin size={16} className="text-red-600 mt-0.5 shrink-0" />
                  <span className="group-hover:underline">
                    Ananda Nagar, Adabari, Guwahati, Assam 781012
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+91XXXXXXXXXX"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                >
                  <Phone size={16} className="text-red-600 shrink-0" />
                  <span className="group-hover:underline">+91 88229 98429</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@pizzaflix.com"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                >
                  <Mail size={16} className="text-red-600 shrink-0" />
                  <span className="group-hover:underline">not provided yet</span>
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-white/10 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2026 PizzaFlix. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-500 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}