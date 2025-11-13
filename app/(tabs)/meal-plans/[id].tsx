import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { YStack, Text, Spinner } from 'tamagui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO, addWeeks, startOfWeek, endOfWeek, isSameWeek } from 'date-fns';
import { getMealPlan } from '@/lib/api/meal-plans';
import { getMeals } from '@/lib/api/meals';
import { getUsers } from '@/lib/api/users';
import { Header } from '@/components/meal-plan/header';
import { BottomNav } from '@/components/meal-plan/bottom-nav';
import { MealCell } from '@/components/meal-plan/meal-cell';
import { getWeekDays } from '@/lib/utils/date';
import type { Meal } from '@/lib/schemas/meal';
import type { User } from '@/lib/schemas/user';

export default function MealPlanShowScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const mealPlanId = parseInt(id || '0', 10);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());

  // Fetch meal plan
  const { data: mealPlan, isLoading: mealPlanLoading } = useQuery({
    queryKey: ['mealPlan', mealPlanId],
    queryFn: () => getMealPlan(mealPlanId),
    enabled: !!mealPlanId,
  });

  // Fetch meals for this meal plan
  const { data: meals, isLoading: mealsLoading } = useQuery({
    queryKey: ['meals', mealPlanId],
    queryFn: () => getMeals({ meal_plan_id: mealPlanId }),
    enabled: !!mealPlanId,
  });

  // Fetch all users (for chef and not eating users)
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  // Get current week's days
  const weekDays = useMemo(() => {
    return getWeekDays(currentWeekStart, 1); // Week starts on Monday
  }, [currentWeekStart]);

  // Filter meals for current week
  const currentWeekMeals = useMemo(() => {
    if (!meals) return [];
    
    return meals.filter((meal) => {
      const mealDate = parseISO(meal.date);
      return isSameWeek(mealDate, currentWeekStart, { weekStartsOn: 1 });
    }).sort((a, b) => {
      const dateA = parseISO(a.date);
      const dateB = parseISO(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  }, [meals, currentWeekStart]);

  // Create a map of meals by date for easy lookup
  const mealsByDate = useMemo(() => {
    const map = new Map<string, Meal>();
    currentWeekMeals.forEach((meal) => {
      map.set(meal.date, meal);
    });
    return map;
  }, [currentWeekMeals]);

  // Get user by ID helper
  const getUserById = (userId: number): User | undefined => {
    return users?.find((u) => u.id === userId);
  };

  // Navigation handlers
  const handlePreviousWeek = () => {
    setCurrentWeekStart((prev) => {
      const newDate = addWeeks(prev, -1);
      return startOfWeek(newDate, { weekStartsOn: 1 });
    });
  };

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => {
      const newDate = addWeeks(prev, 1);
      return startOfWeek(newDate, { weekStartsOn: 1 });
    });
  };

  // Check if we can navigate
  const canGoPrevious = useMemo(() => {
    if (!mealPlan) return false;
    const planStart = parseISO(mealPlan.start_date);
    const weekStart = startOfWeek(currentWeekStart, { weekStartsOn: 1 });
    return weekStart > planStart;
  }, [mealPlan, currentWeekStart]);

  const canGoNext = useMemo(() => {
    if (!mealPlan) return false;
    const planEnd = parseISO(mealPlan.end_date);
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    return weekEnd < planEnd;
  }, [mealPlan, currentWeekStart]);

  // Format week label
  const weekLabel = useMemo(() => {
    const weekStart = startOfWeek(currentWeekStart, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`;
  }, [currentWeekStart]);

  // Set initial week to meal plan start date
  useEffect(() => {
    if (mealPlan) {
      const planStart = parseISO(mealPlan.start_date);
      setCurrentWeekStart(startOfWeek(planStart, { weekStartsOn: 1 }));
    }
  }, [mealPlan]);

  if (mealPlanLoading || mealsLoading) {
    return (
      <YStack flex={1} backgroundColor="$background">
        <Header title="Meal Plan" showBackButton />
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Spinner size="large" color="$blue10" />
        </YStack>
      </YStack>
    );
  }

  if (!mealPlan) {
    return (
      <YStack flex={1} backgroundColor="$background">
        <Header title="Meal Plan" showBackButton />
        <YStack flex={1} alignItems="center" justifyContent="center" padding="$4">
          <Text fontSize="$5" color="$colorFocus" textAlign="center">
            Meal plan not found
          </Text>
        </YStack>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <Header title={mealPlan.title} showBackButton />
      
      <ScrollView style={{ flex: 1 }}>
        <YStack padding="$4" gap="$3">
          {mealPlan.description && (
            <Text fontSize="$4" color="$colorFocus" marginBottom="$2">
              {mealPlan.description}
            </Text>
          )}

          {currentWeekMeals.length === 0 ? (
            <YStack
              padding="$6"
              backgroundColor="$backgroundStrong"
              borderRadius="$4"
              alignItems="center"
            >
              <Text fontSize="$5" color="$colorFocus" textAlign="center">
                No meals scheduled for this week
              </Text>
            </YStack>
          ) : (
            currentWeekMeals.map((meal) => {
              const chef = getUserById(meal.chef_id);
              const notEatingUsers = meal.not_eating_users
                .map((userId) => getUserById(userId))
                .filter((u): u is User => u !== undefined);

              return (
                <MealCell
                  key={meal.id}
                  meal={meal}
                  chef={chef}
                  notEatingUsers={notEatingUsers}
                />
              );
            })
          )}
        </YStack>
      </ScrollView>

      <BottomNav
        onPrevious={handlePreviousWeek}
        onNext={handleNextWeek}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        currentLabel={weekLabel}
      />
    </YStack>
  );
}
