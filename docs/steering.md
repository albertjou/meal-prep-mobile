# 🧭 Project Steering & Vibe

This document serves as the "North Star" for development, ensuring all code and design decisions align with the intended "vibe" of the application.

## 1. The Vibe (Aesthetics & Feel)
*   **Core Emotion**: Collaborative, Lightweight, Joyful.
*   **Visual Style**: 
    *   **Minimalist**: Clean lines, generous whitespace (padding `$4`+).
    *   **Roundness**: Soft corners (`borderRadius="$4"` or `$true`).
    *   **Color**: Distinct accent colors for each user, but neutral backgrounds.
*   **Interaction**: 
    *   **Snappy**: 60fps animations, no lag.
    *   **Tactile**: Haptic feedback on significant actions (joining a meal, completing a week).
    *   **Optimistic**: UI updates immediately; errors handled gracefully in background.

## 2. Golden Rules (The "Vibe Check")
1.  **Tamagui First**: 
    *   **ALWAYS** use `YStack`, `XStack`, `Text`, `Button` from `tamagui`.
    *   **NEVER** use `View` or `Text` from `react-native` unless absolutely necessary (e.g., inside a specific 3rd party library wrapper).
2.  **Theming is Sacred**:
    *   **ALWAYS** use semantic color tokens (e.g., `$background`, `$color`, `$borderColor`).
    *   **NEVER** hardcode hex values (e.g., `#FFFFFF`, `#000000`) in components. This ensures Dark Mode works 100% of the time.
3.  **Performance**:
    *   Use `FlashList` for any list longer than 10 items.
    *   Memoize heavy components in the grid.

## 3. Coding Patterns (Copy-Pasteable Vibe)

### Standard Screen Layout
```tsx
import { YStack, H2 } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function ScreenName() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <YStack flex={1} backgroundColor="$background" padding="$4" gap="$4">
        <H2>Screen Title</H2>
        {/* Content */}
      </YStack>
    </SafeAreaView>
  );
}
```

### Component Structure
```tsx
import { XStack, Text, styled } from 'tamagui';

const Container = styled(XStack, {
  backgroundColor: '$backgroundStrong',
  borderRadius: '$4',
  padding: '$3',
  pressStyle: { opacity: 0.9 },
});

export const MyComponent = ({ label }: { label: string }) => (
  <Container>
    <Text color="$color">{label}</Text>
  </Container>
);
```

## 4. Anti-Patterns (Vibe Killers)
*   ❌ **Inline Styles**: `style={{ marginTop: 20 }}` -> ✅ `marginTop="$4"`
*   ❌ **Prop Drilling**: Passing data down 3+ levels -> ✅ Use Zustand or Composition.
*   ❌ **Blocking UI**: showing a full-screen spinner for small data -> ✅ Use Skeletons.
