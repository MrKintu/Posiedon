/*
 * Created Date: Tuesday, October 8th 2024, 1:54:11 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useStateContext } from "@/contexts/ContextProvider";
import { notificationData } from "public/data/uiData";
import { SubHeading, Button } from "@/components";
import { CgProfile } from "react-icons/cg";

const Notification: React.FC = () => {
  const { handleClosingClick } = useStateContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="nav-item absolute top-16 right-5 md:right-40 bg-white dark:bg-secondary-dark-bg p-8 rounded-lg w-96">
      <SubHeading
        text="Notifications"
        secText="3 New"
        func={() => handleClosingClick("notification")}
      />

      <div className="mt-5">
        {notificationData.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-600 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
          >
            {item.image ? (
              <div className="relative w-10 h-10">
                <Image
                  src={item.image}
                  alt={item.message}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <CgProfile className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </div>
            )}
            <div>
              <p className="font-semibold dark:text-gray-200">
                {item.message}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Button
        text="See all notifications"
        // color="bg-white"
        color="text-gray-700"
        borderRadius="rounded-lg"
        classes="mt-5 border border-gray-300 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700" 
        size={"md"}      />
    </div>
  );
};

export default Notification;
