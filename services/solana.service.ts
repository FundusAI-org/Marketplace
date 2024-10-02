import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { db } from "@/db";
import { ordersTable, solanaTransactionsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

class SolanaService {
  private connection: Connection;
  private merchantPublicKey: PublicKey;

  constructor() {
    this.connection = new Connection(
      process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com",
      "confirmed",
    );
    this.merchantPublicKey = new PublicKey(
      process.env.MERCHANT_WALLET_ADDRESS!,
    );
  }

  async createTransaction(
    amount: number,
    fromPubkey: PublicKey,
  ): Promise<Transaction> {
    const { blockhash } = await this.connection.getLatestBlockhash();
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey: this.merchantPublicKey,
        lamports: amount * LAMPORTS_PER_SOL,
      }),
    );

    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    return transaction;
  }

  async confirmTransaction(
    signature: string,
    amount: number,
    userId: string,
    orderId: string,
  ): Promise<{ success: boolean; transactionId?: string }> {
    const transactionDetails = await this.connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!transactionDetails) {
      throw new Error("Transaction not found");
    }

    const transferInstruction =
      transactionDetails.transaction.message.instructions.find(
        (ix) => "parsed" in ix && ix.parsed.type === "transfer",
      );

    if (!transferInstruction || !("parsed" in transferInstruction)) {
      throw new Error("Invalid transaction");
    }

    const { info } = transferInstruction.parsed;

    if (
      info.destination !== this.merchantPublicKey.toBase58() ||
      info.lamports !== amount * LAMPORTS_PER_SOL
    ) {
      throw new Error("Invalid transaction details");
    }

    // Update order status
    await db
      .update(ordersTable)
      .set({ status: "pending" })
      .where(eq(ordersTable.id, orderId));

    // Insert Solana transaction record
    const [newTransaction] = await db
      .insert(solanaTransactionsTable)
      .values({
        userId,
        orderId,
        amount,
        signature,
        status: "completed",
      })
      .returning();

    return { success: true, transactionId: newTransaction.id };
  }
}

export const solanaService = new SolanaService();
