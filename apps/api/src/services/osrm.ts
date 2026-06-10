import type { Coordinates, SchedulablePlace, TravelInfo } from '@travelbuddy/shared';
import { getHaversineDistanceMeters } from './geo.js';

export class OSRMClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://router.project-osrm.org') {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetches real driving times and distances between a start point and an ordered list of places.
   * Uses the OSRM Route endpoint to get the exact sequence.
   */
  async getSequentialTravelTimes(startNode: Coordinates, orderedPlaces: SchedulablePlace[]): Promise<TravelInfo[]> {
    if (orderedPlaces.length === 0) return [];

    // Construct coordinates string: {startLng},{startLat};{p1Lng},{p1Lat};...
    const allNodes = [startNode, ...orderedPlaces];
    const coordinatesString = allNodes
      .map(node => `${node.longitude.toFixed(6)},${node.latitude.toFixed(6)}`)
      .join(';');

    try {
      // Fetch route from OSRM
      // annotations=duration,distance gets leg-by-leg details
      const response = await fetch(
        `${this.baseUrl}/route/v1/driving/${coordinatesString}?overview=false&annotations=duration,distance`
      );

      if (!response.ok) {
        throw new Error(`OSRM API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;

      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        throw new Error(`OSRM returned error or no route: ${data.code}`);
      }

      const route = data.routes[0];
      const legs = route.legs;

      if (legs.length !== orderedPlaces.length) {
        throw new Error('OSRM legs length mismatch');
      }

      // Map legs to TravelInfo
      return legs.map((leg: any) => ({
        minutes: Math.ceil(leg.duration / 60) + 3, // Add 3 mins buffer for parking/navigating
        km: Number((leg.distance / 1000).toFixed(1)),
      }));

    } catch (error) {
      console.warn('⚠️ OSRM API failed, falling back to Haversine estimates:', error);
      return this.getFallbackTravelTimes(startNode, orderedPlaces);
    }
  }

  /**
   * Fetches the polyline geometry for an entire route.
   */
  async getRouteGeometry(startNode: Coordinates, orderedPlaces: SchedulablePlace[]): Promise<string | null> {
    if (orderedPlaces.length === 0) return null;

    const allNodes = [startNode, ...orderedPlaces];
    const coordinatesString = allNodes
      .map(node => `${node.longitude.toFixed(6)},${node.latitude.toFixed(6)}`)
      .join(';');

    try {
      const response = await fetch(
        `${this.baseUrl}/route/v1/driving/${coordinatesString}?overview=full&geometries=polyline`
      );

      if (!response.ok) return null;
      const data = await response.json() as any;
      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) return null;

      return data.routes[0].geometry;
    } catch (error) {
      console.warn('⚠️ OSRM Geometry API failed:', error);
      return null;
    }
  }

  /**
   * Fallback method using Haversine if OSRM is unreachable
   */
  private getFallbackTravelTimes(startNode: Coordinates, orderedPlaces: SchedulablePlace[]): TravelInfo[] {
    const travelInfos: TravelInfo[] = [];
    let currentLocation = startNode;

    for (const place of orderedPlaces) {
      const distanceMeters = getHaversineDistanceMeters(currentLocation, place);
      const distanceKm = (distanceMeters / 1000) * 1.4; // Winding factor
      const hours = distanceKm / 35; // 35 km/h avg speed
      
      travelInfos.push({
        minutes: Math.ceil(hours * 60) + 3,
        km: Number(distanceKm.toFixed(1)),
      });

      currentLocation = place;
    }

    return travelInfos;
  }
}

export const osrm = new OSRMClient(process.env.OSRM_BASE_URL || 'https://router.project-osrm.org');
