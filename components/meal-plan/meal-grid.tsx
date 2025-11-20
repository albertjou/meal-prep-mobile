import React from 'react';
import { YStack, XStack } from 'tamagui';
import { MealGridHeader } from './meal-grid-header';
import { DayColumn } from './day-column';
import { WeekCarousel } from './week-carousel';
import type { Meal } from '@/lib/schemas/meal';
import type { User } from '@/lib/schemas/user';

interface MealGridProps {
  currentWeekStart: Date;
  meals: Meal[];
  users?: User[];
  canGoPrevious: boolean;
  canGoNext: boolean;
  onWeekChange: (direction: 'prev' | 'next') => void;
  onMealPress?: (dateStr: string, mealType: 'lunch' | 'dinner') => void;
}

export function MealGrid({
  currentWeekStart,
  meals,
  users,
  canGoPrevious,
  canGoNext,
  onWeekChange,
  onMealPress,
}: MealGridProps) {
  return (
    <YStack 
      flex={1}
      padding="$4" 
      gap="$1.5"
      overflow="hidden"
    >
      {/* Fixed Header */}
      <MealGridHeader />

      {/* Grid Content: Day Column + Carousel */}
      <XStack flex={1} position="relative" overflow="hidden" gap={0}>
        {/* Fixed Day Column */}
        <DayColumn weekStart={currentWeekStart} />

        {/* Animated Carousel */}
        <WeekCarousel
          currentWeekStart={currentWeekStart}
          meals={meals}
          users={users}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          onWeekChange={onWeekChange}
          onMealPress={onMealPress}
        />
      </XStack>
    </YStack>
  );
}
