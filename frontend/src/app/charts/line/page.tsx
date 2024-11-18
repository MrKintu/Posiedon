/*
 * Created Date: Tuesday, October 8th 2024, 3:41:42 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useState } from 'react';
import { Header } from "@/components";
import LineChart from "@/components/Charts/LineChart";

const sampleData = [
  {
    name: 'Jan',
    visitors: 4000,
    clicks: 2400,
    conversions: 2400,
  },
  {
    name: 'Feb',
    visitors: 3000,
    clicks: 1398,
    conversions: 2210,
  },
  {
    name: 'Mar',
    visitors: 2000,
    clicks: 9800,
    conversions: 2290,
  },
  {
    name: 'Apr',
    visitors: 2780,
    clicks: 3908,
    conversions: 2000,
  },
  {
    name: 'May',
    visitors: 1890,
    clicks: 4800,
    conversions: 2181,
  },
  {
    name: 'Jun',
    visitors: 2390,
    clicks: 3800,
    conversions: 2500,
  },
  {
    name: 'Jul',
    visitors: 3490,
    clicks: 4300,
    conversions: 2100,
  },
];

export default function LineChartPage() {
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:bg-gray-800 rounded-3xl">
      <Header category="Chart" title="Website Analytics" />
      <div className="w-full h-[420px]">
        <LineChart
          data={sampleData}
          lines={[
            { dataKey: 'visitors', name: 'Visitors', color: '#8884d8' },
            { dataKey: 'clicks', name: 'Clicks', color: '#82ca9d' },
            { dataKey: 'conversions', name: 'Conversions', color: '#ffc658' },
          ]}
          xAxisDataKey="name"
          grid
        />
      </div>
    </div>
  );
}
