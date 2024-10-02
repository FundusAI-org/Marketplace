import { PublicKey } from "@solana/web3.js";
import { DEFAULT_SOL_ADDRESS, DEFAULT_SOL_AMOUNT } from "./solana-const";

export function validatedQueryParams(requestUrl: URL) {
  let toPubkey: PublicKey = DEFAULT_SOL_ADDRESS;
  let amount: number = DEFAULT_SOL_AMOUNT;

  try {
    if (requestUrl.searchParams.get("to")) {
      toPubkey = new PublicKey(requestUrl.searchParams.get("to")!);
    }
  } catch (err) {
    throw "Invalid input query parameter: to";
  }

  try {
    if (requestUrl.searchParams.get("amount")) {
      amount = parseFloat(requestUrl.searchParams.get("amount")!);
    }

    if (amount <= 0) throw "amount must be greater than 0";
  } catch (err) {
    throw "Invalid input query parameter: amount" + err;
  }

  return {
    amount,
    toPubkey,
  };
}
