import type { SchedulablePlace, TimeSlot, Preferences, MealWindow, Coordinates } from '@travelbuddy/shared';
import { getHaversineDistanceMeters, estimateTravelTimeMinutes } from './geo.js';

export class MealPlanner {
  private static usedRestaurantIds = new Set<string>();

  static reset() {
    this.usedRestaurantIds.clear();
  }

  static planMeals(schedule: TimeSlot[], allRestaurants: SchedulablePlace[], preferences: Preferences): TimeSlot[] {
    if (schedule.length === 0) return schedule;

    const windows: MealWindow[] = [
      { type: 'LUNCH', idealMinute: 13 * 60 + 30, windowStart: 12 * 60, windowEnd: 15 * 60, durationMinutes: 60, required: true },
      { type: 'DINNER', idealMinute: 19 * 60 + 30, windowStart: 18 * 60, windowEnd: 21 * 60, durationMinutes: 75, required: true },
    ];

    if (preferences.includeBreakfast) {
      windows.unshift({ type: 'BREAKFAST', idealMinute: 8 * 60 + 30, windowStart: 7 * 60, windowEnd: 10 * 60, durationMinutes: 45, required: true });
    }

    const newSchedule = [...schedule];

    for (const window of windows) {
      let bestIdx = -1;
      let minDiff = Infinity;
      let referenceLocation: Coordinates | null = null;

      for (let i = 0; i < newSchedule.length; i++) {
        const slot = newSchedule[i];
        const [h, m] = slot.endTime.split(':').map(Number);
        const slotEndMinute = h * 60 + m;

        if (slotEndMinute >= window.windowStart && slotEndMinute <= window.windowEnd) {
          const diff = Math.abs(slotEndMinute - window.idealMinute);
          if (diff < minDiff) {
            minDiff = diff;
            bestIdx = i;
            referenceLocation = slot.place;
          }
        }
      }

      if (bestIdx === -1) {
        if (window.type === 'BREAKFAST') {
          bestIdx = -1;
          referenceLocation = newSchedule[0].place;
        } else if (window.type === 'DINNER') {
          bestIdx = newSchedule.length - 1;
          referenceLocation = newSchedule[newSchedule.length - 1].place;
        } else {
          bestIdx = Math.floor(newSchedule.length / 2) - 1;
          if (bestIdx >= 0) referenceLocation = newSchedule[bestIdx].place;
        }
      }

      if (!referenceLocation) referenceLocation = newSchedule[0].place;

      // Filter restaurants
      const validRestaurants = allRestaurants.filter(r => {
        if (this.usedRestaurantIds.has(r.id)) return false; // DEDUPLICATION
        if (r.mealType && r.mealType !== 'NONE' && r.mealType !== window.type) return false;
        if (preferences.foodPreference && r.tags && !r.tags.includes(preferences.foodPreference)) return false;
        
        // Budget match
        if (preferences.budget === 'LOW' && r.budgetTier === 'HIGH') return false;
        
        return true;
      });

      const fallbackRestaurants = allRestaurants.filter(r => !this.usedRestaurantIds.has(r.id));
      const candidates = validRestaurants.length > 0 ? validRestaurants : fallbackRestaurants;
      
      if (candidates.length === 0) continue;

      // Sort by proximity
      const sorted = candidates.sort((a, b) => {
        return getHaversineDistanceMeters(referenceLocation!, a) - getHaversineDistanceMeters(referenceLocation!, b);
      });

      const selectedRestaurant = sorted[0];
      this.usedRestaurantIds.add(selectedRestaurant.id);

      const travelMins = estimateTravelTimeMinutes(referenceLocation!, selectedRestaurant);

      const mealSlot: TimeSlot = {
        place: selectedRestaurant,
        startTime: '00:00', // Recalculated globally later
        endTime: '00:00',
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
