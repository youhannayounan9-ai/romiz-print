import { categories } from "./data/categories";

export default function sitemap() {
  const categoryUrls = categories.map((cat) => ({
    url: `https://romizprint.com/categories/${cat.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  
  return [
    {
      url: "https://romizprint.com",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    ...categoryUrls,
    {
      url: "https://romizprint.com/categories/apparel",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: "https://romizprint.com/quote",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
  ];
}
