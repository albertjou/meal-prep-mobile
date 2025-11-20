import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { format, parseISO } from 'date-fns';
import { getWeekDays } from '@/lib/utils/date';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface DayColumnProps {
  weekStart: Date;
}

export function DayColumn({ weekStart }: DayColumnProps) {
  const weekDays = getWeekDays(weekStart, 1); // Week starts on Monday

  return (
    <YStack flex={1} gap="$1.5" width={50} zIndex={2} backgroundColor="$background" padding={0}>
      {/* Spacer for header */}
      <XStack height={28} marginBottom="$1" />
      
      {/* Day rows */}
      {weekDays.map((dateStr, index) => {
        const date = parseISO(dateStr);
        const dayName = DAYS_OF_WEEK[index];
        const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

        return (
          <XStack
            key={dateStr}
            flex={1}
            alignItems="flex-start"
            justifyContent="center"
            paddingRight="$2"
            minHeight={0}
          >
            <Text
              fontSize="$4"
              fontWeight={isToday ? '700' : '500'}
              color="$color"
              numberOfLines={1}
            >
              {isToday ? dayName.toUpperCase() : dayName}
            </Text>
          </XStack>
        );
      })}
    </YStack>
  );
}

