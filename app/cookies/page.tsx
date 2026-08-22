"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

export default function CookiePolicy() {
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
          COOKIE <span className="text-red-600">POLICY</span>
        </h1>
        <p className="text-sm text-neutral-500 mb-10">
          Last Updated: August 2026
        </p>

        <div className="space-y-8 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              1. What Are Cookies?
            </h2>
            <p>
              Cookies are small text files stored on your browser or device when you visit websites. They are widely used to make websites work efficiently, enhance user experience, and provide web measurement analytics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              2. How PizzaFlix Uses Cookies
            </h2>
            <p>We use essential and functional cookies to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Maintain essential website functionality and performance.</li>
              <li>Analyze general user behavior to improve site layout and speed.</li>
              <li>Remember user preferences across page navigation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              3. Third-Party Cookies
            </h2>
            <p>
              Certain features on our site (such as embedded Google Maps or external delivery badges like Swiggy) may place third-party cookies on your device to enable location services or tracking across external applications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              4. Managing Cookie Preferences
            </h2>
            <p>
              You can choose to disable or block cookies through your browser settings at any time. However, disabling essential cookies may impact certain interactive features on our site.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}