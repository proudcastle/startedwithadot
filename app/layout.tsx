import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Press_Start_2P } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Suspense } from "react";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "It All Started With a Dot",
  description:
    "It's a dot. It does nothing. You decide what happens next.",
  openGraph: {
    title: "It All Started With a Dot",
    description:
      "It's a dot. It does nothing. You decide what happens next.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "It All Started With a Dot",
    description:
      "It's a dot. It does nothing. You decide what happens next.",
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geist.variable} ${geistMono.variable} ${pressStart2P.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground font-sans antialiased min-h-svh flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <Suspense>
            <Header />
          </Suspense>
          <div className="flex-1">{children}</div>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
