import React from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
}

export function Header({ title, showBackButton = false, rightAction }: HeaderProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();

  return (
    <XStack
      paddingHorizontal="$4"
      paddingVertical="$3"
      backgroundColor="$background"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
      alignItems="center"
      justifyContent="space-between"
      minHeight={60}
    >
      <XStack alignItems="center" gap="$3" flex={1}>
        {showBackButton && (
          <Button
            unstyled
            onPress={() => router.back()}
            padding="$2"
            pressStyle={{ opacity: 0.7 }}
            animation="quick"
          >
            <IconSymbol
              name="chevron.left"
              size={24}
              color={colorScheme === 'dark' ? '#ECEDEE' : '#11181C'}
            />
          </Button>
        )}
        <Text
          fontSize="$7"
          fontWeight="600"
          color="$color"
          flex={1}
          numberOfLines={1}
        >
          {title}
        </Text>
      </XStack>
      {rightAction && <XStack>{rightAction}</XStack>}
    </XStack>
  );
}
