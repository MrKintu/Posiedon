/*
 * Created Date: Tuesday, October 8th 2024, 3:43:44 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

'use client';

import { useState, useEffect } from 'react';
import { useStateContext } from '@/contexts/ContextProvider';
import { Header } from '@/components';
import {
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  Cell
} from 'recharts';
import { PyramidData } from 'public/data/chartData';

const PyramidChartPage: React.FC = () => {
  const { activeMenu, currentMode } = useStateContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Transform data for Recharts format and sort by value
  const chartData = [...PyramidData]
    .sort((a, b) => b.value - a.value)
    .map(item => ({
      name: item.x,
      value: item.y,
      color: item.color,
    }));

  const colors = [
    '#00C49F',
    '#00A7B3',
    '#0088B3',
    '#0069B3',
    '#004AB3',
    '#002CB3',
  ];

  return (
    <div className={activeMenu ? "md:ml-72" : "w-full flex-2"}>
      <div className="m-2 md:m-10 py-4 px-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
        <Header category="Chart" title="Food Comparison Chart" />
        <div className="w-full h-[600px] mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: currentMode === 'Dark' ? '#333' : '#fff',
                  color: currentMode === 'Dark' ? '#fff' : '#000',
                  border: 'none',
                  borderRadius: '4px',
                }}
                formatter={(value: number) => [`${value}%`, 'Percentage']}
              />
              <Funnel
                data={chartData}
                dataKey="value"
                nameKey="name"
                labelLine={false}
              >
                <LabelList
                  position="right"
                  fill={currentMode === 'Dark' ? '#fff' : '#000'}
                  stroke="none"
                  dataKey="name"
                  fontSize={12}
                />
                <LabelList
                  position="center"
                  fill="#fff"
                  stroke="none"
                  dataKey="value"
                  formatter={(value: number) => `${value}%`}
                  fontSize={12}
                />
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || colors[index % colors.length]}
                  />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-8 flex justify-center gap-6 flex-wrap">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-4 h-4"
                style={{ backgroundColor: item.color || colors[index % colors.length] }}
              ></div>
              <span className={currentMode === 'Dark' ? 'text-white' : 'text-black'}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PyramidChartPage;
