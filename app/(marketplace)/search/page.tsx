import SearchResults from "@/components/SearchResults";
import searchService from "@/services/search.service";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams: { query },
}): Promise<Metadata> {
  return {
    title: `Search Results for "${query}" - FundusAI Marketplace`,
    description: `Search results for "${query}" on FundusAI Marketplace`,
    openGraph: {
      images: [
        {
          url: "https://marketplace.fundusai.com/og.png",
          width: 1200,
          height: 630,
          alt: "FundusAI Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [
        {
          url: "https://marketplace.fundusai.com/og.png",
          width: 1200,
          height: 630,
          alt: "FundusAI Logo",
        },
      ],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const query = searchParams?.query || "";
  const page = parseInt(searchParams?.page || "1", 10);

  const { success, data } = await searchService.search(query);

  if (!success) {
    return (
      <main className="container w-full py-6 md:py-12">
        <h1 className="text-2xl font-bold">Error fetching search results</h1>
      </main>
    );
  }

  return (
    <main className="container w-full py-6 md:py-12">
      <SearchResults query={query} results={data} page={page} />
    </main>
  );
}
