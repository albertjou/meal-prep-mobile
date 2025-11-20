import React from 'react';
import { XStack, Text } from 'tamagui';
import { format, parseISO } from 'date-fns';
import { MealCell } from './meal-cell';
import type { Meal } from '@/lib/schemas/meal';
import type { User } from '@/lib/schemas/user';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface MealGridRowProps {
  dateStr: string;
  index: number;
  lunchMeal: Meal | null;
  dinnerMeal: Meal | null;
  lunchChef?: User;
  dinnerChef?: User;
  lunchNotEating: User[];
  dinnerNotEating: User[];
  onMealPress?: (dateStr: string, mealType: 'lunch' | 'dinner') => void;
}

export function MealGridRow({
  dateStr,
  index,
  lunchMeal,
  dinnerMeal,
  lunchChef,
  dinnerChef,
  lunchNotEating,
  dinnerNotEating,
  onMealPress,
}: MealGridRowProps) {
  const date = parseISO(dateStr);
  const dayName = DAYS_OF_WEEK[index];
  const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <XStack flex={1} minHeight={0} position="relative" alignItems="stretch">
      {/* Day Column - Fixed, no animation, top z-index with full-height background */}
      <XStack 
        width={50} 
        alignItems="flex-start" 
        justifyContent="center"
        zIndex={2}
        backgroundColor="$background"
        paddingRight="$2"
        position="absolute"
        left={0}
        top={0}
        bottom={0}
        style={{ height: '100%' }}
      >
        <Text
          fontSize="$4"
          fontWeight={isToday ? '700' : '500'}
          color="$color"
          numberOfLines={1}
        >
          {isToday ? dayName.toUpperCase() : dayName}
        </Text>
      </XStack>

      {/* Meal Columns - Lower z-index, slides behind day column */}
      <XStack 
        flex={1} 
        zIndex={1}
        position="relative"
        marginLeft={50} // Offset for fixed day column
      >
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
      </XStack>
    </XStack>
  );
}

