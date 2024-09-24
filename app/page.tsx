import Image from "next/image";

import { Search, ShoppingCart, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="container py-6 md:py-12">
      <section className="mb-12 px-4 text-center md:px-0">
        <h1 className="mb-4 text-3xl font-bold md:mb-6 md:text-4xl">
          Find Your Medications
        </h1>
        <p className="mb-6 text-lg md:mb-8 md:text-xl">
          Search for discounted medications and earn Fundus Points
        </p>
        <form className="mx-auto max-w-3xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground md:left-4 md:h-6 md:w-6" />
            <Input
              type="search"
              placeholder="Search for medications..."
              className="w-full rounded-full py-4 pl-10 pr-4 text-base md:py-6 md:pl-12 md:text-xl"
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 hidden -translate-y-1/2 transform rounded-full md:px-6 md:text-base lg:block"
            >
              Search
            </Button>
            <Button
              type="submit"
              size={"sm"}
              className="absolute right-1 top-1/2 -translate-y-1/2 transform rounded-full lg:hidden"
            >
              Search
            </Button>
          </div>
        </form>
      </section>

      <section className="mb-12 px-4 md:px-0">
        <h2 className="mb-4 text-xl font-bold md:mb-6 md:text-2xl">
          Featured Medications
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item}>
              <CardContent className="p-4">
                <Image
                  src={`/placeholder.svg?height=200&width=200`}
                  alt={`Medication ${item}`}
                  width={200}
                  height={200}
                  className="mb-4 h-40 w-full rounded object-cover md:h-48"
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
      </section>

      <section className="mb-12 px-4 md:px-0">
        <h2 className="mb-4 text-xl font-bold md:mb-6 md:text-2xl">
          How It Works
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground md:h-16 md:w-16">
              <Search className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <h3 className="mb-2 font-semibold">Search Medications</h3>
            <p className="text-sm text-muted-foreground md:text-base">
              Find your prescribed medications at discounted rates
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground md:h-16 md:w-16">
              <User className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <h3 className="mb-2 font-semibold">Log Health Data</h3>
            <p className="text-sm text-muted-foreground md:text-base">
              Earn Fundus Points by logging your daily health data
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground md:h-16 md:w-16">
              <ShoppingCart className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <h3 className="mb-2 font-semibold">Save on Purchases</h3>
            <p className="text-sm text-muted-foreground md:text-base">
              Use your Fundus Points for discounts on medications
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-0">
        <h2 className="mb-4 text-xl font-bold md:mb-6 md:text-2xl">
          Partner Pharmacies
        </h2>
        <div className="flex flex-wrap gap-2 md:gap-4">
          {["Pharmacy A", "Pharmacy B", "Pharmacy C", "Pharmacy D"].map(
            (pharmacy) => (
              <Button
                key={pharmacy}
                variant="outline"
                size="sm"
                className="md:text-base"
              >
                {pharmacy}
              </Button>
            ),
          )}
        </div>
      </section>
    </main>
  );
}
