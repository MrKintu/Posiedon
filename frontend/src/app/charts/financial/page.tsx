/*
 * Created Date: Tuesday, October 8th 2024, 3:40:52 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useStateContext } from "@/contexts/ContextProvider";
import { Header } from "@/components";
import { useEffect, useState } from "react";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  Tooltip,
  HiloSeries,
  DateTime,
  Zoom,
  Logarithmic,
  Crosshair,
} from "@syncfusion/ej2-react-charts";
import {
  financialChartData,
  FinancialPrimaryXAxis,
  FinancialPrimaryYAxis,
} from "public/data/dummy";

const date1 = new Date("2017, 1, 1");

// Define the type for the financial chart data
interface FinancialData {
  x: Date;
  high: number;
  low: number;
}

// Filter function for financial chart data
const filterValue = (value: FinancialData): boolean => {
  return value.x >= date1;
};

const returnValue = financialChartData.filter(filterValue);

const FinancialPage: React.FC = () => {
  const { activeMenu, currentMode } = useStateContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true after the component is mounted in the client environment
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent rendering on the server side
  }

  return (
    <div className={activeMenu ? "md:ml-72" : "w-full flex-2"}>
      <div className="m-2 md:m-10 py-4 px-2 md:p-10 bg-white rounded-3xl dark:text-gray-200 dark:bg-secondary-dark-bg">
        <Header category={"Financial"} title={"APPLE Historical"} />
        <div className="w-full">
          <ChartComponent
            id="financial-chart"
            height="420px"
            primaryXAxis={FinancialPrimaryXAxis}
            primaryYAxis={{
              ...FinancialPrimaryYAxis,
              titleStyle: { color: currentMode === "dark" ? "#fff" : "black" },
            }}
            chartArea={{ border: { width: 0 } }}
            tooltip={{ enable: true }}
            background={currentMode === "dark" ? "#33373e" : "#fff"}
            crosshair={{
              enable: true,
              lineType: "Vertical",
              line: { width: 0 },
            }}
          >
            <Inject
              services={[
                Tooltip,
                HiloSeries,
                DateTime,
                Logarithmic,
                Crosshair,
                Zoom,
              ]}
            />
            <SeriesCollectionDirective>
              <SeriesDirective
                dataSource={returnValue}
                name="Apple Inc"
                xName="x"
                yName="low"
                type="Hilo"
                low="low"
                high="high"
              />
            </SeriesCollectionDirective>
          </ChartComponent>
        </div>
      </div>
    </div>
  );
};

export default FinancialPage;