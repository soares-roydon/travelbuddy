import { z } from 'zod';

// ── Enums (mirror Prisma enums) ──

export const PlaceTypeEnum = z.enum(['ATTRACTION', 'RESTAURANT', 'ACTIVITY']);
export const BudgetTierEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);
export const MealTypeEnum = z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'NONE']);
export const GoaRegionEnum = z.enum(['NORTH', 'CENTRAL', 'SOUTH']);
export const FoodPreferenceEnum = z.enum(['veg', 'non-veg', 'vegan']);

// ── Coordinates ──

export const CoordinatesSchema = z.object({
  latitude: z.number().min(14.5).max(15.9),
  longitude: z.number().min(73.5).max(74.5),
});

export const StayLocationSchema = CoordinatesSchema.extend({
  name: z.string().optional(),
});

// ── Request: User Preferences ──

export const PreferencesSchema = z.object({
  numDays: z.number().int().min(1).max(7),
  budget: BudgetTierEnum,
  stayLocation: StayLocationSchema,
  interests: z.array(z.string()).min(1),
  foodPreference: FoodPreferenceEnum.optional(),
  includeBreakfast: z.boolean().default(false),
  tripStartDate: z.string().optional(),
});

export type Preferences = z.infer<typeof PreferencesSchema>;

// ── Response: Place ──

export const PlaceResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  type: PlaceTypeEnum,
  category: z.string(),
  region: GoaRegionEnum,
  estimatedDurationMinutes: z.number(),
  budgetTier: BudgetTierEnum,
  avgCostPerPerson: z.number().nullable(),
  rating: z.number().nullable(),
  tags: z.array(z.string()),
});

// ── Response: Travel Leg ──

export const TravelLegSchema = z.object({
  minutes: z.number(),
  km: z.number(),
  routeGeometry: z.string().optional(),
});

// ── Response: Itinerary Slot ──

export const ItinerarySlotResponseSchema = z.object({
  slotOrder: z.number(),
  place: PlaceResponseSchema,
  startTime: z.string(),
  endTime: z.string(),
  durationMinutes: z.number(),
  travelFromPrev: TravelLegSchema.nullable(),
  isMealStop: z.boolean(),
  mealType: MealTypeEnum.nullable(),
});

// ── Response: Day Summary ──

export const DaySummarySchema = z.object({
  totalTravelMinutes: z.number(),
  totalTravelKm: z.number(),
  totalActivityMinutes: z.number(),
  region: z.string(),
  theme: z.string().optional(),
});

// ── Response: Itinerary Day ──

export const DayNarrativeSchema = z.object({
  title: z.string(),
  narrative: z.string(),
  tips: z.array(z.string()),
});

export const ItineraryDayResponseSchema = z.object({
  dayNumber: z.number(),
  date: z.string().nullable(),
  slots: z.array(ItinerarySlotResponseSchema),
  summary: DaySummarySchema,
  narrative: DayNarrativeSchema.optional(),
});

// ── Response: Full Itinerary ──

export const ItineraryResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string().optional(),
  days: z.array(ItineraryDayResponseSchema),
  preferences: PreferencesSchema,
  createdAt: z.string(),
});

export type ItineraryResponse = z.infer<typeof ItineraryResponseSchema>;

// ── API Error ──

export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  details: z.any().optional(),
});
