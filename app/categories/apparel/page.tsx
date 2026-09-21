import Link from "next/link";
import { ChevronRight, Home, ArrowRight } from "lucide-react";
import { categories } from "../../data/categories";
import { productData } from "../../data/products";
import { siteConfig } from "../../config/site";

export const metadata = {
  title: `Apparel Collection | ${siteConfig.name}`,
  description:
    "Custom t-shirts, hoodies, lab coats, football kits, and caps — premium apparel printing in Cairo with express dispatch across Egypt.",
};

/* Apparel category slugs shown on this landing page */
const APPAREL_SLUGS = ["t-shirts", "lab-coats", "football-kits", "caps"];

export default function ApparelPage() {
  const apparelCategories = APPAREL_SLUGS.map((slug) =>
    categories.find((c) => c.slug === slug)
  ).filter((c): c is (typeof categories)[number] => Boolean(c));

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
            <Link href="/categories" className="hover:text-gray-600 transition-colors">
              Categories
            </Link>
            <ChevronRight size={12} className="text-gray-300" />
            <span style={{ color: siteConfig.colors.primary }} className="font-semibold">
              Apparel Collection
            </span>
          </nav>

          {/* Hero content — centered */}
          <div className="flex flex-col items-center text-center gap-5 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 w-full justify-center">
              <span className="flex-1 max-w-20 h-px" style={{ backgroundColor: "#C4D4ED" }} />
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                style={{
                  color: siteConfig.colors.dark,
                  fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                }}
              >
                Apparel Collection
              </h1>
              <span className="flex-1 max-w-20 h-px" style={{ backgroundColor: "#C4D4ED" }} />
            </div>

            <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-lg">
              Custom t-shirts, hoodies, medical lab coats, football kits, and caps.
              Premium fabrics, vibrant prints, and express dispatch across Egypt —
              with free design help for every order.
            </p>
          </div>
        </div>
      </section>

      {/* ── Apparel categories ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {apparelCategories.map((category) => {
              const Icon = category.icon;
              const productCount = (productData[category.slug] || []).length;
              return (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="group flex flex-col rounded-3xl overflow-hidden bg-white shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  {/* Icon header */}
                  <div
                    className="flex items-center justify-center py-12"
                    style={{ backgroundColor: siteConfig.colors.lightBar }}
                  >
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: siteConfig.colors.primary }}
                    >
                      <Icon size={36} className="text-white" />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col p-6 gap-3 flex-1 text-center">
                    <h2
                      className="font-bold text-xl"
                      style={{
                        color: siteConfig.colors.dark,
                        fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                      }}
                    >
                      {category.name}
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed flex-1">
                      {productCount > 0
                        ? `${productCount} customizable product${productCount > 1 ? "s" : ""} — plus ready-made designs.`
                        : "Customizable designs with express dispatch."}
                    </p>
                    <span
                      className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 group-hover:-translate-y-0.5 shadow-md"
                      style={{ backgroundColor: siteConfig.colors.accent }}
                    >
                      Shop {category.name}
                      <ArrowRight size={16} />
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
