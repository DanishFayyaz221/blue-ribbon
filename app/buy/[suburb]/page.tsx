import { notFound } from "next/navigation";
import { SuburbListings } from "../../_components/property/SuburbListings";
import {
  SALE_CATEGORIES,
  getSuburbsWithCounts,
  type ListingSearchParams,
} from "@/lib/db/queries";

type PageProps = {
  params: Promise<{ suburb: string }>;
  searchParams: Promise<ListingSearchParams>;
};

export async function generateMetadata({ params }: PageProps) {
  const { suburb } = await params;
  const match = (await getSuburbsWithCounts(SALE_CATEGORIES)).find((s) => s.slug === suburb);

  if (!match) return { title: "Not found | Blue Ribbon Real Estate" };

  return {
    title: `Properties for Sale in ${match.name} | Blue Ribbon Real Estate`,
    description: `${match.count} ${match.count === 1 ? "property" : "properties"} for sale in ${match.name}, NSW. Browse listings with Blue Ribbon Real Estate.`,
    alternates: { canonical: `/buy/${match.slug}` },
  };
}

export default async function BuySuburbPage({ params, searchParams }: PageProps) {
  const { suburb } = await params;
  if (!suburb) notFound();

  return (
    <SuburbListings
      suburbSlugParam={suburb}
      searchParams={await searchParams}
      categories={SALE_CATEGORIES}
      basePath="/buy"
      intent="for sale"
      label="Buy"
    />
  );
}
