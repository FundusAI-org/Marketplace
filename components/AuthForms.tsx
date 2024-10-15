"use client";

import { FC } from "react";
import UserAuthForm from "./UserAuthForm";
import { useSearchParams } from "next/navigation";
import PharmacyAuthForm from "./PharmacyAuthForm";
import { useRouter } from "next/navigation";
import { capitalizeFirstLetter } from "@/lib/utils";

const AuthForms: FC = ({}) => {
  const params = useSearchParams();
  const { replace } = useRouter();

  switch (params.get("role")) {
    case "customer":
      return (
        <div className="mx-auto py-10">
          <h1 className="mb-6 text-center text-2xl font-bold">
            {capitalizeFirstLetter(params.get("role"))} Authentication
          </h1>
          <UserAuthForm />
        </div>
      );
    case "admin":
      return (
        <div className="mx-auto py-10">
          <h1 className="mb-6 text-center text-2xl font-bold">
            {capitalizeFirstLetter(params.get("role"))} Authentication
          </h1>
          <UserAuthForm />
        </div>
      );
    case "pharmacy":
      return (
        <div className="mx-auto py-10">
          <h1 className="mb-6 text-center text-2xl font-bold">
            {capitalizeFirstLetter(params.get("role"))} Authentication
          </h1>
          <PharmacyAuthForm />
        </div>
      );
    default:
      replace("/auth?role=customer&action=login");
      return (
        <div className="mx-auto py-10">
          <h1 className="mb-6 text-center text-2xl font-bold">
            {capitalizeFirstLetter(params.get("role"))} Authentication
          </h1>
          <UserAuthForm />
        </div>
      );
  }
};

export default AuthForms;
