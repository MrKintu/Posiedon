/*
 * Created Date: Friday, October 4th 2024, 11:52:59 pm
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  setMode: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setColor: (color: string) => void;
  activeThemeSettings: boolean;
  setActiveThemeSettings: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ContextProviderProps {
  children: ReactNode;
}

const StateContext = createContext<StateContextType>({} as StateContextType);

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }: ContextProviderProps) => {
  const [activeMenu, setActiveMenu] = useState(false);
  const [isClicked, setIsClicked] = useState(initialState);
  const [screenSize, setScreenSize] = useState<number | undefined>(undefined);
  const [themeColor, setThemeColor] = useState("#FF5C8E");
  const [currentMode, setCurrentMode] = useState("light");
  const [activeThemeSettings, setActiveThemeSettings] = useState(false); // Active theme state

  const toggleMenu = () => {
    setActiveMenu((prev) => {
      const newValue = !prev;
      localStorage.setItem("activeMenu", String(newValue)); // Update local storage whenever the menu state changes
      return newValue;
    });
  };

  const setMode = (newMode: string) => {
    setCurrentMode(newMode);
    localStorage.setItem("themeMode", newMode);
  
    const head = document.getElementById("base-html");
    if (newMode === "dark") {
      head?.classList.add("dark");
    } else {
      head?.classList.remove("dark");
    }
  };

  const setColor = (color: string) => {
    setThemeColor(color);
    localStorage.setItem("themeColor", color);
  };

  const handleClick = (key: keyof typeof initialState) => {
    setIsClicked({ ...initialState, [key]: true });
  };

  const handleClosingClick = (key: keyof typeof initialState) => {
    setIsClicked({ ...initialState, [key]: false });
  };

  useEffect(() => {
    const savedThemeColor = localStorage.getItem("themeColor");
    const savedThemeMode = localStorage.getItem("themeMode");
    const head = document.getElementById("base-html");
    const handleResize = () => { setScreenSize(window.innerWidth); };

    if (savedThemeColor) {
      setThemeColor(savedThemeColor);
    }

    if (savedThemeMode) {
      setCurrentMode(savedThemeMode);

      if (savedThemeMode === "dark") {
        head?.classList.add("dark");
      } else {
        head?.classList.remove("dark");
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize();
    }

    if (typeof window !== "undefined") {
      const storedActiveMenu = localStorage.getItem("activeMenu");
      if (storedActiveMenu !== null) {
        setActiveMenu(JSON.parse(storedActiveMenu));
      } else {
        setActiveMenu(false);
      }
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setScreenSize, setActiveMenu]);

  return (
    <StateContext.Provider
      value={{
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
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
