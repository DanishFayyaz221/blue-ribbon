import type { Metadata } from "next";
import { Geist, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { ConstructionBanner } from "./_components/layout/ConstructionBanner";
import { RevealOnScroll } from "./_components/ui/RevealOnScroll";
import { ScrollEffects } from "./_components/ui/ScrollEffects";
import { SmoothScroll } from "./_components/ui/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blue Ribbon Real Estate",
  description:
    "Your bridge to home. Premier property representation across Western Sydney.",
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
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${playfair.variable} ${poppins.variable} antialiased`}
    >
      <body
        suppressHydrationWarning
        className="bg-white text-brand-bunker"
      >
        <ConstructionBanner />
        <SmoothScroll />
        <RevealOnScroll />
        <ScrollEffects />
        {children}
      </body>
    </html>
  );
}