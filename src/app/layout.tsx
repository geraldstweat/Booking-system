// Import global CSS file (this applies styles globally across the app)
import "./globals.css";

// Import Google font helper from Next.js (here we're using the Inter font)
import { Inter } from "next/font/google";

// Import Metadata type from Next.js (used to type-check the metadata object)
import type { Metadata } from "next";

// Import ReactNode type (represents anything React can render, e.g. JSX, string, fragment)
import type { ReactNode } from "react";

// Load the Inter font with Latin subset
const inter = Inter({ subsets: ["latin"] });

// Define metadata for the whole app (Next.js automatically uses this for SEO & <head>)
export const metadata: Metadata = {
  title: "Fantastic One — Next.js", // Title shown in browser tab & search engines
  description: "A single, fantastic Next.js landing page.", // Meta description for SEO
};

// Define TypeScript interface for props of RootLayout
interface RootLayoutProps {
  children: ReactNode; // React children (all nested pages/components will render here)
}

// Root layout component (wraps around all pages)
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    // Set language of HTML document to English, and prevent hydration warning in dark mode
    <html lang="en" suppressHydrationWarning>
      {/* Apply font class + dark/light mode background & text colors */}
      <body
        className={`${inter.className} bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100`}
      >
        {/* Render whatever child components are passed (like page.tsx, Navbar, etc.) */}
        {children}
      </body>
    </html>
  );
}