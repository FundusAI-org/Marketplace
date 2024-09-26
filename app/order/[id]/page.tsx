"use client";
import { useState, useEffect } from "react";

import { Package, Truck, CheckCircle, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  date: string;
  total: number;
  status: "Processing" | "Shipped" | "Delivered";
  items: OrderItem[];
  shippingAddress: string;
  fundusPointsUsed: number;
};

export default function ViewOrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // In a real application, you would fetch the order details from an API
    // For this example, we'll use mock data
    const mockOrder: Order = {
      id: "1234",
      date: "2023-07-15",
      total: 124.99,
      status: "Shipped",
      items: [
        { id: "1", name: "Medication A", quantity: 2, price: 29.99 },
        { id: "2", name: "Medication B", quantity: 1, price: 65.01 },
      ],
      shippingAddress: "123 Main St, Anytown, AN 12345",
      fundusPointsUsed: 50,
    };
    setOrder(mockOrder);
  }, []);

  if (!order) {
    return <div>Loading...</div>;
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "Processing":
        return <Package className="h-6 w-6 text-yellow-500" />;
      case "Shipped":
        return <Truck className="h-6 w-6 text-blue-500" />;
      case "Delivered":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
    }
  };

  return (
    <main className="container min-h-screen max-w-6xl bg-background py-6 md:py-12">
      <div className="flex items-center justify-between">
        <h1 className="mb-6 text-3xl font-bold">Order Details</h1>

        <Link href="/orders">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order #{order.id}</CardTitle>
            <CardDescription>Placed on {order.date}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      ${(item.quantity * item.price).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Fundus Points Used
              </p>
              <p className="font-medium">{order.fundusPointsUsed} points</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
            </div>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {getStatusIcon(order.status)}
                <span className="text-lg font-medium">{order.status}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{order.shippingAddress}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            x
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                If you have any questions or concerns about your order, please
                don&apos;t hesitate to contact us.
              </p>
              <Button className="w-full">Contact Support</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
