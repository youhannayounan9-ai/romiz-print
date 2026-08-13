export interface CategoryProduct {
  id: number;
  name: string;
  description: string;
  image: string;
  bgColor: string;
  isNew?: boolean;
}

export const productData: Record<string, CategoryProduct[]> = {
  "roll-up": [
    {
      id: 1,
      name: "Roll Up Banner 85x200 cm",
      description: "Ultra-clear banner with vibrant CMYK, premium matte finish, anti-curl polypropylene.",
      image: "/roll-up-banner.png",
      bgColor: "#E8EEF7",
      isNew: true,
    },
  ],
  frame: [
    {
      id: 1,
      name: "Custom Framed Poster",
      description: "Premium framed posters with multiple sizes and frame colour options.",
      image: "/frame1.png",
      bgColor: "#F0EBE3",
    },
  ],
  banners: [
    {
      id: 1,
      name: "Custom Vinyl Banner",
      description: "Durable custom vinyl banners available in multiple widths and heights.",
      image: "/Banner1.png",
      bgColor: "#E3EBF0",
    },
  ],
  "business-cards": [
    {
      id: 1,
      name: "Custom Business Cards",
      description: "Professional 9x5 cm cards available in various premium paper types and weights.",
      image: "/Business Cards.png",
      bgColor: "#EBE3F0",
    },
  ],
  "tote-bags": [
    {
      id: 1,
      name: "Custom Tote Bag",
      description: "Eco-friendly tote bags custom printed with your unique design or logo.",
      image: "/Tote Bag.png",
      bgColor: "#E8F5E9",
    },
  ],
  flyers: [
    {
      id: 1,
      name: "Custom Flyers",
      description: "High-quality custom flyers in A3, A4, or A5 with bulk discount options.",
      image: "/Flyers.png",
      bgColor: "#FFF3E0",
    },
  ],
  mugs: [
    {
      id: 1,
      name: "Custom Mugs",
      description: "Personalised mugs including classic white and magic colour-changing options.",
      image: "/Tote Mug1.png",
      bgColor: "#E8EEF7",
    },
  ],
  pens: [
    {
      id: 1,
      name: "Custom Pens",
      description: "Branded pens with your logo. Minimum 50 pieces - 35 EGP per piece.",
      image: "/Pen1.png",
      bgColor: "#F0EBE3",
    },
  ],
  stickers: [
    {
      id: 1,
      name: "Custom Stickers",
      description: "Die-cut, circle, square, or rectangle stickers in vinyl, paper, or holographic finish.",
      image: "/stickers-placeholder.png", 
      bgColor: "#E3EBF0",
    },
  ],
  "t-shirts": [
    {
      id: 1,
      name: "Custom T-Shirts & Hoodies",
      description: "Premium printable apparel available in multiple sizes and colours.",
      image: "/T-Shirts.png",
      bgColor: "#EBE3F0",
    },
  ],
};

/** Get products for any category slug */
export function getProductsForCategory(slug: string, categoryName: string): CategoryProduct[] {
  return productData[slug] || [];
}
