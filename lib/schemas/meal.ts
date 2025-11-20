import { z } from 'zod';

/**
 * Meal schema based on API documentation
 * Note: The API doesn't specify meal_type (lunch/dinner) - this may need to be added
 * Note: not_eating_users structure is not specified - assuming array of user IDs
 */
export const mealSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // ISO date format YYYY-MM-DD
  meal_plan_id: z.number().int().positive(),
  chef_id: z.number().int().positive(),
  meal_type: z.number().int().min(0).max(1), // 0 for dinner, 1 for lunch
  not_eating_users: z.array(z.number().int().positive()).default([]), // Array of user IDs
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type Meal = z.infer<typeof mealSchema>;

/**
 * Create meal request schema
 */
export const createMealSchema = z.object({
  meal: z.object({
    title: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    meal_plan_id: z.number().int().positive(),
    chef_id: z.number().int().positive(),
    meal_type: z.number().int().min(0).max(1), // 0 for dinner, 1 for lunch
    not_eating_users: z.array(z.number().int().positive()).optional().default([]),
  }),
});

export type CreateMealRequest = z.infer<typeof createMealSchema>;

/**
 * Update meal request schema
 */
export const updateMealSchema = z.object({
  meal: z.object({
    title: z.string().min(1).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    meal_plan_id: z.number().int().positive().optional(),
    chef_id: z.number().int().positive().optional(),
    meal_type: z.number().int().min(0).max(1).optional(), // 0 for dinner, 1 for lunch
    not_eating_users: z.array(z.number().int().positive()).optional(),
  }),
});

export type UpdateMealRequest = z.infer<typeof updateMealSchema>;
