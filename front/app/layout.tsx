import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stock Indexes Browser",
  description: "Stock Indexes Browser",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="min-h-full bg-blue-950 flex flex-col justify-between"
    >
      <body
        className={
          inter.className +
          " min-h-full flex flex-col justify-between align-middle"
        }
      >
        {children}
      </body>
    </html>
  );
}
