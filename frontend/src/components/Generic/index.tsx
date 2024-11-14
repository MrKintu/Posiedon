/*
 * Created Date: Saturday, September 14th 2024, 2:14:37 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useEffect, useState } from "react";
import SectionTitle from "../Common/SectionTitle";
import SingleBlog from "./SingleGeneric";
import blogData from "./genericData";

const Generic = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set state to true when client-side rendering
    setIsClient(true);
  }, []);

  // Return a loading state or null during SSR to avoid hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <section
      id="blog"
      className="bg-gray-light dark:bg-bg-color-dark py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <SectionTitle
          title="Our Latest Blogs"
          paragraph="There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form."
          center
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {blogData.map((generic) => (
            <div key={generic.id} className="w-full">
              <SingleBlog generic={generic} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Generic;
