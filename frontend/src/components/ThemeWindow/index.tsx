/*
 * Created Date: Friday, October 11th 2024, 7:23:54 pm
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useState, useEffect } from "react";
import ThemeSettings from "@/components/ThemeSettings";
import { useStateContext } from "@/contexts/ContextProvider";

const ThemeWindow: React.FC = () => {
  const { activeThemeSettings } = useStateContext();
  const [isClient, setIsClient] = useState(false);

  // Ensure that the component renders only on the client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Prevent rendering on the server side

  return (
    <>
      {activeThemeSettings && <ThemeSettings />}
    </>
  );
};

export default ThemeWindow;
