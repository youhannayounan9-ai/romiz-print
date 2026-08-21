"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "../config/site";

interface Product {
  id: number;
  name: string;
  description: string;
  isNew?: boolean;
  image: string;
  category: string;
  categorySlug: string;
  bgColor: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Custom Frames",
    description: "Premium framed posters, multiple sizes and colors.",
    isNew: true,
    image: "/Frame customize.png",
    category: "Frames",
    categorySlug: "frame",
    bgColor: "#E8EEF7",
  },
  {
    id: 2,
    name: "Custom Stickers",
    description: "Die-cut, vinyl, holographic or transparent — any shape and size you need.",
    isNew: false,
    image: "/Custom Stickers.png",
    category: "Stickers",
    categorySlug: "stickers",
    bgColor: "#E3EBF0",
  },
  {
    id: 3,
    name: "Custom Pens",
    description: "Branded pens with your logo. Minimum 50 pieces — 35 EGP per piece.",
    isNew: false,
    image: "/Pen1.png",
    category: "Merch",
    categorySlug: "pens",
    bgColor: "#F0EBE3",
  },
  {
    id: 4,
    name: "Custom Mugs",
    description: "Personalised mugs including classic white and magic colour-changing options.",
    isNew: true,
    image: "/Tote Mug1.png",
    category: "Drinkware",
    categorySlug: "mugs",
    bgColor: "#FFF3E0",
  },
];

/* ── Section title ── */
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

/* ── Product card ── */
function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/categories/${product.categorySlug}`}
      className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: "#fff",
        boxShadow: hovered
          ? "0 20px 40px rgba(11, 77, 162, 0.15)"
          : "0 2px 12px rgba(0,0,0,0.07)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* NEW badge */}
      {product.isNew && (
        <div
          className="absolute top-3 right-3 z-10 text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
          style={{ backgroundColor: siteConfig.colors.accent }}
        >
          NEW
        </div>
      )}

      {/* Category chip */}
      <div
        className="absolute top-3 left-3 z-10 text-[10px] font-semibold px-2.5 py-1 rounded-full"
        style={{
          backgroundColor: siteConfig.colors.lightBar,
          color: siteConfig.colors.primary,
        }}
      >
        {product.category}
      </div>

      {/* Product image */}
      <div
        className="w-full relative overflow-hidden transition-transform duration-300"
        style={{
          height: "200px",
          backgroundColor: product.bgColor,
          transform: hovered ? "scale(1.03)" : "scale(1)",
        }}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-6"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex-1">
          <h3
            className="font-semibold text-base leading-snug mb-1"
            style={{
              color: siteConfig.colors.dark,
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
          >
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
        </div>
        <div
          className="text-xs font-semibold flex items-center gap-1 transition-all duration-200"
          style={{ color: siteConfig.colors.accent }}
        >
          View Details →
        </div>
      </div>
    </Link>
  );
}

/* ── Main component ── */
export default function TrendingProducts() {
  return (
    <section
      className="w-full py-14 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: siteConfig.colors.background }}
    >
      <div className="max-w-7xl mx-auto">
        <SectionTitle title="Trending at ROMIZ PRINT" />

        {/* 4-col grid → 2-col tablet → 1-col mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
