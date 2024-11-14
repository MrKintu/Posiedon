/*
 * Created Date: Tuesday, October 8th 2024, 1:44:38 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useEffect, useState } from "react";

const Pie: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Only set to true on the client side
  }, []);

  if (!isClient) return null; // Prevent rendering on the server side

  return (
    <div>Pie</div>
  );
};

export default Pie;
