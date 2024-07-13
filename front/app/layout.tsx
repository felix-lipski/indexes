import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stock Indexes Browser",
  description: "Stock Indexes Browser",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="min-h-full bg-blue-950 flex flex-1 flex-col justify-center"
    >
      <body className={inter.className}>{children}</body>
    </html>
  );
}
