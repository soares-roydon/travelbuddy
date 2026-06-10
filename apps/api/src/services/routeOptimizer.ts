import type { SchedulablePlace, Coordinates } from '@travelbuddy/shared';
import { getHaversineDistanceMeters } from './geo.js';

export class RouteOptimizer {
  /**
   * Optimizes the order of places for a single day using Nearest Neighbor + 2-Opt.
   */
  static optimize(
    places: SchedulablePlace[],
    stayLocation: Coordinates,
    endLocation?: Coordinates
  ): SchedulablePlace[] {
    if (places.length <= 1) return places;

    // 1. Initial Route: Nearest Neighbor
    let currentRoute = this.nearestNeighbor(places, stayLocation);

    // 2. Improve Route: 2-Opt algorithm
    currentRoute = this.twoOpt(currentRoute, stayLocation, endLocation || stayLocation);

    return currentRoute;
  }

  private static nearestNeighbor(places: SchedulablePlace[], startNode: Coordinates): SchedulablePlace[] {
    const unvisited = [...places];
    const route: SchedulablePlace[] = [];
    let currentLocation = startNode;

    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const place = unvisited[i];
        const dist = getHaversineDistanceMeters(currentLocation, place);
        if (dist < minDistance) {
          minDistance = dist;
          nearestIdx = i;
        }
      }

      const nearestPlace = unvisited.splice(nearestIdx, 1)[0];
      route.push(nearestPlace);
      currentLocation = nearestPlace;
    }

    return route;
  }

  private static twoOpt(
    route: SchedulablePlace[],
    startNode: Coordinates,
    endNode: Coordinates
  ): SchedulablePlace[] {
    let bestRoute = [...route];
    let improved = true;
    let bestDistance = this.calculateTotalDistance(bestRoute, startNode, endNode);

    while (improved) {
      improved = false;
      for (let i = 0; i < bestRoute.length - 1; i++) {
        for (let k = i + 1; k < bestRoute.length; k++) {
          const newRoute = this.twoOptSwap(bestRoute, i, k);
          const newDistance = this.calculateTotalDistance(newRoute, startNode, endNode);

          if (newDistance < bestDistance) {
            bestRoute = newRoute;
            bestDistance = newDistance;
            improved = true;
          }
        }
      }
    }

    return bestRoute;
  }

  private static twoOptSwap(route: SchedulablePlace[], i: number, k: number): SchedulablePlace[] {
    const newRoute = [...route];
    const reversed = newRoute.slice(i, k + 1).reverse();
    newRoute.splice(i, reversed.length, ...reversed);
    return newRoute;
  }

  private static calculateTotalDistance(
    route: SchedulablePlace[],
    startNode: Coordinates,
    endNode: Coordinates
  ): number {
    if (route.length === 0) return 0;
    
    let total = getHaversineDistanceMeters(startNode, route[0]);
    for (let i = 0; i < route.length - 1; i++) {
      total += getHaversineDistanceMeters(route[i], route[i + 1]);
    }
    total += getHaversineDistanceMeters(route[route.length - 1], endNode);
    
    return total;
  }
}
