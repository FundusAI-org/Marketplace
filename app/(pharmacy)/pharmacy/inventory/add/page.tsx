import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/ProductForm";

export const metadata: Metadata = {
  title: "Add New Product",
  description: "Add a new product to your inventory",
};

export default function AddProductPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
        <Link href="/pharmacy/inventory">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
          </Button>
        </Link>
      </div>
      <ProductForm />
    </div>
  );
}
