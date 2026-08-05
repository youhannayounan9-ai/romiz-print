"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, User, ClipboardList, MessageCircle, Menu, X } from "lucide-react";
import { siteConfig } from "../config/site";

export default function Header() {
  const [logoError, setLogoError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const quoteCount = 0;

  return (
    <header
      className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16 lg:h-20">

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
                  priority
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

          {/* ── CENTER: Search (hidden on mobile) ── */}
          <div className="flex-1 hidden md:flex items-center max-w-2xl mx-auto">
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
                className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold transition-colors duration-200 hover:opacity-90"
                style={{ backgroundColor: siteConfig.colors.dark }}
              >
                <Search size={16} />
                <span className="hidden lg:inline">Search</span>
              </button>
            </div>
          </div>

          {/* ── RIGHT: Actions ── */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Live Chat */}
            <button
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#F5F7FA]"
              style={{ color: siteConfig.colors.dark }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: siteConfig.colors.accent }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: siteConfig.colors.accent }} />
              </span>
              <MessageCircle size={16} />
              <span className="hidden lg:inline">Live Chat</span>
            </button>

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

        {/* Mobile search bar */}
        <div className="md:hidden pb-3">
          <div className="flex w-full rounded-xl overflow-hidden border-2 border-gray-200 focus-within:border-[#0B4DA2] transition-colors duration-200">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="I am looking for..."
              className="flex-1 px-4 py-2.5 text-sm outline-none bg-white text-gray-800 placeholder-gray-400"
            />
            <button
              aria-label="Search"
              className="px-4 py-2.5 text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: siteConfig.colors.dark }}
            >
              <Search size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-2"
        >
          {["Banners", "Roll Labels", "Stickers", "Business Cards", "Mugs", "T-Shirts", "Socks"].map((item) => (
            <a
              key={item}
              href={`/products/${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-[#F5F7FA] hover:text-[#FF7A1A]"
              style={{ color: siteConfig.colors.dark }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}

          {/* Mobile Live Chat */}
          <div className="border-t border-gray-100 mt-2 pt-3">
            <button
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium"
              style={{ color: siteConfig.colors.dark }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: siteConfig.colors.accent }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: siteConfig.colors.accent }} />
              </span>
              <MessageCircle size={16} />
              Live Chat
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
