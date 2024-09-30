import SearchResults from "@/components/SearchResults";
import searchService from "@/services/search.service";

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const query = searchParams?.query || "";
  const page = parseInt(searchParams?.page || "1", 10);

  const { success, data } = await searchService.search(query);

  console.log(success);
  console.log(data);

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
