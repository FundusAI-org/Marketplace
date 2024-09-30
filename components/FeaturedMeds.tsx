import { FC } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import MedicationCard from "./MedicationCard";
import { Medication, Pharmacy } from "@/types/db.types";

interface FeaturedMedsProps {
  featuredMeds: (Medication & { pharmacy: Pharmacy })[];
}

const FeaturedMeds: FC<FeaturedMedsProps> = ({ featuredMeds }) => {
  return (
    <Carousel className="w-full max-w-sm md:max-w-3xl lg:max-w-6xl">
      <CarouselContent className="-ml-1">
        {featuredMeds.map((med) => (
          <CarouselItem key={med.id} className="pl-1 md:basis-1/3 lg:basis-1/4">
            <div className="p-1">
              <MedicationCard key={med.id} medication={med} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default FeaturedMeds;
