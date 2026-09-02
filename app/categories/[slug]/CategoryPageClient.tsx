"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Settings2 } from "lucide-react";
import { siteConfig } from "../../config/site";
import { getProductsForCategory } from "../../data/products";
import { useRouter } from "next/navigation";

/* ─── Frame collection filenames ─── */
// Folder 1: Frame collection
const frameNumbers1 = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41];
const frameGalleryImages1 = frameNumbers1.map((n) => {
  const jpegNums = [1, 2, 5, 6, 7, 8, 10, 11, 12, 28, 29, 34, 38];
  const ext = jpegNums.includes(n) ? "jpeg" : "jpg";
  return `/Frame collection/frame (${n}).${ext}`;
});

// Folder 2: Frame collection 2 (frame (1) to frame (39))
const frameNumbers2 = Array.from({ length: 39 }, (_, i) => i + 1);
const frameGalleryImages2 = frameNumbers2.map(n => `/Frame collection 2/frame (${n}).jpg`);

// Folder 3: Fixed to match public/Collection 3/ (or public/Frame collection 3/)
const frameNumbers3 = Array.from({ length: 27 }, (_, i) => i + 1);
const frameGalleryImages3 = frameNumbers3.map(n => {
  // Support both uppercase and lowercase extensions safely
  const ext = n >= 21 && n <= 27 ? "jpg" : "jpeg";
  return `/Frame collection 3/frame (${n}).${ext}`;
});

// Merged Frame Gallery
const frameGalleryImages = [...frameGalleryImages1, ...frameGalleryImages2, ...frameGalleryImages3];

/* ─── Apparel collections ─── */
const tshirtGalleryImages = Array.from({ length: 23 }, (_, i) => `/T-shirt collection/${i + 1}.jpg`);

const footballKitFiles = [
  "ac 1.jpg", "ac 2.jpg", "ar 1.jpg", "ar 2.jpg", "bayern 1.jpg", "bayern 2.jpg",
  "bc 1.jpg", "bc 2.jpg", "bc 3.jpg", "bc 4.jpg", "ch 1.jpg", "ch 2.jpg",
  "in 1.jpg", "in 2.jpg", "jv 1.jpg", "jv 2.jpg", "li 1.jpg", "li 2.jpg",
  "man 1.jpg", "man 2.jpg", "man 3.jpg", "man 4.jpg", "man 5.jpg", "man 6.jpg",
  "psg 1.jpg", "psg 2.jpg", "rm 1.jpg", "rm 2.jpg", "rm 3.jpg", "rm 4.jpg"
];
const footballKitImages = footballKitFiles.map(f => `/football kits/${f}`);

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

/* ── Skeleton card ── */
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

/* ── Gallery section ── */
function GallerySection({ title, images, onImageClick }: { title: string; images: string[], onImageClick?: (src: string) => void }) {
  return (
    <section className="mt-16 w-full">
      <div className="flex items-center justify-center gap-4 mb-8">
        <span className="flex-1 max-w-24 h-px" style={{ backgroundColor: "#D6E2F0" }} />
        <h2
          className="text-2xl sm:text-3xl font-bold text-center whitespace-nowrap"
          style={{ color: siteConfig.colors.dark, fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
        >
          {title}
        </h2>
        <span className="flex-1 max-w-24 h-px" style={{ backgroundColor: "#D6E2F0" }} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {images.map((src, idx) => (
          <div
            key={idx}
            className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            onClick={() => onImageClick && onImageClick(src)}
          >
            <Image
              src={src}
              alt={`Gallery image ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
              unoptimized
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── T-Shirt Gallery section ── */
function TShirtGallerySection({ onImageClick }: { onImageClick: (src: string, isKit: boolean) => void }) {
  const images = tshirtGalleryImages;

  return (
    <section className="mt-16 w-full">
      <div className="flex flex-col items-center justify-center gap-6 mb-8">
        <div className="flex items-center justify-center gap-4 w-full">
          <span className="flex-1 max-w-24 h-px" style={{ backgroundColor: "#D6E2F0" }} />
          <h2
            className="text-2xl sm:text-3xl font-bold text-center whitespace-nowrap"
            style={{ color: siteConfig.colors.dark, fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
          >
            T-Shirt Collection
          </h2>
          <span className="flex-1 max-w-24 h-px" style={{ backgroundColor: "#D6E2F0" }} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {images.map((src, idx) => (
          <div
            key={idx}
            className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            onClick={() => onImageClick(src, false)}
          >
            <Image
              src={src}
              alt={`T-Shirt image ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Product card ── */
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
        <Image src={image} alt={name} fill className="object-contain p-4" />
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

/* ── Main client component ── */
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
          products.map((product) => {
            return (
              <ProductCard
                key={product.id}
                name={product.name}
                description={product.description}
                image={product.image}
                productSlug={(product as any).slug}
              />
            )
          })
        )}
      </div>

      {/* ── FRAME GALLERY ── */}
      {isFrame && loaded && (
        <GallerySection
          title="Ready-made Frames"
          images={frameGalleryImages}
          onImageClick={(src) => router.push(`/products/custom-framed-poster?image=${encodeURIComponent(src)}&readyMade=true`)}
        />
      )}

      {/* ── FOOTBALL KITS GALLERY ── */}
      {isFootballKitsPage && loaded && (
        <GallerySection
          title="Football Kits Gallery"
          images={footballKitImages}
          onImageClick={(src) => router.push(`/products/custom-football-kit?image=${encodeURIComponent(src)}&readyMade=true`)}
        />
      )}

      {/* ── T-SHIRT GALLERY ── */}
      {isTshirts && loaded && (
        <TShirtGallerySection
          onImageClick={(src, isKit) => {
            const productSlug = isKit ? "custom-football-kit" : "custom-t-shirt";
            router.push(`/products/${productSlug}?image=${encodeURIComponent(src)}&readyMade=true`);
          }}
        />
      )}
    </>
  );
}