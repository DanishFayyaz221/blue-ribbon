import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
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
