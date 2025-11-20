import React, { useMemo } from 'react';
import { YStack } from 'tamagui';
import { Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { addWeeks, startOfWeek } from 'date-fns';
import { WeekFrame } from './week-frame';
import type { Meal } from '@/lib/schemas/meal';
import type { User } from '@/lib/schemas/user';
import * as Haptics from 'expo-haptics';

interface WeekCarouselProps {
  currentWeekStart: Date;
  meals: Meal[];
  users?: User[];
  canGoPrevious: boolean;
  canGoNext: boolean;
  onWeekChange: (direction: 'prev' | 'next') => void;
  onMealPress?: (dateStr: string, mealType: 'lunch' | 'dinner') => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export function WeekCarousel({
  currentWeekStart,
  meals,
  users,
  canGoPrevious,
  canGoNext,
  onWeekChange,
  onMealPress,
}: WeekCarouselProps) {
  const translateX = useSharedValue(0);
  const isAnimating = useSharedValue(false);
  const [mealAreaWidth, setMealAreaWidth] = React.useState(0);

  // Calculate 3 weeks: previous, current, next
  const weeks = useMemo(() => {
    const currentWeek = startOfWeek(currentWeekStart, { weekStartsOn: 1 });
    const prevWeek = startOfWeek(addWeeks(currentWeek, -1), { weekStartsOn: 1 });
    const nextWeek = startOfWeek(addWeeks(currentWeek, 1), { weekStartsOn: 1 });
    return [prevWeek, currentWeek, nextWeek];
  }, [currentWeekStart]);

  // Create meals map for all 3 weeks
  const mealsByDateAndType = useMemo(() => {
    const map = new Map<string, Meal>();
    meals.forEach((meal) => {
      const key = `${meal.date}-${meal.meal_type}`;
      map.set(key, meal);
    });
    return map;
  }, [meals]);

  // Animated style for the carousel container
  const carouselStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Use measured width or fallback to calculated width
  const MEAL_AREA_WIDTH = mealAreaWidth || (SCREEN_WIDTH - 50 - 8 - 32); // Fallback calculation
  const frameStyle = { width: MEAL_AREA_WIDTH };

  // Navigation handlers
  const handlePreviousWeek = React.useCallback(() => {
    if (!canGoPrevious || isAnimating.value) {
      if (!canGoPrevious && process.env.EXPO_OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
      return;
    }

    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    isAnimating.value = true;
    translateX.value = withSpring(MEAL_AREA_WIDTH, {
      damping: 20,
      stiffness: 200,
      mass: 0.5,
    }, (finished) => {
      'worklet';
      if (finished) {
        runOnJS(onWeekChange)('prev');
        // Reset position instantly (frames will swap)
        translateX.value = 0;
        isAnimating.value = false;
      }
    });
  }, [canGoPrevious, translateX, isAnimating, onWeekChange]);

  const handleNextWeek = React.useCallback(() => {
    if (!canGoNext || isAnimating.value) {
      if (!canGoNext && process.env.EXPO_OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
      return;
    }

    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    isAnimating.value = true;
    translateX.value = withSpring(-MEAL_AREA_WIDTH, {
      damping: 20,
      stiffness: 200,
      mass: 0.5,
    }, (finished) => {
      'worklet';
      if (finished) {
        runOnJS(onWeekChange)('next');
        // Reset position instantly (frames will swap)
        translateX.value = 0;
        isAnimating.value = false;
      }
    });
  }, [canGoNext, translateX, isAnimating, onWeekChange]);

  // Swipe gesture
  const swipeGesture = useMemo(() => {
    return Gesture.Pan()
      .activeOffsetX([-10, 10])
      .onUpdate((event) => {
        'worklet';
        if (isAnimating.value) return;
        
        const { translationX } = event;
        const width = mealAreaWidth || (SCREEN_WIDTH - 50 - 8 - 32);
        const clamped = Math.max(-width, Math.min(width, translationX));
        translateX.value = clamped;
      })
      .onEnd((event) => {
        'worklet';
        if (isAnimating.value) return;

        const { translationX, velocityX } = event;
        const swipeThreshold = 50;
        const velocityThreshold = 500;

        const shouldNavigate = 
          Math.abs(velocityX) > velocityThreshold ||
          Math.abs(translationX) > swipeThreshold;

        if (shouldNavigate) {
          if (translationX > 0 || velocityX > 0) {
            runOnJS(handlePreviousWeek)();
          } else {
            runOnJS(handleNextWeek)();
          }
        } else {
          // Snap back
          translateX.value = withSpring(0, {
            damping: 20,
            stiffness: 200,
          });
        }
      });
  }, [handlePreviousWeek, handleNextWeek, translateX, isAnimating, mealAreaWidth]);

  return (
    <YStack 
      flex={1} 
      position="relative" 
      overflow="hidden" 
      marginLeft="$2"
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        if (width > 0 && width !== mealAreaWidth) {
          setMealAreaWidth(width);
        }
      }}
    >
      <GestureDetector gesture={swipeGesture}>
        <YStack flex={1} position="relative" overflow="hidden">
          {/* Carousel container with 3 frames */}
          {mealAreaWidth > 0 && (
            <Animated.View
              style={[
                {
                  flexDirection: 'row',
                  width: MEAL_AREA_WIDTH * 3,
                  height: '100%',
                  position: 'absolute',
                  left: -MEAL_AREA_WIDTH, // Start with current week in center
                },
                carouselStyle,
              ]}
            >
              {/* Previous Week Frame */}
              <YStack style={frameStyle} padding={0}>
                <WeekFrame
                  weekStart={weeks[0]}
                  mealsByDateAndType={mealsByDateAndType}
                  users={users}
                  onMealPress={onMealPress}
                />
              </YStack>

              {/* Current Week Frame */}
              <YStack style={frameStyle} padding={0}>
                <WeekFrame
                  weekStart={weeks[1]}
                  mealsByDateAndType={mealsByDateAndType}
                  users={users}
                  onMealPress={onMealPress}
                />
              </YStack>

              {/* Next Week Frame */}
              <YStack style={frameStyle} padding={0}>
                <WeekFrame
                  weekStart={weeks[2]}
                  mealsByDateAndType={mealsByDateAndType}
                  users={users}
                  onMealPress={onMealPress}
                />
              </YStack>
            </Animated.View>
          )}
        </YStack>
      </GestureDetector>
    </YStack>
  );
}

