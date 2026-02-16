import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "Premium QR Generator | Zero-Track, Private, & Client-Side",
  description: "Create premium, privacy-first QR codes entirely in your browser. No server tracking, no data collection. Customize with gradients, shapes, and logos.",
  metadataBase: new URL("https://premium-qr.vercel.app"), // Placeholder URL, replace when deployed
  openGraph: {
    title: "Premium QR Generator | 100% Private",
    description: "The only QR generator that guarantees your data never leaves your device. Generate beautiful, custom QR codes instantly.",
    url: "https://premium-qr.vercel.app",
    siteName: "Premium QR Generator",
    images: [
      {
        url: "/og-image.png", // This needs to be created or will 404
        width: 1200,
        height: 630,
        alt: "Premium Zero-Track QR Generator Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium QR Generator | Zero-Track Privacy",
    description: "Generate beautiful, custom QR codes entirely in your browser. No tracking, ever.",
    images: ["/og-image.png"], // Placeholder
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg", // Using SVG as placeholder for apple-touch-icon
  },
  themeColor: "#ffffff",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PremiumQR",
  },
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
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
