import { z } from 'zod';

/**
 * Access level enum for meal plan participants
 */
export const accessLevelSchema = z.enum(['viewer', 'admin']);

export type AccessLevel = z.infer<typeof accessLevelSchema>;

/**
 * Meal Plan Participant schema based on API documentation
 */
export const participantSchema = z.object({
  id: z.number().int().positive(),
  access_level: accessLevelSchema,
  user_id: z.number().int().positive(),
  meal_plan_id: z.number().int().positive(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type Participant = z.infer<typeof participantSchema>;

/**
 * Create participant request schema
 */
export const createParticipantSchema = z.object({
  meal_plan_participant: z.object({
    access_level: accessLevelSchema,
    user_id: z.number().int().positive(),
    meal_plan_id: z.number().int().positive(),
  }),
});

export type CreateParticipantRequest = z.infer<typeof createParticipantSchema>;

/**
 * Update participant request schema
 */
export const updateParticipantSchema = z.object({
  meal_plan_participant: z.object({
    access_level: accessLevelSchema.optional(),
    user_id: z.number().int().positive().optional(),
    meal_plan_id: z.number().int().positive().optional(),
  }),
});

export type UpdateParticipantRequest = z.infer<typeof updateParticipantSchema>;
