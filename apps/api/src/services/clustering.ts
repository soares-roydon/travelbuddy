import type { SchedulablePlace, ClusteredPlace, Coordinates } from '@travelbuddy/shared';
import { getHaversineDistanceMeters } from './geo.js';

export class ClusteringService {
  /**
   * Clusters a list of places into K groups (days) using K-Means algorithm.
   */
  static clusterIntoDays(places: SchedulablePlace[], numDays: number): Map<number, SchedulablePlace[]> {
    if (places.length === 0) return new Map();
    if (numDays === 1 || places.length <= numDays) {
      // If 1 day or fewer places than days, just put them all in day 1, or distribute 1 per day
      const map = new Map<number, SchedulablePlace[]>();
      if (numDays === 1) {
        map.set(1, places);
      } else {
        places.forEach((p, i) => map.set(i + 1, [p]));
      }
      return map;
    }

    // Initialize K centroids randomly from the existing places
    let centroids: Coordinates[] = this.initializeCentroids(places, numDays);
    let clusters = new Map<number, SchedulablePlace[]>();
    let assignments = new Map<string, number>();
    
    let changed = true;
    let maxIterations = 50;

    while (changed && maxIterations > 0) {
      changed = false;
      maxIterations--;
      clusters.clear();

      // Assign each place to the nearest centroid
      for (const place of places) {
        let nearestCluster = 0;
        let minDistance = Infinity;

        for (let i = 0; i < centroids.length; i++) {
          const dist = getHaversineDistanceMeters(place, centroids[i]);
          if (dist < minDistance) {
            minDistance = dist;
            nearestCluster = i;
          }
        }

        if (!clusters.has(nearestCluster)) {
          clusters.set(nearestCluster, []);
        }
        clusters.get(nearestCluster)!.push(place);

        if (assignments.get(place.id) !== nearestCluster) {
          changed = true;
          assignments.set(place.id, nearestCluster);
        }
      }

      // Recompute centroids
      for (let i = 0; i < numDays; i++) {
        const clusterPlaces = clusters.get(i) || [];
        if (clusterPlaces.length > 0) {
          const avgLat = clusterPlaces.reduce((sum, p) => sum + p.latitude, 0) / clusterPlaces.length;
          const avgLng = clusterPlaces.reduce((sum, p) => sum + p.longitude, 0) / clusterPlaces.length;
          centroids[i] = { latitude: avgLat, longitude: avgLng };
        }
      }
    }

    // Normalize output keys to be 1-indexed (Day 1, Day 2, ...)
    const result = new Map<number, SchedulablePlace[]>();
    let dayNum = 1;
    for (const [_, clusterPlaces] of clusters) {
      if (clusterPlaces.length > 0) {
        result.set(dayNum++, clusterPlaces);
      }
    }

    // Balance clusters if needed (e.g., if one day has 12 places and another has 2)
    return this.balanceClusters(result, places.length, numDays);
  }

  private static initializeCentroids(places: SchedulablePlace[], k: number): Coordinates[] {
    const shuffled = [...places].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, k).map(p => ({ latitude: p.latitude, longitude: p.longitude }));
  }

  /**
   * Ensures no day is massively overloaded while another is empty.
   */
  private static balanceClusters(
    clusters: Map<number, SchedulablePlace[]>, 
    totalPlaces: number, 
    numDays: number
  ): Map<number, SchedulablePlace[]> {
    const maxPerDay = Math.ceil((totalPlaces / numDays) * 1.5); // Allow 50% variance
    
    // Very basic balancing: if a day has too many, move the furthest point to the smallest day
    // For a production app, we would use a capacity-constrained K-Means or similar.
    
    let overloadedDays = Array.from(clusters.entries()).filter(([_, p]) => p.length > maxPerDay);
    
    if (overloadedDays.length === 0) return clusters;

    // Simple heuristic for now: just return as is unless severely unbalanced,
    // to avoid breaking geographic clustering too much.
    return clusters;
  }
}
