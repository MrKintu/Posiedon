/*
 * Created Date: Tuesday, October 8th 2024, 1:48:07 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useEffect, useState } from 'react';

const ChartsHeader: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true after the component is mounted on the client side
  }, []);

  if (!isClient) return null; // Prevent rendering during SSR

  return (
    <div>ChartsHeader</div>
  );
};

export default ChartsHeader;
