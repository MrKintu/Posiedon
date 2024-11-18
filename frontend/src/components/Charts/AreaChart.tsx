'use client';

import React from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AreaConfig {
  dataKey: string;
  name: string;
  color: string;
}

interface AreaChartProps {
  data: any[];
  areas: AreaConfig[];
  xAxisDataKey: string;
  grid?: boolean;
  stacked?: boolean;
}

const AreaChart = ({
  data,
  areas,
  xAxisDataKey,
  grid = false,
  stacked = false
}: AreaChartProps) => {
  return (
    <div className="w-full h-[360px]">
      {areas.map((area, index) => (
        <h3 key={area.dataKey} className="text-xl font-semibold mb-4 dark:text-white">{area.name}</h3>
      ))}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {areas.map((area, index) => (
            <defs key={`gradient-${area.dataKey}`}>
              <linearGradient id={`color-${area.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={area.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={area.color} stopOpacity={0}/>
              </linearGradient>
            </defs>
          ))}
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
          {areas.map((area, index) => (
            <Area
              key={area.dataKey}
              type="monotone"
              dataKey={area.dataKey}
              name={area.name}
              stroke={area.color}
              fill={`url(#color-${area.dataKey})`}
              fillOpacity={0.3}
              strokeWidth={2}
              stackId={stacked ? "stack" : undefined}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChart;
