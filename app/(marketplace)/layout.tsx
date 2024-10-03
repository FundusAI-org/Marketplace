import type { Metadata } from "next";

import Header from "@/components/Header";
// import { CartProvider } from "@/providers/cart.provider";

export const metadata: Metadata = {
  title: "FundusAI Marketplace",
  description: `FundusAI's marketplace connects diabetics with partner pharmacies to purchase discounted medications using "Fundus Points" earned via daily health data logs.`,
  openGraph: {
    images: [
      {
        url: "https://marketplace-ten-sigma.vercel.app/og.png",
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
        url: "https://marketplace-ten-sigma.vercel.app/og.png",
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

export default function MarketPlaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <div className="flex min-h-screen w-full justify-center">{children}</div>
    </div>
  );
}
