"use client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "./ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

import { useSession } from "@/providers/session.provider";
import { signOut } from "@/actions/auth.actions";

import { User } from "lucide-react";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import Link from "next/link";
import UserAuthForm from "./UserAuthForm";

export function UserNav() {
  const { account } = useSession();

  if (!account) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <VisuallyHidden.Root>
            <DialogTitle>Auth Form</DialogTitle>
          </VisuallyHidden.Root>
          <UserAuthForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            <AvatarFallback>
              {account?.pharmacy
                ? account.pharmacy.name.split(" ")[0].charAt(0) +
                  account.pharmacy.name.split(" ")[1].charAt(0)
                : account?.admin
                  ? `${account.admin?.firstName?.charAt(0)}${account.admin?.lastName?.charAt(0)}`
                  : `${account.customer?.firstName?.charAt(0)}${account.customer?.lastName?.charAt(0)}`}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {account.customer?.firstName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {account.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={"/profile"}>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>

          {account?.customer && (
            <Link href={"/cart"}>
              <DropdownMenuItem>Cart</DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuGroup>
        {account?.admin && (
          <>
            <DropdownMenuSeparator />
            <Link href={"/admin"}>
              <DropdownMenuGroup>
                <DropdownMenuItem>Admin Dashboard</DropdownMenuItem>
              </DropdownMenuGroup>
            </Link>
          </>
        )}

        <DropdownMenuSeparator />
        <form action={signOut}>
          <Button variant={"ghost"} type="submit" className="flex w-full">
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </Button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
