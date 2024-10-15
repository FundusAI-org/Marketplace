import { Metadata } from "next";

import { DataTable } from "@/components/admin ui/data-table";

import usersService from "@/services/users.service";
import { columns } from "@/components/admin ui/userColumns";
import { ProductTable } from "@/components/ProductsTable";

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
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
      </div>
      <p className="text-muted-foreground">
        Here&apos;s a list of all your products
      </p>
      <ProductTable
        product={[
          {
            id: "1",
            name: "Aspirin",
            category: "Pain Relief",
            price: 5.99,
            stock: 100,
            image: "/placeholder.svg?height=50&width=50",
          },
          {
            id: "2",
            name: "Ibuprofen",
            category: "Pain Relief",
            price: 6.99,
            stock: 75,
            image: "/placeholder.svg?height=50&width=50",
          },
          {
            id: "3",
            name: "Amoxicillin",
            category: "Antibiotics",
            price: 12.99,
            stock: 50,
            image: "/placeholder.svg?height=50&width=50",
          },
          {
            id: "4",
            name: "Lisinopril",
            category: "Blood Pressure",
            price: 8.99,
            stock: 80,
            image: "/placeholder.svg?height=50&width=50",
          },
          {
            id: "5",
            name: "Metformin",
            category: "Diabetes",
            price: 7.99,
            stock: 60,
            image: "/placeholder.svg?height=50&width=50",
          },
        ]}
      />
    </div>
  );
}
