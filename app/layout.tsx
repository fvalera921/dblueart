import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/components/providers/session-provider";
import { siteConfig } from "@/lib/site";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "dblueart | Chaquetas personalizadas",
    template: "%s | dblueart"
  },
  description: siteConfig.description,
  openGraph: {
    title: "dblueart | Chaquetas personalizadas",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "dblueart",
    locale: "es_ES",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "dblueart | Chaquetas personalizadas",
    description: siteConfig.description
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className={`${cinzel.variable} ${inter.variable} font-body antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
