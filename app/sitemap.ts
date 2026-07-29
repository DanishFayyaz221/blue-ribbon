import type { MetadataRoute } from "next";
import {
  RENTAL_CATEGORIES,
  SALE_CATEGORIES,
  getAllListingSlugs,
  getSuburbsWithCounts,
} from "@/lib/db/queries";

const SITE_URL = process.env.SITE_URL ?? "https://www.blueribbonrealestate.com.au";

const STATIC_ROUTES = [
  { path: "/", priority: 1 },
  { path: "/buy", priority: 0.9 },
  { path: "/rent", priority: 0.9 },
  { path: "/agents", priority: 0.6 },
  { path: "/about", priority: 0.5 },
  { path: "/contact", priority: 0.5 },
  { path: "/property-report-digital-appraisal", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route.priority,
  }));

  // Only listings the site actually publishes. A sold or hidden listing 404s,
  // so including it would feed Google known-bad URLs.
  let dynamicEntries: MetadataRoute.Sitemap = [];
  try {
    const [slugs, rentSuburbs, buySuburbs] = await Promise.all([
      getAllListingSlugs(),
      getSuburbsWithCounts(RENTAL_CATEGORIES),
      getSuburbsWithCounts(SALE_CATEGORIES),
    ]);

    dynamicEntries = [
      ...slugs.map((slug) => ({
        url: `${SITE_URL}/property/${slug}`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
      // Suburb pages are only listed where stock exists — an empty one 404s,
      // and submitting known-bad URLs wastes crawl budget.
      ...rentSuburbs.map((s) => ({
        url: `${SITE_URL}/rent/${s.slug}`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.7,
      })),
      ...buySuburbs.map((s) => ({
        url: `${SITE_URL}/buy/${s.slug}`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    // A database blip should degrade the sitemap to the static routes rather
    // than return a 500, which search engines treat as a fetch failure.
  }

  return [...staticEntries, ...dynamicEntries];
}
