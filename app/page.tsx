import TrustBar from "./components/TrustBar";
import { siteConfig } from "./config/site";

export default function HomePage() {
  return (
    <>
      {/* Trust Bar — shown only on homepage, directly below nav */}
      <TrustBar />

      {/* Hero Placeholder */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div
            className="w-full rounded-2xl flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-300"
            style={{ minHeight: "500px", backgroundColor: "#E8EEF7" }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: siteConfig.colors.primary }}
            >
              🖨️
            </div>
            <h1
              className="text-2xl font-bold text-center"
              style={{
                color: siteConfig.colors.dark,
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              }}
            >
              Hero Section Coming Next
            </h1>
            <p className="text-sm text-gray-500 text-center max-w-xs">
              Foundation verified — layout, header, nav, mega menu, trust bar & footer are all wired up.
            </p>
            <div className="flex items-center gap-3 flex-wrap justify-center mt-2">
              <span
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: siteConfig.colors.primary }}
              >
                ✓ Header
              </span>
              <span
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: siteConfig.colors.primary }}
              >
                ✓ Mega Menu
              </span>
              <span
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: siteConfig.colors.primary }}
              >
                ✓ Trust Bar
              </span>
              <span
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: siteConfig.colors.accent }}
              >
                ✓ Footer
              </span>
              <span
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: siteConfig.colors.accent }}
              >
                ✓ 27 Categories
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
