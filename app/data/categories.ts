import type { LucideIcon } from "lucide-react";
import {
  Tag,
  Image,
  Flag,
  Layers,
  BookOpen,
  Package,
  CreditCard,
  CalendarDays,
  PawPrint,
  Droplets,
  ShoppingBag,
  Smile,
  FileText,
  Folder,
  BookMarked,
  Monitor,
  Coffee,
  Pen,
  LayoutGrid,
  Footprints,
  Leaf,
  Sticker,
  Wine,
  Layout,
  Sofa,
  Shirt,
  BookCopy,
  HardHat,
} from "lucide-react";

export interface Category {
  slug: string;
  name: string;
  icon: LucideIcon;
  isNew?: boolean;
}

export const categories: Category[] = [
  { slug: "roll-up", name: "Roll Up", icon: Layout },
  { slug: "frame", name: "Frame", icon: Image },
  { slug: "banners", name: "Banners", icon: Flag },
  { slug: "business-cards", name: "Business Cards", icon: CreditCard },
  { slug: "tote-bags", name: "Tote Bags", icon: ShoppingBag },
  { slug: "flyers", name: "Flyers", icon: FileText },
  { slug: "mugs", name: "Mugs", icon: Coffee },
  { slug: "pens", name: "Pens", icon: Pen },
  { slug: "stickers", name: "Stickers", icon: Sticker },
  { slug: "t-shirts", name: "T-Shirts", icon: Shirt },
  { slug: "caps", name: "Caps", icon: HardHat },
];

export const quickLinkSlugs = [
  "roll-up",
  "frame",
  "banners",
  "business-cards",
  "tote-bags",
  "flyers",
  "mugs",
  "pens",
];
