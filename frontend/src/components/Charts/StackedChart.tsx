/*
 * Created Date: Tuesday, October 8th 2024, 1:47:10 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useEffect, useState } from 'react';
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  Legend,
  Category,
  StackingColumnSeries,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
import {
  stackedCustomSeries,
  stackedPrimaryXAxis,
  stackedPrimaryYAxis,
} from "public/data/dummy";
import { useStateContext } from "@/contexts/ContextProvider";

interface StackedChartProps {
  width: string;
  height: string;
}

const StackedChart: React.FC<StackedChartProps> = ({ width, height }) => {
  const { currentMode, themeColor } = useStateContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true after the component is mounted on the client side
  }, []);

  if (!isClient) return null; // Prevent rendering during SSR

  return (
    <ChartComponent
      width={width}
      height={height}
      id="charts"
      primaryXAxis={stackedPrimaryXAxis}
      primaryYAxis={stackedPrimaryYAxis}
      chartArea={{ border: { width: 0 } }}
      tooltip={{ enable: true }}
      legendSettings={{
        textStyle: { color: currentMode === "dark" ? "#fff" : "black" },
      }}
    >
      <Inject services={[Legend, Category, StackingColumnSeries, Tooltip]} />
      <SeriesCollectionDirective>
        {stackedCustomSeries.map((item, index) => (
          <SeriesDirective
            key={index}
            {...item}
            fill={
              index === 0
                ? themeColor
                : currentMode === "dark"
                ? "#9ca3af"
                : "#404041"
            }
          />
        ))}
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default StackedChart;
