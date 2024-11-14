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

// Reusable SocialIcon component
const SocialIcon = ({ href, label, children }) => (
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
const LinkItem = ({ href, children }) => (
  <li>
    <Link
      href={href}
      className="mb-4 inline-block text-base text-body-color duration-300 hover:text-primary dark:text-body-color-dark dark:hover:text-primary"
    >
      {children}
    </Link>
  </li>
);

const Footer = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set state to true when client-side rendering
    setIsClient(true);
  }, []);

  // Return a loading state or null during SSR to avoid hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <footer className="bg-main-bg dark:bg-main-dark-bg pt-16 md:pt-20 lg:pt-24">
      <div className="container mx-auto"> {/* Added mx-auto for centering */}
        <div className="-mx-4 flex flex-wrap">
          {/* Logo and Description */}
          <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-5/12 mb-12 lg:mb-16">
            <Link href="/" className="mb-8 inline-block">
              <Image
                src="/images/logo/logo-2.svg"
                alt="logo"
                className="w-full dark:hidden"
                width={140}
                height={30}
              />
              <Image
                src="/images/logo/logo.svg"
                alt="logo"
                className="hidden w-full dark:block"
                width={140}
                height={30}
              />
            </Link>
            <p className="mb-9 text-base leading-relaxed text-body-color dark:text-body-color-dark">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lobortis.
            </p>
            <div className="flex items-center">
              <SocialIcon href="/" label="facebook">
                {/* Facebook Icon */}
                <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                  <path d="M12.1 10.4939V7.42705C12.1 6.23984..." fill="currentColor" />
                </svg>
              </SocialIcon>
              <SocialIcon href="/" label="twitter">
                {/* Twitter Icon */}
                <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                  <path d="M13.9831 19.25L9.82094 13.3176..." fill="currentColor" />
                </svg>
              </SocialIcon>
              <SocialIcon href="/" label="youtube">
                {/* YouTube Icon */}
                <svg width="18" height="14" viewBox="0 0 18 14" className="fill-current">
                  <path d="M17.5058 2.07119C17.3068 1.2488..." />
                </svg>
              </SocialIcon>
              <SocialIcon href="/" label="linkedin">
                {/* LinkedIn Icon */}
                <svg width="17" height="16" viewBox="0 0 17 16" className="fill-current">
                  <path d="M15.2196 0H1.99991C1.37516 0..." />
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Links Section */}
          <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12 mb-12 lg:mb-16">
            <h2 className="mb-10 text-xl font-bold text-black dark:text-white">Useful Links</h2>
            <ul>
              <LinkItem href="/blog">Blog</LinkItem>
              <LinkItem href="/">Pricing</LinkItem>
              <LinkItem href="/about">About</LinkItem>
            </ul>
          </div>

          {/* Terms Section */}
          <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12 mb-12 lg:mb-16">
            <h2 className="mb-10 text-xl font-bold text-black dark:text-white">Terms</h2>
            <ul>
              <LinkItem href="/">TOS</LinkItem>
              <LinkItem href="/">Privacy Policy</LinkItem>
              <LinkItem href="/">Refund Policy</LinkItem>
            </ul>
          </div>

          {/* Support Section */}
          <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-3/12 mb-12 lg:mb-16">
            <h2 className="mb-10 text-xl font-bold text-black dark:text-white">Support & Help</h2>
            <ul>
              <LinkItem href="/contact">Open Support Ticket</LinkItem>
              <LinkItem href="/">Terms of Use</LinkItem>
              <LinkItem href="/about">About</LinkItem>
            </ul>
          </div>
        </div>

        {/* Divider and Footer Note */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D2D8E183] to-transparent dark:via-[#959CB183]" />
        <div className="py-8 text-center text-base text-body-color dark:text-white">
          Created by Angaza Technologies.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
