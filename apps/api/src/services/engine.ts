import type { Preferences, SchedulablePlace, ItineraryResponse, DaySchedule, TimeSlot, Coordinates } from '@travelbuddy/shared';
import { ClusteringService } from './clustering.js';
import { RouteOptimizer } from './routeOptimizer.js';
import { Scheduler } from './scheduler.js';
import { MealInserter } from './mealInserter.js';
import { osrm } from './osrm.js';
import { v4 as uuidv4 } from 'uuid';

export class ItineraryEngine {
  /**
   * Orchestrates the entire itinerary generation pipeline.
   */
  static async generate(
    preferences: Preferences,
    filteredPlaces: SchedulablePlace[],
    allRestaurants: SchedulablePlace[]
  ): Promise<ItineraryResponse> {
    
    // 1. Cluster places into days
    const clusters = ClusteringService.clusterIntoDays(filteredPlaces, preferences.numDays);

    const itineraryDays: any[] = [];
    
    // Process each day
    for (let dayNumber = 1; dayNumber <= preferences.numDays; dayNumber++) {
      const dayPlaces = clusters.get(dayNumber) || [];
      
      // If no places for this day, skip or handle gracefully
      if (dayPlaces.length === 0) continue;

      // 2. Optimize Route (TSP)
      const optimizedPlaces = RouteOptimizer.optimize(dayPlaces, preferences.stayLocation);

      // 3. OSRM: Fetch real driving times instead of using haversine estimates
      const travelInfos = await osrm.getSequentialTravelTimes(preferences.stayLocation, optimizedPlaces);
      
      // 4. Scheduling (Using the OSRM times)
      // Since our Scheduler originally used Haversine, we'll bypass its internal geo calls
      // by constructing the slots manually using OSRM data.
      let currentMinute = 9 * 60; // 09:00 AM
      const rawSlots: TimeSlot[] = [];
      
      for (let i = 0; i < optimizedPlaces.length; i++) {
        const place = optimizedPlaces[i];
        const tInfo = travelInfos[i];
        
        currentMinute += tInfo.minutes;
        
        const startTime = this.formatTime(currentMinute);
        currentMinute += place.estimatedDurationMinutes;
        const endTime = this.formatTime(currentMinute);

        rawSlots.push({
          place,
          startTime,
          endTime,
          travelFromPrevMinutes: tInfo.minutes,
          travelFromPrevKm: tInfo.km,
          isMealStop: false,
          mealType: null
        });
      }

      // 5. Insert Meals
      let scheduledSlots = MealInserter.insertMeals(
        rawSlots, 
        allRestaurants, 
        preferences.foodPreference, 
        preferences.includeBreakfast
      );

      // Recalculate times to account for inserted meals (Meals throw off the currentMinute)
      scheduledSlots = await this.recalculateScheduleWithMeals(scheduledSlots, preferences.stayLocation);

      // 6. Fetch full day route geometry for mapping
      const placesInFinalOrder = scheduledSlots.map(s => s.place);
      const fullDayGeometry = await osrm.getRouteGeometry(preferences.stayLocation, placesInFinalOrder);

      // 7. Calculate Day Summary
      const totalTravelMins = scheduledSlots.reduce((sum, slot) => sum + slot.travelFromPrevMinutes, 0);
      const totalTravelKm = scheduledSlots.reduce((sum, slot) => sum + slot.travelFromPrevKm, 0);
      const totalActivityMins = scheduledSlots.reduce((sum, slot) => sum + slot.place.estimatedDurationMinutes, 0);
      
      // Try to determine main region for the day
      const regions = dayPlaces.map(p => p.region).filter(Boolean);
      const mostCommonRegion = regions.sort((a, b) => 
        regions.filter(v => v === a).length - regions.filter(v => v === b).length
      ).pop() || 'Goa';

      // Map to response format
      itineraryDays.push({
        dayNumber,
        date: preferences.tripStartDate ? this.addDays(preferences.tripStartDate, dayNumber - 1) : null,
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
            // Assign full day geometry to the first slot for easy frontend access
            routeGeometry: idx === 0 ? fullDayGeometry : undefined
          },
          isMealStop: slot.isMealStop,
          mealType: slot.mealType
        }))
      });
    }

    return {
      id: uuidv4(),
      title: `${preferences.numDays}-Day Goa Adventure`,
      preferences,
      days: itineraryDays,
      createdAt: new Date().toISOString()
    };
  }

  private static async recalculateScheduleWithMeals(slots: TimeSlot[], stayLocation: Coordinates): Promise<TimeSlot[]> {
    if (slots.length === 0) return slots;
    
    const recalculated: TimeSlot[] = [];
    const orderedPlaces = slots.map(s => s.place);
    
    // Fetch fresh OSRM times including the meals
    const travelInfos = await osrm.getSequentialTravelTimes(stayLocation, orderedPlaces);
    
    let currentMinute = 9 * 60; // 09:00 AM
    
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      const tInfo = travelInfos[i];
      
      currentMinute += tInfo.minutes;
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
