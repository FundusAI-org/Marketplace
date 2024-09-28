import { Metadata } from "next";

import { UserAuthForm } from "@/components/UserAuthForm";
import { validateRequest } from "@/lucia";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "FundusAI Marketplace Authentication",
  description: "Authentication forms built using the components.",
};

export default async function AuthenticationPage() {
  const { user } = await validateRequest();

  console.log(user);

  if (!user?.id) {
    return (
      <main className="container flex max-w-6xl items-center justify-center bg-background py-6 md:py-12">
        <UserAuthForm />
      </main>
    );
  } else {
    redirect("/");
  }
}
