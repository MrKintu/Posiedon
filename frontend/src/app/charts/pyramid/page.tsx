/*
 * Created Date: Tuesday, October 8th 2024, 3:43:44 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useState, useEffect } from "react";
import { useStateContext } from "@/contexts/ContextProvider";
import { Header } from "@/components";

import {
	AccumulationChartComponent,
	AccumulationSeriesCollectionDirective,
	AccumulationSeriesDirective,
	AccumulationLegend,
	Inject,
	AccumulationDataLabel,
	AccumulationTooltip,
	PyramidSeries,
	AccumulationSelection,
} from "@syncfusion/ej2-react-charts";

import { PyramidData } from "public/data/dummy";

const PyramidChartPage: React.FC = () => {
	const { activeMenu, currentMode } = useStateContext();
	const [isClient, setIsClient] = useState(false);

	// Hydration: Set isClient to true after the component is mounted on the client
	useEffect(() => {
		setIsClient(true);
	}, []);

	// Don't render chart content until after hydration
	if (!isClient) {
		return null; // Or you can return a loading spinner, if preferred
	}

	return (
		<div className={activeMenu ? "md:ml-72" : "w-full flex-2"}>
			<div className="m-2 md:m-10 py-4 px-2 md:p-10 bg-white rounded-3xl dark:text-gray-200 dark:bg-secondary-dark-bg">
				<Header category={"Pyramid"} title={"Food Comparison Chart"} />
				<div className="w-full">
					<AccumulationChartComponent
						id="Pyramid-chart"
						height="full"
						tooltip={{ enable: true }}
						background={currentMode === "dark" ? "#33373e" : "#fff"}
						legendSettings={{
							textStyle: {
								color: currentMode === "dark" ? "#fff" : "black",
							},
							visible: true,
						}}
					>
						<Inject
							services={[
								AccumulationDataLabel,
								AccumulationTooltip,
								PyramidSeries,
								AccumulationLegend,
								AccumulationSelection,
							]}
						/>

						<AccumulationSeriesCollectionDirective>
							<AccumulationSeriesDirective
								dataSource={PyramidData}
								name="Food"
								xName="x"
								yName="y"
								width="45%"
								height="80%"
								explode
								type="Pyramid"
								neckWidth="15%"
								gapRatio={0.03}
								emptyPointSetting={{ mode: "Drop", fill: "red" }}
								dataLabel={{
									visible: true,
									position: "Inside",
									name: "text",
									font: {
										fontWeight: "600",
										color: currentMode === "dark" ? "#fff" : "black",
									},
								}}
							/>
						</AccumulationSeriesCollectionDirective>
					</AccumulationChartComponent>
				</div>
			</div>
		</div>
	);
};

export default PyramidChartPage;