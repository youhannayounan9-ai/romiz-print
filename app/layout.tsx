import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "./components/AnnouncementBar";
import Header from "./components/Header";
import NavRow from "./components/NavRow";
import Footer from "./components/Footer";
import { siteConfig } from "./config/site";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Cairo's premier custom printing company. Business cards, banners, stickers, t-shirts, mugs and more — premium quality with express dispatch across Egypt.",
  keywords: ["custom printing", "Cairo", "Egypt", "business cards", "banners", "t-shirts"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description:
      "Cairo's premier custom printing company. Premium quality, express dispatch.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ backgroundColor: "#F5F7FA" }}>
        <AnnouncementBar />
        <Header />
        <NavRow />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
