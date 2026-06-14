import type { Preferences, DayTimeBudget } from '@travelbuddy/shared';

export class TimeBudgetAllocator {
  /**
   * Allocates a high-level time budget for each day of the trip.
   */
  static allocate(preferences: Preferences, numPlaces: number): DayTimeBudget[] {
    const budgets: DayTimeBudget[] = [];
    const numDays = preferences.numDays || 1;
    const includeBreakfast = Boolean(preferences.includeBreakfast);

    for (let dayNumber = 1; dayNumber <= numDays; dayNumber++) {
      // Default bounds (1 < numDays < 5)
      let startMinute = 540; // 09:00
      let endMinute = 1260; // 21:00
      let mealCount = includeBreakfast ? 3 : 2;

      // Adjust based on trip duration
      if (numDays === 1) {
        startMinute = 540; // 09:00
        endMinute = 1320; // 22:00
        mealCount = 2; // no breakfast
      } else if (numDays >= 5) {
        startMinute = 600; // 10:00
        endMinute = 1260; // 21:00
        mealCount = includeBreakfast ? 3 : 2;
      }

      // Meal time calculation
      // lunch = 60m, dinner = 75m -> Total 135m
      let totalMealTime = 135;
      if (mealCount === 3) {
        // breakfast = 45m
        totalMealTime += 45;
      }

      // Travel overhead calculation
      const travelOverhead = 30 * (numPlaces / numDays);

      // Available activity time
      const availableActivityMinutes = Math.round(
        endMinute - startMinute - totalMealTime - travelOverhead
      );

      budgets.push({
        dayNumber,
        startMinute,
        endMinute,
        availableActivityMinutes,
        mealCount,
      });
    }

    return budgets;
  }
}
