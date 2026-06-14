import type { ScoredPlace, DayTimeBudget, Coordinates } from '@travelbuddy/shared';
import { getHaversineDistanceMeters } from './geo.js';

export class DayAssigner {
  /**
   * Assigns places to days using Capacity-Constrained Greedy Clustering.
   */
  static assignToDays(places: ScoredPlace[], budgets: DayTimeBudget[]): Map<number, ScoredPlace[]> {
    const numDays = budgets.length;
    const result = new Map<number, ScoredPlace[]>();
    for (let i = 1; i <= numDays; i++) {
      result.set(i, []);
    }

    if (places.length === 0) return result;
    if (numDays === 1) {
      result.set(1, places);
      return result;
    }

    // 1. K-Means++ init for centroids
    const centroids = this.initializeCentroids(places, numDays);
    const dayRemainingCapacity = new Map<number, number>();
    budgets.forEach(b => dayRemainingCapacity.set(b.dayNumber, b.availableActivityMinutes));

    // Simple greedy assignment
    for (const place of places) {
      let bestDay = -1;
      let minDistance = Infinity;

      for (let i = 0; i < numDays; i++) {
        const dayNum = i + 1;
        const capacity = dayRemainingCapacity.get(dayNum) || 0;
        
        if (capacity >= place.estimatedDurationMinutes) {
          const dist = getHaversineDistanceMeters(place, centroids[i]);
          if (dist < minDistance) {
            minDistance = dist;
            bestDay = dayNum;
          }
        }
      }

      // If no day has capacity, put it in the day with most remaining capacity
      if (bestDay === -1) {
        let maxCap = -Infinity;
        for (let i = 0; i < numDays; i++) {
          const dayNum = i + 1;
          const cap = dayRemainingCapacity.get(dayNum) || 0;
          if (cap > maxCap) {
            maxCap = cap;
            bestDay = dayNum;
          }
        }
      }

      if (bestDay !== -1) {
        result.get(bestDay)!.push(place);
        const newCap = (dayRemainingCapacity.get(bestDay) || 0) - place.estimatedDurationMinutes;
        dayRemainingCapacity.set(bestDay, newCap);
      }
    }

    return result;
  }

  private static initializeCentroids(places: ScoredPlace[], k: number): Coordinates[] {
    const centroids: Coordinates[] = [];
    if (places.length === 0) return centroids;

    // First centroid is the first place (highest scored)
    centroids.push({ latitude: places[0].latitude, longitude: places[0].longitude });

    for (let i = 1; i < k; i++) {
      let maxDistSq = -1;
      let nextCentroidIndex = 0;

      for (let p = 0; p < places.length; p++) {
        const place = places[p];
        let minDistSqToCentroids = Infinity;

        for (const c of centroids) {
          const dist = getHaversineDistanceMeters(place, c);
          minDistSqToCentroids = Math.min(minDistSqToCentroids, dist * dist);
        }

        if (minDistSqToCentroids > maxDistSq) {
          maxDistSq = minDistSqToCentroids;
          nextCentroidIndex = p;
        }
      }
      centroids.push({ latitude: places[nextCentroidIndex].latitude, longitude: places[nextCentroidIndex].longitude });
    }

    return centroids;
  }
}
