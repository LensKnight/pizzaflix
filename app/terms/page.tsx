"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-300 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-white font-(--font-bebas) tracking-wide mb-2">
          TERMS OF <span className="text-red-600">SERVICE</span>
        </h1>
        <p className="text-sm text-neutral-500 mb-10">
          Last Updated: August 2026
        </p>

        <div className="space-y-8 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using the PizzaFlix website, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please refrain from using our website or online utilities.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              2. Store Operations & Schedules
            </h2>
            <p>
              Our physical location in Adabari, Guwahati, operates strictly according to posted store hours (06:00 PM – 10:30 PM, closed Saturdays). We reserve the right to modify operating hours, menu item availability, and pricing at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              3. Online Orders & Delivery Partnerships
            </h2>
            <p>
              Online orders fulfilled via third-party platforms (including Swiggy) are governed by the terms, pricing, and refund policies of those external partners. PizzaFlix is not directly liable for delivery delays or fulfillment disputes originating through third-party platforms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              4. Intellectual Property
            </h2>
            <p>
              All branding, logos, imagery, digital assets, and custom design elements on this website are the property of PizzaFlix. Reproduction or distribution of any site content without express authorization is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              5. Governing Law
            </h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India, applicable within the jurisdiction of Guwahati, Assam.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}