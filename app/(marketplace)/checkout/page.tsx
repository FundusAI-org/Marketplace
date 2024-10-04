"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useSession } from "@/providers/session.provider";
import { useCart } from "@/providers/cart.provider";
import { toast } from "sonner";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

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
import SolanaPayment from "@/components/SolanaPayment";

import "@solana/wallet-adapter-react-ui/styles.css";
import { createOrder } from "@/actions/order.actions";
import { redirect } from "next/navigation";

const wallets = [new PhantomWalletAdapter()];

export default function CheckoutPage() {
  const { cart, refreshCart } = useCart();
  const { user } = useSession();
  const [fundusPointsToUse, setFundusPointsToUse] = useState(0);
  const [fundusPointDiscount, setFundusPointDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"traditional" | "solana">(
    "traditional",
  );

  const subtotal =
    cart?.items.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0,
    ) || 0;
  const tax = subtotal * 0.1;
  const total = subtotal + tax - fundusPointDiscount;

  const handleFundusPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.floor(Number(e.target.value));
    if (value >= 0 && value <= (user?.fundusPoints || 0)) {
      setFundusPointsToUse(value);
    }
  };

  useEffect(() => {
    const discount = fundusPointsToUse * 2; // 1 Fundus Point = $2
    setFundusPointDiscount(discount);
  }, [fundusPointsToUse]);

  const handlePlaceOrder = async () => {
    // Implement traditional payment logic here
    toast.success("Order placed successfully");
    await refreshCart();
  };

  const handleSolanaPaymentComplete = async ({
    solanaTransactionId,
    tradtionalTransactionId,
    orderId,
  }: {
    solanaTransactionId?: string;
    tradtionalTransactionId?: string;
    orderId?: string;
  }) => {
    const orderItems = cart.items.map((item) => ({
      id: item.medicationId,
      quantity: item.quantity,
    }));

    const order = await createOrder(orderItems, orderId, solanaTransactionId);

    if (!order.success) {
      toast.error("Failed to create order");
      throw new Error("Failed to create order");
    }

    console.log(order);

    toast.success("Order placed successfully");
    // redirect("/checkout");
    refreshCart();
  };

  return (
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <main className="container min-h-screen max-w-6xl bg-background py-6 md:py-12">
          <h1 className="ml-2 text-3xl font-bold">Checkout</h1>
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="lg:w-2/3">
              <div className="mb-6 rounded-lg bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">Your Cart</h2>
                {cart && cart.items.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.medication.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Your cart is empty</AlertTitle>
                    <AlertDescription>
                      Add some items to your cart before checking out.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="rounded-lg bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">
                  Shipping Information
                </h2>
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
                  {user ? (
                    <>
                      <Input
                        id="fundusPoints"
                        type="number"
                        placeholder="Enter points"
                        value={fundusPointsToUse}
                        onChange={handleFundusPointsChange}
                        min={0}
                        max={user.fundusPoints ?? 0}
                      />
                      <p className="mt-1 text-sm text-muted-foreground">
                        Available: {user.fundusPoints} points (1 point = $2
                        discount)
                      </p>
                    </>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Login required</AlertTitle>
                      <AlertDescription>
                        Please{" "}
                        <Link href="/auth?action=login" className="underline">
                          login
                        </Link>{" "}
                        to use Fundus Points discount.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <div className="mb-4">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={(value: "traditional" | "solana") =>
                      setPaymentMethod(value)
                    }
                  >
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="traditional">
                        Traditional Payment
                      </SelectItem>
                      <SelectItem value="solana">Solana Blinks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {paymentMethod === "traditional" ? (
                  <Button
                    className="w-full"
                    onClick={handlePlaceOrder}
                    disabled={!cart || cart.items.length === 0}
                  >
                    Place Order
                  </Button>
                ) : (
                  <SolanaPayment
                    amountUSD={total}
                    onPaymentComplete={handleSolanaPaymentComplete}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </WalletModalProvider>
    </WalletProvider>
  );
}
