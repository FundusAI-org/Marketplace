import { PublicKey } from "@solana/web3.js";

export const DEFAULT_SOL_ADDRESS: PublicKey = new PublicKey(
  process.env.MERCHANT_WALLET_ADDRESS!, // devnet wallet
);

export const DEFAULT_SOL_AMOUNT: number = 1.0;
