"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { categories } from "../data/categories";
import { siteConfig } from "../config/site";

/* 8 featured categories for the grid */
const featuredSlugs = [
  "stickers",
  "business-cards",
  "t-shirts",
  "mugs",
  "banners",
  "brochures",
  "wall-stickers",
  "flyers",
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

/* ── Category tile ── */
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
          width: "clamp(80px, 10vw, 120px)",
          height: "clamp(80px, 10vw, 120px)",
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
          size={28}
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

      {/* "View More" — appears on hover */}
      <span
        className="text-xs font-semibold transition-all duration-300"
        style={{
          color: siteConfig.colors.accent,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(-4px)",
        }}
      >
        View More →
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
        style={{ width: "clamp(80px, 10vw, 120px)", height: "clamp(80px, 10vw, 120px)" }}
      />
      <div className="h-3 w-20 rounded-full bg-gray-200" />
    </div>
  );
}

/* ── Main component ── */
export default function ShopByCategory() {
  const [loaded, setLoaded] = useState(false);

  /* Simulate 300ms loading delay */
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  const featuredCategories = featuredSlugs
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter(Boolean) as typeof categories;

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#fff" }}>
      <div className="max-w-7xl mx-auto">
        <SectionTitle title="Shop By Category" />

        {/* Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-4 sm:gap-6 justify-items-center">
          {!loaded
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonTile key={i} />)
            : featuredCategories.map((cat) => (
                <CategoryTile
                  key={cat.slug}
                  slug={cat.slug}
                  name={cat.name}
                  icon={cat.icon}
                  isNew={cat.isNew}
                />
              ))}
        </div>

        {/* View all button */}
        <div className="flex justify-center mt-10">
          <Link
            href="/products"
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
