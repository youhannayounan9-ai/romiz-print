"use client";

import { useState } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import dynamic from "next/dynamic";
const QuoteModal = dynamic(() => import("./QuoteModal"), { ssr: false });
import { siteConfig } from "../config/site";

interface Product {
  id: number;
  name: string;
  description: string;
  isNew?: boolean;
  emoji: string;
  category: string;
  categorySlug: string;
  bgColor: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Custom Granddad Hoodie",
    description: "Premium cotton, Cairo-made. Full-colour print, warm fleece lining.",
    isNew: true,
    emoji: "🧥",
    category: "Apparel",
    categorySlug: "t-shirts",
    bgColor: "#E8EEF7",
  },
  {
    id: 2,
    name: "Personalized Coffee Mug",
    description: "Dishwasher-safe, vibrant print. Perfect for branding or gifting.",
    isNew: false,
    emoji: "☕",
    category: "Drinkware",
    categorySlug: "mugs",
    bgColor: "#F0EBE3",
  },
  {
    id: 3,
    name: "Business Card Pack (100)",
    description: "Matte or glossy finish, free design help included.",
    isNew: false,
    emoji: "💼",
    category: "Stationery",
    categorySlug: "business-cards",
    bgColor: "#E3EBF0",
  },
  {
    id: 4,
    name: "Custom Tote Bag",
    description: "Eco-friendly canvas bags with full-colour print. Perfect for events & gifting.",
    isNew: true,
    emoji: "👜",
    category: "Bags",
    categorySlug: "tote-bags",
    bgColor: "#EBE3F0",
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
function ProductCard({
  product,
  onQuoteClick,
}: {
  product: Product;
  onQuoteClick: (name: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
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

      {/* Category chip — links to category page */}
      <a
        href={`/categories/${product.categorySlug}`}
        className="absolute top-3 left-3 z-10 text-[10px] font-semibold px-2.5 py-1 rounded-full hover:opacity-80 transition-opacity"
        style={{
          backgroundColor: siteConfig.colors.lightBar,
          color: siteConfig.colors.primary,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {product.category}
      </a>

      {/* Placeholder image */}
      <div
        className="w-full flex items-center justify-center transition-transform duration-300"
        style={{
          height: "200px",
          backgroundColor: product.bgColor,
          transform: hovered ? "scale(1.03)" : "scale(1)",
        }}
      >
        <span className="text-6xl select-none">{product.emoji}</span>
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

        {/* CTA button */}
        <button
          onClick={() => onQuoteClick(product.name)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
          style={{
            backgroundColor: hovered ? "#E06600" : siteConfig.colors.accent,
          }}
        >
          <ShoppingBag size={14} />
          Request Quote
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function TrendingProducts() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  function openQuote(productName: string) {
    setSelectedProduct(productName);
    setModalOpen(true);
  }

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
            <ProductCard key={product.id} product={product} onQuoteClick={openQuote} />
          ))}
        </div>

        {/* View all link */}
        <div className="flex justify-center mt-10">
          <a
            href="/categories/stickers"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:gap-3"
            style={{ color: siteConfig.colors.primary }}
          >
            Browse All Products
            <ArrowRight size={16} />
          </a>
        </div>
      </div>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={modalOpen}
        productName={selectedProduct}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
