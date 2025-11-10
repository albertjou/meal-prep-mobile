import { z } from 'zod';

/**
 * User schema based on API documentation
 */
export const userSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  name: z.string().min(1),
  color: z.string().optional(), // Hex color string (e.g., "#FF0000")
  token: z.string().optional(), // Auth token (may not be present in all responses)
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type User = z.infer<typeof userSchema>;

/**
 * Create user request schema
 */
export const createUserSchema = z.object({
  user: z.object({
    email: z.string().email(),
    name: z.string().min(1),
    color: z.string().optional(),
    token: z.string().optional(),
  }),
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;

/**
 * Update user request schema
 */
export const updateUserSchema = z.object({
  user: z.object({
    email: z.string().email().optional(),
    name: z.string().min(1).optional(),
    color: z.string().optional(),
    token: z.string().optional(),
  }),
});

export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
