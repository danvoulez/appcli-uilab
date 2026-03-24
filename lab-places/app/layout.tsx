import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LAB Places",
  description: "Operational cockpit for the LAB ecosystem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#0e0e0e] text-white">{children}</body>
    </html>
  );
}
