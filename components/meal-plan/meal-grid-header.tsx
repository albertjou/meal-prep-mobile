import React from 'react';
import { XStack, Text } from 'tamagui';

export function MealGridHeader() {
  return (
    <XStack 
      gap="$2" 
      marginBottom="$1"
      zIndex={2}
      backgroundColor="$background"
    >
      <XStack width={50} alignItems="flex-start" justifyContent="flex-start">
        <Text fontSize="$4" fontWeight="600" color="$color">
          Day
        </Text>
      </XStack>
      <XStack flex={1} gap="$2" marginLeft="$2">
        <XStack flex={1} alignItems="center" justifyContent="center">
          <Text fontSize="$4" fontWeight="600" color="$color">
            Lunch
          </Text>
        </XStack>
        <XStack flex={1} alignItems="center" justifyContent="center">
          <Text fontSize="$4" fontWeight="600" color="$color">
            Dinner
          </Text>
        </XStack>
      </XStack>
    </XStack>
  );
}

