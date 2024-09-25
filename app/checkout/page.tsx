"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, AlertCircle } from "lucide-react";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock user data - in a real app, this would come from your auth system
const mockUser = {
  isLoggedIn: true,
  fundusPoints: 100,
};

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Medication A", price: 29.99, quantity: 2 },
    { id: 2, name: "Medication B", price: 39.99, quantity: 1 },
  ]);
  const [fundusPointsToUse, setFundusPointsToUse] = useState(0);
  const [fundusPointDiscount, setFundusPointDiscount] = useState(0);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax - fundusPointDiscount;

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleFundusPointsChange = (e) => {
    const value = Math.floor(Number(e.target.value));
    if (value >= 0 && value <= mockUser.fundusPoints) {
      setFundusPointsToUse(value);
    }
  };

  useEffect(() => {
    const discount = fundusPointsToUse * 2; // 1 Fundus Point = $2
    setFundusPointDiscount(discount);
  }, [fundusPointsToUse]);

  return (
    <main className="container min-h-screen bg-background py-6 md:py-12">
      <h1 className="mb-6 text-3xl font-bold">Checkout</h1>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="lg:w-2/3">
          <div className="mb-6 rounded-lg bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Your Cart</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      ${(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="rounded-lg bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Shipping Information</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Main St" />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="New York" />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ny">New York</SelectItem>
                      <SelectItem value="ca">California</SelectItem>
                      <SelectItem value="tx">Texas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input id="zipCode" placeholder="12345" />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="lg:w-1/3">
          <div className="sticky top-20 rounded-lg bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
            <div className="mb-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between stroke-gray-400">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {fundusPointDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Fundus Points Discount</span>
                  <span>-${fundusPointDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="fundusPoints">Use Fundus Points</Label>
              {mockUser.isLoggedIn ? (
                <>
                  <Input
                    id="fundusPoints"
                    type="number"
                    placeholder="Enter points"
                    value={fundusPointsToUse}
                    onChange={handleFundusPointsChange}
                    min={0}
                    max={mockUser.fundusPoints}
                  />
                  <p className="mt-1 text-sm text-muted-foreground">
                    Available: {mockUser.fundusPoints} points (1 point = $2
                    discount)
                  </p>
                </>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Login required</AlertTitle>
                  <AlertDescription>
                    Please{" "}
                    <Link href="/login" className="underline">
                      login
                    </Link>{" "}
                    to use Fundus Points discount.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <Button className="w-full">Place Order</Button>
          </div>
        </div>
      </div>
    </main>
  );
}
