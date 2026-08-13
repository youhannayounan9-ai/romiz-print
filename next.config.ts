import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TODO: Add @next/bundle-analyzer integration
  // TODO: Add next-pwa plugin for service worker post-launch
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
