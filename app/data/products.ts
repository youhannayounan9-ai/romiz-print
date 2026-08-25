export interface CategoryProduct {
  id: number | string;
  slug: string;
  name: string;
  description: string;
  image: string;
  bgColor: string;
  isNew?: boolean;
  basePrice: number;
}

export const productData: Record<string, CategoryProduct[]> = {
  "roll-up": [
    {
      id: "rollup-1",
      slug: "roll-up-banner",
      name: "Roll Up Banner 85x200 cm",
      description: "Ultra-clear banner with vibrant CMYK, premium matte finish, anti-curl polypropylene.",
      image: "/roll-up-banner.png",
      bgColor: "#E8EEF7",
      isNew: true,
      basePrice: 1600,
    },
  ],
  frame: [
    {
      id: "frame-1",
      slug: "custom-framed-poster",
      name: "Custom Framed Poster",
      description: "Premium framed posters with multiple sizes and frame colour options.",
      image: "/frame (8).jpeg",
      bgColor: "#F0EBE3",
      basePrice: 250, // Starting from 250 EGP for 15x21 cm
    },
  ],
  banners: [
    {
      id: "banner-1",
      slug: "custom-vinyl-banner",
      name: "Custom Vinyl Banner",
      description: "Durable custom vinyl banners available in multiple widths and heights.",
      image: "/Banner1.png",
      bgColor: "#E3EBF0",
      basePrice: 135,
    },
  ],
  "business-cards": [
    {
      id: "business-cards-1",
      slug: "custom-business-cards",
      name: "Custom Business Cards",
      description: "Professional 9x5 cm cards available in various premium paper types and weights.",
      image: "/New card.png",
      bgColor: "#EBE3F0",
      basePrice: 1,
    },
  ],
  "tote-bags": [
    {
      id: "totebag-1",
      slug: "custom-tote-bag",
      name: "Custom Tote Bag",
      description: "Eco-friendly tote bags custom printed with your unique design or logo.",
      image: "/Tote Bag.png",
      bgColor: "#E8F5E9",
      basePrice: 200,
    },
  ],
  flyers: [
    {
      id: "flyers-1",
      slug: "custom-flyers",
      name: "Custom Flyers",
      description: "High-quality custom flyers in A3, A4, or A5 with bulk discount options.",
      image: "/Flyers.png",
      bgColor: "#FFF3E0",
      basePrice: 1,
    },
  ],
  mugs: [
    {
      id: "mug-1",
      slug: "custom-mug",
      name: "Custom Mug",
      description: "Personalised classic white mug with full-colour sublimation printing.",
      image: "/Customize your mug.png.jpeg",
      bgColor: "#E8EEF7",
      basePrice: 170,
    },
    {
      id: "mug-magic-1",
      slug: "magic-mug",
      name: "Magic Mug",
      description: "Colour-changing magic mug that reveals your design when filled with hot liquid.",
      image: "/black magic mug.png",
      bgColor: "#1E2530",
      basePrice: 170,
      isNew: true,
    }
  ],
  pens: [
    {
      id: "pen-1",
      slug: "custom-pens",
      name: "Custom Pens",
      description: "Branded pens with your logo. Minimum 50 pieces - 35 EGP per piece.",
      image: "/Pen1.png",
      bgColor: "#F0EBE3",
      basePrice: 35,
    },
  ],
  stickers: [
    {
      id: "sticker-1",
      slug: "custom-stickers",
      name: "Custom Stickers",
      description: "Die-cut, circle, square, or rectangle stickers in vinyl, paper, or holographic finish.",
      image: "/Custom Stickers.png",
      bgColor: "#E3EBF0",
      basePrice: 1,
    },
  ],
  "t-shirts": [
    {
      id: "tshirt-1",
      slug: "custom-t-shirt",
      name: "Custom T-Shirt",
      description: "Premium printable cotton t-shirts available in multiple sizes and colours.",
      image: "/T-Shirts.png",
      bgColor: "#EBE3F0",
      basePrice: 700,
    },
    {
      id: "hoodie-1",
      slug: "custom-hoodie",
      name: "Custom Hoodie",
      description: "Warm fleece hoodies with your custom design. Available in multiple sizes and colours.",
      image: "/Hoodies.png",
      bgColor: "#E8EEF7",
      basePrice: 700, // Assuming base price same as t-shirt for now, can adjust in product page
    }
  ],
  caps: [
    {
      id: "cap-1",
      slug: "custom-cap",
      name: "Custom Cap",
      description: "Premium embroidered or printed caps with your logo or design. Available in adjustable sizes.",
      image: "/Caps.png",
      bgColor: "#E8F5E9",
      isNew: true,
      basePrice: 275,
    },
  ],
};

// Slugs for variable-priced products that require a quote
export const QUOTE_BASED_SLUGS = new Set([
  "custom-business-cards",
  "custom-stickers",
  "custom-flyers",
]);

// Per-meter pricing for banners
export const BANNER_PRICE_PER_METER = 135;

/** Get products for any category slug */
export function getProductsForCategory(slug: string, categoryName: string): CategoryProduct[] {
  return productData[slug] || [];
}

/** Get a specific product by slug and name */
export function getProductByName(slug: string, name: string): CategoryProduct | undefined {
  const products = productData[slug] || [];
  return products.find(p => p.name.toLowerCase() === name.toLowerCase());
}

/** Get a specific product by its unique slug across all categories */
export function getProductBySlug(productSlug: string): { product: CategoryProduct, categorySlug: string } | undefined {
  if (!productSlug) return undefined;
  const target = productSlug.toLowerCase().trim();
  for (const [catSlug, products] of Object.entries(productData)) {
    const p = products.find(prod => prod.slug.toLowerCase().trim() === target);
    if (p) return { product: p, categorySlug: catSlug };
  }
  return undefined;
}
