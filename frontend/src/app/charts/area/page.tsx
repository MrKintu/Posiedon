/*
 * Created Date: Tuesday, October 8th 2024, 3:22:20 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

'use client';

import React from 'react';
import { Header } from "@/components";
import AreaChart from "@/components/Charts/AreaChart";

const sampleData = [
  {
    name: 'Jan',
    organic: 4000,
    paid: 2400,
    referral: 1800,
  },
  {
    name: 'Feb',
    organic: 3000,
    paid: 1398,
    referral: 2100,
  },
  {
    name: 'Mar',
    organic: 2000,
    paid: 9800,
    referral: 2290,
  },
  {
    name: 'Apr',
    organic: 2780,
    paid: 3908,
    referral: 2000,
  },
  {
    name: 'May',
    organic: 1890,
    paid: 4800,
    referral: 2181,
  },
  {
    name: 'Jun',
    organic: 2390,
    paid: 3800,
    referral: 2500,
  },
  {
    name: 'Jul',
    organic: 3490,
    paid: 4300,
    referral: 2100,
  },
];

const AreaChartPage = () => {
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:bg-gray-800 rounded-3xl">
      <Header category="Chart" title="Traffic Sources" />
      <div className="w-full h-[420px]">
        <AreaChart
          data={sampleData}
          areas={[
            { dataKey: 'organic', name: 'Organic Traffic', color: '#8884d8' },
            { dataKey: 'paid', name: 'Paid Traffic', color: '#82ca9d' },
            { dataKey: 'referral', name: 'Referral Traffic', color: '#ffc658' },
          ]}
          xAxisDataKey="name"
          grid
          stacked
        />
      </div>
    </div>
  );
};

export default AreaChartPage;
