import { startOfWeek, endOfWeek, addWeeks, format, parseISO, isSameWeek } from 'date-fns';

/**
 * Get the start date of a week
 * @param date - Date within the week
 * @param weekStartsOn - 0 for Sunday, 1 for Monday (default: 1)
 */
export const getWeekStart = (date: Date = new Date(), weekStartsOn: 0 | 1 = 1): Date => {
  return startOfWeek(date, { weekStartsOn });
};

/**
 * Get the end date of a week
 * @param date - Date within the week
 * @param weekStartsOn - 0 for Sunday, 1 for Monday (default: 1)
 */
export const getWeekEnd = (date: Date = new Date(), weekStartsOn: 0 | 1 = 1): Date => {
  return endOfWeek(date, { weekStartsOn });
};

/**
 * Get the start and end dates of a week as ISO date strings
 * @param date - Date within the week
 * @param weekStartsOn - 0 for Sunday, 1 for Monday (default: 1)
 */
export const getWeekRange = (
  date: Date = new Date(),
  weekStartsOn: 0 | 1 = 1
): { startDate: string; endDate: string } => {
  const start = getWeekStart(date, weekStartsOn);
  const end = getWeekEnd(date, weekStartsOn);
  return {
    startDate: format(start, 'yyyy-MM-dd'),
    endDate: format(end, 'yyyy-MM-dd'),
  };
};

/**
 * Get the previous week
 * @param date - Date within the current week
 * @param weekStartsOn - 0 for Sunday, 1 for Monday (default: 1)
 */
export const getPreviousWeek = (date: Date = new Date(), weekStartsOn: 0 | 1 = 1): Date => {
  const weekStart = getWeekStart(date, weekStartsOn);
  return addWeeks(weekStart, -1);
};

/**
 * Get the next week
 * @param date - Date within the current week
 * @param weekStartsOn - 0 for Sunday, 1 for Monday (default: 1)
 */
export const getNextWeek = (date: Date = new Date(), weekStartsOn: 0 | 1 = 1): Date => {
  const weekStart = getWeekStart(date, weekStartsOn);
  return addWeeks(weekStart, 1);
};

/**
 * Check if two dates are in the same week
 * @param date1 - First date
 * @param date2 - Second date
 * @param weekStartsOn - 0 for Sunday, 1 for Monday (default: 1)
 */
export const isSameWeekAs = (
  date1: Date,
  date2: Date,
  weekStartsOn: 0 | 1 = 1
): boolean => {
  return isSameWeek(date1, date2, { weekStartsOn });
};

/**
 * Format date as ISO string (YYYY-MM-DD)
 */
export const formatDateISO = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Parse ISO date string to Date object
 */
export const parseDateISO = (dateString: string): Date => {
  return parseISO(dateString);
};

/**
 * Get all days in a week as ISO date strings
 * @param date - Date within the week
 * @param weekStartsOn - 0 for Sunday, 1 for Monday (default: 1)
 */
export const getWeekDays = (date: Date = new Date(), weekStartsOn: 0 | 1 = 1): string[] => {
  const start = getWeekStart(date, weekStartsOn);
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(formatDateISO(day));
  }
  return days;
};
