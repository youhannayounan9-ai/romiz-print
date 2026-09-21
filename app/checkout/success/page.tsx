"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Package, Phone } from "lucide-react";
import { siteConfig } from "../../config/site";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div
      className="min-h-[70vh] flex items-center justify-center px-4 py-20"
      style={{ backgroundColor: siteConfig.colors.background }}
    >
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-3xl p-10 sm:p-14 flex flex-col items-center justify-center text-center shadow-xl border border-gray-100 dark:border-gray-700 max-w-lg w-full">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: "#E8F5E9" }}
        >
          <CheckCircle2 size={44} className="text-green-500" />
        </div>

        <h1
          className="text-3xl font-bold mb-3"
          style={{
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          }}
        >
          Order Placed! 🎉
        </h1>

        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Thank you for your order! We&apos;ve received it and our team will contact you
          shortly to confirm the details and delivery time.
        </p>

        {orderId && (
          <div className="w-full rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 px-5 py-4 mb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
              Order Reference
            </p>
            <p
              className="text-sm font-bold break-all"
              style={{ color: siteConfig.colors.primary }}
            >
              {orderId}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/categories"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-transform hover:-translate-y-0.5 shadow-md"
            style={{ backgroundColor: siteConfig.colors.accent }}
          >
            <Package size={18} />
            Continue Shopping
          </Link>
          <a
            href={`tel:${siteConfig.contact.phone}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold border-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
            style={{ borderColor: siteConfig.colors.primary, color: siteConfig.colors.primary }}
          >
            <Phone size={18} />
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={<div className="min-h-[70vh] flex items-center justify-center text-gray-500">Loading...</div>}
    >
      <SuccessContent />
    </Suspense>
  );
}
