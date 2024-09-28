// "use client";

import localFont from "next/font/local";
import "./globals.css";

import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { SessionProvider } from "@/providers/session.provider";
import { validateRequest } from "@/lucia";

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
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster richColors />
        {modal}
        <SessionProvider value={sessionData}>
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
