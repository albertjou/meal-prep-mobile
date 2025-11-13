import React, { useEffect, useState } from 'react';
import { ScrollView, Pressable } from 'react-native';
import { YStack, Card, Text, XStack, Spinner } from 'tamagui';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { getMealPlans } from '@/lib/api/meal-plans';
import { getParticipants } from '@/lib/api/participants';
import { useAuthStore } from '@/lib/store/auth-store';
import { Header } from '@/components/meal-plan/header';
import type { MealPlan } from '@/lib/schemas/meal-plan';

export default function MealPlansIndexScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [accessibleMealPlans, setAccessibleMealPlans] = useState<MealPlan[]>([]);

  // Fetch all meal plans
  const { data: mealPlans, isLoading: mealPlansLoading } = useQuery({
    queryKey: ['mealPlans'],
    queryFn: getMealPlans,
  });

  // Fetch all participants
  const { data: participants, isLoading: participantsLoading } = useQuery({
    queryKey: ['participants'],
    queryFn: getParticipants,
  });

  useEffect(() => {
    if (!user || !mealPlans || !participants) return;

    // Filter meal plans where user is owner or participant
    const userMealPlanIds = new Set<number>();
    
    // Add meal plans where user is owner
    mealPlans
      .filter((mp) => mp.owner_id === user.id)
      .forEach((mp) => userMealPlanIds.add(mp.id));

    // Add meal plans where user is a participant
    participants
      .filter((p) => p.user_id === user.id)
      .forEach((p) => userMealPlanIds.add(p.meal_plan_id));

    const accessible = mealPlans.filter((mp) => userMealPlanIds.has(mp.id));
    setAccessibleMealPlans(accessible);
  }, [user, mealPlans, participants]);

  const handleMealPlanPress = (mealPlanId: number) => {
    router.push(`/(tabs)/meal-plans/${mealPlanId}`);
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  };

  if (mealPlansLoading || participantsLoading) {
    return (
      <YStack flex={1} backgroundColor="$background">
        <Header title="Meal Plans" />
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Spinner size="large" color="$blue10" />
        </YStack>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <Header title="Meal Plans" />
      <ScrollView style={{ flex: 1 }}>
        <YStack padding="$4" gap="$3">
          {accessibleMealPlans.length === 0 ? (
            <Card
              padding="$6"
              backgroundColor="$backgroundStrong"
              borderRadius="$4"
              alignItems="center"
            >
              <Text fontSize="$5" color="$colorFocus" textAlign="center">
                No meal plans found
              </Text>
              <Text fontSize="$4" color="$colorFocus" textAlign="center" marginTop="$2">
                Create a new meal plan to get started
              </Text>
            </Card>
          ) : (
            accessibleMealPlans.map((mealPlan) => (
              <Pressable
                key={mealPlan.id}
                onPress={() => handleMealPlanPress(mealPlan.id)}
              >
                <Card
                  elevate
                  padding="$4"
                  backgroundColor="$backgroundStrong"
                  borderRadius="$4"
                  borderWidth={1}
                  borderColor="$borderColor"
                  pressStyle={{ scale: 0.98, opacity: 0.9 }}
                  animation="quick"
                >
                  <YStack gap="$2">
                    <Text fontSize="$7" fontWeight="700" color="$color">
                      {mealPlan.title}
                    </Text>
                    {mealPlan.description && (
                      <Text fontSize="$4" color="$colorFocus">
                        {mealPlan.description}
                      </Text>
                    )}
                    <XStack alignItems="center" gap="$2" marginTop="$2">
                      <Text fontSize="$3" color="$colorFocus">
                        {formatDateRange(mealPlan.start_date, mealPlan.end_date)}
                      </Text>
                      {mealPlan.owner_id === user?.id && (
                        <Text fontSize="$3" color="$blue10" fontWeight="500">
                          • Owner
                        </Text>
                      )}
                    </XStack>
                  </YStack>
                </Card>
              </Pressable>
            ))
          )}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
