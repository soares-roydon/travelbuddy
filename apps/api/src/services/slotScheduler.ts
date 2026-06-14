import type { SchedulablePlace, DayTimeBudget, TimeSlot, Coordinates } from '@travelbuddy/shared';
import { estimateTravelTimeMinutes } from './geo.js';

export class SlotScheduler {
  /**
   * Assigns times to places, respecting best visiting times.
   */
  static schedule(places: SchedulablePlace[], stayLocation: Coordinates, budget: DayTimeBudget): TimeSlot[] {
    const slots: TimeSlot[] = [];
    if (places.length === 0) return slots;

    let currentMinute = budget.startMinute;
    let currentLocation = stayLocation;

    for (const place of places) {
      const travelMins = estimateTravelTimeMinutes(currentLocation, place);
      currentMinute += travelMins;

      // If place has a bestTimeStart, and we are early, wait.
      if (place.bestTimeStart) {
        const [bh, bm] = place.bestTimeStart.split(':').map(Number);
        const bestStartMin = bh * 60 + bm;
        if (currentMinute < bestStartMin) {
          currentMinute = bestStartMin; // Jump time forward (wait)
        }
      }

      const travelKm = Number(((travelMins - 3) * (35 / 60)).toFixed(1));
      const startTime = this.formatTime(currentMinute);
      currentMinute += place.estimatedDurationMinutes;
      const endTime = this.formatTime(currentMinute);

      slots.push({
        place,
        startTime,
        endTime,
        travelFromPrevMinutes: travelMins,
        travelFromPrevKm: travelKm,
        isMealStop: false,
        mealType: null
      });

      currentLocation = place;
    }

    return slots;
  }

  private static formatTime(minutesSinceMidnight: number): string {
    const h = Math.floor(minutesSinceMidnight / 60) % 24;
    const m = Math.floor(minutesSinceMidnight % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }
}
