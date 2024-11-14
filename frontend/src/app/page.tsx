/*
 * Created Date: Saturday, September 14th 2024, 2:14:37 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useEffect, useState } from "react";
import Brands from "@/components/Brands";
import ScrollUp from "@/components/Common/ScrollUp";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Video from "@/components/Video";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  // Set the client flag after the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent rendering of components until after mounting on the client
  if (!isClient) {
    return null;
  }

  return (
    <>
      <ScrollUp />
      <Hero />
      <Features />
      <Video />
      <Brands />
      <Testimonials />
      <Pricing />
    </>
  );
}
