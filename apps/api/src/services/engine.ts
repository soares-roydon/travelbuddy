import type { Preferences, SchedulablePlace, ItineraryResponse, TimeSlot, Coordinates } from '@travelbuddy/shared';
import { v4 as uuidv4 } from 'uuid';

import { PlaceScorer } from './placeScorer.js';
import { TimeBudgetAllocator } from './timeBudget.js';
import { DayAssigner } from './dayAssigner.js';
import { SlotScheduler } from './slotScheduler.js';
import { MealPlanner } from './mealPlanner.js';
import { RouteOptimizer } from './routeOptimizer.js';
import { osrm } from './osrm.js';

export class ItineraryEngine {
  /**
   * Orchestrates the entire redesigned itinerary generation pipeline.
   */
  static async generate(
    preferences: Preferences,
    allPlaces: SchedulablePlace[],
    allRestaurants: SchedulablePlace[]
  ): Promise<ItineraryResponse> {
    
    // 1. Intelligent Scoring & Selection
    const scoredPlaces = PlaceScorer.scoreAndFilter(allPlaces, preferences);

    // Safe stay location for calculations
    const safeStayLocation: Coordinates = {
      latitude: preferences.stayLocation.latitude ?? 15.2993,
      longitude: preferences.stayLocation.longitude ?? 74.1240,
    };

    // 2. Time Budget Allocation
    const budgets = TimeBudgetAllocator.allocate(preferences, scoredPlaces.length);

    // 3. Time-Aware Day Assignment
    const clusters = DayAssigner.assignToDays(scoredPlaces, budgets);

    const itineraryDays: any[] = [];
    
    // Reset Meal Planner tracking
    MealPlanner.reset();

    for (const budget of budgets) {
      const dayPlaces = clusters.get(budget.dayNumber) || [];
      if (dayPlaces.length === 0) continue;

      // 4. Optimize Route (TSP)
      const optimizedPlaces = RouteOptimizer.optimize(dayPlaces, safeStayLocation);

      // 5. Slot Scheduling
      let scheduledSlots = SlotScheduler.schedule(optimizedPlaces, safeStayLocation, budget);

      // 6. Meal Planning
      scheduledSlots = MealPlanner.planMeals(scheduledSlots, allRestaurants, preferences);

      // 7. OSRM Travel Times (Re-evaluate final route timings)
      scheduledSlots = await this.recalculateScheduleWithOSRM(scheduledSlots, safeStayLocation, budget.startMinute);

      // 8. Geometry Fetching
      const placesInFinalOrder = scheduledSlots.map(s => s.place);
      const fullDayGeometry = await osrm.getRouteGeometry(safeStayLocation, placesInFinalOrder);

      // Day Summary Calcs
      const totalTravelMins = scheduledSlots.reduce((sum, slot) => sum + slot.travelFromPrevMinutes, 0);
      const totalTravelKm = scheduledSlots.reduce((sum, slot) => sum + slot.travelFromPrevKm, 0);
      const totalActivityMins = scheduledSlots.reduce((sum, slot) => sum + slot.place.estimatedDurationMinutes, 0);
      
      const regions = dayPlaces.map(p => p.region).filter(Boolean) as string[];
      const mostCommonRegion = regions.sort((a, b) => 
        regions.filter(v => v === a).length - regions.filter(v => v === b).length
      ).pop() || 'Goa';

      itineraryDays.push({
        dayNumber: budget.dayNumber,
        date: preferences.tripStartDate ? this.addDays(preferences.tripStartDate, budget.dayNumber - 1) : null,
        summary: {
          totalTravelMinutes: totalTravelMins,
          totalTravelKm: Number(totalTravelKm.toFixed(1)),
          totalActivityMinutes: totalActivityMins,
          region: mostCommonRegion,
        },
        slots: scheduledSlots.map((slot, idx) => ({
          slotOrder: idx + 1,
          place: slot.place,
          startTime: slot.startTime,
          endTime: slot.endTime,
          durationMinutes: slot.place.estimatedDurationMinutes,
          travelFromPrev: {
            minutes: slot.travelFromPrevMinutes,
            km: slot.travelFromPrevKm,
            routeGeometry: idx === 0 ? fullDayGeometry : undefined
          },
          isMealStop: slot.isMealStop,
          mealType: slot.mealType
        }))
      });
    }

    const rawItinerary: ItineraryResponse = {
      id: uuidv4(),
      title: `${preferences.numDays}-Day Goa Adventure`,
      days: itineraryDays,
      preferences,
      createdAt: new Date().toISOString()
    };

    return rawItinerary;
  }

  private static async recalculateScheduleWithOSRM(slots: TimeSlot[], stayLocation: Coordinates, startMinute: number): Promise<TimeSlot[]> {
    if (slots.length === 0) return slots;
    
    const recalculated: TimeSlot[] = [];
    const orderedPlaces = slots.map(s => s.place);
    
    const travelInfos = await osrm.getSequentialTravelTimes(stayLocation, orderedPlaces);
    
    let currentMinute = startMinute;
    
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      const tInfo = travelInfos[i];
      
      currentMinute += tInfo.minutes;
      
      // Respect bestTimeStart if wait is needed
      if (slot.place.bestTimeStart) {
        const [bh, bm] = slot.place.bestTimeStart.split(':').map(Number);
        const bestStartMin = bh * 60 + bm;
        if (currentMinute < bestStartMin) {
          currentMinute = bestStartMin;
        }
      }

      const startTime = this.formatTime(currentMinute);
      currentMinute += slot.place.estimatedDurationMinutes;
      const endTime = this.formatTime(currentMinute);
      
      recalculated.push({
        ...slot,
        startTime,
        endTime,
        travelFromPrevMinutes: tInfo.minutes,
        travelFromPrevKm: tInfo.km,
      });
    }
    
    return recalculated;
  }

  private static formatTime(minutesSinceMidnight: number): string {
    const h = Math.floor(minutesSinceMidnight / 60) % 24;
    const m = Math.floor(minutesSinceMidnight % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }
  
  private static addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }
}
