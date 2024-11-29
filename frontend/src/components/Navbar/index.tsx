/*
 * Created Date: Tuesday, October 8th 2024, 1:53:21 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useEffect } from "react";
import { useStateContext } from "@/contexts/ContextProvider";
import { useAuthContext } from "@/contexts/AuthContext";
import { AiOutlineMenu } from "react-icons/ai";
import { BsChatLeft } from "react-icons/bs";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggler from "./ThemeToggler";
import Chat from "../Chat";
import Notification from "../Notification";
import UserProfile from "../UserProfile";
import Cart from "../Cart";
import ThemeSettings from "../ThemeSettings";
import avatar from "public/data/avatar.jpg";

const menuData = [
  { title: "Home", path: "/" },
  { title: "About", path: "/about" },
  { title: "Products", path: "/products" },
];

interface NavButtonProps {
  title: string;
  customFunc: () => void;
  icon: React.ReactNode;
  color: string;
  dotColor?: string;
}

const NavButton = ({ title, customFunc, icon, color, dotColor }: NavButtonProps) => (
  <button
    type="button"
    onClick={customFunc}
    style={{ color }}
    className="relative text-xl rounded-full p-3 hover:bg-light-gray dark:hover:bg-secondary-dark-bg"
    title={title}
  >
    {dotColor && (
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
    )}
    {icon}
  </button>
);

const Navbar = () => {
  const {
    toggleMenu,
    isClicked,
    handleClick,
    setScreenSize,
    themeColor,
    setNavButton,
  } = useStateContext();
  const { isLoggedIn, userData } = useAuthContext();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => setScreenSize(window.innerWidth);
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [setScreenSize]);

  const handleActiveMenu = () => {
    setNavButton(true);
    toggleMenu();
  };

  return (
    <div className="w-full flex-2 fixed top-0 z-40 bg-main-bg dark:bg-main-dark-bg navbar">
      <div className="flex justify-between p-2 md:mx-6 relative">
        {isLoggedIn ? (
          <>
            <NavButton
              title="Menu"
              customFunc={handleActiveMenu}
              color={themeColor}
              icon={<AiOutlineMenu />}
            />
          </>
        ) : null}

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          {menuData.map((item) => (
            <Link href={item.path} key={item.title}>
              <span
                className={`py-2 ${
                  pathname === item.path
                    ? "transition-colors duration-200"
                    : "text-dark dark:text-white/70"
                }`}
                style={pathname === item.path ? { color: themeColor } : undefined}
              >
                {item.title}
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NavButton
            title="Cart"
            dotColor="#03C9D7"
            customFunc={() => handleClick('cart')}
            color={themeColor}
            icon={<FiShoppingCart />}
          />

          {isLoggedIn ? (
            <>
              <NavButton
                title="Chat"
                dotColor={themeColor}
                customFunc={() => handleClick('chat')}
                color={themeColor}
                icon={<BsChatLeft />}
              />
              <NavButton
                title="Notifications"
                dotColor={themeColor}
                customFunc={() => handleClick('notification')}
                color={themeColor}
                icon={<RiNotification3Line />}
              />

              <div
                className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
                onClick={() => handleClick('userProfile')}
              >
                <Image
                  className="rounded-full w-8 h-8"
                  src={avatar}
                  alt="user-profile"
                  width={32}
                  height={32}
                />
                <p>
                  <span className="text-gray-400 text-14">Hi, </span>{' '}
                  <span className="text-gray-400 font-bold ml-1 text-14">
                    {userData?.first_name || 'User'}
                  </span>
                </p>
                <MdKeyboardArrowDown className="text-gray-400 text-14" />
              </div>
            </>
          ) : (
            <Link href="/sign-in">
              <button 
                className="px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-opacity duration-200"
                style={{ backgroundColor: themeColor }}
              >
                Sign In
              </button>
            </Link>
          )}
          {isLoggedIn ? (
            <ThemeToggler />
          ) : null}
        </div>
      </div>

      {/* Dropdowns */}
      {isClicked.cart && <Cart />}
      {isLoggedIn && (
        <>
          {isClicked.chat && <Chat />}
          {isClicked.notification && <Notification />}
          {isClicked.userProfile && <UserProfile />}
        </>
      )}
    </div>
  );
};

export default Navbar;
