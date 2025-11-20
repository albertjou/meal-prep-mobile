import React, { useMemo, useCallback } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolate, Extrapolate, runOnJS } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface UseSwipeGestureProps {
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export function useSwipeGesture({
  onPreviousWeek,
  onNextWeek,
  canGoPrevious,
  canGoNext,
}: UseSwipeGestureProps) {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  // Haptic feedback helper
  const triggerHaptic = useCallback(() => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  // Navigation handlers with animation
  const handlePreviousWeek = useCallback(() => {
    if (!canGoPrevious) {
      if (process.env.EXPO_OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
      return;
    }

    triggerHaptic();

    translateX.value = withTiming(-100, { duration: 200 }, (finished) => {
      'worklet';
      if (finished) {
        runOnJS(onPreviousWeek)();
        
        translateX.value = 100;
        opacity.value = 0.5;
        
        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
          mass: 0.5,
        });
        opacity.value = withSpring(1, {
          damping: 20,
          stiffness: 200,
        });
      }
    });
    opacity.value = withTiming(0.5, { duration: 200 });
  }, [canGoPrevious, triggerHaptic, translateX, opacity, onPreviousWeek]);

  const handleNextWeek = useCallback(() => {
    if (!canGoNext) {
      if (process.env.EXPO_OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
      return;
    }

    triggerHaptic();

    translateX.value = withTiming(100, { duration: 200 }, (finished) => {
      'worklet';
      if (finished) {
        runOnJS(onNextWeek)();
        
        translateX.value = -100;
        opacity.value = 0.5;
        
        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
          mass: 0.5,
        });
        opacity.value = withSpring(1, {
          damping: 20,
          stiffness: 200,
        });
      }
    });
    opacity.value = withTiming(0.5, { duration: 200 });
  }, [canGoNext, triggerHaptic, translateX, opacity, onNextWeek]);

  // Animated style for meal columns only (not day column)
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
      opacity: opacity.value,
    };
  });

  // Swipe gesture handlers with velocity detection
  const swipeGesture = useMemo(() => {
    return Gesture.Pan()
      .activeOffsetX([-10, 10])
      .onUpdate((event) => {
        'worklet';
        const { translationX } = event;
        const maxTranslation = 150;
        const clampedTranslation = Math.max(
          -maxTranslation,
          Math.min(maxTranslation, translationX * 0.5)
        );
        translateX.value = clampedTranslation;
        opacity.value = interpolate(
          Math.abs(translationX),
          [0, maxTranslation],
          [1, 0.7],
          Extrapolate.CLAMP
        );
      })
      .onEnd((event) => {
        'worklet';
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
          translateX.value = withSpring(0, {
            damping: 20,
            stiffness: 200,
          });
          opacity.value = withSpring(1, {
            damping: 20,
            stiffness: 200,
          });
        }
      });
  }, [handlePreviousWeek, handleNextWeek, translateX, opacity]);

  return {
    swipeGesture,
    animatedStyle,
    handlePreviousWeek,
    handleNextWeek,
  };
}

