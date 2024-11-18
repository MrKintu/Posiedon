/*
 * Created Date: Tuesday, October 8th 2024, 1:48:58 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useStateContext } from "@/contexts/ContextProvider";
import { chatData } from "public/data/uiData";
import { SubHeading, Button } from "@/components";
import { CgProfile } from "react-icons/cg";

const Chat: React.FC = () => {
  const { handleClosingClick } = useStateContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true after the component is mounted on the client side
  }, []);

  if (!isClient) return null; // Prevent rendering during SSR

  return (
    <div className="nav-item bg-white dark:bg-secondary-dark-bg absolute top-16 right-0 md:right-52 w-full md:w-96 rounded-lg p-8">
      <SubHeading
        text={"Messages"}
        secText={"5 New"}
        func={() => handleClosingClick("chat")}
      />
      <div>
        {chatData.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-600 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
          >
            <div className="relative w-10 h-10">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.message}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <CgProfile className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold dark:text-gray-200">
                {item.message}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {item.time}
                </p>
                {!item.isRead && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button
        color={"white"}
        text={"See all messages"}
        borderRadius={"10px"}
        size={"md"}
        classes="w-full mt-5"
        func={() => handleClosingClick("chat")}
      />
    </div>
  );
};

export default Chat;
