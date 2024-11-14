/*
 * Created Date: Tuesday, October 8th 2024, 4:04:41 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useEffect, useState } from "react";
import { useStateContext } from "@/contexts/ContextProvider";
import { Button, SparkLine, StackedChart } from "@/components";
import { earningData, SparklineAreaData } from "public/data/dummy";
import { GoDotFill } from "react-icons/go";

interface DashboardProps {
  params: Promise<{
    username: string;
  }>;
}

const Dashboard: React.FC<DashboardProps> = ({ params }) => {
  const [username, setUsername] = useState<string | null>(null);
  const { activeMenu, themeColor } = useStateContext();

  useEffect(() => {
    // Unwrap the params asynchronously on the client side
    params.then((resolvedParams) => {
      setUsername(resolvedParams.username);
    });
  }, [params]);

  // Show a loading indicator if the username isn't yet set
  if (!username) {
    return <div>Loading...</div>;
  }

  return (
    <div className={activeMenu ? "md:ml-72" : "w-full flex-2"}>
      <div className="flex flex-col justify-center">
        <EarningsCard username={username} />
        <EarningSummary />
      </div>
      <RevenueUpdates themeColor={themeColor} />
    </div>
  );
};

const EarningsCard: React.FC<{ username: string }> = ({ username }) => (
  <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-[95%] mx-auto p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
    <div className="flex justify-between items-center">
      <div>
        <p className="font-bold text-gray-400">{username} Earnings</p>
        <p className="text-2xl">$63,448.78</p>
      </div>
    </div>
    <div className="mt-6">
      <Button color="white" text="Download" borderRadius="10px" size="md" />
    </div>
  </div>
);

const EarningSummary: React.FC = () => (
  <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
    {earningData.map((item) => (
      <div
        key={item.title}
        className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg min-w-[140px] md:w-56 p-4 pt-9 rounded-2xl"
      >
        <button
          type="button"
          style={{ color: item.iconColor, backgroundColor: item.iconBg }}
          className="text-2xl opacity-[0.9] rounded-full p-4 hover:drop-shadow-xl"
        >
          {item.icon}
        </button>
        <p className="mt-3">
          <span className="text-lg font-semibold">{item.amount}</span>
          <span className={`text-sm ${item.pcColor} ml-2`}>{item.percentage}</span>
        </p>
        <p className="text-sm text-gray-400 mt-1">{item.title}</p>
      </div>
    ))}
  </div>
);

const RevenueUpdates: React.FC<{ themeColor: string }> = ({ themeColor }) => (
  <div className="flex gap-10 flex-wrap justify-center">
    <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-6 rounded-2xl md:w-780">
      <div className="flex justify-between">
        <p className="font-semibold text-xl">Revenue Updates</p>
        <div className="flex items-center gap-4">
          <Legend label="Expense" color="text-gray-400" />
          <Legend label="Budget" color="text-green-400" />
        </div>
      </div>

      <div className="mt-10 flex gap-10 flex-col lg:flex-row justify-center">
        <RevenueDetails themeColor={themeColor} />
        <div className="flex-1 flex justify-center">
          <StackedChart width="320px" height="360px" />
        </div>
      </div>
    </div>
  </div>
);

const Legend: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <p className={`flex items-center gap-2 ${color} hover:drop-shadow-xl`}>
    <GoDotFill />
    <span>{label}</span>
  </p>
);

const RevenueDetails: React.FC<{ themeColor: string }> = ({ themeColor }) => (
  <div className="border-r-1 border-color m-4 flex-grow shrink-0">
    <div>
      <p>
        <span className="text-3xl font-semibold">$93,438</span>
        <span className="p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs">
          23%
        </span>
      </p>
      <p className="text-gray-400 mt-1">Budget</p>
    </div>

    <div className="mt-8">
      <p>
        <span className="text-3xl font-semibold">$48,438</span>
      </p>
      <p className="text-gray-400 mt-1">Expense</p>
    </div>

    <div className="mt-5 spark h-20">
      <SparkLine
        currentColor="blue"
        id="sparkline"
        type="Line"
        height="80px"
        width="80%"
        data={SparklineAreaData}
        color={themeColor}
      />
    </div>

    <div className="mt-10">
      <Button
        color="white"
        text="Download Report"
        borderRadius="10px"
        size="md"
      />
    </div>
  </div>
);

export default Dashboard;
