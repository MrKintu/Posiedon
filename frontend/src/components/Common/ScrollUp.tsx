/*
 * Created Date: Saturday, September 14th 2024, 2:14:37 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useEffect, useState } from "react";

export default function ScrollUp() {
  const [isClient, setIsClient] = useState(false);

  // Set the client flag after the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only execute scroll logic on the client
  useEffect(() => {
    if (isClient) {
      window.document.scrollingElement?.scrollTo(0, 0);
    }
  }, [isClient]);

  return null;
}
