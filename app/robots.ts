import type { MetadataRoute } from "next";

const SITE_URL = process.env.SITE_URL ?? "https://www.blueribbonrealestate.com.au";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Filtered result pages are near-duplicates of the unfiltered listing
      // pages and would dilute crawl budget across endless combinations.
      disallow: ["/buy?", "/rent?", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
