import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { parseISO, addWeeks, startOfWeek, endOfWeek, format } from 'date-fns';
import type { MealPlan } from '@/lib/schemas/meal-plan';

interface UseWeekNavigationProps {
  mealPlan?: MealPlan;
}

export function useWeekNavigation({ mealPlan }: UseWeekNavigationProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());

  // Set initial week to meal plan start date
  useEffect(() => {
    if (mealPlan) {
      const planStart = parseISO(mealPlan.start_date);
      setCurrentWeekStart(startOfWeek(planStart, { weekStartsOn: 1 }));
    }
  }, [mealPlan]);

  // Check if we can navigate
  const canGoPrevious = useMemo(() => {
    if (!mealPlan) return false;
    const planStart = parseISO(mealPlan.start_date);
    const weekStart = startOfWeek(currentWeekStart, { weekStartsOn: 1 });
    return weekStart > planStart;
  }, [mealPlan, currentWeekStart]);

  const canGoNext = useMemo(() => {
    if (!mealPlan) return false;
    const planEnd = parseISO(mealPlan.end_date);
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    return weekEnd < planEnd;
  }, [mealPlan, currentWeekStart]);

  // Helper to update week state with boundary checks
  const updateWeekState = useCallback((direction: 'prev' | 'next') => {
    setCurrentWeekStart((prev) => {
      if (direction === 'prev') {
        const planStart = mealPlan ? parseISO(mealPlan.start_date) : null;
        const weekStart = startOfWeek(prev, { weekStartsOn: 1 });
        if (planStart && weekStart <= planStart) return prev;
        
        const newDate = addWeeks(prev, -1);
        return startOfWeek(newDate, { weekStartsOn: 1 });
      } else {
        const planEnd = mealPlan ? parseISO(mealPlan.end_date) : null;
        const weekEnd = endOfWeek(prev, { weekStartsOn: 1 });
        if (planEnd && weekEnd >= planEnd) return prev;
        
        const newDate = addWeeks(prev, 1);
        return startOfWeek(newDate, { weekStartsOn: 1 });
      }
    });
  }, [mealPlan]);

  // Format week label
  const weekLabel = useMemo(() => {
    const weekStart = startOfWeek(currentWeekStart, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
  }, [currentWeekStart]);

  return {
    currentWeekStart,
    canGoPrevious,
    canGoNext,
    updateWeekState,
    weekLabel,
  };
}

