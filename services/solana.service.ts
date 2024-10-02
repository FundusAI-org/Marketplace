import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { db } from "@/db";
import { ordersTable, solanaTransactionsTable, usersTable } from "@/db/schema";
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

  async getUserSolanaWallet(userId: string): Promise<string | null> {
    const user = await db
      .select({ solanaWalletAddress: usersTable.solanaWalletAddress })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    return user[0]?.solanaWalletAddress || null;
  }

  async getSolPrice(): Promise<number> {
    // In a production environment, you should use a reliable price feed
    // This is a placeholder implementation
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
    );
    const data = await response.json();
    return data.solana.usd;
  }

  async convertUSDToSOL(amountUSD: number): Promise<number> {
    const solPrice = await this.getSolPrice();
    return amountUSD / solPrice;
  }

  async createTransaction(
    amountUSD: number,
    userId: string,
  ): Promise<{ transaction: Transaction; amountSOL: number } | null> {
    const userWalletAddress = await this.getUserSolanaWallet(userId);
    if (!userWalletAddress) {
      return null;
    }

    const solPrice = await this.getSolPrice();
    const amountSOL = amountUSD / solPrice;
    const lamports = Math.round(amountSOL * LAMPORTS_PER_SOL);

    const fromPubkey = new PublicKey(userWalletAddress);
    const { blockhash } = await this.connection.getLatestBlockhash();
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey: this.merchantPublicKey,
        lamports,
      }),
    );

    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    return { transaction, amountSOL };
  }

  async confirmTransaction(
    signature: string,
    amountUSD: number,
    amountSOL: number,
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
      info.lamports !== Math.round(amountSOL * LAMPORTS_PER_SOL)
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
        amount: amountUSD,
        amountSOL,
        signature,
        status: "completed",
      })
      .returning();

    return { success: true, transactionId: newTransaction.id };
  }
}

export const solanaService = new SolanaService();
