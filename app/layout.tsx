import type { Metadata } from "next";
import { Kode_Mono } from "next/font/google";
import { siteContent } from "@/lib/content";
import "./globals.css";

const sans = Kode_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  adjustFontFallback: false,
  fallback: ["monospace"]
});

const display = Kode_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  adjustFontFallback: false,
  fallback: ["monospace"]
});

const mono = Kode_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-bg text-fg antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
