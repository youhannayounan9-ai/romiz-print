"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Printer,
  Layout,
  Shirt,
  Gift,
  Pen,
  Coffee,
  Tag,
  ShoppingBag,
  FileText,
  Briefcase,
} from "lucide-react";
import { siteConfig } from "../config/site";
import { categories } from "../data/categories";

/* ── 4 Main category cards ── */
const mainCategories = [
  {
    title: "Marketing & Print",
    subtitle: "Business Cards, Flyers, Pens",
    icon: Printer,
    href: "/categories?filter=marketing-print",
    gradient: "linear-gradient(135deg, #0B4DA2 0%, #1565c0 100%)",
    accentColor: "#1976d2",
  },
  {
    title: "Banners & Displays",
    subtitle: "Banners, Roll Ups, Frames",
    icon: Layout,
    href: "/categories?filter=banners-displays",
    gradient: "linear-gradient(135deg, #FF7A1A 0%, #f57c00 100%)",
    accentColor: "#fb8c00",
  },
  {
    title: "Apparel & Bags",
    subtitle: "T-Shirts, Hoodies, Tote Bags",
    icon: Shirt,
    href: "/categories?filter=apparel-bags",
    gradient: "linear-gradient(135deg, #1E2530 0%, #37474f 100%)",
    accentColor: "#455a64",
  },
  {
    title: "Custom Merch",
    subtitle: "Stickers, Mugs & More",
    icon: Gift,
    href: "/categories?filter=custom-merch",
    gradient: "linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%)",
    accentColor: "#9c27b0",
  },
];

/* 8 popular product icons */
const popularSlugs = [
  "roll-up",
  "frame",
  "banners",
  "business-cards",
  "tote-bags",
  "flyers",
  "mugs",
  "pens",
];

/* ── Decorative section title ── */
function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-10">
      <span className="flex-1 max-w-24 h-px" style={{ backgroundColor: "#D6E2F0" }} />
      <h2
        className="text-2xl sm:text-3xl font-bold text-center whitespace-nowrap"
        style={{
          color: siteConfig.colors.dark,
          fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
        }}
      >
        {title}
      </h2>
      <span className="flex-1 max-w-24 h-px" style={{ backgroundColor: "#D6E2F0" }} />
    </div>
  );
}

/* ── Main category card ── */
function MainCategoryCard({
  title,
  subtitle,
  icon: Icon,
  href,
  gradient,
}: (typeof mainCategories)[number]) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      className="relative flex flex-col justify-end p-6 rounded-2xl overflow-hidden transition-all duration-300 min-h-[160px] sm:min-h-[180px]"
      style={{
        background: gradient,
        transform: hovered ? "translateY(-4px) scale(1.01)" : "scale(1)",
        boxShadow: hovered
          ? "0 20px 40px rgba(0,0,0,0.25)"
          : "0 4px 16px rgba(0,0,0,0.12)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background decorative icon */}
      <div
        className="absolute top-4 right-4 opacity-10 transition-all duration-300"
        style={{ transform: hovered ? "scale(1.15) rotate(5deg)" : "scale(1)" }}
      >
        <Icon size={64} color="white" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Icon size={18} color="white" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-white leading-tight">{title}</h3>
        <p className="text-xs text-white/75 mt-1 font-medium">{subtitle}</p>
        <div
          className="mt-3 text-xs font-bold text-white/90 flex items-center gap-1 transition-all duration-200"
          style={{ opacity: hovered ? 1 : 0.7 }}
        >
          Explore {hovered ? "→" : ""}
        </div>
      </div>
    </Link>
  );
}

/* ── Individual category tile ── */
function CategoryTile({
  slug,
  name,
  icon: Icon,
  isNew,
}: {
  slug: string;
  name: string;
  icon: LucideIcon;
  isNew?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/categories/${slug}`}
      className="flex flex-col items-center gap-3 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Circle */}
      <div
        className="relative flex items-center justify-center rounded-full transition-all duration-300"
        style={{
          width: "clamp(72px, 9vw, 110px)",
          height: "clamp(72px, 9vw, 110px)",
          backgroundColor: hovered ? siteConfig.colors.accent : siteConfig.colors.lightBar,
          transform: hovered ? "scale(1.08)" : "scale(1)",
          boxShadow: hovered
            ? "0 8px 30px rgba(255, 122, 26, 0.30)"
            : "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        {isNew && (
          <span
            className="absolute -top-1 -right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white z-10"
            style={{ backgroundColor: siteConfig.colors.primary }}
          >
            NEW
          </span>
        )}
        <Icon
          size={26}
          className="transition-colors duration-300"
          style={{ color: hovered ? "#ffffff" : siteConfig.colors.primary }}
        />
      </div>

      {/* Name */}
      <span
        className="text-xs sm:text-sm font-medium text-center leading-tight transition-colors duration-300"
        style={{ color: hovered ? siteConfig.colors.accent : siteConfig.colors.dark }}
      >
        {name}
      </span>
    </Link>
  );
}

/* ── Skeleton loader ── */
function SkeletonTile() {
  return (
    <div className="flex flex-col items-center gap-3 animate-pulse">
      <div
        className="rounded-full bg-gray-200"
        style={{ width: "clamp(72px, 9vw, 110px)", height: "clamp(72px, 9vw, 110px)" }}
      />
      <div className="h-3 w-20 rounded-full bg-gray-200" />
    </div>
  );
}

/* ── Main component ── */
export default function ShopByCategory() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  const popularCategories = popularSlugs
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter(Boolean) as typeof categories;

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#fff" }}>
      <div className="max-w-7xl mx-auto">
        {/* ── MAIN CATEGORY CARDS ── */}
        <SectionTitle title="Shop By Category" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {mainCategories.map((cat) => (
            <MainCategoryCard key={cat.title} {...cat} />
          ))}
        </div>

        {/* ── POPULAR PRODUCTS ── */}
        <div className="mt-14">
          <SectionTitle title="Popular Products" />
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-4 sm:gap-6 justify-items-center">
            {!loaded
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonTile key={i} />)
              : popularCategories.map((cat) => (
                  <CategoryTile
                    key={cat.slug}
                    slug={cat.slug}
                    name={cat.name}
                    icon={cat.icon}
                    isNew={cat.isNew}
                  />
                ))}
          </div>
        </div>

        {/* View all button */}
        <div className="flex justify-center mt-10">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              borderColor: siteConfig.colors.primary,
              color: siteConfig.colors.primary,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                siteConfig.colors.primary;
              (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.color = siteConfig.colors.primary;
            }}
          >
            View All Categories →
          </Link>
        </div>
      </div>
    </section>
  );
}
