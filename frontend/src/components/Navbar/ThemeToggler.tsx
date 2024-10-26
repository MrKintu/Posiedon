/*
 * Created Date: Tuesday, October 8th 2024, 3:17:47 pm
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

import React from "react";
import { useStateContext } from "@/contexts/ContextProvider";

const ThemeToggler: React.FC = () => {
  const { currentMode, setMode, setActiveThemeSettings } = useStateContext();

  // Toggle between light and dark mode using the context
  const toggleTheme = () => {
    const newMode = currentMode === "dark" ? "light" : "dark";
    setMode(newMode);  // Pass the string directly
  };

  // Toggle the Theme Settings panel
  const openThemeSettings = () => {
    setActiveThemeSettings(true);  // Set the theme settings panel to active
  };

  return (
    <div className="flex items-center">
      {/* Toggle between light and dark theme */}
      <button onClick={toggleTheme} className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full">
        {currentMode === "dark" ? "🌙" : "☀️"}
      </button>

      {/* Button to open Theme Settings */}
      <button onClick={openThemeSettings} className="ml-4 p-2 bg-gray-200 dark:bg-gray-800 rounded-full">
        ⚙️
      </button>
    </div>
  );
};

export default ThemeToggler;
