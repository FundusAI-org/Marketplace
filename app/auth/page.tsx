import { Metadata } from "next";

// import { UserAuthForm } from "@/components/UserAuthForm";
import { validateRequest } from "@/lucia";
import { redirect } from "next/navigation";
import AuthForms from "@/components/AuthForms";

export const metadata: Metadata = {
  title: "FundusAI Marketplace Authentication",
  description: "Authentication forms built using the components.",
};

export default async function AuthenticationPage() {
  const { account } = await validateRequest();

  if (!account?.id) {
    return (
      <main className="container flex max-w-6xl items-center justify-center bg-background py-6 md:py-12">
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
