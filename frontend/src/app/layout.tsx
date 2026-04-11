import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClaimProvider } from "@/context/ClaimContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plum Claim Engine",
  description: "Next Generation AI Claim Processing",
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
          <header className="fixed top-0 w-full z-50 glass-nav bg-[#fcf9f8]/90 dark:bg-stone-950/90 backdrop-blur-md shadow-[0_2px_6px_rgba(0,0,0,0.04)] border-b border-stone-200/20">
            <div className="flex justify-between items-center px-8 h-20 max-w-[1440px] mx-auto">
              <div className="flex items-center gap-12">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">P</div>
                  <span className="text-primary font-bold text-2xl tracking-tighter">Plum Claim Engine</span>
                </div>
                <nav className="hidden md:flex gap-8 items-center h-full">
                  <a className="text-primary font-bold border-b-2 border-primary h-20 flex items-center font-medium text-sm tracking-tight transition-colors duration-200" href="/">New Claim</a>
                  <a className="text-on-surface-variant font-medium text-sm tracking-tight h-20 flex items-center hover:text-primary transition-colors duration-200" href="/admin/policy">Policy Settings</a>
                  <a className="text-on-surface-variant font-medium text-sm tracking-tight h-20 flex items-center hover:text-primary transition-colors duration-200" href="/admin/metrics">AI Accuracy</a>
                  <a className="text-on-surface-variant font-medium text-sm tracking-tight h-20 flex items-center hover:text-primary transition-colors duration-200" href="/admin/review">Case Review</a>
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 text-on-surface-variant hover:text-primary transition-all">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                   <span className="material-symbols-outlined">account_circle</span>
                </div>
              </div>
            </div>
          </header>
          {children}
        </ClaimProvider>
      </body>
    </html>
  );
}
