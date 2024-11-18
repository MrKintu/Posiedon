'use client';

import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface BarConfig {
  dataKey: string;
  name: string;
  color: string;
}

interface BarChartProps {
  data: any[];
  bars: BarConfig[];
  xAxisDataKey: string;
  grid?: boolean;
  layout?: 'horizontal' | 'vertical';
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  bars,
  xAxisDataKey,
  grid = false,
  layout = 'horizontal'
}) => {
  return (
    <div className="w-full h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout={layout}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {grid && <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-600" />}
          <XAxis
            type={layout === 'vertical' ? 'number' : 'category'}
            dataKey={layout === 'vertical' ? undefined : xAxisDataKey}
            className="dark:text-gray-300"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            type={layout === 'vertical' ? 'category' : 'number'}
            dataKey={layout === 'vertical' ? xAxisDataKey : undefined}
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
          {bars.map((bar) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={bar.color}
              barSize={20}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
