"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Slider } from "@/components/ui/slider";

export default function SearchResultsPage({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const query = searchParams?.query || "";
  const [priceRange, setPriceRange] = useState([0, 100]);

  return (
    <main className="container w-full py-6 md:py-12">
      <div className="flex flex-col gap-6 md:flex-row">
        <aside className="w-full md:w-64">
          <div className="space-y-4">
            <div>
              <h2 className="mb-2 text-lg font-semibold">Sort By</h2>
              <Select>
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
                onValueChange={setPriceRange}
              />
              <div className="mt-2 flex justify-between">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
            <div>
              <h2 className="mb-2 text-lg font-semibold">Pharmacy</h2>
              <div className="space-y-2">
                {["Pharmacy A", "Pharmacy B", "Pharmacy C", "Pharmacy D"].map(
                  (pharmacy) => (
                    <label key={pharmacy} className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      {pharmacy}
                    </label>
                  ),
                )}
              </div>
            </div>
          </div>
        </aside>
        <div className="flex-1">
          <h1 className="mb-6 text-2xl font-bold">Search Results: {query}</h1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <Card key={item}>
                <CardContent className="p-4">
                  <Image
                    src={`/placeholder.svg?height=200&width=200`}
                    alt={`Medication ${item}`}
                    width={200}
                    height={200}
                    className="mb-4 h-40 w-full rounded object-cover"
                  />
                  <h3 className="mb-2 font-semibold">Medication Name</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Brief description of the medication
                  </p>
                  <p className="font-bold">$XX.XX</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Add to Cart</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
