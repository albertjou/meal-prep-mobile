import React from 'react';
import { Card, XStack, YStack, Text, Circle } from 'tamagui';
import { format, parseISO } from 'date-fns';
import type { Meal } from '@/lib/schemas/meal';
import type { User } from '@/lib/schemas/user';

interface MealCellProps {
  meal: Meal;
  chef?: User;
  notEatingUsers?: User[];
  currentUserId?: number;
}

export function MealCell({ meal, chef, notEatingUsers = [], currentUserId }: MealCellProps) {
  const mealDate = parseISO(meal.date);
  const dayName = format(mealDate, 'EEEE'); // e.g., "Monday"
  const dateDisplay = format(mealDate, 'MMM d'); // e.g., "Nov 11"

  return (
    <Card
      elevate
      padding="$4"
      marginBottom="$3"
      backgroundColor="$backgroundStrong"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$borderColor"
    >
      <XStack alignItems="center" justifyContent="space-between" gap="$3">
        <YStack flex={1} gap="$2">
          <XStack alignItems="center" gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              {dayName}
            </Text>
            <Text fontSize="$4" color="$colorFocus">
              {dateDisplay}
            </Text>
          </XStack>
          
          <Text fontSize="$6" fontWeight="700" color="$color" marginTop="$1">
            {meal.title}
          </Text>

          {chef && (
            <XStack alignItems="center" gap="$2" marginTop="$2">
              <Circle
                size={20}
                backgroundColor={chef.color || '#4ECDC4'}
              />
              <Text fontSize="$4" color="$colorFocus">
                Chef: {chef.name}
              </Text>
            </XStack>
          )}

          {notEatingUsers.length > 0 && (
            <XStack alignItems="center" gap="$2" marginTop="$2" flexWrap="wrap">
              <Text fontSize="$3" color="$colorFocus">
                Not eating:
              </Text>
              {notEatingUsers.map((user) => (
                <XStack key={user.id} alignItems="center" gap="$1">
                  <Circle
                    size={16}
                    backgroundColor={user.color || '#FF6B6B'}
                  />
                  <Text fontSize="$3" color="$colorFocus">
                    {user.name}
                  </Text>
                </XStack>
              ))}
            </XStack>
          )}
        </YStack>
      </XStack>
    </Card>
  );
}
