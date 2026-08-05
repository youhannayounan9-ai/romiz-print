export const siteConfig = {
  name: "ROMIZ PRINT",
  tagline: "YOUR BRAND. PRINTED. PERFECTED.",
  location: "Cairo, Egypt",
  colors: {
    primary: "#0B4DA2",
    dark: "#1E2530",
    accent: "#FF7A1A",
    background: "#F5F7FA",
    lightBar: "#E8EEF7",
  },
  logoHorizontal: "/logo-horizontal.png",
  logoStacked: "/logo-stacked.png",
  contact: {
    address: "15 Tahrir Square, Downtown Cairo, Egypt",
    phone: "+20 2 1234 5678",
    email: "hello@romizprint.com",
  },
  social: {
    facebook: "https://facebook.com/romizprint",
    instagram: "https://instagram.com/romizprint",
  },
} as const;

export type SiteConfig = typeof siteConfig;
