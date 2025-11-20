import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { mealSchema, createMealSchema, updateMealSchema, type Meal, type CreateMealRequest, type UpdateMealRequest } from '@/lib/schemas/meal';
import { dummyMeals } from '@/lib/data/dummy-data';

/**
 * Get all meals
 * Uses dummy data for development
 * TODO: Replace with actual API endpoint once available
 */
export const getMeals = async (params?: {
  meal_plan_id?: number;
  start_date?: string;
  end_date?: string;
}): Promise<Meal[]> => {
  // Development: Use dummy data
  let meals = dummyMeals;
  
  if (params?.meal_plan_id) {
    meals = meals.filter((m) => m.meal_plan_id === params.meal_plan_id);
  }
  
  if (params?.start_date) {
    meals = meals.filter((m) => m.date >= params.start_date!);
  }
  
  if (params?.end_date) {
    meals = meals.filter((m) => m.date <= params.end_date!);
  }
  
  return meals.map((meal) => mealSchema.parse(meal));
  
  // Production: Uncomment when API is ready
  // const response = await apiClient.get<Meal[]>(API_ENDPOINTS.MEALS.LIST, { params });
  // return response.data.map((meal) => mealSchema.parse(meal));
};

/**
 * Get meal by ID
 * Uses dummy data for development
 * TODO: Replace with actual API endpoint once available
 */
export const getMeal = async (id: number): Promise<Meal> => {
  // Development: Use dummy data
  const meal = dummyMeals.find((m) => m.id === id);
  if (!meal) {
    throw new Error(`Meal with id ${id} not found`);
  }
  return mealSchema.parse(meal);
  
  // Production: Uncomment when API is ready
  // const response = await apiClient.get<Meal>(API_ENDPOINTS.MEALS.GET(id));
  // return mealSchema.parse(response.data);
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
