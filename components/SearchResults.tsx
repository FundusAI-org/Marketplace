"use client";

import { FC, useState, useEffect } from "react";

// import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Medication, Pharmacy } from "@/types/db.types";
import { useRouter } from "next/navigation";
import MedicationCard from "./MedicationCard";

interface SearchResultsProps {
  query: string;
  results: {
    medications: (Medication & { pharmacy: Pharmacy })[];
    pharmacies: Pharmacy[];
  };
  page: number;
}

const SearchResults: FC<SearchResultsProps> = ({ query, results, page }) => {
  const router = useRouter();
  const [sortOption, setSortOption] = useState("price-low-high");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedPharmacies, setSelectedPharmacies] = useState<string[]>([]);

  const handleSortChange = (value: string) => {
    setSortOption(value);
    // Implement sorting logic here
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
    // Implement price filtering logic here
  };

  const handlePharmacyChange = (pharmacy: string) => {
    setSelectedPharmacies((prev) =>
      prev.includes(pharmacy)
        ? prev.filter((p) => p !== pharmacy)
        : [...prev, pharmacy],
    );
    // Implement pharmacy filtering logic here
  };

  const filteredMedications = results.medications.filter((med) => {
    const price = parseFloat(med.price.toString());
    return price >= priceRange[0] && price <= priceRange[1];
  });

  useEffect(() => {
    // Update URL with current filters
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("sort", sortOption);
    searchParams.set("minPrice", priceRange[0].toString());
    searchParams.set("maxPrice", priceRange[1].toString());
    searchParams.set("pharmacies", selectedPharmacies.join(","));
    router.push(`/search?${searchParams.toString()}`, { scroll: false });
  }, [sortOption, priceRange, selectedPharmacies, router]);

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <aside className="w-full md:w-64">
        <div className="space-y-4">
          <div>
            <h2 className="mb-2 text-lg font-semibold">Sort By</h2>
            <Select value={sortOption} onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low-high">
                  Price: Low to High
                </SelectItem>
                <SelectItem value="price-high-low">
                  Price: High to Low
                </SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold">Price Range</h2>
            <Slider
              min={0}
              max={100}
              step={1}
              value={priceRange}
              onValueChange={handlePriceRangeChange}
            />
            <div className="mt-2 flex justify-between">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold">Pharmacy</h2>
            <div className="space-y-2">
              {results.pharmacies.map((pharmacy) => (
                <label key={pharmacy.id} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedPharmacies.includes(pharmacy.id)}
                    onChange={() => handlePharmacyChange(pharmacy.id)}
                  />
                  {pharmacy.name}
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>
      <div className="flex-1">
        <h1 className="mb-6 text-2xl font-bold">
          Search Results for &quot;{query}&quot;
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredMedications.map((medication) => (
            <MedicationCard key={medication.id} medication={medication} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
