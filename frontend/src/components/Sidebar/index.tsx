/*
 * Created Date: Tuesday, October 8th 2024, 1:57:24 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiShopware } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";
import { getFilteredLinks } from "public/data/navigationData";
import { useStateContext } from "@/contexts/ContextProvider";
import { useAuthContext } from "@/contexts/AuthContext";

interface LinkItem {
  name: string;
  path: string;
  icon: JSX.Element;
}

interface Category {
  title: string;
  links: LinkItem[];
}

const Sidebar = () => {
  const { activeMenu, setActiveMenu, screenSize, themeColor, navButton } = useStateContext();
  const { userData } = useAuthContext();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const storedActiveMenu = localStorage.getItem("activeMenu");
    if (storedActiveMenu !== null) {
      setActiveMenu(JSON.parse(storedActiveMenu));
    }
  }, [mounted, setActiveMenu]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("activeMenu", JSON.stringify(activeMenu));
    }
  }, [activeMenu, mounted]);

  const handleCloseSidebar = () => {
    if ((screenSize !== undefined && screenSize <= 900) || navButton) {
      setActiveMenu(false);
    }
  };

  if (!mounted) return null;

  const activeLink = "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2 transition-colors duration-200";
  const normalLink = "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2 transition-colors duration-200";

  const sidebarClasses = `
    w-72 fixed sidebar
    ${navButton ? 'top-0 h-screen' : 'top-16 h-[calc(100vh-64px)]'}
    ${activeMenu ? 'left-0' : '-left-72'}
    bg-white dark:bg-secondary-dark-bg
    transition-all duration-300 ease-in-out
    ${navButton ? 'z-[60]' : 'z-[10]'}
    backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95
    border-r border-gray-200 dark:border-gray-700
    shadow-lg
  `;

  const overlayClasses = `
    fixed inset-0 bg-black/50 dark:bg-black/70
    transition-opacity duration-300
    ${navButton && activeMenu ? 'opacity-100 z-[50]' : 'opacity-0 pointer-events-none -z-10'}
  `;

  // Get filtered navigation links based on user's staff status
  const filteredLinks = getFilteredLinks(userData?.is_staff || false);

  return (
    <>
      <div className={overlayClasses} onClick={handleCloseSidebar} />
      
      <div className={sidebarClasses}>
        <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
          {activeMenu && (
            <>
              <div className="flex justify-between items-center">
                <Link
                  href="/"
                  onClick={handleCloseSidebar}
                  className="items-center gap-3 ml-3 mt-4 flex text-xl font-extralight tracking-tight dark:text-white text-slate-900"
                >
                  <SiShopware /> <span>MAZU</span>
                </Link>

                <button
                  type="button"
                  onClick={handleCloseSidebar}
                  className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block"
                  title="Menu"
                >
                  <MdOutlineCancel />
                </button>
              </div>
              <div className="mt-10">
                {filteredLinks.map((category) => (
                  <div key={category.title}>
                    <p className="text-gray-400 m-3 mt-4 uppercase">{category.title}</p>
                    {category.links.map((link) => (
                      <Link
                        key={link.name}
                        href={`/${link.path}`}
                        onClick={handleCloseSidebar}
                        className={pathname === `/${link.path}` ? activeLink : normalLink}
                        style={pathname === `/${link.path}` ? { backgroundColor: themeColor } : {}}
                        title={link.name}
                      >
                        {link.icon}
                        <span className="capitalize">{link.name}</span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
