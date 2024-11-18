'use client';

import { useState, useEffect } from 'react';
import { Navbar, Footer, Sidebar, ThemeWindow } from "@/components";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <main className="flex flex-col min-h-screen dark:bg-main-dark-bg">
      <Navbar />
      <Sidebar />
      <div className="flex flex-1 w-full relative dark:bg-main-dark-bg bg-main-bg">
        <ThemeWindow />
        <div className="w-full mt-[64px] flex-1 transition-all duration-300 ease-in-out">
          <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl dark:bg-secondary-dark-bg dark:text-white">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
