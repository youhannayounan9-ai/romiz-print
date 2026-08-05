import Link from "next/link";
import { MapPin, Phone, Mail, Share2, Globe } from "lucide-react";
import { siteConfig } from "../config/site";
import { categories } from "../data/categories";

const helpLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Shipping & Delivery", href: "/shipping" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "Contact Us", href: "/contact" },
  { label: "Design Templates", href: "/templates" },
  { label: "File Preparation", href: "/file-prep" },
];

export default function Footer() {
  const topCategories = categories.slice(0, 8);
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-auto"
      style={{ backgroundColor: siteConfig.colors.dark }}
    >
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1 — About */}
          <div className="lg:col-span-1">
            {/* Text logo */}
            <a href="/" className="inline-block mb-4">
              <span
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
              >
                <span className="text-white">ROMIZ</span>
                <span style={{ color: siteConfig.colors.accent }}>PRINT</span>
              </span>
            </a>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: siteConfig.colors.accent }}
            >
              {siteConfig.tagline}
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Cairo&apos;s premier custom printing partner. From business cards to large-format banners — we bring your brand to life with premium quality and fast turnaround.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href={siteConfig.social.facebook}
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 text-gray-400 hover:text-[#FF7A1A] hover:bg-white/10 transition-all duration-200"
              >
                <Share2 size={16} />
              </a>
              <a
                href={siteConfig.social.instagram}
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 text-gray-400 hover:text-[#FF7A1A] hover:bg-white/10 transition-all duration-200"
              >
                <Globe size={16} />
              </a>
            </div>
          </div>

          {/* Column 2 — Categories */}
          <div>
            <h3
              className="text-sm font-bold uppercase tracking-widest mb-5"
              style={{ color: siteConfig.colors.accent }}
            >
              Categories
            </h3>
            <ul className="space-y-2.5">
              {topCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products/${cat.slug}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-[#FF7A1A] transition-colors duration-200" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Help */}
          <div>
            <h3
              className="text-sm font-bold uppercase tracking-widest mb-5"
              style={{ color: siteConfig.colors.accent }}
            >
              Help
            </h3>
            <ul className="space-y-2.5">
              {helpLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-[#FF7A1A] transition-colors duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h3
              className="text-sm font-bold uppercase tracking-widest mb-5"
              style={{ color: siteConfig.colors.accent }}
            >
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin
                  size={16}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: siteConfig.colors.accent }}
                />
                <span className="text-sm text-gray-400 leading-relaxed">
                  {siteConfig.contact.address}
                </span>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors duration-200 group"
                >
                  <Phone
                    size={16}
                    className="flex-shrink-0"
                    style={{ color: siteConfig.colors.accent }}
                  />
                  <span>{siteConfig.contact.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors duration-200 group"
                >
                  <Mail
                    size={16}
                    className="flex-shrink-0"
                    style={{ color: siteConfig.colors.accent }}
                  />
                  <span>{siteConfig.contact.email}</span>
                </a>
              </li>
            </ul>

            {/* CTA */}
            <div className="mt-6">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                style={{ backgroundColor: siteConfig.colors.accent }}
              >
                Get a Free Quote
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
