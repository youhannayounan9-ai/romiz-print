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
  { slug: "booklets", name: "Booklets", icon: BookOpen },
  { slug: "boxers", name: "Boxers", icon: Package },
  { slug: "business-cards", name: "Business Cards", icon: CreditCard },
  { slug: "calendars", name: "Calendars", icon: CalendarDays },
  { slug: "dog-tank-tops", name: "Dog Tank Tops", icon: PawPrint, isNew: true },
  { slug: "drink-bottles", name: "Drink Bottles", icon: Droplets },
  { slug: "tote-bags", name: "Tote Bags", icon: ShoppingBag },
  { slug: "face-masks", name: "Face Masks", icon: Smile, isNew: true },
  { slug: "flyers", name: "Flyers", icon: FileText },
  { slug: "folders", name: "Folders", icon: Folder },
  { slug: "magazines", name: "Magazines", icon: BookMarked },
  { slug: "mouse-pads", name: "Mouse Pads", icon: Monitor },
  { slug: "mugs", name: "Mugs", icon: Coffee },
  { slug: "pens", name: "Pens", icon: Pen },
  { slug: "signage", name: "Signage", icon: LayoutGrid },
  { slug: "socks", name: "Socks", icon: Footprints },
  { slug: "bamboo-socks", name: "Bamboo Socks", icon: Leaf, isNew: true },
  { slug: "stickers", name: "Stickers", icon: Sticker },
  { slug: "stubby-holders", name: "Stubby Holders", icon: Wine },
  { slug: "wall-stickers", name: "Wall Stickers", icon: Layout },
  { slug: "cushion-covers", name: "Cushion Covers", icon: Sofa },
  { slug: "t-shirts", name: "T-Shirts", icon: Shirt },
  { slug: "brochures", name: "Brochures", icon: BookCopy },
];

export const quickLinkSlugs = [
  "banners",
  "roll-labels",
  "stickers",
  "vinyl-banners",
  "business-cards",
  "socks",
  "mugs",
  "t-shirts",
];
