import type { Coordinates } from '@travelbuddy/shared';

/**
 * Calculates the Haversine distance between two points in meters.
 */
export function getHaversineDistanceMeters(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371e3; // Earth's radius in meters
  const lat1 = (coord1.latitude * Math.PI) / 180;
  const lat2 = (coord2.latitude * Math.PI) / 180;
  const deltaLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const deltaLng = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Estimates driving travel time in minutes between two points using Haversine distance.
 * Assumes an average speed of 35 km/h (typical for Goa roads) and a winding factor of 1.4.
 */
export function estimateTravelTimeMinutes(coord1: Coordinates, coord2: Coordinates): number {
  const distanceMeters = getHaversineDistanceMeters(coord1, coord2);
  const windingFactor = 1.4; // Roads aren't straight lines
  const distanceKm = (distanceMeters / 1000) * windingFactor;
  
  const avgSpeedKmh = 35;
  const hours = distanceKm / avgSpeedKmh;
  
  // Base time of 3 minutes for parking/navigating
  return Math.ceil(hours * 60) + 3;
}
