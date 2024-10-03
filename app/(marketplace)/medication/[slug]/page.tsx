import Image from "next/image";
import { Star, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import medicationService from "@/services/medication.service";
import { Metadata, ResolvingMetadata } from "next";
import MedicationCartHandle from "@/components/MedicationCartHandle";
import TruncatedText from "@/components/TruncatedText";
// import AddToCartButton from "./AddToCartButton";

interface MedicationDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: MedicationDetailPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { data, success } = await medicationService.getMedicationBySlug(
    params.slug,
  );

  const previousImages = (await parent).openGraph?.images || [];

  if (!success) {
    throw new Error("Page not found");
  }

  return {
    title: data.name,
    description: data.description,
    openGraph: {
      images: [
        {
          url: data.imageUrl,
          width: 1200,
          height: 630,
          alt: data.name,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [
        {
          url: data.imageUrl,
          width: 1200,
          height: 630,
          alt: data.name,
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

export default async function MedicationDetailPage({
  params: { slug },
}: MedicationDetailPageProps) {
  const { data, success } = await medicationService.getMedicationBySlug(slug);

  if (!success) {
    throw new Error("Page not found");
  }

  return (
    <main className="container max-w-6xl py-6 md:py-12">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="md:w-1/2">
          <Image
            src={data.imageUrl ?? "/placeholder.svg?height=400&width=400"}
            alt={data.name}
            width={400}
            height={400}
            className="w-full rounded-lg"
          />
        </div>
        <div className="md:w-1/2">
          <h1 className="mb-4 text-3xl font-bold">{data.name}</h1>
          <div className="mb-4 flex items-center">
            <div className="mr-2 flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-5 w-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({data.reviews.length} reviews)
            </span>
          </div>
          <p className="mb-4 text-2xl font-bold">${data.price}</p>

          <div className="mb-6 mt-6 flex items-center gap-4">
            <MedicationCartHandle {...data} />
          </div>

          <TruncatedText text={data.description} maxLength={200} />

          <p className="mt-4">
            <span className="font-bold">{data.pharmacy.name}</span>
          </p>

          <div className="mb-6 flex items-center text-sm text-muted-foreground">
            <Info className="mr-2 h-4 w-4" />
            <span>You can use your fundus points to buy this medication</span>
          </div>
          <Tabs defaultValue="details">
            <TabsList>
              {data.details && (
                <TabsTrigger value="details">Details</TabsTrigger>
              )}
              {data.sideEffect && (
                <TabsTrigger value="sideEffects">Side Effects</TabsTrigger>
              )}
              {data.usage && <TabsTrigger value="usage">Usage</TabsTrigger>}
            </TabsList>
            <TabsContent value="details" className="mt-4">
              <h2 className="mb-2 text-lg font-semibold">Product Details</h2>
              <ul className="list-inside list-disc space-y-1">
                {data.details &&
                  data.details
                    .split(".")
                    .filter(Boolean)
                    .map((detail, index) => (
                      <li key={index}>{detail.trim()}</li>
                    ))}
              </ul>
            </TabsContent>
            <TabsContent value="sideEffects" className="mt-4">
              <h2 className="mb-2 text-lg font-semibold">
                Possible Side Effects
              </h2>
              <p>Common side effects may include:</p>
              <ul className="list-inside list-disc space-y-1">
                {data.sideEffect &&
                  data.sideEffect
                    .split(",")
                    .map((sideEffect, index) => (
                      <li key={index}>{sideEffect.trim()}</li>
                    ))}
              </ul>
              <p className="mt-2">
                Consult your doctor if you experience any severe side effects.
              </p>
            </TabsContent>
            <TabsContent value="usage" className="mt-4">
              <h2 className="mb-2 text-lg font-semibold">How to Use</h2>
              <ul className="list-inside list-disc space-y-1">
                {data.usage &&
                  data.usage
                    .split(".")
                    .filter(Boolean)
                    .map((usage, index) => <li key={index}>{usage.trim()}</li>)}
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
