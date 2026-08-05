import { Truck, Headphones, Package, ShieldCheck } from "lucide-react";
import { siteConfig } from "../config/site";

const trustItems = [
  {
    icon: Truck,
    title: "Express Dispatch",
    subtitle: "Fast delivery across Egypt",
  },
  {
    icon: Headphones,
    title: "Local Tech Support",
    subtitle: "Cairo, Egypt – free design help",
  },
  {
    icon: Package,
    title: "No Minimum Quantity",
    subtitle: "Order as low as 1 qty.",
  },
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    subtitle: "100% quality-checked",
  },
];

export default function TrustBar() {
  return (
    <section
      className="w-full border-b border-[#D6E2F0]"
      style={{ backgroundColor: siteConfig.colors.lightBar }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#D6E2F0]">
          {trustItems.map(({ icon: Icon, title, subtitle }) => (
            <div
              key={title}
              className="flex items-center gap-3 py-4 px-4 lg:px-6"
            >
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#fff" }}
              >
                <Icon size={20} style={{ color: siteConfig.colors.primary }} />
              </div>
              <div>
                <p
                  className="text-sm font-semibold leading-tight"
                  style={{
                    color: siteConfig.colors.dark,
                    fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                  }}
                >
                  {title}
                </p>
                <p className="text-xs text-gray-500 leading-tight mt-0.5">
                  {subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
