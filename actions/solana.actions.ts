"use server";

import { validateRequest } from "@/lucia";
import { solanaService } from "@/services/solana.service";
import { PublicKey } from "@solana/web3.js";

export async function createSolanaTransaction(amount: number) {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const fromPubkey = new PublicKey(user.solanaWalletAddress);
    const transaction = await solanaService.createTransaction(
      amount,
      fromPubkey,
    );
    if (!transaction) {
      return {
        success: false,
        error: "No Solana wallet address associated with this account",
      };
    }
    return {
      success: true,
      transaction: transaction
        .serialize({ requireAllSignatures: false })
        .toString("base64"),
    };
  } catch (error) {
    console.error("Error creating Solana transaction:", error);
    return { success: false, error: "Failed to create transaction" };
  }
}

export async function confirmSolanaPayment(signature: string, amount: number) {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const result = await solanaService.confirmTransaction(
      signature,
      amount,
      user.id,
    );
    return { success: true, orderId: result.orderId };
  } catch (error) {
    console.error("Error confirming Solana payment:", error);
    return { success: false, error: "Failed to confirm payment" };
  }
}
