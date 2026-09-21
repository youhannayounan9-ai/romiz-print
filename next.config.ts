import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  redirects: async () => [
    // Legacy category slug → renamed "frames" category
    { source: "/categories/frame", destination: "/categories/frames", permanent: true },
    // Legacy plural quote route → singular /quote page
    { source: "/quotes", destination: "/quote", permanent: true },
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;