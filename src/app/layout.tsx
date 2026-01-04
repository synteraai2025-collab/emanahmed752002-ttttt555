import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hospital Calendar for Operations",
  description: "Manage hospital appointments and schedules for patients, doctors, and administrators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="bg-primary text-primary-foreground p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Hospital Calendar
            </Link>
            <div className="flex space-x-6">
              <Link href="/patient" className="hover:text-accent transition-colors">
                Patient Portal
              </Link>
              <Link href="/doctor" className="hover:text-accent transition-colors">
                Doctor Portal
              </Link>
              <Link href="/admin" className="hover:text-accent transition-colors">
                Admin Portal
              </Link>
              <Link href="/dashboard" className="hover:text-accent transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-background">
          {children}
        </main>
      </body>
    </html>
  );
}
