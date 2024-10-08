"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define a type for the context value
interface StateContextType {
  activeMenu: boolean;
  setActiveMenu: React.Dispatch<React.SetStateAction<boolean>>;
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

// Define a type for the props of the ContextProvider
interface ContextProviderProps {
  children: ReactNode;
}

// Create a context with a default empty object
const StateContext = createContext<StateContextType>({} as StateContextType);

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }: ContextProviderProps) => {
  console.log("Children passed to ContextProvider:", children);
  
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [screenSize, setScreenSize] = useState<number | undefined>(undefined);
  const [themeColor, setThemeColor] = useState("#FF5C8E");
  const [currentMode, setCurrentMode] = useState("light");
  const [activeThemeSettings, setActiveThemeSettings] = useState(false);

  const setMode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMode(e.target.value);
    localStorage.setItem("themeMode", e.target.value);

    const head = document.getElementById("base-html");

    if (e.target.value === "dark") {
      head?.classList.add(e.target.value);
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

    if (savedThemeColor) {
      setThemeColor(savedThemeColor);
    }

    if (savedThemeMode) {
      setCurrentMode(savedThemeMode);
      const head = document.getElementById("base-html");

      if (savedThemeMode === "dark") {
        head?.classList.add(savedThemeMode);
      } else {
        head?.classList.remove("dark");
      }
    }
  }, []);

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
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
