import React from 'react';
import { YStack, XStack, Text, Circle, Card } from 'tamagui';
import type { Meal } from '@/lib/schemas/meal';
import type { User } from '@/lib/schemas/user';

interface MealCellProps {
  meal: Meal | null;
  chef?: User;
  notEatingUsers?: User[];
  onPress?: () => void;
}

export function MealCell({ meal, chef, notEatingUsers = [], onPress }: MealCellProps) {
  if (!meal) {
    return (
      <Card
        padding="$2"
        backgroundColor="$backgroundStrong"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$borderColor"
        flex={1}
        width="100%"
        onPress={onPress}
        pressStyle={{ opacity: 0.7 }}
        animation="quick"
      >
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Text fontSize="$2" color="$colorFocus" opacity={0.5}>
            Empty
          </Text>
        </YStack>
      </Card>
    );
  }

  return (
    <Card
      padding="$2"
      backgroundColor="$backgroundStrong"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$borderColor"
      flex={1}
      width="100%"
      onPress={onPress}
      pressStyle={{ opacity: 0.7 }}
      animation="quick"
    >
      <YStack flex={1} justifyContent="center" alignItems="center" gap="$1">
        <Text 
          fontSize="$4" 
          fontWeight="600" 
          color="$color" 
          numberOfLines={2}
          textAlign="center"
        >
          {meal.title}
        </Text>
        
        {chef && (
          <XStack alignItems="center" gap="$1">
            <Circle
              size={10}
              backgroundColor={chef.color || '#4ECDC4'}
            />
            <Text fontSize="$2" color="$colorFocus" numberOfLines={1}>
              {chef.name}
            </Text>
          </XStack>
        )}

        {notEatingUsers.length > 0 && (
          <XStack alignItems="center" gap="$0.5" flexWrap="wrap">
            {notEatingUsers.slice(0, 2).map((user) => (
              <Circle
                key={user.id}
                size={8}
                backgroundColor={user.color || '#FF6B6B'}
              />
            ))}
            {notEatingUsers.length > 2 && (
              <Text fontSize="$1" color="$colorFocus">
                +{notEatingUsers.length - 2}
              </Text>
            )}
          </XStack>
        )}
      </YStack>
    </Card>
  );
}
