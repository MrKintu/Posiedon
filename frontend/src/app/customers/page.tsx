/*
 * Created Date: Tuesday, October 8th 2024, 4:04:41 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useEffect } from "react";
import { useStateContext } from "@/contexts/ContextProvider";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button, SparkLine, StackedChart } from "@/components";
import { earningData, SparklineAreaData, stackedChartData } from "public/data/chartData";
import { GoDotFill } from "react-icons/go";
import { useRouter } from "next/navigation";
import ApiClient from "@/utilities/api_client";

const Dashboard: React.FC = () => {
  const { activeMenu, themeColor } = useStateContext();
  const { isLoggedIn, userData, setAuthContext } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    const initializeDashboard = async () => {
      if (!isLoggedIn) {
        router.push("/sign-in");
        return;
      }

      if (!userData) {
        try {
          const userProfileResponse = await ApiClient.get("users/profile/");
          if (!userProfileResponse.error) {
            setAuthContext(prev => ({
              ...prev,
              userData: userProfileResponse
            }));
          } else {
            console.error("Failed to fetch user profile:", userProfileResponse.error);
            router.push("/sign-in");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          router.push("/sign-in");
        }
      }
    };

    initializeDashboard();
  }, [isLoggedIn, userData, router, setAuthContext]);

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-main-bg dark:bg-main-dark-bg transition-colors duration-200">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary dark:border-primary/80"></div>
      </div>
    );
  }

  return (
    <div className={`${activeMenu ? "md:ml-72" : "w-full flex-2"} bg-main-bg dark:bg-main-dark-bg transition-colors duration-200`}>
      <div className="flex flex-col justify-center">
        <div className="bg-white dark:bg-secondary-dark-bg h-44 rounded-xl w-[95%] mx-auto p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center transition-colors duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-400 dark:text-gray-300 transition-colors duration-200">
                {userData.first_name} {userData.last_name} Earnings
              </p>
              <p className="text-2xl font-bold mt-1 text-gray-700 dark:text-gray-100 transition-colors duration-200">
                $63,448.78
              </p>
            </div>
            <div className="mt-6">
              <Button color="white" text="Download" borderRadius="10px" size="md" />
            </div>
          </div>
        </div>
        <EarningSummary />
      </div>
      <RevenueUpdates themeColor={themeColor} />
    </div>
  );
};

interface EarningsCardProps {
  userData: {
    first_name?: string;
    last_name?: string;
    customer?: {
      business?: string;
    };
  };
}

const EarningSummary = () => (
  <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
    {earningData.map((item) => (
      <div
        key={item.title}
        className="bg-white dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl shadow-sm dark:shadow-none transition-all duration-200"
      >
        <button
          type="button"
          style={{ color: item.iconColor, backgroundColor: item.iconBg }}
          className="text-2xl opacity-[0.9] rounded-full p-4 hover:drop-shadow-xl transition-all duration-200"
        >
          {item.icon}
        </button>
        <p className="mt-3">
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-100 transition-colors duration-200">
            {item.amount}
          </span>
          <span className={`text-sm ${item.pcColor} ml-2 transition-colors duration-200`}>
            {item.percentage}
          </span>
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-300 mt-1 transition-colors duration-200">
          {item.title}
        </p>
      </div>
    ))}
  </div>
);

const RevenueUpdates: React.FC<{ themeColor: string }> = ({ themeColor }) => (
  <div className="flex gap-10 flex-wrap justify-center">
    <div className="bg-white dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780 shadow-sm dark:shadow-none transition-all duration-200">
      <div className="flex justify-between">
        <p className="font-semibold text-xl text-gray-700 dark:text-gray-100 transition-colors duration-200">
          Revenue Updates
        </p>
        <div className="flex items-center gap-4">
          <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:drop-shadow-xl transition-all duration-200">
            <span>
              <GoDotFill />
            </span>
            <span>Expense</span>
          </p>
          <p className="flex items-center gap-2 text-green-400 hover:drop-shadow-xl transition-all duration-200">
            <span>
              <GoDotFill />
            </span>
            <span>Budget</span>
          </p>
        </div>
      </div>
      <div className="mt-10 flex gap-10 flex-wrap justify-center">
        <RevenueDetails themeColor={themeColor} />
        <div className="flex-1 flex justify-center">
          <StackedChart data={stackedChartData} />
        </div>
      </div>
    </div>
  </div>
);

const RevenueDetails: React.FC<{ themeColor: string }> = ({ themeColor }) => (
  <div>
    <div>
      <p>
        <span className="text-3xl font-semibold text-gray-700 dark:text-gray-100 transition-colors duration-200">
          $93,438
        </span>
        <span className="p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 dark:bg-green-500 ml-3 text-xs transition-all duration-200">
          23%
        </span>
      </p>
      <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">Budget</p>
    </div>
    <div className="mt-8">
      <p>
        <span className="text-3xl font-semibold text-gray-700 dark:text-gray-100 transition-colors duration-200">
          $48,487
        </span>
      </p>
      <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">Expense</p>
    </div>

    <div className="mt-5">
      <SparkLine
        id="line-sparkline"
        type="Line"
        height="80px"
        width="250px"
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
