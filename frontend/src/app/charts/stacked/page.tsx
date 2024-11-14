/*
 * Created Date: Tuesday, October 8th 2024, 3:44:47 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useState, useEffect } from "react";
import { useStateContext } from "@/contexts/ContextProvider";
import { Header } from "@/components";
import StackedChart from "@/components/Charts/StackedChart";

const PyramidChartPage: React.FC = () => {
	const { activeMenu } = useStateContext();
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
				<Header category={"Stacked"} title={"Revenue Breakdown"} />
				<div className="w-full">
					{/* Uncomment and set width and height as needed */}
					<StackedChart width={""} height={""} />
				</div>
			</div>
		</div>
	);
};

export default PyramidChartPage;
