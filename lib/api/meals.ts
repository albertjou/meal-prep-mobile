import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { mealSchema, createMealSchema, updateMealSchema, type Meal, type CreateMealRequest, type UpdateMealRequest } from '@/lib/schemas/meal';

/**
 * Get all meals
 * TODO: Add query parameters for filtering by meal_plan_id, date range, etc.
 */
export const getMeals = async (params?: {
  meal_plan_id?: number;
  start_date?: string;
  end_date?: string;
}): Promise<Meal[]> => {
  const response = await apiClient.get<Meal[]>(API_ENDPOINTS.MEALS.LIST, { params });
  return response.data.map((meal) => mealSchema.parse(meal));
};

/**
 * Get meal by ID
 */
export const getMeal = async (id: number): Promise<Meal> => {
  const response = await apiClient.get<Meal>(API_ENDPOINTS.MEALS.GET(id));
  return mealSchema.parse(response.data);
};

/**
 * Create a new meal
 */
export const createMeal = async (data: CreateMealRequest): Promise<Meal> => {
  const validatedData = createMealSchema.parse(data);
  const response = await apiClient.post<Meal>(API_ENDPOINTS.MEALS.CREATE, validatedData);
  return mealSchema.parse(response.data);
};

/**
 * Update meal
 */
export const updateMeal = async (id: number, data: UpdateMealRequest): Promise<Meal> => {
  const validatedData = updateMealSchema.parse(data);
  const response = await apiClient.patch<Meal>(API_ENDPOINTS.MEALS.UPDATE(id), validatedData);
  return mealSchema.parse(response.data);
};

/**
 * Delete meal
 */
export const deleteMeal = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.MEALS.DELETE(id));
};
