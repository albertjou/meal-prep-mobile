import { useRouter } from 'expo-router';
import { YStack, Button, Text, H1, Paragraph, Card } from 'tamagui';
import { useAuthStore } from '@/lib/store/auth-store';
import { defaultUser, MOCK_ACCESS_TOKEN, MOCK_REFRESH_TOKEN } from '@/lib/data/dummy-data';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();

  const handleAutoLogin = async () => {
    try {
      // Haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Simulate login with dummy data
      login(defaultUser, MOCK_ACCESS_TOKEN, MOCK_REFRESH_TOKEN);

      // Small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Navigate to main app
      router.push('/(tabs)');
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

        <YStack gap="$3" marginTop="$4">
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

