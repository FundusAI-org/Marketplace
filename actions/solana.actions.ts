"use server";

import { validateRequest } from "@/lucia";
import { solanaService } from "@/services/solana.service";

export async function createSolanaTransaction(amountUSD: number) {
  const { user } = await validateRequest();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const result = await solanaService.createTransaction(amountUSD, user.id);
    if (!result) {
      return {
        success: false,
        error: "No Solana wallet address associated with this account",
      };
    }
    return {
      success: true,
      transaction: result.transaction
        .serialize({ requireAllSignatures: false })
        .toString("base64"),
      amountSOL: result.amountSOL,
    };
  } catch (error) {
    console.error("Error creating Solana transaction:", error);
    return { success: false, error: "Failed to create transaction" };
  }
}

export async function confirmSolanaPayment(
  signature: string,
  amountUSD: number,
  amountSOL: number,
  orderId: string,
) {
  const { user } = await validateRequest();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const result = await solanaService.confirmTransaction(
      signature,
      amountUSD,
      amountSOL,
      user.id,
      orderId,
    );
    return { success: true, transactionId: result.transactionId };
  } catch (error) {
    console.error("Error confirming Solana payment:", error);
    return { success: false, error: "Failed to confirm payment" };
  }
}