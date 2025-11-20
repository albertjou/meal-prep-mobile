import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import {
  mealPlanSchema,
  createMealPlanSchema,
  updateMealPlanSchema,
  type MealPlan,
  type CreateMealPlanRequest,
  type UpdateMealPlanRequest,
} from '@/lib/schemas/meal-plan';
import { dummyMealPlans } from '@/lib/data/dummy-data';

/**
 * Get all meal plans
 * Uses dummy data for development
 * TODO: Replace with actual API endpoint once available
 */
export const getMealPlans = async (): Promise<MealPlan[]> => {
  // Development: Use dummy data
  return dummyMealPlans.map((mealPlan) => mealPlanSchema.parse(mealPlan));
  
  // Production: Uncomment when API is ready
  // const response = await apiClient.get<MealPlan[]>(API_ENDPOINTS.MEAL_PLANS.LIST);
  // return response.data.map((mealPlan) => mealPlanSchema.parse(mealPlan));
};

/**
 * Get meal plan by ID
 * Uses dummy data for development
 * TODO: Replace with actual API endpoint once available
 */
export const getMealPlan = async (id: number): Promise<MealPlan> => {
  // Development: Use dummy data
  const mealPlan = dummyMealPlans.find((mp) => mp.id === id);
  if (!mealPlan) {
    throw new Error(`Meal plan with id ${id} not found`);
  }
  return mealPlanSchema.parse(mealPlan);
  
  // Production: Uncomment when API is ready
  // const response = await apiClient.get<MealPlan>(API_ENDPOINTS.MEAL_PLANS.GET(id));
  // return mealPlanSchema.parse(response.data);
};

/**
 * Create a new meal plan
 */
export const createMealPlan = async (data: CreateMealPlanRequest): Promise<MealPlan> => {
  const validatedData = createMealPlanSchema.parse(data);
  const response = await apiClient.post<MealPlan>(API_ENDPOINTS.MEAL_PLANS.CREATE, validatedData);
  return mealPlanSchema.parse(response.data);
};

/**
 * Update meal plan
 */
export const updateMealPlan = async (id: number, data: UpdateMealPlanRequest): Promise<MealPlan> => {
  const validatedData = updateMealPlanSchema.parse(data);
  const response = await apiClient.patch<MealPlan>(API_ENDPOINTS.MEAL_PLANS.UPDATE(id), validatedData);
  return mealPlanSchema.parse(response.data);
};

/**
 * Delete meal plan
 */
export const deleteMealPlan = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.MEAL_PLANS.DELETE(id));
};
