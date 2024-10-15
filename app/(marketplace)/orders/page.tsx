"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Order = {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
};

export default function ViewAllOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      date: "2023-05-01",
      total: 75.99,
      status: "Delivered",
      items: 3,
    },
    {
      id: "2",
      date: "2023-05-15",
      total: 124.5,
      status: "Processing",
      items: 2,
    },
    { id: "3", date: "2023-05-28", total: 49.99, status: "Shipped", items: 1 },
    {
      id: "4",
      date: "2023-06-05",
      total: 99.99,
      status: "Delivered",
      items: 4,
    },
    {
      id: "5",
      date: "2023-06-12",
      total: 34.99,
      status: "Processing",
      items: 1,
    },
    { id: "6", date: "2023-06-20", total: 149.99, status: "Shipped", items: 2 },
    {
      id: "7",
      date: "2023-06-25",
      total: 89.99,
      status: "Delivered",
      items: 3,
    },
    {
      id: "8",
      date: "2023-07-02",
      total: 59.99,
      status: "Processing",
      items: 2,
    },
    { id: "9", date: "2023-07-10", total: 199.99, status: "Shipped", items: 5 },
    {
      id: "10",
      date: "2023-07-15",
      total: 29.99,
      status: "Delivered",
      items: 1,
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" || order.status === statusFilter),
  );

  // Get current orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder,
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <main className="container max-w-6xl bg-background py-6 md:py-12">
      <div className="flex items-center justify-between">
        <h1 className="ml-2 text-3xl font-bold">All Orders</h1>

        <Link href="/profile">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-col items-start justify-between space-y-4 p-6 md:flex-row md:items-center md:space-y-0">
        <div className="w-full flex-1 md:w-auto md:max-w-sm">
          <Label htmlFor="search" className="sr-only">
            Search orders
          </Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              type="search"
              placeholder="Search by Order ID"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Label htmlFor="status-filter" className="whitespace-nowrap">
            Filter by Status:
          </Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status-filter" className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="-mt-6 rounded-md border p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/order/${order.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => paginate(currentPage - 1)}
                isActive={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({
              length: Math.ceil(filteredOrders.length / ordersPerPage),
            }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => paginate(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => paginate(currentPage + 1)}
                isActive={
                  currentPage ===
                  Math.ceil(filteredOrders.length / ordersPerPage)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </main>
  );
}
