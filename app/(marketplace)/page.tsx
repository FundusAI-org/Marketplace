import { Search, ShoppingCart, User } from "lucide-react";

import SearchBar from "@/components/SearchBar";
import medicationService from "@/services/medication.service";

import FeaturedMeds from "@/components/FeaturedMeds";

export default async function HomePage() {
  const { data: featuredMeds, success } =
    await medicationService.getFeaturedMedications();

  // const { data: partneredPharmacies, success: pharmacySuccess } =
  //   await medicationService.getFeaturedMedications();

  if (!success) {
    throw new Error("Server error fetching featured medications");
  }

  return (
    <main className="container max-w-6xl py-6 md:py-12">
      <section className="mb-12 px-4 text-center md:px-0">
        <h1 className="mb-4 text-3xl font-bold md:mb-6 md:text-4xl">
          Find Your Medications
        </h1>
        <p className="mb-6 text-lg md:mb-8 md:text-xl">
          Search for discounted medications and earn Fundus Points
        </p>
        <SearchBar goButton={true} />
      </section>

      <section className="mb-12 px-4 md:px-0">
        <h2 className="mb-4 text-xl font-bold md:mb-6 md:text-2xl">
          Featured Medications
        </h2>
        <FeaturedMeds featuredMeds={featuredMeds} />
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
        {/* <LogoScroller /> */}
      </section>
    </main>
  );
}
