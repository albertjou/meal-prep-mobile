import { z } from 'zod';

/**
 * Meal Plan schema based on API documentation
 */
export const mealPlanSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // ISO date format YYYY-MM-DD
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // ISO date format YYYY-MM-DD
  owner_id: z.number().int().positive(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type MealPlan = z.infer<typeof mealPlanSchema>;

/**
 * Create meal plan request schema
 */
export const createMealPlanSchema = z.object({
  meal_plan: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    owner_id: z.number().int().positive(),
  }),
});

export type CreateMealPlanRequest = z.infer<typeof createMealPlanSchema>;

/**
 * Update meal plan request schema
 */
export const updateMealPlanSchema = z.object({
  meal_plan: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    owner_id: z.number().int().positive().optional(),
  }),
});

export type UpdateMealPlanRequest = z.infer<typeof updateMealPlanSchema>;
