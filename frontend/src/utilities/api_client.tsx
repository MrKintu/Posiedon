/*
 * Created Date: Wednesday, October 30th 2024, 6:31:48 pm
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

import axios, { AxiosError, AxiosResponse } from 'axios';
import { secureStorage } from '@/utilities/auth';

interface ApiResponse {
  [key: string]: any;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE_URL) {
  console.warn("API_BASE_URL is not defined. Please check your environment configuration.");
}

// Add auth token to requests if available
const getAuthHeader = () => {
  const token = secureStorage.getItem('access_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const ApiClient = {
  async get<T = ApiResponse>(endpoint: string, params = {}): Promise<T> {
    try {
      const headers = getAuthHeader();
      console.log('Request headers:', headers);
      console.log('API URL:', `${API_BASE_URL}${endpoint}`);
      const response: AxiosResponse<T> = await axios.get(`${API_BASE_URL}${endpoint}`, { 
        params,
        headers
      });
      console.log(`GET ${endpoint} response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`GET ${endpoint} error:`, error);
      if (error instanceof AxiosError) {
        console.error('Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }
      const message = error instanceof AxiosError && error.response
        ? error.response.data
        : "An error occurred while fetching data.";
      return { error: message } as T;
    }
  },

  async post<T = ApiResponse>(endpoint: string, data = {}): Promise<T> {
    try {
      console.log(`POST ${endpoint} request:`, data);
      // Only add auth header if not signing in
      const headers = endpoint === 'users/sign-in/' ? {} : getAuthHeader();
      console.log('Request headers:', headers);
      console.log('API URL:', `${API_BASE_URL}${endpoint}`);
      
      const response: AxiosResponse<T> = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        }
      });
      console.log(`POST ${endpoint} response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`POST ${endpoint} error:`, error);
      if (error instanceof AxiosError) {
        console.error('Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        });
        
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          // Clear session and redirect to login
          secureStorage.clear();
          window.location.replace('/sign-in');
        }
      }
      const message = error instanceof AxiosError && error.response
        ? error.response.data
        : "An error occurred while posting data.";
      throw message; // Throw instead of returning to properly handle errors
    }
  },

  async put<T = ApiResponse>(endpoint: string, data = {}): Promise<T> {
    try {
      const headers = getAuthHeader();
      console.log('Request headers:', headers);
      console.log('API URL:', `${API_BASE_URL}${endpoint}`);
      const response: AxiosResponse<T> = await axios.put(`${API_BASE_URL}${endpoint}`, data, {
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        }
      });
      console.log(`PUT ${endpoint} response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`PUT ${endpoint} error:`, error);
      if (error instanceof AxiosError) {
        console.error('Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }
      const message = error instanceof AxiosError && error.response
        ? error.response.data
        : "An error occurred while updating data.";
      return { error: message } as T;
    }
  },

  async delete<T = ApiResponse>(endpoint: string): Promise<T> {
    try {
      const headers = getAuthHeader();
      console.log('Request headers:', headers);
      console.log('API URL:', `${API_BASE_URL}${endpoint}`);
      const response: AxiosResponse<T> = await axios.delete(`${API_BASE_URL}${endpoint}`, {
        headers
      });
      console.log(`DELETE ${endpoint} response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`DELETE ${endpoint} error:`, error);
      if (error instanceof AxiosError) {
        console.error('Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }
      const message = error instanceof AxiosError && error.response
        ? error.response.data
        : "An error occurred while deleting data.";
      return { error: message } as T;
    }
  },
};

export default ApiClient;
