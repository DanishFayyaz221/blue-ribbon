import type { Metadata } from "next";
import { Geist, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { RevealOnScroll } from "./_components/ui/RevealOnScroll";
import { ScrollEffects } from "./_components/ui/ScrollEffects";
import { SmoothScroll } from "./_components/ui/SmoothScroll";
import { PageTransition } from "./_components/ui/PageTransition";

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
      <head>
        {/* With scripting off, nothing ever adds `reveal-in`, so every
            revealed block would keep its hidden start state and the page
            would read as half empty. The armed class is what hides them, so
            neutralising it here restores the content. */}
        <noscript>
          <style>{`html.reveal-armed .reveal,html.reveal-armed .reveal-scale{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {/* Arm the reveal animations on fresh loads, and disarm on back/forward
            navigation so restored pages don't paint blank when the observer
            isn't re-run. Inline so it executes before first paint. */}
        <script
          dangerouslySetInnerHTML={{
            // `e.persisted` only: pageshow fires on every load, not just a
            // bfcache restore, so disarming unconditionally stripped the
            // hidden start state milliseconds after first paint — every
            // `.reveal` block then sat at its resting position and the
            // scroll animations never played. The guard keeps the safety
            // net (a restored page can't stay blank) without that.
            __html: `document.documentElement.classList.add('reveal-armed');addEventListener('pageshow',function(e){if(e.persisted)document.documentElement.classList.remove('reveal-armed')});`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-white text-brand-bunker"
      >
        <SmoothScroll />
        <RevealOnScroll />
        <ScrollEffects />
        {/* Bounded overflow container. `overflow-x: clip` on html/body was not
            enough on Chromium's mobile emulator — a wrapper with an explicit
            width and clip stops the horizontal drag reliably, without breaking
            the sticky nav (which `overflow: hidden` would). */}
        <div className="relative w-full max-w-[100vw] overflow-x-clip">
          <PageTransition>{children}</PageTransition>
        </div>
      </body>
    </html>
  );
}