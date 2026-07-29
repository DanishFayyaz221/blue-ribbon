import { notFound } from "next/navigation";
import { SuburbListings } from "../../_components/property/SuburbListings";
import {
  RENTAL_CATEGORIES,
  getSuburbsWithCounts,
  type ListingSearchParams,
} from "@/lib/db/queries";

type PageProps = {
  params: Promise<{ suburb: string }>;
  searchParams: Promise<ListingSearchParams>;
};

export async function generateMetadata({ params }: PageProps) {
  const { suburb } = await params;
  const match = (await getSuburbsWithCounts(RENTAL_CATEGORIES)).find((s) => s.slug === suburb);

  if (!match) return { title: "Not found | Blue Ribbon Real Estate" };

  return {
    title: `Rental Properties in ${match.name} | Blue Ribbon Real Estate`,
    description: `${match.count} rental ${match.count === 1 ? "property" : "properties"} available in ${match.name}, NSW. Browse listings with Blue Ribbon Real Estate.`,
    alternates: { canonical: `/rent/${match.slug}` },
  };
}

export default async function RentSuburbPage({ params, searchParams }: PageProps) {
  const { suburb } = await params;
  if (!suburb) notFound();

  return (
    <SuburbListings
      suburbSlugParam={suburb}
      searchParams={await searchParams}
      categories={RENTAL_CATEGORIES}
      basePath="/rent"
      intent="for rent"
      label="Rent"
    />
  );
}
