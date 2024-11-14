/*
 * Created Date: Tuesday, October 8th 2024, 3:19:21 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useEffect, useState } from "react";
import { useStateContext } from "@/contexts/ContextProvider";
import { ColorPickerComponent, ColorPickerEventArgs } from "@syncfusion/ej2-react-inputs";
import { Header } from "@/components";

const change = (args: ColorPickerEventArgs) => {
  document.getElementById("preview")!.style.backgroundColor = args.currentValue.hex;
};

const ColorPickerPage: React.FC = () => {
  const { activeMenu } = useStateContext();
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once the component is mounted on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent rendering until the component is mounted on the client
  if (!isClient) {
    return null;
  }

  return (
    <div className={activeMenu ? "md:ml-72" : "w-full flex-2"}>
      <div className="m-2 md:m-10 py-4 px-2 md:p-10 bg-white rounded-3xl dark:text-gray-200 dark:bg-secondary-dark-bg">
        <Header category={"App"} title={"Color Picker"} />
        <div className="text-center">
          <div id="preview" />
          <div className="flex justify-center items-center gap-20 flex-wrap">
            <div>
              <p className="text-2xl font-semibold mt-2 mb-4">Inline Palette</p>
              <ColorPickerComponent
                id="inline-palette"
                mode="Palette"
                modeSwitcher={false}
                inline
                showButtons={false}
                change={change}
              />
            </div>
            <div>
              <p className="text-2xl font-semibold mt-2 mb-4">Inline Picker</p>
              <ColorPickerComponent
                id="inline-picker"
                mode="Picker"
                modeSwitcher={false}
                inline
                showButtons={false}
                change={change}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPickerPage;
