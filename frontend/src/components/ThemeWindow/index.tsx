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
