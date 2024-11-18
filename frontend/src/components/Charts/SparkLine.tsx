/*
 * Created Date: Tuesday, October 8th 2024, 1:45:19 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { useStateContext } from "@/contexts/ContextProvider";

interface SparkLineProps {
  id?: string;
  height?: string;
  width?: string;
  color?: string;
  data: Array<{
    x: number;
    yval: number;
  }>;
  type?: string;
  currentColor?: string;
}

const SparkLine: React.FC<SparkLineProps> = ({
  id,
  height = "80px",
  width = "250px",
  color = "#fff",
  data,
  type,
  currentColor,
}) => {
  const { currentMode } = useStateContext();

  // Transform data for Recharts format
  const chartData = data.map(item => ({
    x: item.x,
    value: item.yval,
  }));

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={currentColor || color}
            strokeWidth={2}
            dot={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: currentMode === "Dark" ? "#333" : "#fff",
              color: currentMode === "Dark" ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
            }}
            formatter={(value: number) => [value, ""]}
            labelFormatter={() => ""}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SparkLine;
