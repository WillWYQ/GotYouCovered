import type { Metadata } from "next";
import { Kode_Mono, Inter } from "next/font/google";
import { siteContent } from "@/lib/content";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

const display = Kode_Mono({
  subsets: ["latin"],
  variable: "--font-display",
  adjustFontFallback: false,
  fallback: ["monospace"]
});

const mono = Kode_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  adjustFontFallback: false,
  fallback: ["monospace"]
});

export const metadata: Metadata = {
  title: siteContent.metadata.title,
  description: siteContent.metadata.description
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${display.variable} ${mono.variable} bg-bg text-fg antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
