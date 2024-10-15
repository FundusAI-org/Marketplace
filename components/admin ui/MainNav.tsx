"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserNav } from "../UserNav";
import { useSession } from "@/providers/session.provider";
import Image from "next/image";

import FundusAILogo from "@/assets/FundusAI_Logo_updated.png";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [isOpen, setIsOpen] = useState(false);
  const { account } = useSession();

  const pharmacyNavItems = [
    { href: "/pharmacy", label: "Dashboard" },
    { href: "/pharmacy/inventory", label: "Inventory" },
    { href: "/pharmacy/orders", label: "Orders" },
    { href: "/pharmacy/customers", label: "Customers" },
  ];

  const adminNavItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/pharmacies", label: "Pharmacies" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/sales", label: "Sales" },
  ];

  const navItems = account?.pharmacy
    ? pharmacyNavItems
    : account?.admin
      ? adminNavItems
      : pharmacyNavItems;

  const home = account?.pharmacy
    ? "/pharmacy"
    : account?.admin
      ? "/admin"
      : "/";

  return (
    <header className="sticky top-0 z-50 flex w-full flex-col items-center justify-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href={home} className="-ml-4 flex items-center md:-ml-20">
          <Image
            src={FundusAILogo}
            alt="FundusAI Logo"
            className=""
            // width={100}
            // height={100}
            style={{
              overflow: "clip",
              overflowClipMargin: "content-box",
              objectFit: "contain",
              width: "100%",
            }}
          />
        </Link>
        {/* Desktop Navigation */}

        <nav
          className={cn(
            "hidden items-center space-x-4 md:flex lg:space-x-6",
            className,
          )}
          {...props}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="container flex h-16 items-center justify-end px-4">
          {/* Mobile Navigation */}

          <UserNav />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>FundusAI Marketplace</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
