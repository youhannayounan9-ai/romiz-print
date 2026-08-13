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
    address: "24 Makram Ebeid, Madinet Nasr City, Egypt",
    phone: "01200956004",
    email: "Romiz.Print@gmail.com",
  },
  social: {
    facebook: "https://www.facebook.com/share/1DAEMsUffL/?mibextid=wwXIfr",
    instagram: "https://www.instagram.com/romiz.print/?utm_source=ig_web_button_share_sheet",
  },
} as const;

export type SiteConfig = typeof siteConfig;
