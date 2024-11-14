/*
 * Created Date: Sunday, November 10th 2024, 2:20:27 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

import React, { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  username?: string;
  setAuthContext: React.Dispatch<React.SetStateAction<{ isLoggedIn: boolean; username?: string }>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<{ isLoggedIn: boolean; username?: string }>({
    isLoggedIn: false,
  });

  // Expose both the authState and setAuthState (for updating the context) to the app
  return (
    <AuthContext.Provider value={{ ...authState, setAuthContext: setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the context easily in other components
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
