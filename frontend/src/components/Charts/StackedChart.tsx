"use client";

import React from 'react';
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
