// Re-export Zod inferred types + additional utility types

import type { z } from 'zod';
import type {
  PreferencesSchema,
  PlaceResponseSchema,
  ItinerarySlotResponseSchema,
  ItineraryDayResponseSchema,
  ItineraryResponseSchema,
  TravelLegSchema,
  DaySummarySchema,
} from './schemas.js';

// ── Inferred Types ──
// These are exported directly from schemas.ts, so we don't re-define them here.
// You can use them directly via import { Preferences } from '@travelbuddy/shared';

// ── Algorithm Internal Types ──

export interface SchedulablePlace {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  estimatedDurationMinutes: number;
  type: string;
  mealType?: string;
  region?: string;
  tags?: string[];
}

export interface ClusteredPlace extends SchedulablePlace {
  cluster_id: number;
}

export interface TravelInfo {
  minutes: number;
  km: number;
}

export interface TimeSlot {
  place: SchedulablePlace;
  startTime: string;
  endTime: string;
  travelFromPrevMinutes: number;
  travelFromPrevKm: number;
  isMealStop: boolean;
  mealType: string | null;
  routeGeometry?: string;
}

export interface DaySchedule {
  dayNumber: number;
  slots: TimeSlot[];
  totalTravelMinutes: number;
  totalActivityMinutes: number;
}

export interface MealWindow {
  type: string;
  idealMinute: number;
  windowStart: number;
  windowEnd: number;
  durationMinutes: number;
  required: boolean;
}

// ── Coordinates ──

export interface Coordinates {
  latitude: number;
  longitude: number;
}
