/*
 * Created Date: Saturday, September 14th 2024, 2:14:37 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useState, useEffect } from "react";
import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";

const Features = () => {
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after the component mounts on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent rendering until client-side hydration is complete
  }

  return (
    <section id="features" className="py-16 md:py-20 lg:py-28 bg-white dark:bg-gray-dark transition-colors duration-200">
      <div className="container">
        <SectionTitle
          title="Main Features"
          paragraph="There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form."
          center
        />
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {featuresData.map((feature) => (
            <SingleFeature key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
