"use client";

import { ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

import { Button } from "./ui/button";
import SearchBar from "./SearchBar";
import { usePathname } from "next/navigation";

const Header: FC = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  return (
    <header className="sticky top-0 z-50 flex w-full flex-col items-center justify-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="ml-4 flex items-center space-x-2 md:ml-0">
          <Image
            src="/fundusai-logo.svg"
            alt="FundusAI Logo"
            width={32}
            height={32}
          />
          <span className="hidden font-bold md:inline">FundusAI</span>
        </Link>
        {!isHomePage && <SearchBar goButton={false} />}

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">User</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
