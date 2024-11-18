/*
 * Created Date: Tuesday, October 8th 2024, 3:19:21 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useState, useEffect } from "react";
import { useStateContext } from "@/contexts/ContextProvider";
import { Header } from "@/components";
import { ColorPicker } from "@/components/ColorPicker";

const ColorPickerPage: React.FC = () => {
  const { activeMenu } = useStateContext();
  const [isClient, setIsClient] = useState(false);
  const [color, setColor] = useState("#1a97f5");

  // Set isClient to true once the component is mounted on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent rendering until the component is mounted on the client
  if (!isClient) {
    return null;
  }

  return (
    <div className={activeMenu ? "md:ml-72" : "w-full flex-2"}>
      <div className="m-2 md:m-10 py-4 px-2 md:p-10 bg-white rounded-3xl dark:text-gray-200 dark:bg-secondary-dark-bg">
        <Header category={"App"} title={"Color Picker"} />
        <div className="text-center">
          <div className="flex flex-col items-center gap-10">
            <div className="w-full max-w-md">
              <ColorPicker
                color={color}
                onChange={setColor}
                label="Choose primary color"
              />
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Preview
              </p>
              <div 
                className="w-full h-32 rounded-lg shadow-md transition-all duration-300"
                style={{ backgroundColor: color }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPickerPage;
