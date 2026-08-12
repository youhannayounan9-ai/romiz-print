"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";
import { siteConfig } from "./config/site";

export default function NotFound() {
  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center"
      style={{ backgroundColor: siteConfig.colors.background }}
    >
      {/* Big 404 */}
      <div
        className="text-[120px] font-bold leading-none select-none mb-2"
        style={{
          color: siteConfig.colors.lightBar,
          fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
        }}
      >
        404
      </div>

      {/* Icon */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md mb-6"
        style={{ backgroundColor: siteConfig.colors.primary }}
      >
        <Search size={28} className="text-white" />
      </div>

      {/* Heading */}
      <h1
        className="text-3xl sm:text-4xl font-bold mb-3"
        style={{
          color: siteConfig.colors.dark,
          fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
        }}
      >
        Page Not Found
      </h1>

      <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        Browse our full range of custom printing products below.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 shadow-md"
          style={{ backgroundColor: siteConfig.colors.primary }}
        >
          <Home size={16} />
          Back to Homepage
        </Link>

        <Link
          href="/categories/stickers"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200 hover:-translate-y-0.5"
          style={{
            borderColor: siteConfig.colors.accent,
            color: siteConfig.colors.accent,
          }}
        >
          <ArrowLeft size={16} />
          Browse Products
        </Link>
      </div>

      {/* Quick category links */}
      <div className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
          Popular Categories
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {["Stickers", "Banners", "Business Cards", "Mugs", "T-Shirts", "Flyers"].map((cat) => (
            <Link
              key={cat}
              href={`/categories/${cat.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 hover:border-[#FF7A1A] hover:text-[#FF7A1A] hover:bg-orange-50"
              style={{
                borderColor: "#E8EEF7",
                color: siteConfig.colors.dark,
              }}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
