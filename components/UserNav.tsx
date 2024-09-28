"use client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTrigger,
} from "./ui/dialog";

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
import Link from "next/link";
import { User } from "lucide-react";
import { UserAuthForm } from "./UserAuthForm";

export function UserNav() {
  const { user } = useSession();
  if (!user) {
    return (
      // <Link href="/auth?action=login">

      // </Link>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425p]">
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
              {user.firstName[0] + user.lastName[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.firstName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {user?.role.toString() == "admin" && (
          <DropdownMenuGroup>
            <DropdownMenuItem>Admin Dashboard</DropdownMenuItem>
          </DropdownMenuGroup>
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
