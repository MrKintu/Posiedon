/*
 * Created Date: Friday, October 11th 2024, 7:23:54 pm
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

import React from "react";
import SettingIcon from "@/components/SettingIcon";
import ThemeSettings from "@/components/ThemeSettings";
import { useStateContext } from "@/contexts/ContextProvider";

const ThemeWindow: React.FC = () => {
	const { activeThemeSettings } = useStateContext();

	return (
		<>
			<SettingIcon />
			{activeThemeSettings && <ThemeSettings />}
		</>
	);
};

export default ThemeWindow;
