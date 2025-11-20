import React from 'react';
import { XStack, Button, Circle, Text } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { User } from '@/lib/schemas/user';

interface ParticipantsBarProps {
  participants: User[];
  onSettingsPress?: () => void;
}

export function ParticipantsBar({ participants, onSettingsPress }: ParticipantsBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <XStack
      paddingHorizontal="$4"
      paddingTop="$1.5"
      paddingBottom={(insets.bottom + 12) / 2}
      backgroundColor="$background"
      borderTopWidth={1}
      borderTopColor="$borderColor"
      alignItems="center"
      justifyContent="space-between"
      minHeight={(60 + insets.bottom) / 2}
    >
      {/* Participants */}
      <XStack alignItems="center" gap="$2" flex={1}>
        {participants.length > 0 ? (
          <>
            {participants.slice(0, 5).map((participant) => (
              <Circle
                key={participant.id}
                size={24}
                backgroundColor={participant.color || '#4ECDC4'}
              >
                <Text color="white" fontSize="$2" fontWeight="600">
                  {participant.name.charAt(0).toUpperCase()}
                </Text>
              </Circle>
            ))}
            {participants.length > 5 && (
              <Text fontSize="$3" color="$colorFocus">
                +{participants.length - 5}
              </Text>
            )}
          </>
        ) : (
          <Text fontSize="$3" color="$colorFocus">
            No participants
          </Text>
        )}
      </XStack>

      {/* Settings Button */}
      <Button
        unstyled
        onPress={onSettingsPress}
        padding="$1"
        pressStyle={{ opacity: 0.7 }}
        animation="quick"
      >
        <IconSymbol
          name="gearshape.fill"
          size={20}
          color="$color"
        />
      </Button>
    </XStack>
  );
}

