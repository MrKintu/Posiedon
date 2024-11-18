/*
 * Created Date: Friday, October 4th 2024, 9:11:46 pm
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

import "./globals.css";
import { Open_Sans } from "next/font/google";
import { Providers } from "@/contexts/Providers";
import DashboardLayout from "@/components/Layouts/DashboardLayout";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open",
});

export const metadata = {
  title: "Mazu Marketing",
  description: "Modern Marketing Platform",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      id="base-html" 
      lang="en" 
      suppressHydrationWarning
      className="transition-colors duration-200"
    >
      <head />
      <body 
        className={`font-open antialiased bg-main-bg transition-colors duration-200 ${openSans.variable}`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                console.log('[Layout] Current theme class:', document.documentElement.className);
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                      console.log('[Layout] Theme class changed:', document.documentElement.className);
                    }
                  });
                });
                observer.observe(document.documentElement, {
                  attributes: true,
                  attributeFilter: ['class']
                });
              })();
            `
          }}
        />
        <Providers>
          <DashboardLayout>{children}</DashboardLayout>
        </Providers>
      </body>
    </html>
  );
}
