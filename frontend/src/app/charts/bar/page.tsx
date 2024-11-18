/*
 * Created Date: Tuesday, October 8th 2024, 3:24:34 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useStateContext } from "@/contexts/ContextProvider";
import { Header } from "@/components";
import BarChart from "@/components/Charts/BarChart";
import { useEffect, useState } from "react";

const sampleData = [
  {
    name: 'Q1',
    revenue: 4000,
    expenses: 2400,
    profit: 1600,
  },
  {
    name: 'Q2',
    revenue: 3000,
    expenses: 1398,
    profit: 1602,
  },
  {
    name: 'Q3',
    revenue: 2000,
    expenses: 980,
    profit: 1020,
  },
  {
    name: 'Q4',
    revenue: 2780,
    expenses: 1908,
    profit: 872,
  },
];

const BarChartPage: React.FC = () => {
  const { activeMenu, currentMode } = useStateContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensures component is rendered only on the client side
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent rendering on the server side
  }

  return (
    <div className={activeMenu ? "md:ml-72" : "w-full flex-2"}>
      <div className="m-2 md:m-10 py-4 px-2 md:p-10 bg-white rounded-3xl dark:text-gray-200 dark:bg-secondary-dark-bg">
        <Header category={"Bar"} title={"Quarterly Performance"} />
        <div className="w-full">
          <div className="w-full h-[420px]">
            <BarChart
              data={sampleData}
              bars={[
                { dataKey: 'revenue', name: 'Revenue', color: '#8884d8' },
                { dataKey: 'expenses', name: 'Expenses', color: '#82ca9d' },
                { dataKey: 'profit', name: 'Profit', color: '#ffc658' },
              ]}
              xAxisDataKey="name"
              grid
              layout="vertical"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChartPage;
