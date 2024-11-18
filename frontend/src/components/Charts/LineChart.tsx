/*
 * Created Date: Tuesday, October 8th 2024, 1:39:25 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

'use client';

import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface LineConfig {
  dataKey: string;
  name: string;
  color: string;
}

interface LineChartProps {
  data: any[];
  lines: LineConfig[];
  xAxisDataKey: string;
  grid?: boolean;
}

const lineChartData = [
  { x: new Date(2005, 0, 1), y1: 21, y2: 15 },
  { x: new Date(2006, 0, 1), y1: 24, y2: 18 },
  { x: new Date(2007, 0, 1), y1: 36, y2: 22 },
  { x: new Date(2008, 0, 1), y1: 38, y2: 25 },
  { x: new Date(2009, 0, 1), y1: 54, y2: 30 },
  { x: new Date(2010, 0, 1), y1: 57, y2: 32 },
];

const lineChartLines = [
  { dataKey: 'y1', name: 'Line 1', color: '#00bdae' },
  { dataKey: 'y2', name: 'Line 2', color: '#ff69b4' },
];

const LineChart = ({ data = lineChartData, lines = lineChartLines, xAxisDataKey = 'x', grid = false }: LineChartProps) => {
  return (
    <div className="w-full h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {grid && <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-600" />}
          <XAxis
            dataKey={xAxisDataKey}
            className="dark:text-gray-300"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            className="dark:text-gray-300"
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
          <Legend />
          {lines.map((lineConfig, index) => (
            <Line
              key={lineConfig.dataKey}
              type="monotone"
              dataKey={lineConfig.dataKey}
              name={lineConfig.name}
              stroke={lineConfig.color}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
