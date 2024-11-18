/*
 * Created Date: Tuesday, October 8th 2024, 1:44:38 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React from "react";
import { PieChart, Pie as RechartsPie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useStateContext } from "@/contexts/ContextProvider";

interface PieProps {
  id: string;
  data: Array<{
    x: string;
    y: number;
    color?: string;
  }>;
  legendVisibility?: boolean;
  height?: string;
}

const pieChartData = [
  { x: 'Labour', y: 18, text: '18%' },
  { x: 'Legal', y: 8, text: '8%' },
  { x: 'Production', y: 15, text: '15%' },
  { x: 'License', y: 11, text: '11%' },
  { x: 'Facilities', y: 18, text: '18%' },
  { x: 'Taxes', y: 14, text: '14%' },
  { x: 'Insurance', y: 16, text: '16%' },
];

const Pie: React.FC<PieProps> = ({ id, data = pieChartData, legendVisibility = true, height = "full" }) => {
  const { currentMode } = useStateContext();

  // Transform data for Recharts format
  const chartData = data.map(item => ({
    name: item.x,
    value: item.y,
    color: item.color,
  }));

  // Calculate total for percentage
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={`w-full ${height === "full" ? "h-full" : height}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <RechartsPie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="45%"
            outerRadius="80%"
            dataKey="value"
            labelLine={false}
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
              const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
              return percent > 0.05 ? (
                <text
                  x={x}
                  y={y}
                  fill={currentMode === "Dark" ? "#fff" : "#000"}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              ) : null;
            }}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                style={{
                  filter:
                    currentMode === "Dark"
                      ? "brightness(0.8)"
                      : "brightness(1)",
                }}
              />
            ))}
          </RechartsPie>
          {legendVisibility && (
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value: string) => (
                <span style={{ color: currentMode === "Dark" ? "#fff" : "#000" }}>
                  {value}
                </span>
              )}
            />
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: currentMode === "Dark" ? "#333" : "#fff",
              color: currentMode === "Dark" ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
            }}
            formatter={(value: number) => [`${((value / total) * 100).toFixed(1)}%`, ""]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Pie;
