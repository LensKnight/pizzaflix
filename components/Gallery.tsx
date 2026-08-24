"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ShoppingBag, Utensils, Wallet, Clock, Tag } from "lucide-react";

const faqs = [
  {
    icon: ShoppingBag,
    question: "Do you offer online delivery?",
    answer:
      "For now, online delivery is available exclusively through Swiggy. This website is for takeaway and dine-in orders only — place your order here and simply collect it at the counter.",
  },
  {
    icon: Tag,
    question: "Are the prices on this website the same as in-store?",
    answer:
      "Yes, all prices listed on this website match our offline menu exactly — no hidden markups or website-only pricing.",
  },
  {
    icon: Utensils,
    question: "What facilities does the website support?",
    answer:
      "You can place an order through this website for Takeaway or Dine-In. Just show your order token at the counter when you arrive — no need to wait in line to order.",
  },
  {
    icon: Wallet,
    question: "What payment methods do you accept?",
    answer:
      "We accept both UPI and Cash at the counter. Payment is collected when you pick up your order — this website does not process online payments.",
  },
  {
    icon: Clock,
    question: "What are your opening hours?",
    answer:
      "We're open daily from 6:00 PM to 10:30 PM. Please note we remain closed on Saturdays.",
  },
];

function FAQItem({ faq, isOpen, onClick, index }: {
  faq: typeof faqs[0];
  isOpen: boolean;
  onClick: () => void;
  index: number;
}) {
  const Icon = faq.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="border-b border-white/10"
    >
      <button
        onClick={onClick}
        className="w-full flex items-center gap-4 py-6 text-left group"
      >
        <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center shrink-0 group-hover:bg-red-600/20 transition-colors">
          <Icon size={18} className="text-red-600" />
        </div>

        <span className="flex-1 text-white font-semibold text-lg leading-snug">
          {faq.question}
        </span>

        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-red-600"
        >
          <Plus size={16} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-gray-400 text-base leading-relaxed pl-14 pb-6 pr-8">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="px-6 py-20 bg-neutral-900 text-white">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-red-600 uppercase tracking-[5px] font-semibold mb-3">
            Got Questions?
          </p>

          <h2 className="text-6xl font-(--font-bebas) leading-none">
            FREQUENTLY ASKED
            <br />
            <span className="text-red-600">QUESTIONS</span>
          </h2>
        </motion.div>

        <div className="flex flex-col">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}