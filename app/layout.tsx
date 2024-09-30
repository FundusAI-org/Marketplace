// "use client";

import localFont from "next/font/local";
import "./globals.css";

import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { SessionProvider } from "@/providers/session.provider";
import { validateRequest } from "@/lucia";
import { CartProvider } from "@/providers/cart.provider";
import cartService from "@/services/cart.service";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const sessionData = await validateRequest();
  const cartResponse = await cartService.getCart();
  const cartData = cartResponse.success ? cartResponse.data : null;
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster richColors />
        {modal}
        <SessionProvider value={sessionData}>
          <CartProvider initialValue={cartData}>
            {children}
            <Footer />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
