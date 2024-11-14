/*
 * Created Date: Wednesday, October 30th 2024, 6:31:48 pm
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

import axios, { AxiosError, AxiosResponse } from 'axios';

interface ApiResponse {
  [key: string]: any;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE_URL) {
  console.warn("API_BASE_URL is not defined. Please check your environment configuration.");
}

const ApiClient = {
  async get<T = ApiResponse>(endpoint: string, params = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.get(`${API_BASE_URL}${endpoint}`, { params });
      return response.data;
    } catch (error) {
      const message = error instanceof AxiosError && error.response
        ? error.response.data
        : "An error occurred while fetching data.";
      return { error: message } as T;
    }
  },

  async post<T = ApiResponse>(endpoint: string, data = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.post(`${API_BASE_URL}${endpoint}`, data);
      return response.data;
    } catch (error) {
      const message =
        error instanceof AxiosError && error.response
          ? JSON.stringify(error.response.data)
          : "An error occurred while posting data.";
      return { error: message } as T;
    }
  },

  async put<T = ApiResponse>(endpoint: string, data = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.put(`${API_BASE_URL}${endpoint}`, data);
      return response.data;
    } catch (error) {
      const message = error instanceof AxiosError && error.response
        ? error.response.data
        : "An error occurred while updating data.";
      return { error: message } as T;
    }
  },

  async delete<T = ApiResponse>(endpoint: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.delete(`${API_BASE_URL}${endpoint}`);
      return response.data;
    } catch (error) {
      const message = error instanceof AxiosError && error.response
        ? error.response.data
        : "An error occurred while deleting data.";
      return { error: message } as T;
    }
  },
};

export default ApiClient;
