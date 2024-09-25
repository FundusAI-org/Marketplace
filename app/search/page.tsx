import SearchResults from "@/components/SearchResults";

export default function SearchResultsPage({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const query = searchParams?.query || "";

  return (
    <main className="container w-full py-6 md:py-12">
      <SearchResults query={query} />
    </main>
  );
}
