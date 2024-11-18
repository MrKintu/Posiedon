/*
 * Created Date: Tuesday, October 8th 2024, 3:42:45 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useStateContext } from "@/contexts/ContextProvider";
import { Header } from "@/components";
import { useState, useEffect } from "react";
import PieChart from "@/components/Charts/PieChart";

const sampleData = [
  { name: 'Social Media', value: 400 },
  { name: 'Email Marketing', value: 300 },
  { name: 'Content Marketing', value: 300 },
  { name: 'SEO', value: 200 },
  { name: 'PPC', value: 150 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const PieChartPage: React.FC = () => {
  const { activeMenu, currentMode } = useStateContext();
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
        <Header category={"Pie"} title={"Project Cost Breakdown"} />
        <div className="w-full">
          <div className="w-full h-[420px]">
            <PieChart
              data={sampleData}
              dataKey="value"
              nameKey="name"
              colors={COLORS}
              innerRadius={60}
              outerRadius={140}
              label
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChartPage;
