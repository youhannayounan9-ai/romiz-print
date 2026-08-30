"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { siteConfig } from "../config/site";

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto" style={{ backgroundColor: siteConfig.colors.dark }}>
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

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
              Cairo&apos;s premier custom printing partner. From business cards to
              large-format banners — we bring your brand to life with premium
              quality and fast turnaround.
            </p>


          </div>

          {/* Column 2 — Contact */}
          <div>
            <h3
              className="text-sm font-bold uppercase tracking-widest mb-5"
              style={{ color: siteConfig.colors.accent }}
            >
              Contact Us
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
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors duration-200"
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
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors duration-200"
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
          </div>

          {/* Column 3 — Follow Us */}
          <div>
            <h3
              className="text-sm font-bold uppercase tracking-widest mb-5"
              style={{ color: siteConfig.colors.accent }}
            >
              Follow Us
            </h3>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              Stay connected and see the latest work from our print shop.
            </p>
            <div className="flex flex-col gap-4">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-[#FF7A1A] transition-all duration-200 group"
              >
                <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors duration-200">
                  <FacebookIcon size={20} />
                </span>
                <span className="group-hover:text-[#FF7A1A] transition-colors duration-200 font-medium">
                  Facebook
                </span>
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-[#FF7A1A] transition-all duration-200 group"
              >
                <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors duration-200">
                  <InstagramIcon size={20} />
                </span>
                <span className="group-hover:text-[#FF7A1A] transition-colors duration-200 font-medium">
                  Instagram
                </span>
              </a>
              <a 
                href="https://www.tiktok.com/@romiz.print?_r=1&_t=ZS-99FQl6hAdTJ" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-[#FF7A1A] transition-all duration-200 group"
              >
                <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors duration-200">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.33 6.33 0 0 0-1-.05A6.34 6.34 0 0 0 5 15.71a6.34 6.34 0 0 0 6.33 6.33 6.34 6.34 0 0 0 6.33-6.33V10.6a8.26 8.26 0 0 0 3.45.75V8.22a5.18 5.18 0 0 1-1.59-.24z"/>
                  </svg>
                </span>
                <span className="group-hover:text-[#FF7A1A] transition-colors duration-200 font-medium">
                  TikTok
                </span>
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
            <Link
              href="/privacy-policy"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
