/*
 * Created Date: Tuesday, October 8th 2024, 3:17:47 pm
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useEffect, useState } from "react";
import { useStateContext } from "@/contexts/ContextProvider";
import { FiSettings } from "react-icons/fi";
import { BsSun, BsMoon } from "react-icons/bs";
import { useTheme } from 'next-themes';

const ThemeToggler: React.FC = () => {
  const { themeColor, setActiveThemeSettings } = useStateContext();
  const [isClient, setIsClient] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsClient(true);
  }, [theme]);

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  if (!isClient) return null;

  return (
    <div className="flex items-center gap-2">
      {/* Theme Mode Toggle */}
      <button 
        onClick={handleThemeToggle}
        className="p-2 rounded-full hover:bg-light-gray dark:hover:bg-secondary-dark-bg transition-colors duration-200"
        title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {theme === 'dark' ? (
          <BsSun className="text-lg text-yellow-500" />
        ) : (
          <BsMoon className="text-lg text-blue-700" />
        )}
      </button>

      {/* Theme Settings Button */}
      <button 
        onClick={() => setActiveThemeSettings(true)}
        className="p-2 rounded-full hover:bg-light-gray dark:hover:bg-secondary-dark-bg transition-colors duration-200"
        style={{ color: themeColor }}
        title="Theme Settings"
      >
        <FiSettings className="text-lg" />
      </button>
    </div>
  );
};

export default ThemeToggler;
