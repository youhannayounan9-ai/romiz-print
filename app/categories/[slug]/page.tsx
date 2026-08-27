import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { categories } from "../../data/categories";
import { siteConfig } from "../../config/site";
import CategoryPageClient from "./CategoryPageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: `${category.name} | ${siteConfig.name}`,
    description: `Custom ${category.name.toLowerCase()} printing in Cairo — premium quality, express dispatch, no minimums. Get a free quote from ROMIZ PRINT today.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) notFound();

  const Icon = category.icon;

  return (
    <div style={{ backgroundColor: siteConfig.colors.background }}>
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
            <Link
              href="/categories"
              className="hover:text-gray-600 transition-colors"
            >
              Categories
            </Link>
            <ChevronRight size={12} className="text-gray-300" />
            <span style={{ color: siteConfig.colors.primary }} className="font-semibold">
              {category.name}
            </span>
          </nav>

          {/* Hero content — centered */}
          <div className="flex flex-col items-center text-center gap-5 max-w-2xl mx-auto">
            {/* Icon badge */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: siteConfig.colors.primary }}
            >
              <Icon size={28} className="text-white" />
            </div>

            {/* Decorative title row */}
            <div className="flex items-center gap-4 w-full justify-center">
              <span className="flex-1 max-w-20 h-px" style={{ backgroundColor: "#C4D4ED" }} />
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                style={{
                  color: siteConfig.colors.dark,
                  fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                }}
              >
                {category.name}
              </h1>
              <span className="flex-1 max-w-20 h-px" style={{ backgroundColor: "#C4D4ED" }} />
            </div>



            <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-lg">
              Discover our full range of custom{" "}
              <span className="font-semibold" style={{ color: siteConfig.colors.primary }}>
                {category.name.toLowerCase()}
              </span>{" "}
              printing options. Premium materials, vibrant colours, and express dispatch across
              Egypt — with free design help for every order.
            </p>


          </div>
        </div>
      </section>

      {/* ── Products + Modal (client component) ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <CategoryPageClient categoryName={category.name} slug={slug} />
        </div>
      </section>
    </div>
  );
}
