/*
 * Created Date: Sunday, November 10th 2024, 2:20:27 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import ApiClient from '@/utilities/api_client';
import { secureStorage, isTokenExpired } from '@/utils/auth';

interface UserData {
  id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  is_staff?: boolean;
  is_active?: boolean;
  customer?: {
    business?: string;
  };
}

interface AuthState {
  isLoggedIn: boolean;
  username?: string;
  userData?: UserData;
}

interface AuthContextType extends AuthState {
  setAuthContext: React.Dispatch<React.SetStateAction<AuthState>>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Initialize state from secure storage if available
    if (typeof window !== 'undefined') {
      const token = secureStorage.getItem('access_token');
      const userData = secureStorage.getItem('user_data');
      
      if (token && userData) {
        try {
          // Validate token before restoring session
          if (isTokenExpired(token)) {
            secureStorage.clear(); // Clear invalid session
            return { isLoggedIn: false };
          }
          
          return {
            isLoggedIn: true,
            userData: typeof userData === 'string' ? JSON.parse(userData) : userData,
            username: typeof userData === 'string' ? JSON.parse(userData).username : userData.username
          };
        } catch (e) {
          console.error('Error parsing stored user data:', e);
          secureStorage.clear(); // Clear corrupted data
        }
      }
    }
    return { isLoggedIn: false };
  });

  const logout = async () => {
    try {
      const refreshToken = secureStorage.getItem('refresh_token');
      if (refreshToken) {
        // Call the backend logout endpoint
        await ApiClient.post('users/sign-out/', { refresh_token: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear secure storage
      secureStorage.clear();
      
      // Reset auth state
      setAuthState({ isLoggedIn: false, userData: undefined, username: undefined });

      // Force reload to home page
      window.location.replace('/');
    }
  };

  // Store user data in secure storage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && authState.userData) {
      secureStorage.setItem('user_data', authState.userData);
    }
  }, [authState.userData]);

  // Check token expiration periodically
  useEffect(() => {
    if (typeof window !== 'undefined' && authState.isLoggedIn) {
      const checkToken = () => {
        const token = secureStorage.getItem('access_token');
        if (!token || isTokenExpired(token)) {
          logout();
        }
      };

      // Check every minute
      const interval = setInterval(checkToken, 60000);
      return () => clearInterval(interval);
    }
  }, [authState.isLoggedIn]);

  return (
    <AuthContext.Provider value={{ ...authState, setAuthContext: setAuthState, logout }}>
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
