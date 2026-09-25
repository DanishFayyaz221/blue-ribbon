import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Pages renamed to match their menu labels. Permanent, so search engines
  // move their index across and old links and bookmarks still land.
  async redirects() {
    return [
      { source: "/about", destination: "/our-story", permanent: true },
      { source: "/agents", destination: "/our-team", permanent: true },
      { source: "/agents/:slug", destination: "/our-team/:slug", permanent: true },
    ];
  },
  images: {
    // 60 is for the navy fabric backdrop (bg.png): a soft, near-flat texture
    // where the extra bytes of 90 buy nothing visible, but the source file is
    // 4.8MB and it appears on most pages.
    qualities: [60, 75, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Local development pulls listing photos from the live server, since
        // the files only exist on the VPS. Production serves them same-origin,
        // so this pattern is unused there.
        protocol: "https",
        hostname: "blueribbonrealestate.com.au",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "blueribbonre.com.au",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
