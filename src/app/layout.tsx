import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "emanahmed752002-ttttt555",
  description: "Next.js app with TypeScript and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}