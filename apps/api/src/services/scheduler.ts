import type { SchedulablePlace, TimeSlot, TravelInfo, Coordinates } from '@travelbuddy/shared';
import { estimateTravelTimeMinutes } from './geo.js';

export class Scheduler {
  /**
   * Assigns exact time slots to an ordered list of places.
   * Assumes the day starts at 09:00 by default.
   */
  static assignTimeSlots(
    orderedPlaces: SchedulablePlace[],
    stayLocation: Coordinates,
    dayStartHour: number = 9
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    if (orderedPlaces.length === 0) return slots;

    // Start time in minutes since midnight (e.g., 9:00 = 540)
    let currentMinute = dayStartHour * 60;
    let currentLocation = stayLocation;

    for (let i = 0; i < orderedPlaces.length; i++) {
      const place = orderedPlaces[i];
      
      // Calculate travel from previous location
      const travelMins = estimateTravelTimeMinutes(currentLocation, place);
      const travelKm = Number(((travelMins - 3) * (35 / 60)).toFixed(1)); // Reverse engineer km from our heuristic
      
      currentMinute += travelMins;

      const startTime = this.formatTime(currentMinute);
      currentMinute += place.estimatedDurationMinutes;
      const endTime = this.formatTime(currentMinute);

      slots.push({
        place,
        startTime,
        endTime,
        travelFromPrevMinutes: travelMins,
        travelFromPrevKm: travelKm,
        isMealStop: place.type === 'RESTAURANT',
        mealType: place.mealType || null,
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
