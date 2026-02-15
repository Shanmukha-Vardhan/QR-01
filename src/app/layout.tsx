import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium QR Generator",
  description: "Create premium, privacy-first QR codes in your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <Header />
        <main className="min-h-[calc(100vh-4rem)] pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
