import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  ParsedTransactionWithMeta,
  ParsedInstruction,
  PartiallyDecodedInstruction,
} from "@solana/web3.js";
import { db } from "@/db";
import {
  customersTable,
  ordersTable,
  solanaTransactionsTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
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
      .select({ solanaWalletAddress: customersTable.solanaWalletAddress })
      .from(customersTable)
      .where(eq(customersTable.id, userId))
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
    walletAddress?: string,
  ): Promise<{ transaction: Transaction; amountSOL: number } | null> {
    const userWalletAddress = await this.getUserSolanaWallet(userId);
    if (!userWalletAddress) {
      throw new Error("No Solana wallet address associated with this account");
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
  ): Promise<{ success: boolean; transactionId?: string; orderId: string }> {
    console.log(`Confirming transaction: ${signature}`);

    const transactionDetails = await this.connection.getParsedTransaction(
      signature,
      {
        maxSupportedTransactionVersion: 0,
      },
    );

    if (!transactionDetails) {
      console.error(`Transaction not found: ${signature}`);
      throw new Error("Transaction not found");
    }

    // console.log(
    //   `Transaction details:`,
    //   JSON.stringify(transactionDetails, null, 2),
    // );

    const instructions = this.getInstructions(transactionDetails);
    console.log(`Instructions:`, JSON.stringify(instructions, null, 2));

    const transferInstruction = this.findTransferInstruction(instructions);
    if (!transferInstruction) {
      console.error(
        `No transfer instruction found in transaction: ${signature}`,
      );
      throw new Error("Invalid transaction: No transfer instruction found");
    }

    console.log(
      `Transfer instruction:`,
      JSON.stringify(transferInstruction, null, 2),
    );

    const { info } = transferInstruction.parsed;
    const expectedLamports = Math.round(amountSOL * LAMPORTS_PER_SOL);

    if (
      info.destination !== this.merchantPublicKey.toBase58() ||
      info.lamports !== expectedLamports
    ) {
      console.error(`Invalid transaction details for ${signature}:`, {
        expectedDestination: this.merchantPublicKey.toBase58(),
        actualDestination: info.destination,
        expectedLamports,
        actualLamports: info.lamports,
      });
      throw new Error("Invalid transaction details");
    }

    const transactionUpdate = {
      status: "completed",
      signature,
    };

    try {
      const [order] = await db
        .insert(ordersTable)
        .values({
          customerId: userId,
          totalAmount: "0", // We'll update this later
          fundusPointsUsed: 0,
        })
        .returning();

      const [newTransaction] = await db
        .insert(solanaTransactionsTable)
        .values({
          customerId: userId,
          amount: amountUSD.toString(),
          amountSOL: amountSOL.toString(),
          signature,
          orderId: order.id,
          ...transactionUpdate,
        })
        .returning();

      console.log(`Transaction confirmed and recorded: ${newTransaction.id}`);
      return {
        success: true,
        transactionId: newTransaction.id,
        orderId: order.id,
      };
    } catch (error) {
      console.error(`Error inserting transaction record:`, error);
      throw new Error("Failed to record transaction");
    }
  }

  private getInstructions(
    transactionDetails: ParsedTransactionWithMeta,
  ): (ParsedInstruction | PartiallyDecodedInstruction)[] {
    const message = transactionDetails.transaction.message;
    if ("instructions" in message) {
      return message.instructions;
    } else if ("compiledInstructions" in message) {
      return (
        transactionDetails.meta?.innerInstructions?.[0]?.instructions || []
      );
    } else {
      console.error(`Unsupported message format:`, message);
      throw new Error("Unsupported transaction message format");
    }
  }

  private findTransferInstruction(
    instructions: (ParsedInstruction | PartiallyDecodedInstruction)[],
  ): ParsedInstruction | null {
    for (const instruction of instructions) {
      if ("parsed" in instruction && instruction.parsed.type === "transfer") {
        return instruction as ParsedInstruction;
      }
    }
    return null;
  }

  async updateWalletAddress(walletAddress: string, userId: string) {
    const [updatedUser] = await db
      .update(customersTable)
      .set({ solanaWalletAddress: walletAddress })
      .where(eq(customersTable.id, userId))
      .returning();

    return updatedUser;
  }
}

export const solanaService = new SolanaService();
