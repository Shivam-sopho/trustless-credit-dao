import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { WalletConnect } from "./components/WalletConnect";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trustless Credit DAO",
  description: "A decentralized credit system built on IOTA EVM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
              <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Trustless Credit DAO</h1>
                <WalletConnect />
              </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
