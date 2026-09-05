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
    address: "24 Makram Ebeid, Al Mintaqah as Sâdisah, Nasr City, Cairo, Egypt",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Mitri+%D9%85%D8%AA%D8%B1%D9%8A+%D9%84%D9%84%D8%AF%D8%B9%D8%A7%D9%8A%D8%A9+%D9%88%D8%A7%D9%84%D8%A7%D8%B9%D9%84%D8%A7%D9%86+24+Makram+Ebeid+Nasr+City",
    phone: "01041998484",
    email: "Romiz.Print@gmail.com",
  },
  social: {
    facebook: "https://www.facebook.com/share/1DAEMsUffL/?mibextid=wwXIfr",
    instagram: "https://www.instagram.com/romiz.print/?utm_source=ig_web_button_share_sheet",
  },
} as const;

export type SiteConfig = typeof siteConfig;