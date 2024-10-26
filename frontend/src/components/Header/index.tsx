/*
 * Created Date: Saturday, September 14th 2024, 2:14:37 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

import React from "react";

// Define the props interface
interface HeaderProps {
  category: string; // Type for category
  title: string;    // Type for title
}

const Header: React.FC<HeaderProps> = ({ category, title }) => {
  return (
    <div className="mb-10 ml-2 md:ml-0">
      <p className="text-gray-400">{category}</p>
      <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        {title}
      </p>
    </div>
  );
};

export default Header;
