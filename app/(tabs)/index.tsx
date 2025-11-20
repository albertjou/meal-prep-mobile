import { YStack, H2, Paragraph, XStack, Button } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <YStack flex={1} padding="$4" gap="$4" backgroundColor="$background">
        <YStack gap="$2">
          <H2>Weekly Meal Grid</H2>
          <Paragraph theme="alt2">
            This is where the collaborative meal grid will live.
          </Paragraph>
        </YStack>

        <YStack
          flex={1}
          backgroundColor="$backgroundStrong"
          borderRadius="$4"
          alignItems="center"
          justifyContent="center"
          borderWidth={1}
          borderColor="$borderColor"
        >
          <Paragraph color="$colorFocus">
            Grid Component Placeholder
          </Paragraph>
        </YStack>

        <XStack gap="$3" justifyContent="center">
          <Button theme="active">Previous Week</Button>
          <Button theme="active">Next Week</Button>
        </XStack>
      </YStack>
    </SafeAreaView>
  );
}
