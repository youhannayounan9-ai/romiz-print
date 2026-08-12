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
} from "lucide-react";

export interface Category {
  slug: string;
  name: string;
  icon: LucideIcon;
  isNew?: boolean;
}

export const categories: Category[] = [
  { slug: "roll-labels", name: "Roll Labels", icon: Tag },
  { slug: "poster-printing", name: "Poster Printing", icon: Image },
  { slug: "banners", name: "Banners", icon: Flag },
  { slug: "vinyl-banners", name: "Vinyl Banners", icon: Layers },
  { slug: "business-cards", name: "Business Cards", icon: CreditCard },
  { slug: "tote-bags", name: "Tote Bags", icon: ShoppingBag },
  { slug: "flyers", name: "Flyers", icon: FileText },
  { slug: "folders", name: "Folders", icon: Folder },
  { slug: "magazines", name: "Magazines", icon: BookMarked },
  { slug: "mugs", name: "Mugs", icon: Coffee },
  { slug: "pens", name: "Pens", icon: Pen },
  { slug: "stickers", name: "Stickers", icon: Sticker },
  { slug: "wall-stickers", name: "Wall Stickers", icon: Layout },
  { slug: "t-shirts", name: "T-Shirts", icon: Shirt },
  { slug: "brochures", name: "Brochures", icon: BookCopy },
];

export const quickLinkSlugs = [
  "banners",
  "roll-labels",
  "stickers",
  "vinyl-banners",
  "business-cards",
  "brochures",
  "mugs",
  "t-shirts",
];
