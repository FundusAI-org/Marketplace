"use client";

import { FC } from "react";
import UserAuthForm from "./UserAuthForm";
import { useSearchParams } from "next/navigation";
import PharmacyAuthForm from "./PharmacyAuthForm";

interface AuthFormsProps {}

const AuthForms: FC<AuthFormsProps> = ({}) => {
  const params = useSearchParams();

  switch (params.get("role")) {
    case "customer":
      return <UserAuthForm />;
    case "admin":
      return <UserAuthForm />;
    case "pharmacy":
      return (
        <div className="container mx-auto py-10">
          <h1 className="mb-6 text-center text-2xl font-bold">
            Pharmacy Authentication
          </h1>
          <PharmacyAuthForm />
        </div>
      );
    default:
      return <UserAuthForm />;
  }
};

export default AuthForms;
