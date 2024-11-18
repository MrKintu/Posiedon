/*
 * Created Date: Tuesday, October 8th 2024, 3:17:47 pm
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useEffect, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { BsCheck } from "react-icons/bs";
import { useStateContext } from "@/contexts/ContextProvider";
import { themeColors, type ThemeColor } from "@/data/dummy";
import { useTheme } from 'next-themes';

const ThemeSettings: React.FC = () => {
  const { 
    themeColor, 
    setColor, 
    activeThemeSettings, 
    setActiveThemeSettings,
  } = useStateContext();
  const { theme, setTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !activeThemeSettings) return null;

  return (
    <div className="fixed nav-item top-0 right-0 w-screen h-screen bg-half-transparent">
      <div className="float-right h-screen dark:text-gray-200 bg-white dark:bg-secondary-dark-bg w-400">
        <div className="flex justify-between items-center p-4 ml-4">
          <p className="font-semibold text-lg">Settings</p>
          <button
            type="button"
            onClick={() => setActiveThemeSettings(false)}
            className="text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray"
          >
            <MdOutlineCancel />
          </button>
        </div>
        <div className="flex-col border-t-1 border-color p-4 ml-4">
          <p className="font-semibold text-xl">Theme Mode</p>
          <div className="mt-4">
            <input
              type="radio"
              id="light"
              name="theme"
              value="light"
              className="cursor-pointer"
              onChange={() => setTheme('light')}
              checked={theme === 'light'}
            />
            <label htmlFor="light" className="ml-2 cursor-pointer">
              Light
            </label>
          </div>
          <div className="mt-2">
            <input
              type="radio"
              id="dark"
              name="theme"
              value="dark"
              className="cursor-pointer"
              onChange={() => setTheme('dark')}
              checked={theme === 'dark'}
            />
            <label htmlFor="dark" className="ml-2 cursor-pointer">
              Dark
            </label>
          </div>
        </div>
        <div className="p-4 border-t-1 border-color ml-4">
          <p className="font-semibold text-xl">Theme Colors</p>
          <div className="flex gap-3 mt-4">
            {themeColors.map((item: ThemeColor) => (
              <button
                key={item.name}
                type="button"
                className="h-10 w-10 rounded-full cursor-pointer flex items-center justify-center"
                style={{ backgroundColor: item.color }}
                onClick={() => setColor(item.color)}
              >
                {item.color === themeColor && (
                  <BsCheck className="text-2xl text-white" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
