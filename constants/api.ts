/**
 * API Configuration Constants
 */

import Constants from 'expo-constants';

/**
 * Get the API base URL from environment variables
 * Falls back to localhost for development if not set
 */
export const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  'http://localhost:3005';

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login', // ✅ Implemented
    LOGOUT: '/auth/logout', // ✅ Implemented
    REFRESH: '/auth/refresh', // ❌ Not in API spec
    ME: '/auth/me', // ❌ Not in API spec - no current user endpoint available
  },
  // User endpoints
  USERS: {
    LIST: '/users',
    GET: (id: number) => `/users/${id}`,
    UPDATE: (id: number) => `/users/${id}`,
    CREATE: '/users',
  },
  // Meal Plan endpoints
  MEAL_PLANS: {
    LIST: '/meal_plans',
    GET: (id: number) => `/meal_plans/${id}`,
    CREATE: '/meal_plans',
    UPDATE: (id: number) => `/meal_plans/${id}`,
    DELETE: (id: number) => `/meal_plans/${id}`,
  },
  // Meal endpoints
  MEALS: {
    LIST: '/meals',
    GET: (id: number) => `/meals/${id}`,
    CREATE: '/meals',
    UPDATE: (id: number) => `/meals/${id}`,
    DELETE: (id: number) => `/meals/${id}`,
  },
  // Participant endpoints
  PARTICIPANTS: {
    LIST: '/meal_plan_participants',
    GET: (id: number) => `/meal_plan_participants/${id}`,
    CREATE: '/meal_plan_participants',
    UPDATE: (id: number) => `/meal_plan_participants/${id}`,
    DELETE: (id: number) => `/meal_plan_participants/${id}`,
  },
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;
