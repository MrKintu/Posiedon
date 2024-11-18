/*
 * Created Date: Tuesday, October 8th 2024, 2:01:42 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStateContext } from "@/contexts/ContextProvider";
import { useAuthContext } from "@/contexts/AuthContext";
import { userProfileData } from "public/data/uiData";
import { SubHeading, Button } from "@/components";
import avatar from "public/data/avatar.jpg";
import { useRouter } from "next/navigation";
import { MdOutlineCancel } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { BsShield } from "react-icons/bs";

const iconComponents = {
  CgProfile,
  BsShield
};

const UserProfile: React.FC = () => {
  const { handleClosingClick } = useStateContext();
  const { userData, logout } = useAuthContext();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Ensure the component only renders on the client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    handleClosingClick("userProfile"); // Close the profile dropdown first
    await logout(); // Logout will handle the navigation
  };

  if (!isClient) return null; // Prevent rendering on the server side

  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-secondary-dark-bg p-8 rounded-lg w-96 shadow-2xl">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <button
          type="button"
          onClick={() => handleClosingClick("userProfile")}
          className="text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray rounded-full"
        >
          <MdOutlineCancel />
        </button>
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <Image
          src={avatar}
          alt="user-profile"
          className="rounded-full h-24 w-24"
        />
        <div>
          <p className="font-semibold text-xl dark:text-gray-200">
            {userData ? `${userData.first_name} ${userData.last_name}` : "Loading..."}
          </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            {userData?.is_staff ? "Administrator" : "Customer"}
          </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
            {userData?.email || "Loading..."}
          </p>
        </div>
      </div>
      <div>
        {userProfileData.map((item, index) => {
          const IconComponent = iconComponents[item.iconName as keyof typeof iconComponents];
          return (
            <Link key={index} href="/customers" className="block">
              <div className="flex gap-5 items-center p-3 border-b-1 border-color dark:border-gray-600 hover:bg-light-gray cursor-pointer dark:hover:bg-gray-500 rounded-lg">
                <div
                  className="rounded-lg w-12 h-12 flex justify-center items-center text-xl"
                  style={{ backgroundColor: item.iconBg, color: item.iconColor }}
                >
                  {IconComponent && <IconComponent />}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold dark:text-gray-200">{item.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {/* Logout Button */}
      <div className="mt-5">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
