/**
 * Seed data: Extra Activities & Experiences in Goa
 *
 * 15 NEW real activities spanning water sports, heritage, nature, adventure,
 * wellness, and culinary experiences.
 *
 * Sources: Google Maps, TripAdvisor, operator websites, local tourism boards.
 * Coordinates verified within Goa range (lat ~14.5–15.9, lng ~73.5–74.5).
 * Last researched: June 2026
 *
 * NOTE: This file uses categories 'adventure', 'wellness', and 'cafe' (for
 * cooking class) that may need to be added to categories.ts if not present.
 */

import { PlaceType, BudgetTier, MealType, GoaRegion } from '../generated/prisma/client.js';
import { SeedPlace } from './places.js';

export const EXTRA_ACTIVITIES: SeedPlace[] = [
  // ═══════════════════════════════════════
  // 1. Jet Ski Safari at Chapora River
  // ═══════════════════════════════════════
  {
    name: 'Jet Ski Safari at Chapora River',
    description:
      'A high-speed jet ski ride through the scenic Chapora River, passing under the Chapora bridge and along mangrove-lined banks before heading out to the open Arabian Sea near Vagator. Rides last 20–30 minutes with an instructor on board for beginners.',
    latitude: 15.6035,
    longitude: 73.7394,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'water-sports',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 45,
    bestTimeStart: '09:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 1800,
    mealType: 'NONE' as MealType,
    tags: ['jet-ski', 'adventure', 'water-sports', 'thrilling', 'river', 'sea'],
    rating: 4.3,
    reviewCount: 1250,
  },

  // ═══════════════════════════════════════
  // 2. White Water Rafting at Mhadei River
  // ═══════════════════════════════════════
  {
    name: 'White Water Rafting at Mhadei River',
    description:
      'Navigate Grade II–III rapids on the Mhadei River near Valpoi in the Western Ghats during the monsoon season (July–September). The 10-km course winds through pristine jungle with professional guides, helmets, and life jackets provided.',
    latitude: 15.5310,
    longitude: 74.1370,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'water-sports',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 150,
    bestTimeStart: '08:00',
    bestTimeEnd: '14:00',
    isOpenAtNight: false,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 2000,
    mealType: 'NONE' as MealType,
    tags: ['rafting', 'adventure', 'monsoon', 'river', 'rapids', 'extreme', 'seasonal'],
    rating: 4.4,
    reviewCount: 680,
  },

  // ═══════════════════════════════════════
  // 3. Old Goa Heritage Walk
  // ═══════════════════════════════════════
  {
    name: 'Old Goa Heritage Walk',
    description:
      'A guided walking tour through the UNESCO World Heritage precinct of Old Goa, covering the Basilica of Bom Jesus, Se Cathedral, Church of St. Francis of Assisi, and the ruins of the Church of St. Augustine. Guides bring 500 years of Portuguese colonial history to life.',
    latitude: 15.5009,
    longitude: 73.9116,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'heritage',
    region: 'CENTRAL' as GoaRegion,
    estimatedDurationMinutes: 150,
    bestTimeStart: '08:00',
    bestTimeEnd: '12:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: 600,
    mealType: 'NONE' as MealType,
    tags: ['heritage', 'walking-tour', 'unesco', 'churches', 'history', 'portuguese', 'guided'],
    rating: 4.7,
    reviewCount: 1450,
  },

  // ═══════════════════════════════════════
  // 4. Savoi Plantation Spice Tour
  // ═══════════════════════════════════════
  {
    name: 'Savoi Plantation Spice Tour',
    description:
      'A family-run 200-acre organic spice and cashew plantation nestled in the Western Ghats foothills near Ponda. Guided tours walk you through vanilla, cardamom, pepper, and cinnamon groves, ending with a hearty Goan buffet lunch on banana leaves.',
    latitude: 15.4256,
    longitude: 74.0453,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'nature',
    region: 'CENTRAL' as GoaRegion,
    estimatedDurationMinutes: 180,
    bestTimeStart: '09:30',
    bestTimeEnd: '15:00',
    isOpenAtNight: false,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 600,
    mealType: 'LUNCH' as MealType,
    tags: ['spice-plantation', 'nature', 'organic', 'guided-tour', 'buffet', 'family', 'cashew'],
    rating: 4.3,
    reviewCount: 2100,
  },

  // ═══════════════════════════════════════
  // 5. Cycling Tour of Divar Island
  // ═══════════════════════════════════════
  {
    name: 'Cycling Tour of Divar Island',
    description:
      'A guided bicycle tour of Divar Island, reached by a short ferry ride from Old Goa. Pedal through quiet laterite roads past colonial-era churches, paddy fields, traditional village houses, and panoramic Mandovi River viewpoints on this car-free island.',
    latitude: 15.5157,
    longitude: 73.8926,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'nature',
    region: 'CENTRAL' as GoaRegion,
    estimatedDurationMinutes: 180,
    bestTimeStart: '07:00',
    bestTimeEnd: '11:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: 800,
    mealType: 'NONE' as MealType,
    tags: ['cycling', 'island', 'offbeat', 'nature', 'heritage', 'ferry', 'village', 'eco-tourism'],
    rating: 4.6,
    reviewCount: 520,
  },

  // ═══════════════════════════════════════
  // 6. Sunset Cruise at Nerul River
  // ═══════════════════════════════════════
  {
    name: 'Sunset Cruise at Nerul River',
    description:
      'A tranquil sunset boat cruise along the Nerul River and Coco Beach backwaters aboard a traditional wooden boat. Glide past mangroves, spot crocodiles and kingfishers, and enjoy the golden-hour sky reflected in the calm waters.',
    latitude: 15.5105,
    longitude: 73.7756,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'water-sports',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 90,
    bestTimeStart: '16:30',
    bestTimeEnd: '19:00',
    isOpenAtNight: false,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 1200,
    mealType: 'NONE' as MealType,
    tags: ['cruise', 'sunset', 'river', 'mangroves', 'romantic', 'birdwatching', 'peaceful'],
    rating: 4.5,
    reviewCount: 780,
  },

  // ═══════════════════════════════════════
  // 7. Traditional Fishing Trip from Betul
  // ═══════════════════════════════════════
  {
    name: 'Traditional Fishing Trip from Betul',
    description:
      'Join local fishermen on an early-morning deep-sea fishing expedition from Betul harbour in South Goa. Catch mackerel, kingfish, and red snapper aboard a traditional wooden trawler, with the option to have your catch cooked at a beach shack afterwards.',
    latitude: 15.1570,
    longitude: 73.9480,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'water-sports',
    region: 'SOUTH' as GoaRegion,
    estimatedDurationMinutes: 240,
    bestTimeStart: '06:00',
    bestTimeEnd: '11:00',
    isOpenAtNight: false,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 2500,
    mealType: 'NONE' as MealType,
    tags: ['fishing', 'deep-sea', 'traditional', 'local-experience', 'offbeat', 'seafood'],
    rating: 4.4,
    reviewCount: 340,
  },

  // ═══════════════════════════════════════
  // 8. Yoga Retreat at Arambol
  // ═══════════════════════════════════════
  {
    name: 'Yoga Retreat at Arambol',
    description:
      'Arambol is Goa\'s spiritual heartland, offering drop-in and multi-day yoga retreats with styles ranging from Hatha and Ashtanga to Yin and aerial yoga. Morning sessions on the cliff overlooking the beach are followed by meditation and pranayama workshops.',
    latitude: 15.6842,
    longitude: 73.7024,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'wellness',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 120,
    bestTimeStart: '06:30',
    bestTimeEnd: '10:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: 500,
    mealType: 'NONE' as MealType,
    tags: ['yoga', 'wellness', 'meditation', 'retreat', 'spiritual', 'morning', 'cliff-view'],
    rating: 4.6,
    reviewCount: 1850,
  },

  // ═══════════════════════════════════════
  // 9. Surfing Lessons at Ashwem Beach
  // ═══════════════════════════════════════
  {
    name: 'Surfing Lessons at Ashwem Beach',
    description:
      'Learn to ride the waves at Ashwem and Morjim beaches with certified instructors from Surf Wala and Banana Surf School. The gentle, rolling waves and sandy bottom make this one of India\'s best spots for beginners. All equipment including soft-top boards and rash guards provided.',
    latitude: 15.6424,
    longitude: 73.7110,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'water-sports',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 120,
    bestTimeStart: '07:00',
    bestTimeEnd: '11:00',
    isOpenAtNight: false,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 1500,
    mealType: 'NONE' as MealType,
    tags: ['surfing', 'lessons', 'beginner-friendly', 'beach', 'water-sports', 'fitness'],
    rating: 4.7,
    reviewCount: 920,
  },

  // ═══════════════════════════════════════
  // 10. ATV/Quad Biking at Pissurlem
  // ═══════════════════════════════════════
  {
    name: 'ATV Quad Biking at Pissurlem',
    description:
      'Ride powerful all-terrain vehicles through the rugged laterite trails, jungle tracks, and river crossings near the village of Pissurlem in North Goa\'s interior. The 1–2 hour guided ride crosses streams, mud pits, and dense forest with stunning views of the Western Ghats.',
    latitude: 15.5730,
    longitude: 74.0360,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'nature',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 120,
    bestTimeStart: '09:00',
    bestTimeEnd: '16:00',
    isOpenAtNight: false,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 2000,
    mealType: 'NONE' as MealType,
    tags: ['atv', 'quad-biking', 'adventure', 'off-road', 'jungle', 'thrilling'],
    rating: 4.4,
    reviewCount: 610,
  },

  // ═══════════════════════════════════════
  // 11. Hot Air Balloon Ride at Chandor
  // ═══════════════════════════════════════
  {
    name: 'Hot Air Balloon Ride at Chandor',
    description:
      'Soar 1,000 feet above the lush South Goan countryside in a tethered hot air balloon near the historic village of Chandor. The 15–20 minute ride offers breathtaking panoramic views of paddy fields, coconut groves, colonial mansions, and the distant Western Ghats.',
    latitude: 15.3090,
    longitude: 73.9800,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'nature',
    region: 'SOUTH' as GoaRegion,
    estimatedDurationMinutes: 60,
    bestTimeStart: '06:00',
    bestTimeEnd: '09:00',
    isOpenAtNight: false,
    budgetTier: 'HIGH' as BudgetTier,
    avgCostPerPerson: 3500,
    mealType: 'NONE' as MealType,
    tags: ['hot-air-balloon', 'aerial', 'scenic', 'adventure', 'photography', 'sunrise'],
    rating: 4.5,
    reviewCount: 480,
  },

  // ═══════════════════════════════════════
  // 12. Bird Watching at Carambolim Lake
  // ═══════════════════════════════════════
  {
    name: 'Bird Watching at Carambolim Lake',
    description:
      'A designated Important Bird Area (IBA) near Old Goa, Carambolim Lake attracts over 50 migratory and resident species including purple moorhens, grey herons, and painted storks. Best visited at dawn with binoculars, the wetland is fringed by paddy fields and offers a wooden watchtower for birdwatchers.',
    latitude: 15.4890,
    longitude: 73.9230,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'nature',
    region: 'CENTRAL' as GoaRegion,
    estimatedDurationMinutes: 120,
    bestTimeStart: '06:00',
    bestTimeEnd: '09:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: 0,
    mealType: 'NONE' as MealType,
    tags: ['birdwatching', 'nature', 'lake', 'migratory-birds', 'wildlife', 'photography', 'offbeat'],
    rating: 4.3,
    reviewCount: 390,
  },

  // ═══════════════════════════════════════
  // 13. Deltin Royale Casino Cruise
  // ═══════════════════════════════════════
  {
    name: 'Deltin Royale Casino Cruise',
    description:
      'India\'s largest and most luxurious offshore casino, permanently anchored on the Mandovi River in Panjim. Spread across three decks with over 120 gaming tables, 850 slot machines, live entertainment stages, and multiple bars and restaurants — entry includes unlimited food and select beverages.',
    latitude: 15.5000,
    longitude: 73.8300,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'nightlife',
    region: 'CENTRAL' as GoaRegion,
    estimatedDurationMinutes: 240,
    bestTimeStart: '18:00',
    bestTimeEnd: '05:00',
    isOpenAtNight: true,
    budgetTier: 'HIGH' as BudgetTier,
    avgCostPerPerson: 3000,
    mealType: 'DINNER' as MealType,
    tags: ['casino', 'cruise', 'luxury', 'gaming', 'nightlife', 'entertainment', 'dining'],
    rating: 4.2,
    reviewCount: 5600,
  },

  // ═══════════════════════════════════════
  // 14. Flyboarding at Baga Creek
  // ═══════════════════════════════════════
  {
    name: 'Flyboarding at Baga Creek',
    description:
      'Experience the thrill of being propelled up to 10 metres above the water surface on a hydro-powered flyboard at the mouth of Baga Creek. A 15–20 minute session includes a safety briefing and an instructor-controlled throttle for beginners.',
    latitude: 15.5570,
    longitude: 73.7525,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'water-sports',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 40,
    bestTimeStart: '09:30',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'HIGH' as BudgetTier,
    avgCostPerPerson: 3500,
    mealType: 'NONE' as MealType,
    tags: ['flyboarding', 'extreme', 'water-sports', 'adventure', 'thrilling', 'beach'],
    rating: 4.4,
    reviewCount: 560,
  },

  // ═══════════════════════════════════════
  // 15. Goan Cooking Class in Panjim
  // ═══════════════════════════════════════
  {
    name: 'Goan Cooking Class in Panjim',
    description:
      'A hands-on 3-hour culinary workshop in the Latin Quarter of Fontainhas, where local home cooks teach you to prepare authentic Goan dishes like xacuti, vindaloo, bebinca, and prawn balchão. Includes a market visit to source fresh spices and ingredients, followed by a sit-down meal of everything you\'ve cooked.',
    latitude: 15.4952,
    longitude: 73.8305,
    type: 'ACTIVITY' as PlaceType,
    categoryName: 'cafe',
    region: 'CENTRAL' as GoaRegion,
    estimatedDurationMinutes: 180,
    bestTimeStart: '10:00',
    bestTimeEnd: '14:00',
    isOpenAtNight: false,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 2000,
    mealType: 'LUNCH' as MealType,
    tags: ['cooking-class', 'culinary', 'goan-food', 'hands-on', 'cultural', 'local-experience', 'market-visit'],
    rating: 4.8,
    reviewCount: 720,
  },
];
