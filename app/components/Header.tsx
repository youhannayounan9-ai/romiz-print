"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, User, ClipboardList, Menu, X } from "lucide-react";
import { siteConfig } from "../config/site";

export default function Header() {
  const [logoError, setLogoError] = useState(true); // default to text logo until image is added to /public
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const quoteCount = 0;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-y-3 md:gap-4 py-3 md:py-0 min-h-[64px] lg:min-h-[80px]">
          
          {/* ── LEFT: Logo ── */}
          <div className="flex-shrink-0">
            <a href="/" className="block">
              {!logoError ? (
                <Image
                  src={siteConfig.logoHorizontal}
                  alt={siteConfig.name}
                  width={180}
                  height={40}
                  className="h-10 w-auto object-contain"
                  onError={() => setLogoError(true)}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                />
              ) : (
                /* Fallback text logo */
                <span
                  className="text-2xl font-bold tracking-tight select-none"
                  style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
                >
                  <span style={{ color: siteConfig.colors.dark }}>ROMIZ</span>
                  <span style={{ color: siteConfig.colors.accent }}>PRINT</span>
                </span>
              )}
            </a>
          </div>

          {/* ── CENTER: Search (Row 2 on mobile) ── */}
          <div className="order-last md:order-none w-full md:w-auto md:flex-1 flex items-center max-w-2xl mx-auto">
            <div className="flex w-full rounded-xl overflow-hidden border-2 border-gray-200 focus-within:border-[#0B4DA2] transition-colors duration-200 shadow-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="I am looking for..."
                className="flex-1 px-4 py-2.5 text-sm outline-none bg-white text-gray-800 placeholder-gray-400"
              />
              <button
                aria-label="Search"
                className="flex items-center gap-2 px-4 md:px-5 py-2.5 text-white text-sm font-semibold transition-colors duration-200 hover:opacity-90"
                style={{ backgroundColor: siteConfig.colors.dark }}
              >
                <Search size={16} />
                <span className="hidden lg:inline">Search</span>
              </button>
            </div>
          </div>

          {/* ── RIGHT: Actions ── */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Account Icon */}
            <button
              aria-label="Account"
              className="p-2 rounded-lg transition-colors hover:bg-[#F5F7FA]"
              style={{ color: siteConfig.colors.dark }}
            >
              <User size={20} />
            </button>

            {/* Quote list with badge */}
            <button
              aria-label="Quote list"
              className="relative p-2 rounded-lg transition-colors hover:bg-[#F5F7FA]"
              style={{ color: siteConfig.colors.dark }}
            >
              <ClipboardList size={20} />
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-bold text-white rounded-full flex items-center justify-center"
                style={{ backgroundColor: siteConfig.colors.accent }}
              >
                {quoteCount}
              </span>
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg transition-colors hover:bg-[#F5F7FA]"
              style={{ color: siteConfig.colors.dark }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-2 absolute w-full shadow-md z-40">
          {["Banners", "Roll Labels", "Stickers", "Business Cards", "Mugs", "T-Shirts", "Brochures"].map((item) => (
            <a
              key={item}
              href={`/categories/${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-[#F5F7FA] hover:text-[#FF7A1A]"
              style={{ color: siteConfig.colors.dark }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
