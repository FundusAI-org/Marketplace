"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Pill, Shield, User } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

const roles = [
  {
    value: "admin",
    label: "Admin",
    icon: Shield,
  },
  {
    value: "pharmacy",
    label: "Pharmacy",
    icon: Pill,
  },
  {
    value: "customer",
    label: "Customer",
    icon: User,
  },
];

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    table.setGlobalFilter(searchValue);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search emails, names..."
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={handleSearch}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("role") && (
          <DataTableFacetedFilter
            column={table.getColumn("role")}
            title="Role"
            options={roles}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter("");
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto"
              disabled={selectedRows.length === 0}
            >
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => console.log("Delete selected")}>
              Delete Selected
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Change role of selected")}
            >
              Change Role
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Export selected")}>
              Export Selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
