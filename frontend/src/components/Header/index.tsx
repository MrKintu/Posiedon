/*
 * Created Date: Saturday, September 14th 2024, 2:14:37 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useState, useEffect } from "react";

// Define the props interface
interface HeaderProps {
  category: string; // Type for category
  title: string;    // Type for title
  subheadingClass?: string;  // Optional class for subheading
  titleClass?: string;      // Optional class for title
}

const Header: React.FC<HeaderProps> = ({ category, title, subheadingClass = "text-gray-400", titleClass = "text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white" }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true after component mounts
    setIsClient(true);
  }, []);

  // Only render the content once it's safe (on the client side)
  if (!isClient) {
    return null;
  }

  return (
    <div className="mb-10 ml-2 md:ml-0">
      <p className={`${subheadingClass}`}>{category}</p>
      <p className={`${titleClass}`}>{title}</p>
    </div>
  );
};

export default Header;
