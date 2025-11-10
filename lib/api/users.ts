import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { userSchema, createUserSchema, updateUserSchema, type User, type CreateUserRequest, type UpdateUserRequest } from '@/lib/schemas/user';

/**
 * Get all users
 */
export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>(API_ENDPOINTS.USERS.LIST);
  return response.data.map((user) => userSchema.parse(user));
};

/**
 * Get user by ID
 */
export const getUser = async (id: number): Promise<User> => {
  const response = await apiClient.get<User>(API_ENDPOINTS.USERS.GET(id));
  return userSchema.parse(response.data);
};

/**
 * Create a new user
 */
export const createUser = async (data: CreateUserRequest): Promise<User> => {
  const validatedData = createUserSchema.parse(data);
  const response = await apiClient.post<User>(API_ENDPOINTS.USERS.CREATE, validatedData);
  return userSchema.parse(response.data);
};

/**
 * Update user
 */
export const updateUser = async (id: number, data: UpdateUserRequest): Promise<User> => {
  const validatedData = updateUserSchema.parse(data);
  const response = await apiClient.patch<User>(API_ENDPOINTS.USERS.UPDATE(id), validatedData);
  return userSchema.parse(response.data);
};
