/*
 * Created Date: Tuesday, October 8th 2024, 1:58:07 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

import React from "react";
import { MdOutlineCancel } from "react-icons/md";

// Define props type for SubHeading
interface SubHeadingProps {
	text: string;
	secText?: string; // Optional
	func: () => void;
}

const SubHeading: React.FC<SubHeadingProps> = ({ text, secText, func }) => {
	return (
		<div className="flex justify-between items-center">
			<div className="flex gap-4 items-center dark:text-gray-200">
				<p className="text-xl font-semibold">{text}</p>
				{secText && <p className="text-sm">{secText}</p>} {/* Render secText only if provided */}
			</div>
			<button
				type="button"
				className="rounded-full text-theme-button text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray"
				onClick={func}
			>
				<MdOutlineCancel />
			</button>
		</div>
	);
};

export default SubHeading;
