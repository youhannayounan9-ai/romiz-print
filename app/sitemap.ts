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
  ];
}
