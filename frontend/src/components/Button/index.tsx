/*
 * Created Date: Tuesday, October 8th 2024, 1:30:08 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

import React, { useEffect, useState } from "react";
import { useStateContext } from "@/contexts/ContextProvider";

interface ButtonProps {
  color: string;
  text: string;
  borderRadius: string;
  size: "sm" | "md" | "lg";
  classes?: string;
  func?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  color,
  text,
  borderRadius,
  size,
  classes = "",
  func,
}) => {
  const { themeColor } = useStateContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure this runs only on the client side
  }, []);

  if (!isClient) return null; // Prevent rendering on the server side

  return (
    <button
      className={`text-${size} p-3 hover:drop-shadow-xl ${classes}`}
      type="button"
      style={{
        backgroundColor: themeColor,
        color: color,
        borderRadius: borderRadius,
      }}
      onClick={func}
    >
      {text}
    </button>
  );
};

export default Button;
