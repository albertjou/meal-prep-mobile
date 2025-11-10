import { apiClient, setAccessToken, setRefreshToken, clearTokens } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { userSchema, type User } from '@/lib/schemas/user';

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Login response (to be confirmed with actual API)
 */
export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user: User;
}

/**
 * Login user
 * TODO: Update endpoint and response format once API is confirmed
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  // TODO: Replace with actual endpoint once confirmed
  // const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  // const { access_token, refresh_token, user } = response.data;
  
  // await setAccessToken(access_token);
  // if (refresh_token) {
  //   await setRefreshToken(refresh_token);
  // }
  
  // const validatedUser = userSchema.parse(user);
  // return { access_token, refresh_token, user: validatedUser };

  // Placeholder - remove once endpoint is confirmed
  throw new Error('Login endpoint not yet implemented - API endpoint needs to be confirmed');
};

/**
 * Logout user
 * TODO: Update endpoint once API is confirmed
 */
export const logout = async (): Promise<void> => {
  try {
    // TODO: Call logout endpoint once confirmed
    // await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    // Always clear tokens locally
    await clearTokens();
  }
};

/**
 * Get current user
 * TODO: Update endpoint once API is confirmed
 */
export const getCurrentUser = async (): Promise<User> => {
  // TODO: Replace with actual endpoint once confirmed
  // const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
  // return userSchema.parse(response.data);

  // Placeholder - remove once endpoint is confirmed
  throw new Error('Get current user endpoint not yet implemented - API endpoint needs to be confirmed');
};
