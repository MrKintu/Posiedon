/*
 * Created Date: Tuesday, October 8th 2024, 1:45:19 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useEffect, useState } from "react";
import {
  SparklineComponent,
  Inject,
  SparklineTooltip,
} from "@syncfusion/ej2-react-charts";

interface SparkLineProps {
  currentColor: string;
  id: string;
  type: "Line" | "Area" | "Column" | "WinLoss"; // Specify types based on your usage
  height: string;
  width: string;
  data: Array<{ x: number | string; yval: number }>; // Adjust based on your data structure
  color: string;
}

const SparkLine: React.FC<SparkLineProps> = ({
  currentColor,
  id,
  type,
  height,
  width,
  data,
  color,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Only set to true on the client side
  }, []);

  if (!isClient) return null; // Prevent rendering on the server side

  return (
    <SparklineComponent
      id={id}
      height={height}
      width={width}
      lineWidth={1}
      valueType="Numeric"
      fill={color}
      border={{ color: currentColor, width: 2 }}
      dataSource={data}
      xName="x"
      yName="yval"
      type={type}
      tooltipSettings={{
        visible: true,
        format: "${yval}",
        trackLineSettings: { visible: true },
      }}
      markerSettings={{ visible: ["All"], fill: `${color}` }}
    >
      <Inject services={[SparklineTooltip]} />
    </SparklineComponent>
  );
};

export default SparkLine;
