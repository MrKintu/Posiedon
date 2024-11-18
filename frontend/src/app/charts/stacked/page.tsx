/*
 * Created Date: Tuesday, October 8th 2024, 3:44:47 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useState, useEffect } from "react";
import { useStateContext } from "@/contexts/ContextProvider";
import { Header } from "@/components";
import StackedChart from "@/components/Charts/StackedChart";

const sampleData = [
  { x: 'Jan', y: 111.1, y1: 76.9, y2: 66.1 },
  { x: 'Feb', y: 127.3, y1: 99.5, y2: 79.3 },
  { x: 'Mar', y: 143.4, y1: 121.7, y2: 91.3 },
  { x: 'Apr', y: 159.9, y1: 142.5, y2: 102.4 },
  { x: 'May', y: 159.9, y1: 142.5, y2: 102.4 },
  { x: 'Jun', y: 159.9, y1: 142.5, y2: 102.4 },
  { x: 'Jul', y: 150.9, y1: 132.5, y2: 92.4 },
];

const StackedChartPage: React.FC = () => {
  const { activeMenu } = useStateContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className={activeMenu ? "md:ml-72" : "w-full flex-2"}>
      <div className="m-2 md:m-10 py-4 px-2 md:p-10 bg-white rounded-3xl dark:text-gray-200 dark:bg-secondary-dark-bg">
        <Header category="Stacked" title="Revenue Breakdown" />
        <div className="w-full h-[420px]">
          <StackedChart data={sampleData} />
        </div>
      </div>
    </div>
  );
};

export default StackedChartPage;
