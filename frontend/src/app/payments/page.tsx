/*
 * Created Date: Friday, October 11th 2024, 3:02:06 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client"

import { useEffect, useState } from "react";
import SingleGen from "@/components/Generic/SingleGeneric";
import GenericData from "@/components/Generic/genericData";
import Breadcrumb from "@/components/Common/Breadcrumb";

const Pagination = () => (
  <div className="-mx-4 flex flex-wrap" data-wow-delay=".15s">
    <div className="w-full px-4">
      <ul className="flex items-center justify-center pt-8">
        <PaginationButton label="Prev" />
        <PaginationButton label="1" />
        <PaginationButton label="2" />
        <PaginationButton label="3" />
        <li className="mx-1">
          <span className="flex h-9 min-w-[36px] cursor-not-allowed items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color">
            ...
          </span>
        </li>
        <PaginationButton label="12" />
        <PaginationButton label="Next" />
      </ul>
    </div>
  </div>
);

const PaginationButton = ({ label }: { label: string }) => (
  <li className="mx-1">
    <a
      href="#0"
      className="flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition hover:bg-primary hover:bg-opacity-100 hover:text-white"
    >
      {label}
    </a>
  </li>
);

const NewGeneric = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true only on the client side
    setIsClient(true);
  }, []);

  // Prevent hydration issues by rendering content only when on the client side
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

          <Pagination />
        </div>
      </section>
    </>
  );
};

export default NewGeneric;
