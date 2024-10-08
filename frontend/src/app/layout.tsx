"use client";
import "./globals.css";
import { Open_Sans } from "next/font/google";
import { Navbar, Sidebar, ThemeWindow } from "@/components";
import { ContextProvider } from "@/contexts/ContextProvider";
import { ReactNode } from "react";

const open = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: "normal",
  display: "swap",
  variable: "--font-open",
});

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${open.variable}`} id="base-html">
      <body className={open.className}>
        <ContextProvider>
          <main className="flex relative dark:bg-main-dark-bg">
            <ThemeWindow />
            <Sidebar />
            <div className="min-h-screen dark:bg-main-dark-bg bg-main-bg w-full">
              <Navbar />
              <div className="md:mt-4 mt-16">{children}</div>
            </div>
          </main>
        </ContextProvider>
      </body>
    </html>
  );
}
