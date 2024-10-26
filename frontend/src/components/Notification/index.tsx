/*
 * Created Date: Tuesday, October 8th 2024, 1:54:11 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

import React from "react";
import Image from "next/image";
import { useStateContext } from "@/contexts/ContextProvider";
import { chatData } from "public/data/dummy";
import { SubHeading, Button } from "@/components";

const Notification: React.FC = () => {
	const { handleClosingClick } = useStateContext();

	return (
		<div className="nav-item bg-white dark:bg-secondary-dark-bg absolute top-16 right-0 md:right-40 w-full md:w-96 rounded-lg p-8">
			<SubHeading
				text={"Notification"}
				secText={"3 New"}
				func={() => handleClosingClick("notification")}
			/>
			<div>
				{chatData.map((item, index) => (
					<div
						key={index}
						className="flex gap-5 items-center p-3 border-b-1 border-color dark:border-gray-600 cursor-pointer"
					>
						<Image
							src={item.image}
							alt={item.message}
							className="rounded-full w-10 h-10"
						/>
						<div className="flex-1">
							<h3 className="font-semibold dark:text-gray-200">
								{item.message}
							</h3>
							<p className="text-gray-500 dark:text-gray-400 text-sm">
								{item.desc}
							</p>
							{/* <span className="text-gray-500 dark:text-gray-400 text-xs">
								{item.time}
							</span> */}
						</div>
					</div>
				))}
			</div>
			<Button
				color={"white"}
				text={"See all notifications"}
				borderRadius={"10px"}
				size={"md"}
				classes="w-full mt-5"
				func={() => handleClosingClick("notification")}
			/>
		</div>
	);
};

export default Notification;
