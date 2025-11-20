import React from 'react';
import { YStack } from 'tamagui';
import { MealRowCells } from './meal-row-cells';
import { getWeekDays } from '@/lib/utils/date';
import type { Meal } from '@/lib/schemas/meal';
import type { User } from '@/lib/schemas/user';

interface WeekFrameProps {
  weekStart: Date;
  mealsByDateAndType: Map<string, Meal>;
  users?: User[];
  onMealPress?: (dateStr: string, mealType: 'lunch' | 'dinner') => void;
}

export function WeekFrame({
  weekStart,
  mealsByDateAndType,
  users,
  onMealPress,
}: WeekFrameProps) {
  const weekDays = getWeekDays(weekStart, 1); // Week starts on Monday

  // Get user by ID helper
  const getUserById = (userId: number): User | undefined => {
    return users?.find((u) => u.id === userId);
  };

  // Get meal for a specific date and meal type
  const getMealForDateAndType = (date: string, mealType: number): Meal | null => {
    const key = `${date}-${mealType}`;
    return mealsByDateAndType.get(key) || null;
  };

  return (
    <YStack flex={1} gap="$1.5" width="100%" padding={0}>
      {/* Spacer for header */}
      <YStack height={28} marginBottom="$1" />
      
      {/* Meal rows (without day column) */}
      {weekDays.map((dateStr) => {
        const lunchMeal = getMealForDateAndType(dateStr, 1);
        const dinnerMeal = getMealForDateAndType(dateStr, 0);
        
        const lunchChef = lunchMeal ? getUserById(lunchMeal.chef_id) : undefined;
        const dinnerChef = dinnerMeal ? getUserById(dinnerMeal.chef_id) : undefined;
        
        const lunchNotEating = lunchMeal
          ? lunchMeal.not_eating_users
              .map((userId) => getUserById(userId))
              .filter((u): u is User => u !== undefined)
          : [];
        const dinnerNotEating = dinnerMeal
          ? dinnerMeal.not_eating_users
              .map((userId) => getUserById(userId))
              .filter((u): u is User => u !== undefined)
          : [];

        return (
          <YStack key={dateStr} flex={1} minHeight={0}>
            <MealRowCells
              dateStr={dateStr}
              lunchMeal={lunchMeal}
              dinnerMeal={dinnerMeal}
              lunchChef={lunchChef}
              dinnerChef={dinnerChef}
              lunchNotEating={lunchNotEating}
              dinnerNotEating={dinnerNotEating}
              onMealPress={onMealPress}
            />
          </YStack>
        );
      })}
    </YStack>
  );
}

