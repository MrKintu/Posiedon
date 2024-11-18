/*
 * Created Date: Tuesday, October 8th 2024, 1:47:10 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useStateContext } from '@/contexts/ContextProvider';

interface StackedChartProps {
  data: Array<{
    x: string;
    y: number;
    y1: number;
    y2: number;
  }>;
  width?: string | number;
  height?: string | number;
}

const StackedChart = ({ data, width = "100%", height = "100%" }: StackedChartProps) => {
  const { currentMode } = useStateContext();

  const colors = {
    y: '#00bdae',
    y1: '#404041',
    y2: '#357cd2'
  };

  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          className="dark:stroke-gray-600"
        />
        <XAxis
          dataKey="x"
          className="dark:text-gray-300"
          tick={{ fontSize: 12 }}
        />
        <YAxis
          className="dark:text-gray-300"
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: currentMode === 'Dark' ? '#333' : '#fff',
            color: currentMode === 'Dark' ? '#fff' : '#000',
            border: 'none',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        />
        <Legend
          wrapperStyle={{
            color: currentMode === 'Dark' ? '#fff' : '#000',
          }}
        />
        <Bar
          dataKey="y"
          stackId="a"
          fill={colors.y}
          name="Budget"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="y1"
          stackId="a"
          fill={colors.y1}
          name="Expense"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="y2"
          stackId="a"
          fill={colors.y2}
          name="Revenue"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StackedChart;
