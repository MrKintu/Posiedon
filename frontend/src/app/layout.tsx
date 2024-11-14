/*
 * Created Date: Friday, October 4th 2024, 9:11:46 pm
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import "./globals.css";
import { Navbar, Sidebar, ThemeWindow } from "@/components";
import Footer from "@/components/Footer";
import { ContextProvider } from "@/contexts/ContextProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ReactNode, useState, useEffect } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

const LayoutContent = ({ children }: RootLayoutProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Delay rendering until on the client

  return (
    <main className="flex flex-col min-h-screen dark:bg-main-dark-bg">
      <Navbar />
      <div className="flex flex-1 w-full relative dark:bg-main-dark-bg bg-main-bg">
        <Sidebar />
        <ThemeWindow />
        <div className="w-full mt-[64px] flex-1 transition-all duration-300 ease-in-out p-4 md:p-8 lg:p-12">
          {children}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" id="base-html">
      <head />
      <body>
        <ContextProvider>
          <AuthProvider>
            <LayoutContent>{children}</LayoutContent>
          </AuthProvider>
        </ContextProvider>
      </body>
    </html>
  );
}
