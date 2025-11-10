import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL, HTTP_STATUS } from '@/constants/api';

/**
 * Storage keys for tokens
 */
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

/**
 * Create axios instance with base configuration
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000, // 30 seconds
});

/**
 * Get stored access token
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

/**
 * Get stored refresh token
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Store access token
 */
export const setAccessToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, token);
  } catch (error) {
    console.error('Error storing access token:', error);
  }
};

/**
 * Store refresh token
 */
export const setRefreshToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, token);
  } catch (error) {
    console.error('Error storing refresh token:', error);
  }
};

/**
 * Clear all stored tokens
 */
export const clearTokens = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

/**
 * Refresh access token using refresh token
 * TODO: Implement actual refresh endpoint once API is confirmed
 */
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    // TODO: Replace with actual refresh endpoint
    // const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
    //   refresh_token: refreshToken,
    // });
    // const { access_token, refresh_token } = response.data;
    // await setAccessToken(access_token);
    // if (refresh_token) {
    //   await setRefreshToken(refresh_token);
    // }
    // return access_token;

    // Placeholder - remove once endpoint is confirmed
    console.warn('Token refresh not implemented - endpoint needs to be confirmed');
    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    await clearTokens();
    return null;
  }
};

/**
 * Request interceptor: Add auth token to requests
 * 
 * TODO: Re-enable authentication once auth flow is implemented
 * Authentication is currently bypassed for development
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // TODO: Re-enable authentication
    // const token = await getAccessToken();
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor: Handle token refresh on 401
 * 
 * TODO: Re-enable authentication once auth flow is implemented
 * Authentication is currently bypassed for development
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // TODO: Re-enable authentication token refresh logic
    // const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // // If error is 401 and we haven't tried to refresh yet
    // if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
    //   if (isRefreshing) {
    //     // If already refreshing, queue this request
    //     return new Promise((resolve, reject) => {
    //       failedQueue.push({ resolve, reject });
    //     })
    //       .then((token) => {
    //         if (originalRequest.headers && token) {
    //           originalRequest.headers.Authorization = `Bearer ${token}`;
    //         }
    //         return apiClient(originalRequest);
    //       })
    //       .catch((err) => {
    //         return Promise.reject(err);
    //       });
    //   }

    //   originalRequest._retry = true;
    //   isRefreshing = true;

    //   try {
    //     const newToken = await refreshAccessToken();
    //     if (newToken) {
    //       processQueue(null, newToken);
    //       if (originalRequest.headers) {
    //         originalRequest.headers.Authorization = `Bearer ${newToken}`;
    //       }
    //       return apiClient(originalRequest);
    //     } else {
    //       processQueue(error, null);
    //       await clearTokens();
    //       // TODO: Redirect to login screen
    //       return Promise.reject(error);
    //     }
    //   } catch (refreshError) {
    //     processQueue(refreshError as AxiosError, null);
    //     await clearTokens();
    //     // TODO: Redirect to login screen
    //     return Promise.reject(refreshError);
    //   } finally {
    //     isRefreshing = false;
    //   }
    // }

    return Promise.reject(error);
  }
);

/**
 * API Error type
 */
export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

/**
 * Extract error message from API error response
 */
export const extractApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ errors?: Record<string, string[]>; message?: string }>;
    return {
      message: axiosError.response?.data?.message || axiosError.message || 'An error occurred',
      status: axiosError.response?.status,
      errors: axiosError.response?.data?.errors,
    };
  }
  return {
    message: error instanceof Error ? error.message : 'An unknown error occurred',
  };
};
