import React from 'react';
import { XStack } from 'tamagui';
import { MealCell } from './meal-cell';
import type { Meal } from '@/lib/schemas/meal';
import type { User } from '@/lib/schemas/user';

interface MealRowCellsProps {
  lunchMeal: Meal | null;
  dinnerMeal: Meal | null;
  lunchChef?: User;
  dinnerChef?: User;
  lunchNotEating: User[];
  dinnerNotEating: User[];
  onMealPress?: (dateStr: string, mealType: 'lunch' | 'dinner') => void;
  dateStr: string;
}

export function MealRowCells({
  lunchMeal,
  dinnerMeal,
  lunchChef,
  dinnerChef,
  lunchNotEating,
  dinnerNotEating,
  onMealPress,
  dateStr,
}: MealRowCellsProps) {
  return (
    <XStack flex={1} gap="$2" minHeight={0}>
      {/* Lunch Column */}
      <XStack flex={1} minHeight={0}>
        <MealCell
          meal={lunchMeal}
          chef={lunchChef}
          notEatingUsers={lunchNotEating}
          onPress={() => onMealPress?.(dateStr, 'lunch')}
        />
      </XStack>

      {/* Dinner Column */}
      <XStack flex={1} minHeight={0}>
        <MealCell
          meal={dinnerMeal}
          chef={dinnerChef}
          notEatingUsers={dinnerNotEating}
          onPress={() => onMealPress?.(dateStr, 'dinner')}
        />
      </XStack>
    </XStack>
  );
}

