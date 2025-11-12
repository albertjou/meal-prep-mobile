import type { User } from '@/lib/schemas/user';
import type { MealPlan } from '@/lib/schemas/meal-plan';
import type { Meal } from '@/lib/schemas/meal';
import type { Participant } from '@/lib/schemas/participant';

/**
 * Dummy data for development and testing
 * Based on API schema from docs/meal-prep-api.yaml
 */

export const dummyUsers: User[] = [
  {
    id: 1,
    email: 'alice@example.com',
    name: 'Alice Johnson',
    color: '#FF6B6B',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    email: 'bob@example.com',
    name: 'Bob Smith',
    color: '#4ECDC4',
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
  },
  {
    id: 3,
    email: 'charlie@example.com',
    name: 'Charlie Brown',
    color: '#45B7D1',
    created_at: '2024-01-17T10:00:00Z',
    updated_at: '2024-01-17T10:00:00Z',
  },
  {
    id: 4,
    email: 'diana@example.com',
    name: 'Diana Prince',
    color: '#FFA07A',
    created_at: '2024-01-18T10:00:00Z',
    updated_at: '2024-01-18T10:00:00Z',
  },
];

export const dummyMealPlans: MealPlan[] = [
  {
    id: 1,
    title: 'Weekly Family Meal Plan',
    description: 'Our family meal plan for the week',
    start_date: '2024-11-11',
    end_date: '2024-11-17',
    owner_id: 1,
    created_at: '2024-11-01T10:00:00Z',
    updated_at: '2024-11-01T10:00:00Z',
  },
  {
    id: 2,
    title: 'Holiday Meal Planning',
    description: 'Special meals for the holiday season',
    start_date: '2024-12-20',
    end_date: '2024-12-31',
    owner_id: 1,
    created_at: '2024-11-05T10:00:00Z',
    updated_at: '2024-11-05T10:00:00Z',
  },
  {
    id: 3,
    title: 'Roommate Meal Schedule',
    description: 'Shared meal planning with roommates',
    start_date: '2024-11-18',
    end_date: '2024-11-24',
    owner_id: 2,
    created_at: '2024-11-10T10:00:00Z',
    updated_at: '2024-11-10T10:00:00Z',
  },
];

export const dummyMeals: Meal[] = [
  {
    id: 1,
    title: 'Spaghetti Bolognese',
    date: '2024-11-11',
    meal_plan_id: 1,
    chef_id: 1,
    not_eating_users: [],
    created_at: '2024-11-01T10:00:00Z',
    updated_at: '2024-11-01T10:00:00Z',
  },
  {
    id: 2,
    title: 'Grilled Chicken Salad',
    date: '2024-11-12',
    meal_plan_id: 1,
    chef_id: 2,
    not_eating_users: [3],
    created_at: '2024-11-01T11:00:00Z',
    updated_at: '2024-11-01T11:00:00Z',
  },
  {
    id: 3,
    title: 'Vegetarian Stir Fry',
    date: '2024-11-13',
    meal_plan_id: 1,
    chef_id: 3,
    not_eating_users: [],
    created_at: '2024-11-01T12:00:00Z',
    updated_at: '2024-11-01T12:00:00Z',
  },
  {
    id: 4,
    title: 'Taco Tuesday',
    date: '2024-11-14',
    meal_plan_id: 1,
    chef_id: 1,
    not_eating_users: [],
    created_at: '2024-11-01T13:00:00Z',
    updated_at: '2024-11-01T13:00:00Z',
  },
  {
    id: 5,
    title: 'Pizza Night',
    date: '2024-11-15',
    meal_plan_id: 1,
    chef_id: 2,
    not_eating_users: [],
    created_at: '2024-11-01T14:00:00Z',
    updated_at: '2024-11-01T14:00:00Z',
  },
  {
    id: 6,
    title: 'BBQ Ribs',
    date: '2024-11-18',
    meal_plan_id: 3,
    chef_id: 2,
    not_eating_users: [],
    created_at: '2024-11-10T10:00:00Z',
    updated_at: '2024-11-10T10:00:00Z',
  },
];

export const dummyParticipants: Participant[] = [
  {
    id: 1,
    access_level: 'admin',
    user_id: 1,
    meal_plan_id: 1,
    created_at: '2024-11-01T10:00:00Z',
    updated_at: '2024-11-01T10:00:00Z',
  },
  {
    id: 2,
    access_level: 'viewer',
    user_id: 2,
    meal_plan_id: 1,
    created_at: '2024-11-01T10:00:00Z',
    updated_at: '2024-11-01T10:00:00Z',
  },
  {
    id: 3,
    access_level: 'viewer',
    user_id: 3,
    meal_plan_id: 1,
    created_at: '2024-11-01T10:00:00Z',
    updated_at: '2024-11-01T10:00:00Z',
  },
  {
    id: 4,
    access_level: 'admin',
    user_id: 1,
    meal_plan_id: 2,
    created_at: '2024-11-05T10:00:00Z',
    updated_at: '2024-11-05T10:00:00Z',
  },
  {
    id: 5,
    access_level: 'admin',
    user_id: 2,
    meal_plan_id: 3,
    created_at: '2024-11-10T10:00:00Z',
    updated_at: '2024-11-10T10:00:00Z',
  },
  {
    id: 6,
    access_level: 'viewer',
    user_id: 3,
    meal_plan_id: 3,
    created_at: '2024-11-10T10:00:00Z',
    updated_at: '2024-11-10T10:00:00Z',
  },
];

/**
 * Default user for auto-login
 */
export const defaultUser = dummyUsers[0];

/**
 * Mock access token for development
 */
export const MOCK_ACCESS_TOKEN = 'mock_access_token_12345';
export const MOCK_REFRESH_TOKEN = 'mock_refresh_token_12345';

