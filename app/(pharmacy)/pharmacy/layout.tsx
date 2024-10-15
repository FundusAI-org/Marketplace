import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { MainNav } from "@/components/admin ui/MainNav";
import { validateRequest } from "@/lucia";

export const metadata: Metadata = {
  title: "FundusAI Marketplace Admin",
  description: "Admin dashboard for FundusAI Marketplace",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { account } = await validateRequest();

  if (!account || !account.pharmacy) {
    redirect("/auth?action=login&role=pharmacy");
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background">
        <MainNav />
      </header>

      <div className="flex w-full justify-center">
        <main className="container max-w-6xl py-6 md:py-12">{children}</main>
      </div>
    </>
  );
}
