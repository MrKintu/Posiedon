/*
 * Created Date: Tuesday, October 8th 2024, 1:45:57 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useStateContext } from '@/contexts/ContextProvider';

interface StackedProps {
  width?: string;
  height?: string;
}

const Stacked: React.FC<StackedProps> = ({ width = '100%', height = '420px' }) => {
  const { currentMode } = useStateContext();
  
  // Sample data - replace with your actual data
  const data = [
    { month: 'Jan', Budget: 2400, Expense: 1398 },
    { month: 'Feb', Budget: 1398, Expense: 2800 },
    { month: 'Mar', Budget: 9800, Expense: 2800 },
    { month: 'Apr', Budget: 3908, Expense: 2800 },
    { month: 'May', Budget: 4800, Expense: 2800 },
    { month: 'Jun', Budget: 3800, Expense: 2800 },
    { month: 'Jul', Budget: 4300, Expense: 2800 },
  ];

  return (
    <div style={{ width, height }} className="rounded-lg bg-white dark:bg-secondary-dark-bg p-4">
      <ResponsiveContainer width="100%" height="100%">
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
            className="stroke-gray-200 dark:stroke-gray-600"
          />
          <XAxis
            dataKey="month"
            className="text-gray-600 dark:text-gray-400"
          />
          <YAxis
            className="text-gray-600 dark:text-gray-400"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: currentMode === 'Dark' ? '#33373E' : '#fff',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              color: currentMode === 'Dark' ? '#fff' : '#333',
            }}
          />
          <Legend />
          <Bar
            dataKey="Budget"
            stackId="a"
            fill="#00bdae"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="Expense"
            stackId="a"
            fill="#404041"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Stacked;
