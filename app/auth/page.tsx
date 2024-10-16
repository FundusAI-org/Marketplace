import { Metadata } from "next";

import { validateRequest } from "@/lucia";
import { redirect } from "next/navigation";
import AuthForms from "@/components/AuthForms";
import { capitalizeFirstLetter } from "@/lib/utils";

export async function generateMetadata({
  searchParams: { role, action },
}): Promise<Metadata> {
  return {
    title: `${capitalizeFirstLetter(role)} Authentication - FundusAI Marketplace`,
    description: `FundusAI's marketplace connects diabetics with partner pharmacies to purchase discounted medications using "Fundus Points" earned via daily health data logs.`,
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

export default async function AuthenticationPage() {
  const { account } = await validateRequest();

  if (!account?.id) {
    return (
      <main className="flex justify-center py-6 md:py-12">
        <AuthForms />
      </main>
    );
  } else {
    if (account.admin) {
      redirect("/admin");
    } else if (account.pharmacy) {
      redirect("/pharmacy");
    } else {
      redirect("/");
    }
  }
}
