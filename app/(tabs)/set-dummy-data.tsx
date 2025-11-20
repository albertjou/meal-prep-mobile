import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { YStack, Card, Text, Button, Spinner } from 'tamagui';
import { useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';

export default function SetDummyDataScreen() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const handleSetDummyData = async () => {
    try {
      setIsLoading(true);
      
      // Haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Invalidate all queries to force refetch with dummy data
      await queryClient.invalidateQueries({ queryKey: ['mealPlans'] });
      await queryClient.invalidateQueries({ queryKey: ['participants'] });
      await queryClient.invalidateQueries({ queryKey: ['meals'] });
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      await queryClient.invalidateQueries({ queryKey: ['mealPlan'] });
      
      // Refetch all queries
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['mealPlans'] }),
        queryClient.refetchQueries({ queryKey: ['participants'] }),
        queryClient.refetchQueries({ queryKey: ['meals'] }),
        queryClient.refetchQueries({ queryKey: ['users'] }),
      ]);

      setLastUpdated(new Date());
      
      // Success haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      console.log('[SetDummyData] Dummy data refreshed successfully');
    } catch (error) {
      console.error('[SetDummyData] Error setting dummy data:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <YStack flex={1} backgroundColor="$background" padding="$4">
      <ScrollView style={{ flex: 1 }}>
        <YStack gap="$4" paddingTop="$4">
          <Card
            elevate
            padding="$6"
            backgroundColor="$backgroundStrong"
            borderRadius="$4"
            gap="$4"
          >
            <YStack gap="$3">
              <Text fontSize="$8" fontWeight="700" color="$color">
                Set Dummy Data
              </Text>
              <Text fontSize="$4" color="$colorFocus">
                This will refresh all data by invalidating and refetching React Query caches.
                All API functions are configured to return dummy data.
              </Text>
              
              {lastUpdated && (
                <Text fontSize="$3" color="$green10" marginTop="$2">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </Text>
              )}

              <Button
                size="$4"
                theme="active"
                onPress={handleSetDummyData}
                disabled={isLoading}
                backgroundColor="$blue10"
                color="white"
                fontWeight="600"
                borderRadius="$4"
                pressStyle={{ scale: 0.95, opacity: 0.8 }}
                animation="quick"
                marginTop="$2"
              >
                {isLoading ? (
                  <YStack flexDirection="row" alignItems="center" gap="$2">
                    <Spinner size="small" color="white" />
                    <Text color="white" fontSize="$5" fontWeight="600">
                      Refreshing...
                    </Text>
                  </YStack>
                ) : (
                  <Text color="white" fontSize="$5" fontWeight="600">
                    Refresh Dummy Data
                  </Text>
                )}
              </Button>
            </YStack>
          </Card>

          <Card
            padding="$4"
            backgroundColor="$backgroundStrong"
            borderRadius="$4"
            gap="$2"
          >
            <Text fontSize="$5" fontWeight="600" color="$color" marginBottom="$2">
              What this does:
            </Text>
            <YStack gap="$2">
              <Text fontSize="$4" color="$colorFocus">
                • Invalidates meal plans cache
              </Text>
              <Text fontSize="$4" color="$colorFocus">
                • Invalidates participants cache
              </Text>
              <Text fontSize="$4" color="$colorFocus">
                • Invalidates meals cache
              </Text>
              <Text fontSize="$4" color="$colorFocus">
                • Invalidates users cache
              </Text>
              <Text fontSize="$4" color="$colorFocus" marginTop="$2">
                • Refetches all data from API functions (which return dummy data)
              </Text>
            </YStack>
          </Card>
        </YStack>
      </ScrollView>
    </YStack>
  );
}


