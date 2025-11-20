import React, { useMemo } from 'react';
import { YStack, Text, Spinner } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getMealPlan } from '@/lib/api/meal-plans';
import { getMeals } from '@/lib/api/meals';
import { getUsers } from '@/lib/api/users';
import { getParticipants } from '@/lib/api/participants';
import { TopNav } from '@/components/meal-plan/top-nav';
import { ParticipantsBar } from '@/components/meal-plan/participants-bar';
import { MealGrid } from '@/components/meal-plan/meal-grid';
import { useWeekNavigation } from '@/hooks/use-week-navigation';
import type { User } from '@/lib/schemas/user';

export function MealPlanWeekView() {
  const params = useLocalSearchParams<{ id: string }>();
  const { id } = params;
  const mealPlanId = parseInt(id || '0', 10);

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

  // Fetch participants for this meal plan
  const { data: participants } = useQuery({
    queryKey: ['participants', mealPlanId],
    queryFn: () => getParticipants(mealPlanId),
    enabled: !!mealPlanId,
  });

  // Get participant users
  const participantUsers = useMemo(() => {
    if (!participants || !users) {
      console.log('[MealPlan] Missing data:', { participants: !!participants, users: !!users });
      return [];
    }
    const mapped = participants
      .map((p) => {
        const user = users.find((u) => u.id === p.user_id);
        if (!user) {
          console.log('[MealPlan] User not found for participant:', p.user_id);
        }
        return user;
      })
      .filter((u): u is User => u !== undefined);
    console.log('[MealPlan] Participant users:', mapped.length, mapped.map(u => u.name));
    return mapped;
  }, [participants, users]);

  // Week navigation hook
  const {
    currentWeekStart,
    canGoPrevious,
    canGoNext,
    updateWeekState,
    weekLabel,
  } = useWeekNavigation({ mealPlan });

  // Settings handler
  const handleSettingsPress = React.useCallback(() => {
    console.log('Settings pressed');
    // TODO: Navigate to settings screen
  }, []);

  // Meal press handler
  const handleMealPress = React.useCallback((dateStr: string, mealType: 'lunch' | 'dinner') => {
    console.log(`${mealType} cell pressed for`, dateStr);
    // TODO: Handle meal cell press
  }, []);

  // Navigation handlers for TopNav buttons
  // NOTE: These must be defined before any conditional returns to follow Rules of Hooks
  const handlePreviousWeek = React.useCallback(() => {
    updateWeekState('prev');
  }, [updateWeekState]);

  const handleNextWeek = React.useCallback(() => {
    updateWeekState('next');
  }, [updateWeekState]);

  if (mealPlanLoading || mealsLoading) {
    return (
      <YStack flex={1} backgroundColor="$background">
        <TopNav />
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Spinner size="large" color="$blue10" />
          <Text fontSize="$4" color="$colorFocus" marginTop="$4">
            Loading data...
          </Text>
        </YStack>
        <ParticipantsBar participants={[]} />
      </YStack>
    );
  }

  if (!mealPlan) {
    return (
      <YStack flex={1} backgroundColor="$background">
        <TopNav />
        <YStack flex={1} alignItems="center" justifyContent="center" padding="$4">
          <Text fontSize="$5" color="$colorFocus" textAlign="center">
            Meal plan not found
          </Text>
        </YStack>
        <ParticipantsBar participants={[]} />
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <TopNav
        onPrevious={handlePreviousWeek}
        onNext={handleNextWeek}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        currentLabel={weekLabel}
      />
      
      <MealGrid
        currentWeekStart={currentWeekStart}
        meals={meals || []}
        users={users}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        onWeekChange={updateWeekState}
        onMealPress={handleMealPress}
      />

      <ParticipantsBar
        participants={participantUsers}
        onSettingsPress={handleSettingsPress}
      />
    </YStack>
  );
}

