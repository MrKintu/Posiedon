/*
 * Created Date: Saturday, September 14th 2024, 2:14:37 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client"

import { useEffect, useState } from "react";
import SingleGen from "@/components/Generic/SingleGeneric";
import GenericData from "@/components/Generic/genericData";
import Breadcrumb from "@/components/Common/Breadcrumb";

const NewGeneric = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure that the code only runs on the client side
    setIsClient(true);
  }, []);

  // Hydration fix: only render the component when it's on the client side
  if (!isClient) return null;

  return (
    <>
      <Breadcrumb
        pageName="Products Page"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius eros eget sapien consectetur ultrices. Ut quis dapibus libero."
      />

      <section className="pb-[120px] pt-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            {GenericData.map((generic) => (
              <div
                key={generic.id}
                className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
              >
                <SingleGen generic={generic} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default NewGeneric;
