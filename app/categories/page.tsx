import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { categories } from "../data/categories";
import { siteConfig } from "../config/site";

export const metadata = {
  title: `All Categories | ${siteConfig.name}`,
  description: "Browse all custom printing categories and products from ROMIZ PRINT.",
};

export default async function AllCategoriesPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const resolvedParams = await searchParams;
  const filter = resolvedParams.filter;
  let displayedCategories = categories;

  console.log("🔍 Categories page - filter param:", filter);
  console.log("🔍 All category slugs:", categories.map(c => c.slug));

  if (filter === "marketing-print") {
    displayedCategories = categories.filter(c => ["business-cards", "flyers", "pens", "stamps"].includes(c.slug));
  } else if (filter === "banners-displays") {
    displayedCategories = categories.filter(c => ["banners", "roll-up", "frame"].includes(c.slug));
  } else if (filter === "apparel-bags") {
    displayedCategories = categories.filter(c => ["t-shirts", "tote-bags", "football-kits", "caps", "lab-coats"].includes(c.slug));
  } else if (filter === "custom-merch") {
    displayedCategories = categories.filter(c => ["stickers", "mugs"].includes(c.slug));
  }

  console.log("🔍 Filtered categories count:", displayedCategories.length);
  console.log("🔍 Filtered category slugs:", displayedCategories.map(c => c.slug));

  return (
    <div style={{ backgroundColor: siteConfig.colors.background }} className="min-h-screen">
      {/* ── Hero ── */}
      <section
        className="w-full py-12 px-4 sm:px-6 lg:px-8"
        style={{ background: "linear-gradient(135deg, #F5F7FA 0%, #E8EEF7 100%)" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-gray-400 mb-8 flex-wrap"
          >
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-gray-600 transition-colors"
            >
              <Home size={13} />
              Home
            </Link>
            <ChevronRight size={12} className="text-gray-300" />
            <span style={{ color: siteConfig.colors.primary }} className="font-semibold">
              All Categories
            </span>
          </nav>

          {/* Hero content */}
          <div className="flex flex-col items-center text-center gap-5 max-w-2xl mx-auto">
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
              style={{
                color: siteConfig.colors.dark,
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              }}
            >
              {filter ? `${filter.charAt(0).toUpperCase() + filter.slice(1)} Categories` : "All Categories"}
            </h1>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-lg">
              Explore our complete range of premium custom printing solutions. From high-impact banners and professional business cards to personalized apparel and promotional items.
            </p>
          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12 justify-items-center">
            {displayedCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="flex flex-col items-center gap-4 group w-full"
                >
                  <div
                    className="relative flex items-center justify-center rounded-3xl transition-all duration-300 w-full aspect-square"
                    style={{
                      backgroundColor: siteConfig.colors.lightBar,
                    }}
                  >
                    <div className="absolute inset-0 rounded-3xl bg-[#0B4DA2] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl" />



                    <Icon
                      size={40}
                      className="relative z-10 transition-colors duration-300"
                      style={{ color: siteConfig.colors.primary }}
                      color="currentColor"
                    />

                    {/* Make the icon white on hover using a hack with nested classes */}
                    <style>{`
                      .group:hover .relative.z-10 {
                        color: white !important;
                      }
                    `}</style>
                  </div>

                  <div className="flex flex-col items-center gap-1 text-center">
                    <span
                      className="font-bold text-sm sm:text-base leading-tight transition-colors duration-300"
                      style={{ color: siteConfig.colors.dark }}
                    >
                      {cat.name}
                    </span>
                    <span
                      className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0"
                      style={{ color: siteConfig.colors.accent }}
                    >
                      Explore →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
