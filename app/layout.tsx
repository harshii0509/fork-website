import { Agentation } from "agentation";
import type { Metadata } from "next";
import { Caveat, Inter } from "next/font/google";
import "./globals.css";

// Inter is variable, so the design's in-between 450 weight renders as drawn.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// The handwritten notes: "Why I made this?", "THANKS A TON!" and the footer line.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const title = "Fork, a terminal for people who build things";
const description =
  "Fork is a terminal for people who build things with agents. Every project in its own tab, a square that tells you when it needs you, and your app, its changes and its design system right beside it.";

// Link previews need absolute image URLs; Vercel provides the production domain at build time.
const site = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const metadata: Metadata = {
  metadataBase: new URL(site ? `https://${site}` : "http://localhost:3000"),
  title,
  description,
  openGraph: {
    title,
    description,
    // Rendered from the home page's Fork window (app/v2/fork/ForkWindow.tsx), never a screenshot of the real app.
    images: [{ url: "/og.png", width: 2400, height: 1260, alt: "The Fork window: workspaces as tabs, a terminal, and the panel showing a page before and after" }],
  },
  twitter: { card: "summary_large_image", creator: "@harshii04" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${caveat.variable}`}>
      <body>
        {children}
        {/* Visual feedback toolbar while developing; never in production. */}
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
