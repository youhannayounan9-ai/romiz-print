"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { siteConfig } from "../config/site";

/* ─── Slide data ──────────────────────────────────────────────── */
const slides = [
  {
    id: 1,
    eyebrow: "Cairo's Custom Printing Co.",
    headline: "Custom Frames",
    subHeadline: "& Displays",
    subtext:
      "Premium quality frames available in A5, A4, and A3 sizes. Perfect for memories, art prints, office branding, and corporate displays.",
    cta: "Explore Frames",
    ctaHref: "/categories/frames",
    badge: null,
    accentSubHeadline: true,
    image: {
      src: "/hero-frames.jpg.jpeg",
      alt: "Custom Frames Printing Cairo",
      loading: "eager" as const,
    },
  },
  {
    id: 2,
    eyebrow: "Custom Apparel & Lab Coats",
    headline: "Personalized Shirts",
    subHeadline: "& Medical Wear",
    subtext:
      "High-grade fabric custom t-shirts and embroidered medical lab coats tailored for professionals, university students, and teams.",
    cta: "Shop Apparel Collection",
    ctaHref: "/categories/t-shirts",
    badge: null,
    accentSubHeadline: false,
    image: {
      src: "/hero-clothes.jpg.jpeg",
      alt: "Custom Apparel and Lab Coats Egypt",
      loading: "lazy" as const,
    },
  },
  {
    id: 3,
    eyebrow: "High-Volume Commercial Printing",
    headline: "Commercial Printing",
    subHeadline: "& Marketing",
    subtext:
      "Stickers, banners, marketing collaterals, and full-scale printing services with precise color reproduction and fast turnaround across Cairo.",
    cta: "Get a Quote",
    ctaHref: "/quotes",
    badge: null,
    accentSubHeadline: false,
    image: {
      src: "/hero-printing.jpg.jpeg",
      alt: "Commercial Printing Services Cairo",
      loading: "lazy" as const,
    },
  },
];

/* ─── Main Component ──────────────────────────────────────────── */
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

  /* Auto-rotate every 5 s, pause on hover */
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
      style={{ background: "linear-gradient(135deg, #F5F7FA 0%, #E8EEF7 100%)" }}
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
                {slide.eyebrow}
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
                  color: slide.accentSubHeadline
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

            {/* CTA Button */}
            <div className="pt-2 flex justify-center md:justify-start">
              <Link
                href={slide.ctaHref}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-transform duration-200 hover:scale-105 shadow-md"
                style={{ backgroundColor: siteConfig.colors.primary }}
              >
                {slide.cta}
              </Link>
            </div>

            {/* Dot navigation */}
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
                        i === current ? siteConfig.colors.accent : "#CBD5E0",
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
          <div className="flex-shrink-0 w-full md:w-80 lg:w-[420px] h-64 md:h-80 lg:h-[380px] relative">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                key={slide.id}
                src={slide.image.src}
                alt={slide.image.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 320px, 420px"
                className="object-cover"
                loading={slide.image.loading}
                style={{
                  transition: "opacity 0.35s ease",
                }}
              />
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(11,77,162,0.08) 0%, rgba(0,0,0,0.04) 100%)",
                }}
              />
            </div>

            <div
              className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl -z-10"
              style={{
                border: `2px solid ${siteConfig.colors.accent}`,
                opacity: 0.25,
              }}
            />
          </div>

          {/* ── ARROW CONTROLS ── */}
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 md:-translate-x-4 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md border border-gray-200 transition-all duration-200 hover:bg-[#0B4DA2] hover:text-white hover:border-[#0B4DA2] z-10"
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