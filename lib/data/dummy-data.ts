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
    end_date: '2024-11-24', // Extended to 2 weeks
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

// Helper function to format date as YYYY-MM-DD
const formatDate = (year: number, month: number, day: number): string => {
  const monthStr = month.toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  return `${year}-${monthStr}-${dayStr}`;
};

// Generate 2 weeks of meals for meal plan 1 (14 days, starting Nov 11, 2024)
// Each day has one lunch (meal_type: 1) and one dinner (meal_type: 0)
const generateMealPlan1Meals = (): Meal[] => {
  const meals: Meal[] = [];
  const startDate = new Date(2024, 10, 11); // November 11, 2024 (month is 0-indexed)
  const lunchTitles = [
    'Caesar Salad', 'Turkey Sandwich', 'Chicken Wrap', 'Quinoa Bowl', 'Soup & Salad',
    'Pasta Salad', 'Burrito Bowl', 'Greek Salad', 'Sushi Rolls', 'Caprese Salad',
    'Chicken Caesar Wrap', 'Mediterranean Bowl', 'Taco Salad', 'Asian Noodle Bowl'
  ];
  const dinnerTitles = [
    'Spaghetti Bolognese', 'Grilled Chicken', 'Beef Stir Fry', 'Taco Tuesday', 'Pizza Night',
    'BBQ Ribs', 'Salmon Teriyaki', 'Chicken Curry', 'Beef Tacos', 'Pasta Carbonara',
    'Grilled Steak', 'Chicken Parmesan', 'Beef Burgers', 'Roast Chicken'
  ];
  const chefIds = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2]; // Rotate between users 1, 2, 3

  let mealId = 1;
  for (let day = 0; day < 14; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);
    const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
    const chefId = chefIds[day % chefIds.length];
    const nextChefId = chefIds[(day + 1) % chefIds.length];

    // Lunch (meal_type: 1)
    meals.push({
      id: mealId++,
      title: lunchTitles[day % lunchTitles.length],
      date: dateStr,
      meal_plan_id: 1,
      chef_id: chefId,
      meal_type: 1,
      not_eating_users: day === 1 ? [3] : [], // Day 2 lunch has user 3 not eating
      created_at: '2024-11-01T10:00:00Z',
      updated_at: '2024-11-01T10:00:00Z',
    });

    // Dinner (meal_type: 0)
    meals.push({
      id: mealId++,
      title: dinnerTitles[day % dinnerTitles.length],
      date: dateStr,
      meal_plan_id: 1,
      chef_id: nextChefId,
      meal_type: 0,
      not_eating_users: [],
      created_at: '2024-11-01T10:00:00Z',
      updated_at: '2024-11-01T10:00:00Z',
    });
  }

  return meals;
};

export const dummyMeals: Meal[] = [
  ...generateMealPlan1Meals(),
  // Meal for meal plan 3
  {
    id: 29,
    title: 'BBQ Ribs',
    date: '2024-11-18',
    meal_plan_id: 3,
    chef_id: 2,
    meal_type: 0,
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

