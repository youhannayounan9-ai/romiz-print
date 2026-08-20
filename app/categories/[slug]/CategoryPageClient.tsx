"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Settings2 } from "lucide-react";
import dynamic from "next/dynamic";
import { siteConfig } from "../../config/site";
import { getProductsForCategory } from "../../data/products";
import type { FieldConfig } from "../../components/CustomizationModal";

const CustomizationModal = dynamic(() => import("../../components/CustomizationModal"), { ssr: false });

/* ─── Frame collection filenames ─── */
const frameNumbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41];
const frameGalleryImages = frameNumbers.map((n) => {
  const jpegNums = [1,2,5,6,7,8,10,11,12,28,29,34,38];
  const ext = jpegNums.includes(n) ? "jpeg" : "jpg";
  return `/Frame collection/frame (${n}).${ext}`;
});

/* ─── T-shirt collection (1..23, all .jpg) ─── */
const tshirtGalleryImages = Array.from({ length: 23 }, (_, i) => `/T-shirt collection/${i + 1}.jpg`);

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
    body: "Premium cotton t-shirts and hoodies with vibrant print. Perfect for teams, events, or personal use.",
  },
};

const getModalFields = (slug: string): FieldConfig[] => {
  switch (slug) {
    case "roll-up":
      return [
        { id: "design", label: "Describe your design / upload file", type: "textarea", required: false, placeholder: "E.g. brand colours, text, logo placement..." },
      ];
    case "frame":
      return [
        { id: "size", label: "Size", type: "select", required: true, options: ["20x30 cm", "30x40 cm", "40x50 cm"] },
        { id: "color", label: "Frame Color", type: "color", required: true, options: ["Black", "Silver", "#D2B48C"] },
      ];
    case "banners":
      return [
        { id: "width", label: "Width (cm)", type: "select", required: true, options: ["90", "110", "120", "130", "140", "150", "160", "170", "180", "190", "200"] },
        { id: "height", label: "Height (cm)", type: "select", required: true, options: ["50", "100", "150", "200"] },
      ];
    case "business-cards":
      return [
        { id: "paper", label: "Paper Type", type: "select", required: true, options: ["300 gm (normal)", "300 gm (protection)", "Fabriano", "Cristal (White/Gray/Gold)", "700 gm", "IDs"] },
      ];
    case "tote-bags":
    case "mugs":
    case "pens":
      return [
        { id: "design", label: "Describe your design", type: "textarea", required: true, placeholder: "Tell us what you want printed..." },
      ];
    case "flyers":
      return [
        { id: "size_qty", label: "Size & Quantity", type: "select", required: true, options: ["A5 20*15: 2000 pcs (15-25% discount)", "A5 20*15: 1000 pcs", "A4 30*20: 2000 pcs (15-25% discount)", "A4 30*20: 1000 pcs", "A3 30*40: 1000 pcs (15-25% discount)"] },
        { id: "weight", label: "Paper Weight", type: "select", required: true, options: ["80g", "130g", "150g", "200g", "250g", "300g"] },
        { id: "options", label: "Print Options", type: "select", required: true, options: ["4-color double-sided", "Glossy", "Matte"] },
      ];
    case "stickers":
      return [
        { id: "size", label: "Size", type: "select", required: true, options: ["Small (5x5 cm)", "Medium (10x10 cm)", "Large (15x15 cm)", "Custom"] },
        { id: "material", label: "Material", type: "select", required: true, options: ["Vinyl", "Paper", "Holographic", "Transparent"] },
        { id: "finish", label: "Finish", type: "select", required: true, options: ["Matte", "Glossy", "Unlaminated"] },
        { id: "shape", label: "Shape", type: "select", required: true, options: ["Die-cut", "Circle", "Square", "Rectangle"] },
        { id: "quantity", label: "Quantity", type: "select", required: true, options: ["10", "25", "50", "100", "250", "500", "1000"] },
      ];
    case "t-shirts":
      return [
        { id: "type", label: "Product Type", type: "select", required: true, options: ["T-Shirt", "Hoodie"] },
        { id: "size", label: "Size", type: "select", required: true, options: ["Small", "Medium", "Large", "XLarge"] },
        { id: "color", label: "Color", type: "color", required: true, options: ["Black", "White", "Gray", "Navy", "Red"] },
        { id: "design", label: "Describe your design", type: "textarea", required: true },
      ];
    default:
      return [];
  }
};

const getModalExamples = (slug: string): string[] => {
  switch (slug) {
    case "roll-up": return ["/roll-up-banner.png"];
    case "frame": return ["/Frame customize.png"];
    case "banners": return ["/Banner1.png"];
    case "business-cards": return ["/New card.png"];
    case "tote-bags": return ["/Tote Bag.png"];
    case "flyers": return ["/Flyers.png"];
    case "mugs": return ["/Tote Mug1.png", "/black magic mug.png"];
    case "pens": return ["/Pen1.png"];
    case "stickers": return ["/Custom Stickers.png"];
    case "t-shirts": return ["/T-Shirts.png", "/Hoodies.png"];
    default: return [];
  }
};

const getPricingNode = (slug: string): React.ReactNode | undefined => {
  if (slug === "pens") return "Minimum 50 pieces - 35 EGP per piece";
  if (slug === "flyers") {
    return (
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-gray-900">Pricing Information:</p>
        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
          <Image src="/FlyersInfo.png" alt="Flyers Pricing Table" fill className="object-contain" />
        </div>
      </div>
    );
  }
  return undefined;
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
function GallerySection({ title, images }: { title: string; images: string[] }) {
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
          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
            <Image
              src={src}
              alt={`Gallery image ${idx + 1}`}
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
  isNew,
  onCustomize,
  customizeLabel,
}: {
  name: string;
  description: string;
  image: string;
  isNew?: boolean;
  onCustomize: () => void;
  customizeLabel: string;
}) {
  return (
    <div className="flex flex-col rounded-3xl overflow-hidden bg-white shadow-xl border border-gray-100 max-w-sm w-full">
      <div className="w-full relative bg-gray-50" style={{ height: "280px" }}>
        <Image src={image} alt={name} fill className="object-contain p-4" />
        {isNew && (
          <span
            className="absolute top-4 right-4 z-10 text-[10px] font-bold px-3 py-1.5 rounded-full text-white shadow-sm"
            style={{ backgroundColor: siteConfig.colors.accent }}
          >
            NEW
          </span>
        )}
      </div>
      <div className="flex flex-col p-6 gap-4 text-center flex-1">
        <div>
          <h3 className="font-bold text-xl mb-2" style={{ color: siteConfig.colors.dark }}>{name}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
        <button
          onClick={onCustomize}
          className="mt-auto w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
          style={{ backgroundColor: siteConfig.colors.accent }}
        >
          <Settings2 size={16} />
          {customizeLabel}
        </button>
      </div>
    </div>
  );
}

/* ── Main client component ── */
export default function CategoryPageClient({ categoryName, slug }: { categoryName: string; slug: string }) {
  const [loaded, setLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProductName, setModalProductName] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  const openModal = (productName: string) => {
    setModalProductName(productName);
    setModalOpen(true);
  };

  const products = getProductsForCategory(slug, categoryName);
  const product = products.length > 0 ? products[0] : null;

  if (!product && loaded) {
    return <div className="text-center py-20">Product not found.</div>;
  }

  const isTshirts = slug === "t-shirts";
  const isFrame = slug === "frame";

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

      {/* ── T-SHIRTS: Two cards side by side ── */}
      {isTshirts ? (
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch mt-6">
          {!loaded ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <ProductCard
                name="Custom T-Shirts"
                description="Premium cotton tees with vibrant full-colour print. Perfect for teams, events, or retail."
                image="/T-Shirts.png"
                isNew
                onCustomize={() => openModal("Custom T-Shirts")}
                customizeLabel="Customize T-Shirts"
              />
              <ProductCard
                name="Custom Hoodies"
                description="Warm fleece hoodies with your custom design. Available in multiple sizes and colours."
                image="/Hoodies.png"
                onCustomize={() => openModal("Custom Hoodies")}
                customizeLabel="Customize Hoodies"
              />
            </>
          )}
        </div>
      ) : (
        /* ── ALL OTHER CATEGORIES: Single card ── */
        <div className="flex justify-center mt-6">
          {!loaded || !product ? (
            <SkeletonCard />
          ) : (
            <div className="flex flex-col rounded-3xl overflow-hidden bg-white shadow-xl max-w-sm w-full border border-gray-100">
              <div className="w-full relative bg-gray-50" style={{ height: "300px" }}>
                <Image src={product.image} alt={product.name} fill className="object-contain p-4" />
                {product.isNew && (
                  <span
                    className="absolute top-4 right-4 z-10 text-[10px] font-bold px-3 py-1.5 rounded-full text-white shadow-sm"
                    style={{ backgroundColor: siteConfig.colors.accent }}
                  >
                    NEW
                  </span>
                )}
              </div>
              <div className="flex flex-col p-6 sm:p-8 gap-4 text-center">
                <div>
                  <h3 className="font-bold text-xl mb-2" style={{ color: siteConfig.colors.dark }}>{product.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
                </div>
                <button
                  onClick={() => openModal(product.name)}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                  style={{ backgroundColor: siteConfig.colors.accent }}
                >
                  <Settings2 size={16} />
                  Customize {product.name.replace("Custom ", "")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── FRAME GALLERY ── */}
      {isFrame && loaded && (
        <GallerySection title="Ready-made Frames" images={frameGalleryImages} />
      )}

      {/* ── T-SHIRT GALLERY ── */}
      {isTshirts && loaded && (
        <GallerySection title="Ready-Made T-Shirts" images={tshirtGalleryImages} />
      )}

      {/* Modal */}
      {product && (
        <CustomizationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          productName={modalProductName || product.name}
          fields={getModalFields(slug)}
          examples={getModalExamples(slug)}
          pricing={getPricingNode(slug)}
          fileRequired={["banners", "business-cards", "flyers", "stickers", "roll-up"].includes(slug)}
        />
      )}
    </>
  );
}
