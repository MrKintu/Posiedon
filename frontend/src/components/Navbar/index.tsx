/*
 * Created Date: Tuesday, October 8th 2024, 1:53:21 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";
import React, { useEffect, useState } from "react";
import { useStateContext } from "@/contexts/ContextProvider";
import { AiOutlineMenu } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { BsChatLeft } from "react-icons/bs";
import { RiNotification3Line } from "react-icons/ri";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import avatar from "public/data/avatar.jpg";
import { Cart, Chat, Notification, UserProfile } from "@/components";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";

interface NavButtonProps {
  title: string;
  icon: React.ReactNode;
  customFunc: () => void;
  color: string;
  dotColor: string;
}

const NavButton: React.FC<NavButtonProps> = ({ title, icon, customFunc, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      style={{ color }}
      onClick={customFunc}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span style={{ background: dotColor }} className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar: React.FC = () => {
  const {
    activeMenu,
    setActiveMenu,
    isClicked,
    themeColor,
    handleClick,
    screenSize,
    setScreenSize,
    setActiveThemeSettings,
  } = useStateContext();
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true); // Ensure client-side rendering
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [setScreenSize]);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize, setActiveMenu]);

  // Skip rendering for hydration issues
  if (!isClient) return null;

  return (
    <div className="w-full flex-2 fixed top-0 z-40 bg-main-bg dark:bg-main-dark-bg">
      <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg w-full navbar shadow-md z-[9999]">
        <div className="flex justify-between p-2 md:mx-6 relative">
          {/* Left Side - Menu Button */}
          <NavButton
            title="Menu"
            icon={<AiOutlineMenu />}
            customFunc={() => setActiveMenu((prev) => !prev)}
            color={themeColor}
            dotColor="transparent"
          />

          {/* Center - Links from Header */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuData.map((menuItem, index) => (
              <div key={index}>
                {menuItem.path ? (
                  <Link href={menuItem.path}>
                    <span
                      className={`py-2 text-base ${
                        pathname === menuItem.path
                          ? "text-primary dark:text-white"
                          : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                      }`}
                    >
                      {menuItem.title}
                    </span>
                  </Link>
                ) : (
                  <span className="py-2 text-base text-dark dark:text-white/70">
                    {menuItem.title}
                  </span>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side - Icons and Theme Toggler */}
          <div className="flex items-center">
            <NavButton
              title="Cart"
              icon={<FiShoppingCart />}
              customFunc={() => handleClick("cart")}
              color={themeColor}
              dotColor="transparent"
            />

            <NavButton
              title="Chat"
              icon={<BsChatLeft />}
              customFunc={() => handleClick("chat")}
              color={themeColor}
              dotColor="#03c9d7"
            />

            <NavButton
              title="Notifications"
              icon={<RiNotification3Line />}
              customFunc={() => handleClick("notification")}
              color={themeColor}
              dotColor="#03c9d7"
            />

            {/* Profile Section */}
            <TooltipComponent content="Profile" position="BottomCenter">
              <div
                className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
                onClick={() => handleClick("userProfile")}
              >
                <Image src={avatar} alt="avatar" className="rounded-full w-8 h-8" />
                <p className="text-gray-400 text-14">
                  <span>Hi, </span>
                  <span className="font-bold ml-1">Hossam</span>
                </p>
              </div>
            </TooltipComponent>

            {/* Theme Toggler */}
            <div className="ml-4">
              <ThemeToggler />
            </div>
          </div>

          {/* Conditional Rendering for Components */}
          {isClicked.cart && <Cart />}
          {isClicked.chat && <Chat />}
          {isClicked.notification && <Notification />}
          {isClicked.userProfile && <UserProfile />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
