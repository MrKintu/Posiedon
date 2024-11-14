/*
 * Created Date: Tuesday, October 8th 2024, 3:41:42 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useStateContext } from "@/contexts/ContextProvider";
import { Header } from "@/components";
import { useState, useEffect } from "react";
import { LineChart } from "@/components";

const LineChartPage: React.FC = () => {
  const { activeMenu } = useStateContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true after the component is mounted in the client environment
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent rendering on the server side
  }

  return (
    <div className={activeMenu ? "md:ml-72" : "w-full flex-2"}>
      <div className="m-2 md:m-10 py-4 px-2 md:p-10 bg-white rounded-3xl dark:text-gray-200 dark:bg-secondary-dark-bg">
        <Header category={"Chart"} title={"Inflation Rate"} />
        <div className="w-full">
          <LineChart />
        </div>
      </div>
    </div>
  );
};

export default LineChartPage;
