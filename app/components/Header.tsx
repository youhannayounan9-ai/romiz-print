"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, User, Menu, X, ShoppingCart, Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { siteConfig } from "../config/site";
import { useCart } from "../context/CartContext";
import { useTheme } from "next-themes";
import { productData, CategoryProduct } from "../data/products";

const POPULAR_SEARCH_TAGS = ["Mugs", "Stickers", "Business Cards", "T-Shirts", "Roll Up"];

export default function Header() {
  const [logoError, setLogoError] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const searchRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { totalItems } = useCart();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    router.push(`/search?q=${encodeURIComponent(tag)}`);
    setIsSearchFocused(false);
  };

  // Get matching products for live search
  const getSearchSuggestions = (): (CategoryProduct & { categorySlug: string })[] => {
    if (!searchQuery.trim()) return [];
    const term = searchQuery.toLowerCase();
    const matches: (CategoryProduct & { categorySlug: string })[] = [];
    
    Object.entries(productData).forEach(([slug, products]) => {
      products.forEach(p => {
        if (p.name.toLowerCase().includes(term) || slug.includes(term)) {
          matches.push({ ...p, categorySlug: slug });
        }
      });
    });
    return matches.slice(0, 5); // Limit to 5 suggestions
  };

  const searchSuggestions = getSearchSuggestions();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-y-3 md:gap-4 py-3 md:py-0 min-h-[64px] lg:min-h-[80px]">
          
          {/* ── LEFT: Logo ── */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              {!logoError ? (
                <Image
                  src={siteConfig.logoHorizontal}
                  alt={siteConfig.name}
                  width={180}
                  height={40}
                  className="h-10 w-auto object-contain"
                  onError={() => setLogoError(true)}
                  loading="lazy"
                />
              ) : (
                <span
                  className="text-2xl font-bold tracking-tight select-none"
                  style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
                >
                  <span style={{ color: siteConfig.colors.dark }}>ROMIZ</span>
                  <span style={{ color: siteConfig.colors.accent }}>PRINT</span>
                </span>
              )}
            </Link>
          </div>

          {/* ── CENTER: Search with Autocomplete ── */}
          <div className="order-last md:order-none w-full md:w-auto md:flex-1 flex items-center max-w-2xl mx-auto relative">
            <form 
              ref={searchRef}
              onSubmit={handleSearch} 
              className="flex w-full rounded-xl border-2 border-gray-200 focus-within:border-[#0B4DA2] transition-colors duration-200 shadow-sm bg-white relative z-50"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="I am looking for..."
                className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400 rounded-l-xl"
              />
              <button
                type="submit"
                aria-label="Search"
                className="flex items-center gap-2 px-4 md:px-5 py-2.5 text-white text-sm font-semibold transition-colors duration-200 hover:opacity-90 rounded-r-[10px]"
                style={{ backgroundColor: siteConfig.colors.dark }}
              >
                <Search size={16} />
                <span className="hidden lg:inline">Search</span>
              </button>
            </form>

            {/* Search Dropdown Panel */}
            {isSearchFocused && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-40 max-h-[80vh] overflow-y-auto">
                {!searchQuery.trim() ? (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Popular Searches</h4>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCH_TAGS.map(tag => (
                        <button 
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Matching Products</h4>
                    {searchSuggestions.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {searchSuggestions.map(product => {
                          const productSlug = product.name.toLowerCase().replace(/\s+/g, '-');
                          return (
                            <Link 
                              key={product.id} 
                              href={`/products/${product.categorySlug}?p=${productSlug}`}
                              onClick={() => setIsSearchFocused(false)}
                              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group"
                            >
                              <div className="w-12 h-12 relative bg-gray-100 rounded border border-gray-200 flex-shrink-0">
                                <Image src={product.image} alt={product.name} fill className="object-contain p-1" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-800 group-hover:text-[#0B4DA2] transition-colors">{product.name}</span>
                                <span className="text-xs text-gray-500 capitalize">{product.categorySlug}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 py-4 text-center">No products found for "{searchQuery}"</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT: Actions ── */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
              aria-label="Toggle theme"
            >
              {mounted ? (resolvedTheme === 'dark' ? '☀️' : '🌙') : '🌙'}
            </button>
            {/* Account Icon */}
            <Link
              href="/admin?access=ROMIZ_ADMIN_2026"
              aria-label="Admin Dashboard"
              className="p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-700"
            >
              <User size={22} />
            </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              aria-label="Shopping Cart"
              className="relative p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-700"
            >
              <ShoppingCart size={22} />
              {mounted && totalItems > 0 && (
                <span 
                  className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white rounded-full border-2 border-white"
                  style={{ backgroundColor: siteConfig.colors.accent }}
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

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
          {["Roll Up", "Frame", "Banners", "Business Cards", "Tote Bags", "Flyers", "Mugs", "Pens", "Stickers", "T-Shirts"].map((item) => (
            <Link
              key={item}
              href={`/categories/${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-[#F5F7FA] hover:text-[#FF7A1A]"
              style={{ color: siteConfig.colors.dark }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
