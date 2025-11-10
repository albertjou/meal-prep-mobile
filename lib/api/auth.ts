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
 * Login response based on API spec
 * Note: JWT is returned in Authorization header, not response body
 */
export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user: User;
}

/**
 * API login response format
 */
interface ApiLoginResponse {
  message: string;
  user: {
    id: number;
    email: string;
    name: string;
    color?: string;
  };
}

/**
 * Login user
 * Based on API spec: POST /auth/login
 * Request: { user: { email, password } }
 * Response: { message, user } with JWT in Authorization header
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiLoginResponse>(
    API_ENDPOINTS.AUTH.LOGIN,
    {
      user: {
        email: credentials.email,
        password: credentials.password,
      },
    }
  );

  // Extract JWT from Authorization header
  // Axios normalizes headers to lowercase, but check both cases
  const authHeader =
    (response.headers.authorization as string | undefined) ||
    (response.headers.Authorization as string | undefined);
  let access_token = '';
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    access_token = authHeader.substring(7);
  } else if (authHeader) {
    // Some APIs return token without Bearer prefix
    access_token = authHeader;
  } else {
    throw new Error('No authorization token received from server');
  }

  // Validate and parse user
  const validatedUser = userSchema.parse(response.data.user);

  // Store access token
  await setAccessToken(access_token);

  // Note: API spec doesn't show refresh_token, so we'll leave it optional
  return {
    access_token,
    user: validatedUser,
  };
};

/**
 * Logout user
 * Based on API spec: DELETE /auth/logout
 * Requires Authorization header with Bearer token
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.delete(API_ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    console.error('Error during logout:', error);
    // Continue with local logout even if API call fails
  } finally {
    // Always clear tokens locally
    await clearTokens();
  }
};

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

/**
 * API refresh token response format
 */
interface ApiRefreshTokenResponse {
  message: string;
  user: {
    id: number;
    email: string;
    name: string;
    color?: string;
  };
  refresh_token: string;
}

/**
 * Refresh access token
 * Based on API spec: POST /auth/refresh
 * Request: { refresh_token: string }
 * Response: { message, user, refresh_token } with JWT in Authorization header
 */
export const refreshToken = async (refreshTokenValue: string): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post<ApiRefreshTokenResponse>(
    API_ENDPOINTS.AUTH.REFRESH,
    {
      refresh_token: refreshTokenValue,
    }
  );

  // Extract JWT from Authorization header
  const authHeader =
    (response.headers.authorization as string | undefined) ||
    (response.headers.Authorization as string | undefined);
  let access_token = '';
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    access_token = authHeader.substring(7);
  } else if (authHeader) {
    access_token = authHeader;
  } else {
    throw new Error('No authorization token received from server');
  }

  // Validate and parse user
  const validatedUser = userSchema.parse(response.data.user);

  // Store tokens
  await setAccessToken(access_token);
  await setRefreshToken(response.data.refresh_token);

  return {
    access_token,
    refresh_token: response.data.refresh_token,
    user: validatedUser,
  };
};

/**
 * Get current user
 * Note: API spec doesn't have /auth/me endpoint
 * This function attempts to decode user ID from JWT token and fetch user
 * For now, returns an error - this should be implemented when we have a way to get current user
 */
export const getCurrentUser = async (): Promise<User> => {
  // Since there's no /auth/me endpoint, we'll need to either:
  // 1. Decode JWT to get user ID and call GET /users/{id}
  // 2. Wait for backend to add /auth/me endpoint
  // For now, throw an error to indicate this needs implementation
  
  // TODO: Implement JWT decoding or use /users/{id} if we can extract user ID from token
  throw new Error('Get current user endpoint not available - API spec does not include /auth/me');
};
