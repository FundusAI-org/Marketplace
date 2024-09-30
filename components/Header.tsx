"use client";

import Image from "next/image";
import FundusAILogo from "@/assets/FundusAI_Logo_updated.png";
import Link from "next/link";
import { FC } from "react";

import SearchBar from "./SearchBar";
import { usePathname } from "next/navigation";
import { UserNav } from "./UserNav";
import CartSheet from "./CartSheet";

const Header: FC = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  return (
    <header className="sticky top-0 z-50 flex w-full flex-col items-center justify-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="-ml-4 flex items-center md:-ml-20">
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
          {/* <span className="hidden font-bold md:inline">FundusAI</span> */}
        </Link>
        {!isHomePage && <SearchBar goButton={false} />}

        <div className="flex items-center space-x-2">
          <CartSheet />

          <UserNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
