"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
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
          PRIVACY <span className="text-red-600">POLICY</span>
        </h1>
        <p className="text-sm text-neutral-500 mb-10">
          Last Updated: August 2026
        </p>

        <div className="space-y-8 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              1. Information We Collect
            </h2>
            <p>
              When you visit or interact with PizzaFlix (located in Guwahati, Assam), we may collect personal information that you voluntarily provide to us, such as your name, email address, phone number, and delivery details when making inquiries or navigating through our linked services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide and manage our food ordering and dining services.</li>
              <li>To communicate regarding reservations, order updates, or customer support queries.</li>
              <li>To improve our website functionality, promotional offerings, and store experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              3. Third-Party Links & Services
            </h2>
            <p>
              Our website provides direct links to third-party delivery platforms (such as Swiggy) and navigation utilities (such as Google Maps). PizzaFlix is not responsible for the privacy practices, content, or policies of these external platforms. We encourage you to review their respective privacy policies upon redirection.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              4. Data Protection & Security
            </h2>
            <p>
              We implement reasonable security measures to maintain the safety of your personal information. However, no data transmission over the internet or wireless network can be guaranteed to be 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              5. Contact Us
            </h2>
            <p>
              If you have any questions regarding this Privacy Policy, please reach out to us at:
            </p>
            <p className="mt-2 text-white font-medium">
              PizzaFlix <br />
              Ananda Nagar, Adabari, Guwahati, Assam 781012 <br />
              Email: <a href="mailto:info@pizzaflix.com" className="text-red-500 underline">info@pizzaflix.com</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}