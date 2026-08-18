"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Home, SearchX } from "lucide-react";
import { siteConfig } from "../config/site";
import { productData } from "../data/products";
import { categories } from "../data/categories";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const normalizedQuery = query.toLowerCase().trim();

  // Flatten products and inject slug
  const allProducts = Object.entries(productData).flatMap(([slug, products]) => 
    products.map(p => {
      const category = categories.find(c => c.slug === slug);
      return {
        ...p,
        slug,
        categoryName: category?.name || slug
      };
    })
  );

  // Filter products
  const matchingProducts = normalizedQuery
    ? allProducts.filter(p => 
        p.name.toLowerCase().includes(normalizedQuery) || 
        p.description.toLowerCase().includes(normalizedQuery) ||
        p.categoryName.toLowerCase().includes(normalizedQuery)
      )
    : [];

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="w-full py-12 px-4 sm:px-6 lg:px-8"
        style={{ background: "linear-gradient(135deg, #F5F7FA 0%, #E8EEF7 100%)" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-400 mb-8 flex-wrap">
            <Link href="/" className="flex items-center gap-1 hover:text-gray-600 transition-colors">
              <Home size={13} />
              Home
            </Link>
            <ChevronRight size={12} className="text-gray-300" />
            <span style={{ color: siteConfig.colors.primary }} className="font-semibold">
              Search Results
            </span>
          </nav>

          {/* Hero content */}
          <div className="flex flex-col items-start gap-4">
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold"
              style={{
                color: siteConfig.colors.dark,
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              }}
            >
              Search Results for <span style={{ color: siteConfig.colors.accent }}>&quot;{query}&quot;</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-500 font-medium">
              Found {matchingProducts.length} matching {matchingProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>
        </div>
      </section>

      {/* ── Results Grid ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {matchingProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {matchingProducts.map((product) => (
                <Link
                  key={`${product.slug}-${product.id}`}
                  href={`/categories/${product.slug}`}
                  className="flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div
                    className="w-full relative bg-gray-50 overflow-hidden"
                    style={{ height: "220px" }}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white rounded-lg bg-[#0B4DA2] shadow-sm">
                      {product.categoryName}
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg mb-2" style={{ color: siteConfig.colors.dark }}>
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-1">
                      {product.description}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-sm font-semibold" style={{ color: siteConfig.colors.accent }}>
                      <span>View Details</span>
                      <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                <SearchX size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No products found</h2>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                We couldn&apos;t find any products matching &quot;{query}&quot;. Try checking for typos or using more general terms.
              </p>
              <Link 
                href="/categories"
                className="px-6 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 shadow-sm"
                style={{ backgroundColor: siteConfig.colors.primary }}
              >
                Browse All Categories
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
