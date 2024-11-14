/*
 * Created Date: Saturday, October 26th 2024, 3:25:37 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useState, useEffect } from "react";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [isClient, setIsClient] = useState(false); // For client-side rendering check

  // Set isClient to true when the component has mounted on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent rendering on the server side to address hydration issues
  if (!isClient) return null;

  return (
    <div className="flex items-center p-4">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-grow rounded-sm border px-4 py-2 text-sm"
      />
      {/* Search Button */}
      <button className="ml-2 p-2 bg-blue-600 text-white rounded-sm flex items-center justify-center">
        {/* Arrow Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;
