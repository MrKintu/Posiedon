/*
 * Created Date: Saturday, September 14th 2024, 2:14:37 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from 'next-themes';

// Reusable SocialIcon component
const SocialIcon: React.FC<{ href: string; label: string; children: React.ReactNode }> = ({ href, label, children }) => (
  <a
    href={href}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
    className="mr-6 text-body-color duration-300 hover:text-primary dark:text-body-color-dark dark:hover:text-primary"
  >
    {children}
  </a>
);

// Reusable LinkItem component
const LinkItem: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <li>
    <Link
      href={href}
      className="inline-block text-base leading-loose text-body-color hover:text-primary dark:text-gray-200 dark:hover:text-primary transition-colors duration-200"
    >
      {children}
    </Link>
  </li>
);

const Footer = () => {
  const [isClient, setIsClient] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <footer className="relative z-10 bg-white dark:bg-secondary-dark-bg pt-16 md:pt-20 lg:pt-24 border-t border-gray-200 dark:border-gray-700">
      <div className="container px-4">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-5/12">
            <div className="mb-12 max-w-[360px] lg:mb-16">
              <Link href="/" className="mb-8 inline-block">
                <Image
                  src={resolvedTheme === 'dark' ? '/images/dark.png' : '/images/white.png'}
                  alt="logo"
                  className="w-full"
                  width={140}
                  height={30}
                />
              </Link>
              <p className="mb-9 text-base leading-relaxed text-body-color dark:text-gray-300">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                lobortis.
              </p>
              <div className="flex items-center">
                <SocialIcon href="#" label="Facebook" children={undefined}>
                  {/* Social icons */}
                </SocialIcon>
              </div>
            </div>
          </div>

          <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
            <div className="mb-12 lg:mb-16">
              <h2 className="mb-10 text-xl font-bold text-black dark:text-white">
                Useful Links
              </h2>
              <ul>
                <LinkItem href="/blog">Blog</LinkItem>
                <LinkItem href="/pricing">Pricing</LinkItem>
                <LinkItem href="/about">About</LinkItem>
              </ul>
            </div>
          </div>

          <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
            <div className="mb-12 lg:mb-16">
              <h2 className="mb-10 text-xl font-bold text-black dark:text-white">
                Terms
              </h2>
              <ul>
                <LinkItem href="/tos">TOS</LinkItem>
                <LinkItem href="/privacy">Privacy Policy</LinkItem>
                <LinkItem href="/refund">Refund Policy</LinkItem>
              </ul>
            </div>
          </div>

          <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-3/12">
            <div className="mb-12 lg:mb-16">
              <h2 className="mb-10 text-xl font-bold text-black dark:text-white">
                Support & Help
              </h2>
              <ul>
                <LinkItem href="/contact">Contact Us</LinkItem>
                <LinkItem href="/support">Support</LinkItem>
                <LinkItem href="/faq">FAQ</LinkItem>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-200 dark:border-gray-700 py-8 lg:mt-16">
        <div className="container px-4">
          <div className="flex flex-wrap items-center justify-center">
            <div className="w-full md:w-2/3 lg:w-1/2">
              <div className="text-center lg:text-left">
                <p className="text-base text-body-color dark:text-gray-300">
                  &copy; {new Date().getFullYear()} Mazu Marketing. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
