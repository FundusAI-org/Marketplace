"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
      <h2 className="text-3xl font-bold text-red-500">Something went wrong.</h2>
      <p>{error.message}</p>
      <div className="flex gap-4">
        <Link href="/">
          <Button variant="default">Go back home</Button>
        </Link>

        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          variant="secondary"
          size={"lg"}
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
