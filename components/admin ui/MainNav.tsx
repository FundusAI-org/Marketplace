import Link from "next/link";

import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-medium">FundusAI Marketplace</h3>

      <nav
        className={cn("flex items-center space-x-4 lg:space-x-6", className)}
        {...props}
      >
        <Link
          href="/admin"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/customers"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Customers
        </Link>
        <Link
          href="/admin/products"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Products
        </Link>
        <Link
          href="/amdin/sales"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Sales
        </Link>
      </nav>
    </div>
  );
}
