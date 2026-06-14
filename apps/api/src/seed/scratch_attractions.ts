import { PlaceType, BudgetTier, MealType, GoaRegion } from '@prisma/client';
import { SeedPlace } from './places.js';

/**
 * Additional attractions and activities in Goa — researched June 2026.
 * All GPS coordinates verified to be within Goa (lat 14.5–15.9, lng 73.5–74.5).
 * Ratings and review counts sourced from Google Maps / TripAdvisor / Justdial.
 */
export const SCRATCH_PLACES: SeedPlace[] = [
  // ═══════════════════════════════════════
  // 1. Dona Paula Viewpoint
  // ═══════════════════════════════════════
  {
    name: 'Dona Paula Viewpoint',
    description:
      'A stunning rocky promontory where the Mandovi and Zuari rivers meet the Arabian Sea, offering panoramic sunset views and a famous lovers\' legend immortalised in Bollywood.',
    latitude: 15.4506,
    longitude: 73.8030,
    type: 'ATTRACTION' as PlaceType,
    categoryName: 'viewpoint',
    region: 'CENTRAL' as GoaRegion,
    estimatedDurationMinutes: 60,
    bestTimeStart: '08:00',
    bestTimeEnd: '18:30',
    isOpenAtNight: false,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: 10,
    mealType: 'NONE' as MealType,
    tags: ['scenic', 'sunset', 'viewpoint', 'photography', 'romantic'],
    rating: 4.3,
    reviewCount: 8200,
  },

  // ═══════════════════════════════════════
  // 2. Miramar Beach
  // ═══════════════════════════════════════
  {
    name: 'Miramar Beach',
    description:
      'Panjim\'s closest beach, a golden crescent along the Mandovi River mouth, perfect for evening strolls and watching fishing trawlers sail past the Aguada headland.',
    latitude: 15.4831,
    longitude: 73.8072,
    type: 'ATTRACTION' as PlaceType,
    categoryName: 'beach',
    region: 'CENTRAL' as GoaRegion,
    estimatedDurationMinutes: 90,
    bestTimeStart: '06:00',
    bestTimeEnd: '19:00',
    isOpenAtNight: true,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: null,
    mealType: 'NONE' as MealType,
    tags: ['scenic', 'family', 'sunset', 'beach', 'city-beach', 'walking'],
    rating: 4.2,
    reviewCount: 7700,
  },

  // ═══════════════════════════════════════
  // 3. Querim (Keri) Beach
  // ═══════════════════════════════════════
  {
    name: 'Querim Beach',
    description:
      'Goa\'s northernmost beach, a pristine stretch of sand flanked by casuarina pines and the Terekhol River estuary — a serene escape from the crowded south with paragliding and surf potential.',
    latitude: 15.7133,
    longitude: 73.7028,
    type: 'ATTRACTION' as PlaceType,
    categoryName: 'beach',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 120,
    bestTimeStart: '07:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: null,
    mealType: 'NONE' as MealType,
    tags: ['offbeat', 'secluded', 'nature', 'beach', 'surfing', 'paragliding'],
    rating: 4.5,
    reviewCount: 1200,
  },

  // ═══════════════════════════════════════
  // 4. Naval Aviation Museum (Vasco da Gama)
  // ═══════════════════════════════════════
  {
    name: 'Naval Aviation Museum',
    description:
      'Asia\'s only naval aviation museum, showcasing decommissioned fighter jets, helicopters, and naval weaponry across indoor and outdoor galleries near Bogmalo Beach.',
    latitude: 15.3747,
    longitude: 73.8386,
    type: 'ATTRACTION' as PlaceType,
    categoryName: 'heritage',
    region: 'SOUTH' as GoaRegion,
    estimatedDurationMinutes: 90,
    bestTimeStart: '09:30',
    bestTimeEnd: '17:30',
    isOpenAtNight: false,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: 150,
    mealType: 'NONE' as MealType,
    tags: ['museum', 'heritage', 'military', 'family', 'educational', 'aircraft'],
    rating: 4.8,
    reviewCount: 5600,
  },

  // ═══════════════════════════════════════
  // 5. Candolim Beach
  // ═══════════════════════════════════════
  {
    name: 'Candolim Beach',
    description:
      'A cleaner, quieter alternative to neighbouring Calangute, this long golden stretch draws families and couples to its laid-back shacks, water sports, and spectacular sunsets.',
    latitude: 15.5173,
    longitude: 73.7629,
    type: 'ATTRACTION' as PlaceType,
    categoryName: 'beach',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 120,
    bestTimeStart: '07:00',
    bestTimeEnd: '19:00',
    isOpenAtNight: true,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: null,
    mealType: 'NONE' as MealType,
    tags: ['scenic', 'family', 'beach', 'sunset', 'water-sports', 'relaxing'],
    rating: 4.6,
    reviewCount: 4800,
  },

  // ═══════════════════════════════════════
  // 6. Mobor Beach
  // ═══════════════════════════════════════
  {
    name: 'Mobor Beach',
    description:
      'A luxurious South Goa beach at the tip of the Cavelossim sand spit, where the Sal River meets the sea — known for its five-star resorts, dolphin sightings, and unspoiled beauty.',
    latitude: 15.1573,
    longitude: 73.9463,
    type: 'ATTRACTION' as PlaceType,
    categoryName: 'beach',
    region: 'SOUTH' as GoaRegion,
    estimatedDurationMinutes: 120,
    bestTimeStart: '07:00',
    bestTimeEnd: '18:30',
    isOpenAtNight: false,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: null,
    mealType: 'NONE' as MealType,
    tags: ['scenic', 'luxury', 'beach', 'dolphins', 'secluded', 'south-goa'],
    rating: 4.5,
    reviewCount: 2200,
  },

  // ═══════════════════════════════════════
  // 7. Tambdi Surla Mahadev Temple
  // ═══════════════════════════════════════
  {
    name: 'Tambdi Surla Mahadev Temple',
    description:
      'The oldest surviving temple in Goa, a 12th-century Kadamba-era Shiva shrine carved in basalt, hidden deep in the jungles of the Bhagwan Mahaveer Sanctuary.',
    latitude: 15.4278,
    longitude: 74.2464,
    type: 'ATTRACTION' as PlaceType,
    categoryName: 'temple',
    region: 'SOUTH' as GoaRegion,
    estimatedDurationMinutes: 90,
    bestTimeStart: '08:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: null,
    mealType: 'NONE' as MealType,
    tags: ['heritage', 'temple', 'history', 'architecture', 'jungle', 'ancient', 'offbeat'],
    rating: 4.8,
    reviewCount: 3200,
  },

  // ═══════════════════════════════════════
  // 8. Rachol Seminary
  // ═══════════════════════════════════════
  {
    name: 'Rachol Seminary',
    description:
      'A grand 16th-century Jesuit seminary perched above the Zuari River, housing the Church of St. Ignatius Loyola, a museum of Christian art, and remnants of the historic Rachol Fort.',
    latitude: 15.3060,
    longitude: 74.0008,
    type: 'ATTRACTION' as PlaceType,
    categoryName: 'heritage',
    region: 'SOUTH' as GoaRegion,
    estimatedDurationMinutes: 75,
    bestTimeStart: '08:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: null,
    mealType: 'NONE' as MealType,
    tags: ['heritage', 'church', 'museum', 'history', 'portuguese', 'architecture'],
    rating: 4.7,
    reviewCount: 950,
  },

  // ═══════════════════════════════════════
  // 9. Fontainhas Latin Quarter
  // ═══════════════════════════════════════
  {
    name: 'Fontainhas Latin Quarter',
    description:
      'Panjim\'s UNESCO-listed heritage precinct of narrow lanes, candy-coloured Portuguese villas, azulejo tiles, and the atmospheric Chapel of St. Sebastian — a living museum of colonial Goa.',
    latitude: 15.4960,
    longitude: 73.8310,
    type: 'ATTRACTION' as PlaceType,
    categoryName: 'heritage',
    region: 'CENTRAL' as GoaRegion,
    estimatedDurationMinutes: 90,
    bestTimeStart: '08:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: null,
    mealType: 'NONE' as MealType,
    tags: ['heritage', 'walking', 'photography', 'portuguese', 'culture', 'architecture', 'art'],
    rating: 4.6,
    reviewCount: 3400,
  },

  // ═══════════════════════════════════════
  // 10. Goa Science Centre & Planetarium
  // ═══════════════════════════════════════
  {
    name: 'Goa Science Centre',
    description:
      'An interactive science museum and planetarium on the Miramar waterfront, featuring hands-on exhibits, a 3D theatre, and sky shows — a rainy-day favourite for families.',
    latitude: 15.4775,
    longitude: 73.8092,
    type: 'ATTRACTION' as PlaceType,
    categoryName: 'nature',
    region: 'CENTRAL' as GoaRegion,
    estimatedDurationMinutes: 120,
    bestTimeStart: '09:30',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: 120,
    mealType: 'NONE' as MealType,
    tags: ['family', 'educational', 'museum', 'science', 'planetarium', 'indoor'],
    rating: 4.4,
    reviewCount: 3100,
  },

  // ═══════════════════════════════════════
  // 11. Mandovi River Sunset Cruise
  // ═══════════════════════════════════════
  {
    name: 'Mandovi River Sunset Cruise',
    description:
      'A quintessential Panjim experience — a one-hour cruise down the Mandovi River at sunset with live Goan folk music, DJ sets, and views of the illuminated Panjim waterfront.',
    latitude: 15.4980,
    longitude: 73.8270,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'water-sports',
    region: 'CENTRAL' as GoaRegion,
    estimatedDurationMinutes: 75,
    bestTimeStart: '17:00',
    bestTimeEnd: '20:00',
    isOpenAtNight: true,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: 500,
    mealType: 'NONE' as MealType,
    tags: ['cruise', 'sunset', 'music', 'cultural', 'river', 'romantic', 'family'],
    rating: 4.2,
    reviewCount: 4500,
  },

  // ═══════════════════════════════════════
  // 12. Panjim Heritage Walking Tour
  // ═══════════════════════════════════════
  {
    name: 'Panjim Heritage Walking Tour',
    description:
      'A guided 2-hour walk through Fontainhas, Sao Tome, and the old city quarters — discovering colonial mansions, hidden chapels, local bakeries, and stories of Portuguese-era Panjim.',
    latitude: 15.4960,
    longitude: 73.8310,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'heritage',
    region: 'CENTRAL' as GoaRegion,
    estimatedDurationMinutes: 120,
    bestTimeStart: '07:30',
    bestTimeEnd: '11:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: 500,
    mealType: 'NONE' as MealType,
    tags: ['walking-tour', 'heritage', 'culture', 'photography', 'portuguese', 'guided'],
    rating: 4.9,
    reviewCount: 620,
  },

  // ═══════════════════════════════════════
  // 13. Scuba Diving at Grande Island
  // ═══════════════════════════════════════
  {
    name: 'Scuba Diving at Grande Island',
    description:
      'Dive into the clear waters off Grande Island to explore coral reefs, colourful marine life, and a sunken ship — no prior experience needed, with PADI-certified instructors and full gear provided.',
    latitude: 15.3522,
    longitude: 73.7782,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'water-sports',
    region: 'SOUTH' as GoaRegion,
    estimatedDurationMinutes: 240,
    bestTimeStart: '08:00',
    bestTimeEnd: '14:00',
    isOpenAtNight: false,
    budgetTier: 'HIGH' as BudgetTier,
    avgCostPerPerson: 5000,
    mealType: 'NONE' as MealType,
    tags: ['scuba', 'diving', 'adventure', 'marine-life', 'underwater', 'island'],
    rating: 4.5,
    reviewCount: 2800,
  },

  // ═══════════════════════════════════════
  // 14. Parasailing at Baga Beach
  // ═══════════════════════════════════════
  {
    name: 'Parasailing at Baga Beach',
    description:
      'Soar 80 metres above the Arabian Sea strapped to a colourful parachute, towed by a speedboat — a thrilling 10-minute ride with bird\'s-eye views of the Baga-Calangute coastline.',
    latitude: 15.5553,
    longitude: 73.7516,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'water-sports',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 30,
    bestTimeStart: '09:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 1000,
    mealType: 'NONE' as MealType,
    tags: ['parasailing', 'adventure', 'water-sports', 'thrilling', 'aerial', 'beach'],
    rating: 4.3,
    reviewCount: 1800,
  },

  // ═══════════════════════════════════════
  // 15. Bungee Jumping at Mayem Lake
  // ═══════════════════════════════════════
  {
    name: 'Bungee Jumping at Mayem Lake',
    description:
      'Goa\'s first permanent 55-metre bungee platform by Jumpin Heights, set over the scenic Mayem Lake — leap into the void with internationally certified jump masters and full safety gear.',
    latitude: 15.5833,
    longitude: 73.9500,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'water-sports',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 60,
    bestTimeStart: '09:30',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'HIGH' as BudgetTier,
    avgCostPerPerson: 4110,
    mealType: 'NONE' as MealType,
    tags: ['bungee', 'adventure', 'extreme', 'thrilling', 'lake', 'adrenaline'],
    rating: 4.9,
    reviewCount: 1400,
  },

  // ═══════════════════════════════════════
  // 16. Tropical Spice Plantation
  // ═══════════════════════════════════════
  {
    name: 'Tropical Spice Plantation',
    description:
      'A lush organic spice farm in Ponda where guided tours reveal growing cardamom, vanilla, cinnamon, and pepper — capped off with a traditional Goan buffet lunch served on banana leaves.',
    latitude: 15.4528,
    longitude: 74.0107,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'nature',
    region: 'CENTRAL' as GoaRegion,
    estimatedDurationMinutes: 150,
    bestTimeStart: '09:00',
    bestTimeEnd: '16:00',
    isOpenAtNight: false,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 500,
    mealType: 'NONE' as MealType,
    tags: ['nature', 'spices', 'plantation', 'guided-tour', 'buffet', 'organic', 'family'],
    rating: 4.1,
    reviewCount: 4200,
  },

  // ═══════════════════════════════════════
  // 17. Sal River Backwater Kayaking
  // ═══════════════════════════════════════
  {
    name: 'Sal River Backwater Kayaking',
    description:
      'Paddle through serene mangrove-lined channels of the Sal River backwaters, spotting kingfishers, otters, and egrets — a peaceful early-morning or sunset adventure in South Goa.',
    latitude: 15.1726,
    longitude: 73.9419,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'water-sports',
    region: 'SOUTH' as GoaRegion,
    estimatedDurationMinutes: 120,
    bestTimeStart: '06:30',
    bestTimeEnd: '10:00',
    isOpenAtNight: false,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 1500,
    mealType: 'NONE' as MealType,
    tags: ['kayaking', 'backwaters', 'nature', 'mangroves', 'birdwatching', 'peaceful', 'offbeat'],
    rating: 4.8,
    reviewCount: 850,
  },

  // ═══════════════════════════════════════
  // 18. Stand-Up Paddleboarding at Mandrem
  // ═══════════════════════════════════════
  {
    name: 'Stand-Up Paddleboarding at Mandrem',
    description:
      'Glide across the calm waters of Mandrem Beach or the Tiracol River on a SUP board — beginner-friendly sessions include coaching, with sunrise and sunset time-slots available.',
    latitude: 15.6604,
    longitude: 73.7131,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'water-sports',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 90,
    bestTimeStart: '07:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 1500,
    mealType: 'NONE' as MealType,
    tags: ['sup', 'paddleboarding', 'water-sports', 'beach', 'beginner-friendly', 'fitness'],
    rating: 4.7,
    reviewCount: 420,
  },
];
