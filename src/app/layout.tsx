import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wah Ha Ha - The Back Room",
  description: "Sunday night dinner at the roundtable",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-hidden">{children}</body>
    </html>
  );
}
