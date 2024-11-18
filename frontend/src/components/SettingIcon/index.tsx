/*
 * Created Date: Tuesday, October 8th 2024, 1:55:03 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useState, useEffect } from "react";
import { FiSettings } from "react-icons/fi";
import { useStateContext } from "@/contexts/ContextProvider";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

const SettingIcon: React.FC = () => {
  const { themeColor, setActiveThemeSettings, currentMode } = useStateContext();
  const [isClient, setIsClient] = useState(false); // For client-side rendering check

  // Ensure component runs only on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent rendering on the server side to address hydration issues
  if (!isClient) return null;

  return (
    <div className="fixed right-4 bottom-4 z-[1000]">
      <Tippy 
        content="Settings"
        placement="left"
        theme={currentMode === 'Dark' ? 'dark' : 'light'}
        className="shadow-lg"
      >
        <button
          type="button"
          onClick={() => setActiveThemeSettings(true)}
          className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray rounded-full bg-blue-600"
          style={{ background: themeColor }}
        >
          <FiSettings />
        </button>
      </Tippy>
    </div>
  );
};

export default SettingIcon;
