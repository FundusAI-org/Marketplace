import { Metadata } from "next";

import { DataTable } from "@/components/admin ui/data-table";

import usersService from "@/services/users.service";
import { columns } from "@/components/admin ui/userColumns";

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

export default async function TaskPage() {
  const users = await usersService.getUsers();

  if (!users.success) {
    return null;
  }

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="items-left flex justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      </div>
      <p className="text-muted-foreground">
        Here&apos;s a list of all your users
      </p>
      <DataTable data={users.data} columns={columns} />
    </div>
  );
}
