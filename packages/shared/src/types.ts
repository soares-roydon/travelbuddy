// Re-export Zod inferred types + additional utility types

// ── Inferred Types ──
// These are exported directly from schemas.ts, so we don't re-define them here.
// You can use them directly via import { Preferences } from '@travelbuddy/shared';

// ── Algorithm Internal Types ──

/**
 * A place with all the data the engine needs for scoring, scheduling, and meal planning.
 * Mirrors the full Prisma Place model so algorithms can use every field.
 */
export interface SchedulablePlace {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  latitude: number;
  longitude: number;
  estimatedDurationMinutes: number;
  type: string;                     // PlaceType: ATTRACTION | RESTAURANT | ACTIVITY
  categoryName?: string;            // e.g. 'beach', 'fort', 'restaurant'
  region?: string;                  // GoaRegion: NORTH | CENTRAL | SOUTH
  bestTimeStart?: string | null;    // "09:00"
  bestTimeEnd?: string | null;      // "18:00"
  isOpenAtNight?: boolean;
  budgetTier?: string;              // BudgetTier: LOW | MEDIUM | HIGH
  avgCostPerPerson?: number | null;
  mealType?: string;                // MealType: BREAKFAST | LUNCH | DINNER | SNACK | NONE
  tags?: string[];
  rating?: number | null;
  reviewCount?: number;
}

export interface ScoredPlace extends SchedulablePlace {
  /** Overall relevance score 0–1, higher is better */
  score: number;
  /** Breakdown of individual scoring components for debugging */
  scoreBreakdown?: {
    interestMatch: number;
    ratingScore: number;
    budgetFit: number;
    proximityScore: number;
    popularityScore: number;
    diversityBonus: number;
  };
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

// ── Day Time Budget ──

export interface DayTimeBudget {
  dayNumber: number;
  /** Minutes since midnight for day start (e.g. 540 = 09:00) */
  startMinute: number;
  /** Minutes since midnight for day end (e.g. 1260 = 21:00) */
  endMinute: number;
  /** Total minutes available for activities (excluding meals & travel) */
  availableActivityMinutes: number;
  /** Expected number of meal stops */
  mealCount: number;
}

// ── Coordinates ──

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// ── LLM Enrichment ──

export interface ItineraryNarrative {
  /** Overall trip title, e.g. "Sun, Sand & Heritage: 3 Days in Goa" */
  title: string;
  /** One-line summary of the entire trip */
  summary: string;
  /** Per-day narrative */
  days: {
    dayNumber: number;
    /** Day title, e.g. "North Goa Beach Hopping" */
    title: string;
    /** 2-3 sentence narrative for the day */
    narrative: string;
    /** Quick pro tips for the day */
    tips: string[];
  }[];
}
