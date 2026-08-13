"use client";

import Link from "next/link";
import { categories } from "../data/categories";
import { siteConfig } from "../config/site";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {


  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 z-50 shadow-2xl border-t border-gray-100">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        style={{ backgroundColor: "#fff" }}
        className="relative w-full pt-6 pb-8 px-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* All categories grid — 6 columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  onClick={onClose}
                  className="group relative flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-[#F5F7FA] transition-all duration-200"
                >
                  {cat.isNew && (
                    <span
                      className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: siteConfig.colors.accent }}
                    >
                      NEW
                    </span>
                  )}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200"
                    style={{ backgroundColor: "#E8EEF7" }}
                  >
                    <Icon
                      size={20}
                      className="transition-colors duration-200 text-[#0B4DA2]"
                    />
                  </div>
                  <span
                    className="text-xs font-medium text-center leading-tight transition-colors duration-200 group-hover:text-[#FF7A1A]"
                    style={{ color: siteConfig.colors.dark }}
                  >
                    {cat.name}
                  </span>
                  {/* Accent underline on hover */}
                  <span className="block h-0.5 w-0 group-hover:w-full bg-[#FF7A1A] transition-all duration-300 rounded-full" />
                </Link>
              );
            })}
          </div>


        </div>
      </div>
    </div>
  );
}
