/*
 * Created Date: Tuesday, October 8th 2024, 1:57:24 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiShopware } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { links } from "public/data/dummy";
import { useStateContext } from "@/contexts/ContextProvider";

interface LinkItem {
  name: string;
  icon: JSX.Element;
}

interface Category {
  title: string;
  links: LinkItem[];
}

const Sidebar: React.FC = () => {
  const { themeColor, activeMenu, setActiveMenu, screenSize, toggleMenu } = useStateContext();
  const [mounted, setMounted] = React.useState(false);

  // Set default Sidebar state to closed (false) regardless of screen size
  useEffect(() => {
    setActiveMenu(false);  // Ensure menu is closed by default
    setMounted(true);
  }, [setActiveMenu]);

  useEffect(() => {
    // Ensure sidebar is only opened manually and doesn't pop up on larger screens
    const storedActiveMenu = localStorage.getItem("activeMenu");
    if (storedActiveMenu !== null) {
      setActiveMenu(JSON.parse(storedActiveMenu));  // Load saved state
    }
  }, [setActiveMenu]);

  // Update localStorage whenever 'activeMenu' state changes
  useEffect(() => {
    localStorage.setItem("activeMenu", JSON.stringify(activeMenu));
  }, [activeMenu]);

  if (!mounted) return null;  // Avoid rendering before mounting

  // Close Sidebar on smaller screens or when manually closed
  const handleCloseSidebar = () => {
    if (screenSize <= 900 || activeMenu) {
      setActiveMenu(false);
    }
  };

  const activeLink = "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md m-2 text-white";
  const normalLink = "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2";

  const router = usePathname();

  return (
    <div className={activeMenu ? "w-72 fixed top-0 left-0 h-full sidebar dark:bg-secondary-dark-bg bg-white z-50" : "hidden"}>
      <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
        {activeMenu && (
          <>
            <div className="flex justify-between items-center">
              <button onClick={toggleMenu} className="items-center gap-3 ml-3 mt-4 flex text-xl font-extralight tracking-tight dark:text-white text-slate-900">
                -X-
              </button>
              <Link
                href="/"
                onClick={handleCloseSidebar}
                className="items-center gap-3 ml-3 mt-4 flex text-xl font-extralight tracking-tight dark:text-white text-slate-900"
              >
                <SiShopware /> <span>MAZU</span>
              </Link>

              <TooltipComponent content="Menu" position="BottomCenter">
                <button
                  type="button"
                  onClick={handleCloseSidebar}
                  className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
                >
                  <MdOutlineCancel />
                </button>
              </TooltipComponent>
            </div>
            <div className="mt-10">
              {links.map((category: Category) => (
                <div key={category.title}>
                  <p className="text-gray-400 m-3 mt-4 uppercase">{category.title}</p>
                  {category.links.map((link: LinkItem) => (
                    <Link
                      key={link.name}
                      href={`/${link.path}`}
                      onClick={handleCloseSidebar}
                      className={`${router === `/${link.path}` ? activeLink : normalLink}`}
                      style={router === `/${link.path}` ? { backgroundColor: themeColor } : {}}
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
  );
};

export default Sidebar;
