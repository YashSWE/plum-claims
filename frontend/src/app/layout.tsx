import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClaimProvider } from "@/context/ClaimContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClaimAdjudicate",
  description: "Next Generation Claim Processing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased light`}
    >
      <head>
          <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-on-surface font-body">
        <ClaimProvider>
          <header className="fixed top-0 w-full z-50 border-b border-stone-200/20 bg-[#fcf9f8]/90 dark:bg-stone-950/90 backdrop-blur-md shadow-sm">
            <div className="flex justify-between items-center px-8 h-20 max-w-[1440px] mx-auto">
              <div className="flex items-center gap-12">
                <span className="text-[#ba0036] font-bold text-2xl tracking-tighter">ClaimAdjudicate</span>
                <nav className="hidden md:flex gap-8 items-center pt-4">
                  <a className="text-[#ba0036] font-bold border-b-2 border-[#ba0036] pb-4 font-['Inter'] font-medium text-sm tracking-tight transition-colors duration-200" href="/">New Claim</a>
                </nav>
              </div>
            </div>
          </header>
          {children}
        </ClaimProvider>
      </body>
    </html>
  );
}
