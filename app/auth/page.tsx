import { Metadata } from "next";

import { UserAuthForm } from "@/components/UserAuthForm";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <main className="container flex max-w-6xl items-center justify-center bg-background py-6 md:py-12">
      <UserAuthForm />;
    </main>
  );
}
