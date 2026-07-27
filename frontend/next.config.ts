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
        protocol: "https",
        hostname: "agentboxcdn.com.au",
      },
      {
        protocol: "https",
        hostname: "**.agentboxcdn.com.au",
      },
    ],
  },
};

export default nextConfig;
