"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

async function updateSolanaWallet(walletAddress: string) {
  const response = await fetch("/api/user/update-solana-wallet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ walletAddress }),
  });

  if (!response.ok) {
    throw new Error("Failed to update Solana wallet address");
  }

  return response.json();
}

export function UpdateSolanaWallet({
  currentAddress,
}: {
  currentAddress: string | null;
}) {
  const [walletAddress, setWalletAddress] = useState(currentAddress || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateSolanaWallet(walletAddress);
      toast.success("Solana wallet address updated successfully");
    } catch (error) {
      console.error("Error updating Solana wallet address:", error);
      toast.error("Failed to update Solana wallet address");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label
          htmlFor="solanaWallet"
          className="block text-sm font-medium text-gray-700"
        >
          Solana Wallet Address
        </label>
        <Input
          id="solanaWallet"
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Enter your Solana wallet address"
          className="mt-1"
        />
      </div>
      <Button type="submit" disabled={isUpdating}>
        {isUpdating ? "Updating..." : "Update Solana Wallet"}
      </Button>
    </form>
  );
}
