"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Settings2 } from "lucide-react";
import { siteConfig } from "../../config/site";
import { getProductsForCategory } from "../../data/products";
import { useRouter } from "next/navigation";
import { footballKitsData, FootballKitItem } from "../../data/apparelData";

/* ─── Frame collection filenames ─── */
const frameNumbers1 = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41];
const frameGalleryImages1 = frameNumbers1.map((n) => {
  const jpegNums = [1, 2, 5, 6, 7, 8, 10, 11, 12, 28, 29, 34, 38];
  const ext = jpegNums.includes(n) ? "jpeg" : "jpg";
  return `/Frame collection/frame (${n}).${ext}`;
});

const frameNumbers2 = Array.from({ length: 39 }, (_, i) => i + 1);
const frameGalleryImages2 = frameNumbers2.map(n => `/Frame collection 2/frame (${n}).jpg`);

const frameNumbers3 = Array.from({ length: 27 }, (_, i) => i + 1);
const frameGalleryImages3 = frameNumbers3.map((n) => {
  const ext = n >= 21 && n <= 27 ? "jpg" : "jpeg";
  return `/Frame collection 3/framee (${n}).${ext}`;
});

const frameGalleryImages = [...frameGalleryImages1, ...frameGalleryImages2, ...frameGalleryImages3];

/* ─── T-Shirt collection (Excludes 23.jpg used for main card) ─── */
const tshirtGalleryImages = Array.from({ length: 22 }, (_, i) => `/T-shirt collection/${i + 1}.jpg`);

const categoryIntros: Record<string, { headline: string; body: string }> = {
  "roll-up": {
    headline: "Premium Roll Up Banners",
    body: "High-impact, ultra-clear roll up banners. Perfect for exhibitions, retail, and events.",
  },
  frame: {
    headline: "Custom Framed Posters",
    body: "Beautifully framed posters in multiple sizes and finishes to elevate your space or brand.",
  },
  banners: {
    headline: "High-Impact Banner Printing",
    body: "Custom vinyl banners. Express turnaround, custom sizes, eyelets included.",
  },
  "business-cards": {
    headline: "Business Cards That Make an Impression",
    body: "Professional cards that speak for your brand before you say a word. Multiple paper types available.",
  },
  "tote-bags": {
    headline: "Custom Printed Tote Bags",
    body: "Eco-friendly cotton tote bags with full-colour printing. Perfect for retail, events, and gifting.",
  },
  flyers: {
    headline: "Professional Flyer Printing",
    body: "Full-colour flyers in various sizes and weights. Perfect for events, promotions, and campaigns.",
  },
  mugs: {
    headline: "Personalised Mugs & Drinkware",
    body: "Custom photo mugs, magic colour-changing mugs — printed with full-colour sublimation.",
  },
  pens: {
    headline: "Branded Pens & Writing Sets",
    body: "Custom pens printed with your logo. Ideal for corporate gifting and events.",
  },
  stickers: {
    headline: "Custom Stickers for Every Need",
    body: "Die-cut, circle, square, or rectangle stickers in vinyl, paper, or holographic finish.",
  },
  "t-shirts": {
    headline: "Custom Apparel Printing in Cairo",
    body: "Premium cotton t-shirts, hoodies, and lab coats with vibrant print. Perfect for teams, events, or personal use.",
  },
  "football-kits": {
    headline: "Football Kits & Teamwear",
    body: "High-performance football kits ready for your team logo and player names.",
  },
  caps: {
    headline: "Custom Caps & Hats",
    body: "Premium embroidered or printed caps with your logo or design. Perfect for corporate wear or casual merch.",
  },
  "lab-coats": {
    headline: "Custom Lab Coats & Uniforms",
    body: "Professionally printed lab coats and uniforms for clinics, labs, and corporate teams.",
  },
  stamps: {
    headline: "Custom Stamps",
    body: "Self-inking and traditional stamps in various types and sizes. Perfect for offices and clinics.",
  },
};

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse bg-white shadow-sm max-w-sm w-full mx-auto">
      <div className="h-64 bg-gray-200" />
      <div className="p-6 flex flex-col gap-4">
        <div className="h-5 bg-gray-200 rounded-full w-3/4" />
        <div className="h-4 bg-gray-200 rounded-full w-full" />
        <div className="h-4 bg-gray-200 rounded-full w-2/3" />
        <div className="h-12 bg-gray-200 rounded-xl mt-2" />
      </div>
    </div>
  );
}

/* ── Standard Gallery Card (Frames & T-Shirts) ── */
function GalleryCard({
  src,
  alt,
  onClick,
}: {
  src: string;
  alt: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative aspect-square w-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
          unoptimized={src.startsWith("/")}
        />
      </div>

      <div className="p-2.5 sm:p-3 bg-white dark:bg-gray-800 flex items-center justify-center border-t border-gray-100 dark:border-gray-700">
        <button
          className="w-full py-2 px-3 rounded-xl text-xs sm:text-sm font-bold text-white transition-colors duration-200 shadow-sm flex items-center justify-center gap-1.5"
          style={{ backgroundColor: siteConfig.colors.accent }}
        >
          <span>Select Design</span>
          <span className="text-xs">→</span>
        </button>
      </div>
    </div>
  );
}

/* ── Football Kit Card with Front/Back Toggle Overlay ── */
function FootballKitCard({
  kit,
  onSelect,
}: {
  kit: FootballKitItem;
  onSelect: (activeSrc: string, altSrc: string) => void;
}) {
  const [activeView, setActiveView] = useState<"back" | "front">("back");
  const activeImage = activeView === "back" ? kit.backImage : kit.frontImage;
  const altImage = activeView === "back" ? kit.frontImage : kit.backImage;

  return (
    <div className="group flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300">
      <div
        className="relative aspect-square w-full bg-gray-50 dark:bg-gray-900 overflow-hidden cursor-pointer"
        onClick={() => onSelect(activeImage, altImage)}
      >
        <Image
          src={activeImage}
          alt={`${kit.name} - ${activeView} view`}
          fill
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
          unoptimized
        />

        {/* View Switcher Overlay */}
        <div
          className="absolute top-2 right-2 flex bg-black/60 backdrop-blur-md rounded-lg p-0.5 text-[10px] font-bold text-white z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setActiveView("front")}
            className={`px-2 py-1 rounded-md transition-colors ${activeView === "front" ? "bg-white text-black" : "text-gray-300 hover:text-white"
              }`}
          >
            Front
          </button>
          <button
            onClick={() => setActiveView("back")}
            className={`px-2 py-1 rounded-md transition-colors ${activeView === "back" ? "bg-white text-black" : "text-gray-300 hover:text-white"
              }`}
          >
            Back
          </button>
        </div>
      </div>

      <div className="p-2.5 sm:p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => onSelect(activeImage, altImage)}
          className="w-full py-2 px-3 rounded-xl text-xs sm:text-sm font-bold text-white transition-colors duration-200 shadow-sm flex items-center justify-center gap-1.5"
          style={{ backgroundColor: siteConfig.colors.accent }}
        >
          <span>Customize Kit</span>
          <span className="text-xs">→</span>
        </button>
      </div>
    </div>
  );
}

/* ── Product Card Component ── */
function ProductCard({
  name,
  description,
  image,
  productSlug,
}: {
  name: string;
  description: string;
  image: string;
  productSlug: string;
}) {
  const router = useRouter();

  const handleCustomize = () => {
    router.push(`/products/${productSlug}`);
  };

  const displayName = name.replace("Custom ", "");

  return (
    <div className="flex flex-col rounded-3xl overflow-hidden bg-white shadow-xl border border-gray-100 max-w-sm w-full mx-auto">
      <div className="w-full relative bg-gray-50" style={{ height: "280px" }}>
        <Image src={image} alt={name} fill className="object-contain p-4" unoptimized={image.startsWith("/")} />
      </div>
      <div className="flex flex-col p-6 gap-4 text-center flex-1">
        <div>
          <h3 className="font-bold text-xl mb-2" style={{ color: siteConfig.colors.dark }}>{name}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
        <button
          onClick={handleCustomize}
          className="mt-auto w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
          style={{ backgroundColor: siteConfig.colors.accent }}
        >
          <Settings2 size={16} />
          Customize Your {displayName}
        </button>
      </div>
    </div>
  );
}

/* ── Main Client Component ── */
export default function CategoryPageClient({ categoryName, slug }: { categoryName: string; slug: string }) {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  const products = getProductsForCategory(slug, categoryName);

  if (products.length === 0 && loaded) {
    return <div className="text-center py-20">Product not found.</div>;
  }

  const isTshirts = slug === "t-shirts";
  const isFrame = slug === "frame";
  const isFootballKitsPage = slug === "football-kits";

  return (
    <>
      {/* Category intro banner */}
      {(() => {
        const intro = categoryIntros[slug];
        return intro ? (
          <div
            className="rounded-2xl p-6 mb-10 border-l-4 max-w-3xl mx-auto"
            style={{ backgroundColor: siteConfig.colors.lightBar, borderLeftColor: siteConfig.colors.accent }}
          >
            <h2 className="text-lg font-bold mb-2" style={{ color: siteConfig.colors.dark, fontFamily: "var(--font-space-grotesk)" }}>
              {intro.headline}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">{intro.body}</p>
          </div>
        ) : null;
      })()}

      {/* Dynamic Product Cards */}
      <div className={`grid gap-6 justify-center ${products.length > 1 ? "grid-cols-1 md:grid-cols-2 max-w-4xl" : "grid-cols-1 max-w-sm"} mx-auto mt-6`}>
        {!loaded ? (
          Array.from({ length: products.length || 1 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              description={product.description}
              image={product.image}
              productSlug={(product as any).slug}
            />
          ))
        )}
      </div>

      {/* ── FRAME GALLERY ── */}
      {isFrame && loaded && (
        <section className="mt-16 w-full">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="flex-1 max-w-24 h-px" style={{ backgroundColor: "#D6E2F0" }} />
            <h2
              className="text-2xl sm:text-3xl font-bold text-center whitespace-nowrap"
              style={{ color: siteConfig.colors.dark, fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
            >
              Ready-made Frames
            </h2>
            <span className="flex-1 max-w-24 h-px" style={{ backgroundColor: "#D6E2F0" }} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {frameGalleryImages.map((src, idx) => (
              <GalleryCard
                key={idx}
                src={src}
                alt={`Frame design ${idx + 1}`}
                onClick={() => router.push(`/products/custom-framed-poster?image=${encodeURIComponent(src)}&readyMade=true`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── FOOTBALL KITS GALLERY (Paired Front & Back) ── */}
      {isFootballKitsPage && loaded && (
        <section className="mt-16 w-full">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="flex-1 max-w-24 h-px" style={{ backgroundColor: "#D6E2F0" }} />
            <h2
              className="text-2xl sm:text-3xl font-bold text-center whitespace-nowrap"
              style={{ color: siteConfig.colors.dark, fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
            >
              Football Kits Gallery
            </h2>
            <span className="flex-1 max-w-24 h-px" style={{ backgroundColor: "#D6E2F0" }} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {footballKitsData.map((kit) => (
              <FootballKitCard
                key={kit.id}
                kit={kit}
                onSelect={(activeSrc, altSrc) =>
                  router.push(
                    `/products/custom-football-kit?image=${encodeURIComponent(activeSrc)}&altImage=${encodeURIComponent(
                      altSrc
                    )}&readyMade=true`
                  )
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* ── T-SHIRT GALLERY ── */}
      {isTshirts && loaded && (
        <section className="mt-16 w-full">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="flex-1 max-w-24 h-px" style={{ backgroundColor: "#D6E2F0" }} />
            <h2
              className="text-2xl sm:text-3xl font-bold text-center whitespace-nowrap"
              style={{ color: siteConfig.colors.dark, fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
            >
              T-Shirt Collection
            </h2>
            <span className="flex-1 max-w-24 h-px" style={{ backgroundColor: "#D6E2F0" }} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {tshirtGalleryImages.map((src, idx) => (
              <GalleryCard
                key={idx}
                src={src}
                alt={`T-Shirt design ${idx + 1}`}
                onClick={() => router.push(`/products/custom-t-shirt?image=${encodeURIComponent(src)}&readyMade=true`)}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}