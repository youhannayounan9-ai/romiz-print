import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import NavRow from "./components/NavRow";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
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
  metadataBase: new URL("https://romizprint.com"),
  title: "ROMIZ PRINT | Premium Custom Printing in Cairo",
  description: "YOUR BRAND. PRINTED. PERFECTED. Custom stickers, apparel, mugs & more. No minimums. Express dispatch across Egypt. Request your free quote today.",
  keywords: ["custom printing", "Cairo", "stickers", "t-shirts", "mugs", "business cards", "ROMIZ PRINT"],
  openGraph: {
    title: "ROMIZ PRINT | Premium Custom Printing",
    description: "Custom printing made easy in Cairo. Upload your design, get a quote, we print & deliver.",
    url: "https://romizprint.com",
    siteName: "ROMIZ PRINT",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
    locale: "en_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ROMIZ PRINT",
    description: "Premium custom printing in Cairo",
    images: ["/og-image.svg"]
  },
};

export const viewport = {
  themeColor: "#0B4DA2",
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
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full flex flex-col" style={{ backgroundColor: "#F5F7FA" }}>
        <Header />
        <NavRow />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
