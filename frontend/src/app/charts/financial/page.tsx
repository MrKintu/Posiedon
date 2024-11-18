/*
 * Created Date: Tuesday, October 8th 2024, 3:40:52 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useStateContext } from "@/contexts/ContextProvider";
import { Header } from "@/components";
import { useEffect, useState } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { financialChartData } from "public/data/chartConfigs";

const FinancialPage: React.FC = () => {
  const { activeMenu, currentMode } = useStateContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Transform data for Recharts format
  const chartData = financialChartData.map(item => ({
    date: new Date(item.x).toLocaleDateString(),
    low: item.low,
    high: item.high,
    open: item.open,
    close: item.close,
    volume: item.volume,
  }));

  return (
    <div className={activeMenu ? "md:ml-72" : "w-full flex-2"}>
      <div className="m-2 md:m-10 py-4 px-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
        <Header category={"Financial"} title={"APPLE Historical"} />
        <div className="w-full">
          <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
            <Header category="Chart" title="Financial Chart" />
            <div className="w-full h-[600px] mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
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
                    stroke={currentMode === 'Dark' ? '#404040' : '#e0e0e0'} 
                  />
                  <XAxis 
                    dataKey="date"
                    stroke={currentMode === 'Dark' ? '#fff' : '#000'}
                    style={{
                      fontSize: '12px',
                      fontFamily: 'sans-serif',
                    }}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke={currentMode === 'Dark' ? '#fff' : '#000'}
                    style={{
                      fontSize: '12px',
                      fontFamily: 'sans-serif',
                    }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke={currentMode === 'Dark' ? '#fff' : '#000'}
                    style={{
                      fontSize: '12px',
                      fontFamily: 'sans-serif',
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: currentMode === 'Dark' ? '#333' : '#fff',
                      color: currentMode === 'Dark' ? '#fff' : '#000',
                      border: 'none',
                      borderRadius: '4px',
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      color: currentMode === 'Dark' ? '#fff' : '#000',
                    }}
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="volume" 
                    fill="#8884d8" 
                    opacity={0.3}
                    name="Volume"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="high"
                    stroke="#4CAF50"
                    name="High"
                    dot={false}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="low"
                    stroke="#F44336"
                    name="Low"
                    dot={false}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="open"
                    stroke="#2196F3"
                    name="Open"
                    dot={false}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="close"
                    stroke="#FF9800"
                    name="Close"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialPage;