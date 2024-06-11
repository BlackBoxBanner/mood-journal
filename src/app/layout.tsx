import type {Metadata} from "next";
import {Raleway, Playfair_Display, Sarabun} from "next/font/google";
import "./globals.css";
import {cn} from "@/lib/utils";
import {Suspense} from "react";
import {ThemeProvider} from "@/components/theme-provider";
import {Toaster} from "@/components/ui/toaster";
import Loading from "./loading";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-raleway",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
});

const sarabun = Sarabun({
  weight: ["100", "200", "300"],
  subsets: ["thai"],
  display: "swap",
  variable: "--font-sarabun",
});

export const metadata: Metadata = {
  title: "Mood Journal",
  description: "Mood Journal",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body
      className={cn(
        raleway.variable,
        playfairDisplay.variable,
        sarabun.variable,
        "font-sans bg-background text-foreground"
      )}
    >
    <Toaster/>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Suspense fallback={<Loading/>}>{children}</Suspense>
    </ThemeProvider>
    </body>
    </html>
  );
}
