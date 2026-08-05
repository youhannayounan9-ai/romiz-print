"use client";

import { useState } from "react";
import { ChevronDown, LayoutGrid } from "lucide-react";
import MegaMenu from "./MegaMenu";
import { siteConfig } from "../config/site";

export default function NavRow() {
  const [megaOpen, setMegaOpen] = useState(false);

  return (
    <div
      className="relative border-b border-gray-100"
      style={{ backgroundColor: "#fff" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 h-11">
          {/* View All Products button */}
          <button
            onClick={() => setMegaOpen(!megaOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 hover:bg-[#E8EEF7] group"
            style={{
              color: megaOpen ? siteConfig.colors.accent : siteConfig.colors.primary,
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
            aria-expanded={megaOpen}
            aria-haspopup="true"
          >
            <LayoutGrid size={16} />
            <span>View All Products</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Divider */}
          <div className="h-5 w-px bg-gray-200 mx-2" />

          {/* Quick nav links for desktop */}
          <nav className="hidden lg:flex items-center gap-0 overflow-x-auto">
            {["Banners", "Roll Labels", "Stickers", "Business Cards", "Mugs", "T-Shirts", "Socks"].map((item) => (
              <a
                key={item}
                href={`/products/${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 hover:text-[#FF7A1A] hover:bg-[#F5F7FA] whitespace-nowrap"
                style={{ color: siteConfig.colors.dark }}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Mega Menu */}
      <MegaMenu isOpen={megaOpen} onClose={() => setMegaOpen(false)} />
    </div>
  );
}
