/**
 * API Service
 * Main Axios instance with interceptors for authentication and error handling
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_ENDPOINTS } from '../../config/env';
import { errorHandler } from './errorHandler';
import { storage } from './storage';

// Constants
const TOKEN_KEY = '@flowvest:token';
const REFRESH_TOKEN_KEY = '@flowvest:refresh_token';

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get token from storage
    const token = await storage.getItem(TOKEN_KEY);
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    (config as any).metadata = { startTime: new Date() };
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: any) => {
    // Log request duration in development
    if (__DEV__ && response.config.metadata) {
      const duration = new Date().getTime() - response.config.metadata.startTime.getTime();
      console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && originalRequest) {
      // Check if this is already a retry
      if (originalRequest._retry) {
        // Refresh failed, logout user
        // await authService.logout(); // Will be implemented later
        console.log('Token refresh failed, user needs to login again');
        return Promise.reject(error);
      }
      
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const refreshToken = await storage.getItem(REFRESH_TOKEN_KEY);
        if (refreshToken) {
          // const newToken = await authService.refreshToken(refreshToken); // Will be implemented later
          
          // For now, just log the attempt
          console.log('Token refresh attempt with:', refreshToken);
          
          // Update token in storage (when auth service is ready)
          // await storage.setItem(TOKEN_KEY, newToken);
          
          // Retry original request with new token
          // originalRequest.headers.Authorization = `Bearer ${newToken}`;
          // return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        // await authService.logout(); // Will be implemented later
        console.log('Token refresh failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors using the error handler
    const handledError = errorHandler.handle(error);
    return Promise.reject(handledError);
  }
);

// API methods
export const apiClient = {
  // GET request
  get: async <T = any>(url: string, params?: any): Promise<T> => {
    const response = await api.get<T>(url, { params });
    return response.data;
  },
  
  // POST request
  post: async <T = any>(url: string, data?: any): Promise<T> => {
    const response = await api.post<T>(url, data);
    return response.data;
  },
  
  // PUT request
  put: async <T = any>(url: string, data?: any): Promise<T> => {
    const response = await api.put<T>(url, data);
    return response.data;
  },
  
  // PATCH request
  patch: async <T = any>(url: string, data?: any): Promise<T> => {
    const response = await api.patch<T>(url, data);
    return response.data;
  },
  
  // DELETE request
  delete: async <T = any>(url: string): Promise<T> => {
    const response = await api.delete<T>(url);
    return response.data;
  },
  
  // Upload file
  upload: async <T = any>(url: string, formData: FormData, onProgress?: (progress: number) => void): Promise<T> => {
    const response = await api.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: any) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  },
};

// Export configured axios instance for advanced usage
export { api };

// Type definitions for request config
interface CustomAxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
  _retry?: boolean;
} 