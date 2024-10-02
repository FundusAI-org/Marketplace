"use client";

import { FC, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Connection, Transaction } from "@solana/web3.js";
import {
  createSolanaTransaction,
  confirmSolanaPayment,
} from "@/actions/solana.actions";
import Link from "next/link";

interface SolanaPaymentProps {
  amount: number;
  onPaymentComplete: () => void;
}

const SolanaPayment: FC<SolanaPaymentProps> = ({
  amount,
  onPaymentComplete,
}) => {
  const { publicKey, signTransaction } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!publicKey || !signTransaction) {
      toast.error("Please connect your Solana wallet");
      return;
    }

    setIsProcessing(true);
    try {
      const createResult = await createSolanaTransaction(amount);
      if (!createResult.success) {
        if (
          createResult.error ===
          "No Solana wallet address associated with this account"
        ) {
          toast.error(
            "No Solana wallet address associated with your account. Please add one in your profile settings.",
          );
          return;
        }
        throw new Error(createResult.error);
      }

      const transaction = Transaction.from(
        Buffer.from(createResult.transaction, "base64"),
      );
      const signedTransaction = await signTransaction(transaction);

      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL!,
        "confirmed",
      );
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize(),
      );

      const confirmation = await connection.confirmTransaction(
        signature,
        "confirmed",
      );
      if (confirmation.value.err) {
        throw new Error("Transaction failed");
      }

      const confirmResult = await confirmSolanaPayment(signature, amount);
      if (!confirmResult.success) {
        throw new Error(confirmResult.error);
      }

      toast.success("Payment successful!");
      onPaymentComplete();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <WalletMultiButton />
      {publicKey ? (
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ${amount} SOL`
          )}
        </Button>
      ) : (
        <div className="text-center">
          <p className="mb-2">
            Please connect your Solana wallet to proceed with the payment.
          </p>
          <p className="text-sm text-muted-foreground">
            If you haven't added a Solana wallet address to your account, please{" "}
            <Link href="/profile" className="text-primary hover:underline">
              update your profile
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
};

export default SolanaPayment;
