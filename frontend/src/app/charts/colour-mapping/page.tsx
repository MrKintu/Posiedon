/*
 * Created Date: Tuesday, October 8th 2024, 3:39:32 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useStateContext } from "@/contexts/ContextProvider";
import { Header } from "@/components";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { colorMappingData } from "public/data/chartConfigs";

const getColor = (temp: number) => {
  if (temp < 0) return "#4575b4"; // Very cold - blue
  if (temp < 10) return "#74add1"; // Cold - light blue
  if (temp < 20) return "#abd9e9"; // Cool - very light blue
  if (temp < 30) return "#fee090"; // Warm - light orange
  if (temp < 40) return "#fdae61"; // Hot - orange
  return "#d73027"; // Very hot - red
};

const ColorMappingPage: React.FC = () => {
  const { activeMenu, currentMode } = useStateContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Transform data for Recharts format
  const chartData = colorMappingData.map((item) => ({
    date: new Date(item.x).toLocaleDateString("default", { month: "short" }),
    temp: item.y,
  }));

  return (
    <div className={activeMenu ? "md:ml-72" : "w-full flex-2"}>
      <div className="m-2 md:m-10 py-4 px-2 md:p-10 bg-white rounded-3xl dark:text-gray-200 dark:bg-secondary-dark-bg">
        <Header category={"Color Mapping"} title={"USA CLIMATE - WEATHER BY MONTH"} />
        <div className="w-full">
          <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
            <Header category="Chart" title="Temperature Color Mapping" />
            <div className="w-full h-[500px] mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={currentMode === "Dark" ? "#404040" : "#e0e0e0"}
                  />
                  <XAxis
                    dataKey="date"
                    stroke={currentMode === "Dark" ? "#fff" : "#000"}
                    style={{
                      fontSize: "12px",
                      fontFamily: "sans-serif",
                    }}
                  />
                  <YAxis
                    stroke={currentMode === "Dark" ? "#fff" : "#000"}
                    style={{
                      fontSize: "12px",
                      fontFamily: "sans-serif",
                    }}
                    label={{
                      value: "Temperature (°C)",
                      angle: -90,
                      position: "insideLeft",
                      style: {
                        fill: currentMode === "Dark" ? "#fff" : "#000",
                      },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: currentMode === "Dark" ? "#333" : "#fff",
                      color: currentMode === "Dark" ? "#fff" : "#000",
                      border: "none",
                      borderRadius: "4px",
                    }}
                    formatter={(value: number) => [`${value}°C`, "Temperature"]}
                  />
                  <Legend
                    wrapperStyle={{
                      color: currentMode === "Dark" ? "#fff" : "#000",
                    }}
                  />
                  <Bar dataKey="temp" name="Temperature">
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getColor(entry.temp)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 flex justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4"
                  style={{ backgroundColor: "#4575b4" }}
                ></div>
                <span
                  className={currentMode === "Dark" ? "text-white" : "text-black"}
                >
                  {"< 0°C"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4"
                  style={{ backgroundColor: "#74add1" }}
                ></div>
                <span
                  className={currentMode === "Dark" ? "text-white" : "text-black"}
                >
                  {"0-10°C"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4"
                  style={{ backgroundColor: "#abd9e9" }}
                ></div>
                <span
                  className={currentMode === "Dark" ? "text-white" : "text-black"}
                >
                  {"10-20°C"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4"
                  style={{ backgroundColor: "#fee090" }}
                ></div>
                <span
                  className={currentMode === "Dark" ? "text-white" : "text-black"}
                >
                  {"20-30°C"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4"
                  style={{ backgroundColor: "#fdae61" }}
                ></div>
                <span
                  className={currentMode === "Dark" ? "text-white" : "text-black"}
                >
                  {"30-40°C"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4"
                  style={{ backgroundColor: "#d73027" }}
                ></div>
                <span
                  className={currentMode === "Dark" ? "text-white" : "text-black"}
                >
                  {"> 40°C"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorMappingPage;
