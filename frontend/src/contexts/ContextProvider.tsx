/*
 * Created Date: Friday, October 4th 2024, 11:52:59 pm
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";

interface StateContextType {
  activeMenu: boolean;
  setActiveMenu: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMenu: () => void;
  isClicked: typeof initialState;
  setIsClicked: React.Dispatch<React.SetStateAction<typeof initialState>>;
  handleClick: (key: keyof typeof initialState) => void;
  handleClosingClick: (key: keyof typeof initialState) => void;
  screenSize: number | undefined;
  setScreenSize: React.Dispatch<React.SetStateAction<number | undefined>>;
  currentMode: string;
  setCurrentMode: React.Dispatch<React.SetStateAction<string>>;
  themeColor: string;
  setThemeColor: React.Dispatch<React.SetStateAction<string>>;
  setMode: (newMode: string) => void;
  setColor: (color: string) => void;
  activeThemeSettings: boolean;
  setActiveThemeSettings: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ContextProviderProps {
  children: ReactNode;
}

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

const StateContext = createContext<StateContextType>({} as StateContextType);

export const ContextProvider = ({ children }: ContextProviderProps) => {
  const [activeMenu, setActiveMenu] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem("activeMenu") || "false");
    }
    return false;
  });

  const [isClicked, setIsClicked] = useState(initialState);
  const [screenSize, setScreenSize] = useState<number | undefined>(undefined);
  const [themeColor, setThemeColor] = useState("#FF5C8E");
  const [currentMode, setCurrentMode] = useState("light");
  const [activeThemeSettings, setActiveThemeSettings] = useState(false);

  useEffect(() => {
    const savedThemeColor = localStorage.getItem("themeColor");
    const savedThemeMode = localStorage.getItem("themeMode");

    if (savedThemeColor) setThemeColor(savedThemeColor);
    if (savedThemeMode) setCurrentMode(savedThemeMode);

    if (typeof window !== "undefined") {
      const handleResize = () => setScreenSize(window.innerWidth);
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const setMode = (newMode: string) => {
    if (newMode !== currentMode) {
      setCurrentMode(newMode);
      localStorage.setItem("themeMode", newMode);

      const head = document.getElementById("base-html");
      if (newMode === "dark") head?.classList.add("dark");
      else head?.classList.remove("dark");
    }
  };

  const setColor = (color: string) => {
    if (color !== themeColor) {
      setThemeColor(color);
      localStorage.setItem("themeColor", color);
    }
  };

  const handleClick = (key: keyof typeof initialState) => {
    setIsClicked({ ...initialState, [key]: true });
  };

  const handleClosingClick = (key: keyof typeof initialState) => {
    setIsClicked({ ...initialState, [key]: false });
  };

  const toggleMenu = () => {
    setActiveMenu((prev) => {
      const newValue = !prev;
      localStorage.setItem("activeMenu", JSON.stringify(newValue));
      return newValue;
    });
  };

  const contextValue = useMemo(() => ({
    activeMenu,
    setActiveMenu,
    isClicked,
    setIsClicked,
    handleClick,
    handleClosingClick,
    screenSize,
    setScreenSize,
    currentMode,
    setCurrentMode,
    themeColor,
    setThemeColor,
    setMode,
    setColor,
    activeThemeSettings,
    setActiveThemeSettings,
    toggleMenu,
  }), [activeMenu, isClicked, screenSize, currentMode, themeColor, activeThemeSettings]);

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
