import type { LucideIcon } from "lucide-react";

export interface CategoryProduct {
  id: number;
  name: string;
  description: string;
  emoji: string;
  bgColor: string;
  isNew?: boolean;
}

/** Generate a set of sample products for any category */
export function getProductsForCategory(slug: string, categoryName: string): CategoryProduct[] {
  const palettes = ["#E8EEF7", "#F0EBE3", "#E3EBF0", "#EBE3F0", "#E8F5E9", "#FFF3E0"];
  const emojis: Record<string, string[]> = {
    stickers: ["🏷️", "✨", "⭐", "🎨"],
    "business-cards": ["💼", "🤝", "📇", "✉️"],
    "t-shirts": ["👕", "🧥", "🎽", "👗"],
    mugs: ["☕", "🍵", "🫖", "🥤"],
    banners: ["🏁", "🚩", "📢", "🎌"],
    socks: ["🧦", "👟", "🦶", "✨"],
    "stubby-holders": ["🍺", "🥤", "🎉", "🏆"],
    "mouse-pads": ["🖱️", "💻", "🖥️", "⌨️"],
    default: ["📦", "🎁", "✨", "⭐"],
  };

  const emojiSet = emojis[slug] ?? emojis.default;

  return Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Custom ${categoryName} ${i < 4 ? ["Classic", "Premium", "Deluxe", "Pro"][i] : ["Bundle", "Pack", "Set", "Edition"][i - 4]}`,
    description: [
      "High-quality print, express turnaround. Free design consultation included.",
      "Professional finish, vibrant colours. Any quantity from 1 to 10,000.",
      "Cairo-made quality, shipped nationwide. Multiple finishes available.",
      "Perfect for branding, gifting, or events. Bulk discounts available.",
    ][i % 4],
    emoji: emojiSet[i % emojiSet.length],
    bgColor: palettes[i % palettes.length],
    isNew: i === 0 || i === 3,
  }));
}

export type { LucideIcon };
