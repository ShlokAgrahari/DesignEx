import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { LoadingProvider } from "@/context/LoadingContext";
import LoadingOverlay from "@/components/LoadingOverlay";

import AuthProvider from "@/components/AuthProvider/AuthProvider";
import { StreamVideoProvider } from "@/providers/StreamClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DesignEx",
  description: "Next-gen team design collaboration app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>

        {
          <LoadingProvider>
            <LoadingOverlay />
            <AuthProvider>
              {children}
            </AuthProvider>
          </LoadingProvider>
        }

      </body>
    </html>
  );
}
