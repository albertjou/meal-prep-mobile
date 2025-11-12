import { useState } from 'react';
import { YStack, Button, Text, H1, Paragraph, Card } from 'tamagui';
import { useAuthStore } from '@/lib/store/auth-store';
import { defaultUser, MOCK_ACCESS_TOKEN, MOCK_REFRESH_TOKEN } from '@/lib/data/dummy-data';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { login } = useAuthStore();

  const handleAutoLogin = async () => {
    try {
      // Haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Simulate login with dummy data
      login(defaultUser, MOCK_ACCESS_TOKEN, MOCK_REFRESH_TOKEN);

      // Set authenticated state to show message
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding="$4"
      backgroundColor="$background"
      gap="$4"
    >
      <Card
        elevate
        padding="$6"
        borderRadius="$4"
        backgroundColor="$backgroundStrong"
        width="100%"
        maxWidth={400}
        gap="$4"
      >
        <YStack alignItems="center" gap="$2">
          <H1 color="$color" fontSize="$10" fontWeight="bold">
            Meal Prep
          </H1>
          <Paragraph color="$colorFocus" fontSize="$5" textAlign="center">
            Plan your meals together
          </Paragraph>
        </YStack>

        <YStack gap="$3" marginTop="$4" alignItems="center">
          {!isAuthenticated ? (
            <Button
              size="$4"
              theme="active"
              onPress={handleAutoLogin}
              backgroundColor="$blue10"
              color="white"
              fontWeight="600"
              borderRadius="$4"
              pressStyle={{ scale: 0.95, opacity: 0.8 }}
              animation="quick"
            >
              <Text color="white" fontSize="$5" fontWeight="600">
                Sign In
              </Text>
            </Button>
          ) : (
            <Text fontSize="$6" fontWeight="bold" color="$green10">
              authenticated
            </Text>
          )}

          <Paragraph
            color="$colorFocus"
            fontSize="$3"
            textAlign="center"
            marginTop="$2"
          >
            Using demo account: {defaultUser.name}
          </Paragraph>
        </YStack>
      </Card>
    </YStack>
  );
}
