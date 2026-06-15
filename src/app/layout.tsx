import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Assistant",
  description:
    "An AI-powered support chatbot built with Next.js, FastAPI, and llama-3.1-8b-instant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      {/*
        suppressHydrationWarning prevents a React warning caused by browser
        extensions (like dark-mode toggles) that modify the <html> element
        before React can hydrate the page.
      */}
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-surface text-ink antialiased`}>{children}</body>
    </html>
  );
}
