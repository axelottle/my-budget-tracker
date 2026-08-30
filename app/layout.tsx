import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { TransactionsProvider } from "@/lib/transactions-context";
import "./globals.css";

// Display face: used sparingly for headings and the big balance figure.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-fraunces",
});

// Body face: used for all UI text, labels, and buttons.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

// Mono face: used only for currency amounts, so every number in the app lines up
// like entries in a ledger.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "Budget Tracker",
  description: "A simple personal budget tracker.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}
      >
        <TransactionsProvider>{children}</TransactionsProvider>
      </body>
    </html>
  );
}
