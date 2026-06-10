import type { SchedulablePlace, TimeSlot, MealWindow, Coordinates } from '@travelbuddy/shared';
import { getHaversineDistanceMeters, estimateTravelTimeMinutes } from './geo.js';

export class MealInserter {
  /**
   * Inserts meals into a day's schedule by finding restaurants near the location 
   * where the user is during standard meal times.
   */
  static insertMeals(
    schedule: TimeSlot[],
    restaurants: SchedulablePlace[],
    foodPreference?: string,
    includeBreakfast: boolean = false
  ): TimeSlot[] {
    if (schedule.length === 0) return schedule;

    const windows: MealWindow[] = [
      { type: 'LUNCH', idealMinute: 13 * 60 + 30, windowStart: 12 * 60, windowEnd: 15 * 60, durationMinutes: 60, required: true },
      { type: 'DINNER', idealMinute: 19 * 60 + 30, windowStart: 18 * 60, windowEnd: 21 * 60, durationMinutes: 90, required: true },
    ];

    if (includeBreakfast) {
      windows.unshift({ type: 'BREAKFAST', idealMinute: 8 * 60 + 30, windowStart: 7 * 60, windowEnd: 10 * 60, durationMinutes: 45, required: true });
    }

    const newSchedule = [...schedule];

    for (const window of windows) {
      // Find the best insertion index in the schedule
      let bestIdx = -1;
      let minDiff = Infinity;
      let referenceLocation: Coordinates | null = null;

      for (let i = 0; i < newSchedule.length; i++) {
        const slot = newSchedule[i];
        const [h, m] = slot.endTime.split(':').map(Number);
        const slotEndMinute = h * 60 + m;

        // If the activity ends within the meal window, or is closest to ideal time
        if (slotEndMinute >= window.windowStart && slotEndMinute <= window.windowEnd) {
          const diff = Math.abs(slotEndMinute - window.idealMinute);
          if (diff < minDiff) {
            minDiff = diff;
            bestIdx = i; // Insert AFTER this activity
            referenceLocation = slot.place;
          }
        }
      }

      // If we couldn't find a good slot but meal is required, append it or prepend it
      if (bestIdx === -1) {
        if (window.type === 'BREAKFAST') {
          bestIdx = -1; // Insert at very beginning
          referenceLocation = newSchedule[0].place; // near first activity
        } else if (window.type === 'DINNER') {
          bestIdx = newSchedule.length - 1; // Insert at very end
          referenceLocation = newSchedule[newSchedule.length - 1].place;
        } else {
          // Lunch fallback — put in middle
          bestIdx = Math.floor(newSchedule.length / 2) - 1;
          referenceLocation = newSchedule[bestIdx].place;
        }
      }

      // Find nearest restaurant matching meal type & preference
      const validRestaurants = restaurants.filter(r => {
        if (r.mealType && r.mealType !== 'NONE' && r.mealType !== window.type) return false;
        if (foodPreference && r.tags && !r.tags.includes(foodPreference)) return false;
        return true;
      });

      const fallbackRestaurants = restaurants.filter(r => 
        !r.mealType || r.mealType === 'NONE' || r.mealType === window.type
      );

      const candidates = validRestaurants.length > 0 ? validRestaurants : fallbackRestaurants;
      
      if (candidates.length === 0) continue; // No restaurants found

      // Sort by distance to reference location
      const sorted = candidates.sort((a, b) => {
        return getHaversineDistanceMeters(referenceLocation!, a) - getHaversineDistanceMeters(referenceLocation!, b);
      });

      const selectedRestaurant = sorted[0];
      const travelMins = estimateTravelTimeMinutes(referenceLocation!, selectedRestaurant);

      // Create new meal slot (times will be recalculated by a global pass later, 
      // but we populate it roughly here)
      const mealSlot: TimeSlot = {
        place: selectedRestaurant,
        startTime: '00:00', // To be recalculated
        endTime: '00:00',   // To be recalculated
        travelFromPrevMinutes: travelMins,
        travelFromPrevKm: Number(((travelMins - 3) * (35 / 60)).toFixed(1)),
        isMealStop: true,
        mealType: window.type,
      };

      newSchedule.splice(bestIdx + 1, 0, mealSlot);
    }

    return newSchedule;
  }
}
