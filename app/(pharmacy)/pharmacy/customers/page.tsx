import { Metadata } from "next";

import { DataTable } from "@/components/admin ui/data-table";

import usersService from "@/services/users.service";
import { columns } from "@/components/admin ui/userColumns";

export const metadata: Metadata = {
  title: "Customers",
  description: "FundusAI Marketplace",
};

export default async function CustomersPage() {
  const users = await usersService.getCustomersForPharmacy();

  if (!users.success) {
    return null;
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="items-left flex justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
      </div>
      <p className="text-muted-foreground">
        Here&apos;s a list of all your customers
      </p>
      <DataTable data={users.data} columns={columns} />
    </div>
  );
}
