"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
const QuoteModal = dynamic(() => import("../../components/QuoteModal"), { ssr: false });
import { siteConfig } from "../../config/site";
import { getProductsForCategory, type CategoryProduct } from "../../data/products";

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse bg-white shadow-sm">
      <div className="h-48 bg-gray-200" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-4 bg-gray-200 rounded-full w-3/4" />
        <div className="h-3 bg-gray-200 rounded-full w-full" />
        <div className="h-3 bg-gray-200 rounded-full w-2/3" />
        <div className="h-10 bg-gray-200 rounded-xl mt-1" />
      </div>
    </div>
  );
}

/* ── Product card ── */
function ProductCard({
  product,
  onQuoteClick,
}: {
  product: CategoryProduct;
  onQuoteClick: (name: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 bg-white"
      style={{
        boxShadow: hovered
          ? "0 20px 40px rgba(11,77,162,0.15)"
          : "0 2px 12px rgba(0,0,0,0.07)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* NEW badge */}
      {product.isNew && (
        <span
          className="absolute top-3 right-3 z-10 text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
          style={{ backgroundColor: siteConfig.colors.accent }}
        >
          NEW
        </span>
      )}

      {/* Placeholder image */}
      <div
        className="w-full flex items-center justify-center transition-transform duration-300"
        style={{
          height: "192px",
          backgroundColor: product.bgColor,
          transform: hovered ? "scale(1.03)" : "scale(1)",
        }}
      >
        <span className="text-5xl select-none">{product.emoji}</span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex-1">
          <h3
            className="font-semibold text-base leading-snug mb-1.5"
            style={{ color: siteConfig.colors.dark }}
          >
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
        </div>
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

/* ── Main client component ── */
export default function CategoryPageClient({
  categoryName,
  slug,
}: {
  categoryName: string;
  slug: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  /* 300ms skeleton delay */
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  const products = getProductsForCategory(slug, categoryName);

  function openQuote(productName: string) {
    setSelectedProduct(productName);
    setModalOpen(true);
  }

  return (
    <>
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {!loaded
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map((p) => (
              <ProductCard key={p.id} product={p} onQuoteClick={openQuote} />
            ))}
      </div>

      {/* SEO text blocks */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6" style={{ backgroundColor: "#F5F7FA" }}>
          <h2
            className="text-lg font-bold mb-3"
            style={{ color: siteConfig.colors.dark, fontFamily: "var(--font-space-grotesk)" }}
          >
            Why Choose ROMIZ PRINT for {categoryName}?
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            At ROMIZ PRINT, we combine cutting-edge printing technology with premium materials to
            deliver {categoryName.toLowerCase()} that truly represent your brand. Our Cairo-based
            team provides free design consultation, fast turnaround times, and competitive pricing
            for every order — from a single piece to bulk runs of 10,000+.
          </p>
        </div>
        <div className="rounded-2xl p-6" style={{ backgroundColor: "#F5F7FA" }}>
          <h2
            className="text-lg font-bold mb-3"
            style={{ color: siteConfig.colors.dark, fontFamily: "var(--font-space-grotesk)" }}
          >
            How It Works
          </h2>
          <ol className="text-sm text-gray-500 leading-relaxed space-y-2">
            {[
              "Choose your product and click \"Request Quote\"",
              "Fill in your details and upload your design file",
              "Our team reviews and sends you a custom quote within 24 hours",
              "Approve the quote and we handle the rest — printing, quality check, dispatch",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white mt-0.5"
                  style={{ backgroundColor: siteConfig.colors.primary }}
                >
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={modalOpen}
        productName={selectedProduct}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
