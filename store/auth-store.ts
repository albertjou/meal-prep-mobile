import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { login as loginApi, logout as logoutApi, getCurrentUser } from '@/lib/api/auth';
import { LoginCredentials } from '@/lib/api/auth';
import { User } from '@/lib/schemas/user';
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, clearTokens } from '@/lib/api/client';

/**
 * Auth store state
 */
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
}

/**
 * Auth store actions
 */
interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken?: string) => Promise<void>;
  clearAuth: () => Promise<void>;
}

/**
 * Storage keys
 */
const STORAGE_KEYS = {
  USER: 'auth_user',
} as const;

/**
 * Auth store
 */
export const useAuthStore = create<AuthState & AuthActions>(
  (
    set: (partial: Partial<AuthState & AuthActions> | ((state: AuthState & AuthActions) => Partial<AuthState & AuthActions>)) => void,
    get: () => AuthState & AuthActions
  ) => ({
  // Initial state
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,

  /**
   * Login action
   */
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true });
    try {
      const response = await loginApi(credentials);
      const { access_token, refresh_token, user } = response;

      // Store tokens
      await get().setTokens(access_token, refresh_token);

      // Store user in SecureStore
      await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(user));

      // Update state
      set({
        user,
        accessToken: access_token,
        refreshToken: refresh_token || null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  /**
   * Logout action
   */
  logout: async () => {
    set({ isLoading: true });
    try {
      // Call logout API
      await logoutApi();
    } catch (error) {
      console.error('Error during logout API call:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local state and storage
      await get().clearAuth();
      set({ isLoading: false });
    }
  },

  /**
   * Initialize auth state from SecureStore
   */
  initialize: async () => {
    set({ isInitializing: true });
    try {
      // Get tokens from SecureStore
      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();

      // Get user from SecureStore
      const userJson = await SecureStore.getItemAsync(STORAGE_KEYS.USER);
      let user: User | null = null;

      if (userJson) {
        try {
          user = JSON.parse(userJson);
        } catch (error) {
          console.error('Error parsing stored user:', error);
        }
      }

      // If we have a token but no user, try to fetch current user
      // Note: getCurrentUser may not be implemented if API doesn't have /auth/me endpoint
      if (accessToken && !user) {
        try {
          user = await getCurrentUser();
          await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(user));
        } catch (error) {
          console.warn('Could not fetch current user (endpoint may not be available):', error);
          // Don't clear tokens if getCurrentUser fails - user might be stored elsewhere
          // or endpoint might not be implemented yet
        }
      }

      // Update state
      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!accessToken && !!user,
        isInitializing: false,
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isInitializing: false,
      });
    }
  },

  /**
   * Set user
   */
  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
    if (user) {
      SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(user)).catch(
        (error: unknown) => console.error('Error storing user:', error)
      );
    } else {
      SecureStore.deleteItemAsync(STORAGE_KEYS.USER).catch(
        (error: unknown) => console.error('Error deleting user:', error)
      );
    }
  },

  /**
   * Set tokens
   */
  setTokens: async (accessToken: string, refreshToken?: string) => {
    await setAccessToken(accessToken);
    if (refreshToken) {
      await setRefreshToken(refreshToken);
    }
    set({
      accessToken,
      refreshToken: refreshToken || null,
    });
  },

  /**
   * Clear auth state and storage
   */
  clearAuth: async () => {
    await clearTokens();
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER).catch(
      (error: unknown) => console.error('Error deleting user:', error)
    );
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },
}));
