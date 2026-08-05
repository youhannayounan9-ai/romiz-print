"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star, ArrowRight } from "lucide-react";
import { siteConfig } from "../config/site";

/* ─── Slide data ─────────────────────────────────────────────── */
const slides = [
  {
    id: 1,
    headline: "YOUR BRAND.",
    subHeadline: "PRINTED. PERFECTED.",
    subtext:
      "Premium custom printing in Cairo — from 1 piece to 10,000. Free design help, express dispatch.",
    cta: "Request Your Free Quote",
    badge: { label: "4.8★ Reviews", sub: "200+ happy clients" },
    imageLabel: "Product Collage",
    imageSlots: 3,
    accentLine: true,
  },
  {
    id: 2,
    headline: "Stickers That",
    subHeadline: "Stick. Literally.",
    subtext:
      "Die-cut, roll labels, holographic & vinyl — any shape, any size, any quantity. Dispatched same week.",
    cta: "Get a Quote on Stickers",
    badge: null,
    imageLabel: "Sticker Sheets",
    imageSlots: 2,
    accentLine: false,
  },
  {
    id: 3,
    headline: "Custom Apparel,",
    subHeadline: "Made in Cairo.",
    subtext:
      "T-shirts, hoodies, socks & more — premium fabrics, full-colour prints, no minimums.",
    cta: "Design Your Apparel",
    badge: null,
    imageLabel: "T-Shirt & Mug",
    imageSlots: 2,
    accentLine: false,
  },
];

/* ─── Placeholder image block ───────────────────────────────── */
function PlaceholderCollage({ slots, label }: { slots: number; label: string }) {
  if (slots === 3) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Back left */}
        <div
          className="absolute left-0 top-6 w-40 h-48 md:w-48 md:h-56 rounded-2xl shadow-lg"
          style={{ backgroundColor: "#D1DCF0", transform: "rotate(-6deg)" }}
        />
        {/* Back right */}
        <div
          className="absolute right-0 top-10 w-36 h-44 md:w-44 md:h-52 rounded-2xl shadow-lg"
          style={{ backgroundColor: "#C4D4ED", transform: "rotate(5deg)" }}
        />
        {/* Front center */}
        <div
          className="relative z-10 w-44 h-52 md:w-52 md:h-64 rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-2"
          style={{ backgroundColor: "#B8CCEB" }}
        >
          <span className="text-4xl">🖨️</span>
          <span
            className="text-xs font-semibold px-3 text-center"
            style={{ color: siteConfig.colors.primary }}
          >
            {label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center gap-4">
      <div
        className="w-40 h-52 md:w-48 md:h-60 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-2"
        style={{ backgroundColor: "#D1DCF0", transform: "rotate(-4deg)" }}
      >
        <span className="text-3xl">✨</span>
        <span
          className="text-xs font-semibold px-3 text-center"
          style={{ color: siteConfig.colors.primary }}
        >
          {label}
        </span>
      </div>
      <div
        className="w-36 h-44 md:w-44 md:h-52 rounded-2xl shadow-lg"
        style={{ backgroundColor: "#C4D4ED", transform: "rotate(3deg)" }}
      />
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent((index + total) % total);
      setTimeout(() => setIsAnimating(false), 400);
    },
    [isAnimating, total]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  /* Auto-rotate */
  useEffect(() => {
    if (isHovered) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, total]);

  const slide = slides[current];

  return (
    <section
      className="w-full overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #F5F7FA 0%, #E8EEF7 100%)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12 py-12 md:py-16 lg:py-20 min-h-[480px] md:min-h-[520px]"
          style={{
            opacity: isAnimating ? 0 : 1,
            transform: isAnimating ? "translateY(6px)" : "translateY(0)",
            transition: "opacity 0.35s ease, transform 0.35s ease",
          }}
        >
          {/* ── TEXT SIDE ── */}
          <div className="flex-1 flex flex-col gap-5 text-center md:text-left">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span
                className="inline-block w-8 h-0.5 rounded"
                style={{ backgroundColor: siteConfig.colors.accent }}
              />
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: siteConfig.colors.accent }}
              >
                Cairo&apos;s Custom Printing Co.
              </span>
            </div>

            {/* Headline */}
            <div>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
                style={{
                  color: siteConfig.colors.dark,
                  fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                }}
              >
                {slide.headline}
              </h1>
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
                style={{
                  color: slide.accentLine
                    ? siteConfig.colors.accent
                    : siteConfig.colors.primary,
                  fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                }}
              >
                {slide.subHeadline}
              </h2>
            </div>

            {/* Subtext */}
            <p
              className="text-sm sm:text-base leading-relaxed max-w-md mx-auto md:mx-0"
              style={{ color: "#4A5568" }}
            >
              {slide.subtext}
            </p>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 shadow-lg shadow-orange-200"
                style={{ backgroundColor: siteConfig.colors.accent }}
              >
                {slide.cta}
                <ArrowRight size={16} />
              </a>

              {/* Google Badge */}
              {slide.badge && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < 4 ? "#FBBC04" : "none"}
                        stroke={i < 4 ? "#FBBC04" : "#CBD5E0"}
                      />
                    ))}
                  </div>
                  <div>
                    <p
                      className="text-xs font-bold leading-none"
                      style={{ color: siteConfig.colors.dark }}
                    >
                      {slide.badge.label}
                    </p>
                    <p className="text-[10px] text-gray-400 leading-none mt-0.5">
                      {slide.badge.sub}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Slide counter & dots */}
            <div className="flex items-center gap-3 justify-center md:justify-start mt-2">
              <div className="flex items-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === current ? "24px" : "8px",
                      height: "8px",
                      backgroundColor:
                        i === current
                          ? siteConfig.colors.accent
                          : "#CBD5E0",
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">
                {current + 1} / {total}
              </span>
            </div>
          </div>

          {/* ── IMAGE SIDE ── */}
          <div className="flex-shrink-0 w-full md:w-80 lg:w-96 h-64 md:h-80 lg:h-96 relative">
            <PlaceholderCollage slots={slide.imageSlots} label={slide.imageLabel} />
          </div>

          {/* ── ARROW CONTROLS ── */}
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 md:-translate-x-4 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md border border-gray-200 transition-all duration-200 hover:bg-[#0B4DA2] hover:text-white hover:border-[#0B4DA2] hover:-translate-y-1/2 z-10"
            style={{ color: siteConfig.colors.dark }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 md:translate-x-4 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md border border-gray-200 transition-all duration-200 hover:bg-[#0B4DA2] hover:text-white hover:border-[#0B4DA2] z-10"
            style={{ color: siteConfig.colors.dark }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
