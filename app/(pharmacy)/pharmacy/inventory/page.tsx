import { Metadata } from "next";
import Link from "next/link";
import { ProductTable } from "@/components/ProductsTable";
import medicationService from "@/services/medication.service";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Inventory",
  description: "FundusAI Marketplace",
};

export default async function InventoryPage() {
  const medications = await medicationService.getInventory();

  if (!medications.success) {
    throw new Error(medications.data as string);
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <Link href="/pharmacy/inventory/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </Link>
      </div>
      <p className="text-muted-foreground">
        Here&apos;s a list of all your products
      </p>
      <ProductTable product={medications.data} />
    </div>
  );
}
