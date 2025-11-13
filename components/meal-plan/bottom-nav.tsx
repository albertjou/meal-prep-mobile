import React from 'react';
import { XStack, Button, Text } from 'tamagui';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface BottomNavProps {
  onPrevious?: () => void;
  onNext?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  currentLabel?: string;
}

export function BottomNav({
  onPrevious,
  onNext,
  canGoPrevious = true,
  canGoNext = true,
  currentLabel,
}: BottomNavProps) {
  const colorScheme = useColorScheme();

  return (
    <XStack
      paddingHorizontal="$4"
      paddingVertical="$3"
      backgroundColor="$background"
      borderTopWidth={1}
      borderTopColor="$borderColor"
      alignItems="center"
      justifyContent="space-between"
      minHeight={60}
    >
      <Button
        unstyled
        onPress={onPrevious}
        disabled={!canGoPrevious}
        opacity={canGoPrevious ? 1 : 0.3}
        padding="$2"
        pressStyle={{ opacity: 0.7 }}
        animation="quick"
      >
        <XStack alignItems="center" gap="$2">
          <IconSymbol
            name="chevron.left"
            size={20}
            color={colorScheme === 'dark' ? '#ECEDEE' : '#11181C'}
          />
          <Text fontSize="$4" color="$color" fontWeight="500">
            Previous
          </Text>
        </XStack>
      </Button>

      {currentLabel && (
        <Text fontSize="$4" color="$color" fontWeight="500">
          {currentLabel}
        </Text>
      )}

      <Button
        unstyled
        onPress={onNext}
        disabled={!canGoNext}
        opacity={canGoNext ? 1 : 0.3}
        padding="$2"
        pressStyle={{ opacity: 0.7 }}
        animation="quick"
      >
        <XStack alignItems="center" gap="$2">
          <Text fontSize="$4" color="$color" fontWeight="500">
            Next
          </Text>
          <IconSymbol
            name="chevron.right"
            size={20}
            color={colorScheme === 'dark' ? '#ECEDEE' : '#11181C'}
          />
        </XStack>
      </Button>
    </XStack>
  );
}
