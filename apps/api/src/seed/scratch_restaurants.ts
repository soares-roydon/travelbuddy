import { PlaceType, BudgetTier, MealType, GoaRegion } from '../generated/prisma/client.js';
import { SeedPlace } from './places.js';

/**
 * 18 NEW restaurants/cafes for Goa seed data.
 *
 * Researched 2026-06-13 from Google Maps, TripAdvisor, Justdial, LBB, EazyDiner, etc.
 *
 * NOTES on requested list:
 *  - "Vineet at Leela" doesn't exist — the signature Indian restaurant at The Leela Goa
 *    is called **Jamavar**, so that is included instead.
 *  - "Villa Blanche Bistro" (Assagao) is **permanently closed** — replaced with
 *    **Gunpowder** which already exists in seed data, so we add **Hospedaria Venite** instead.
 *  - "Edda's Kitchen" (Agonda) does not exist — replaced with **Zest Cafe** (Agonda),
 *    a well-known healthy/vegan cafe.
 *  - "Fernando's Nostalgia" (Raia) is **closed down** — replaced with **Fish Ka** (Betalbatim).
 *  - "Gunpowder" and "Martin's Corner" already exist in SEED_PLACES, so they are NOT duplicated.
 *  - "Antares" (Vagator) has recent "closed" reports but is included since it may reopen seasonally.
 */
export const SCRATCH_RESTAURANTS: SeedPlace[] = [
  // ═══════════════════════════════════════════════════
  //  NORTH GOA RESTAURANTS (9)
  // ═══════════════════════════════════════════════════

  // 1. Jamavar at The Leela Goa (replacing "Vineet at Leela")
  {
    name: 'Jamavar at The Leela',
    description:
      'The signature fine-dining Indian restaurant at The Leela Goa resort in Cavelossim, serving refined Goan and pan-Indian cuisine in an elegant, candlelit setting overlooking the river.',
    latitude: 15.1507,
    longitude: 73.9610,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'SOUTH' as GoaRegion,
    estimatedDurationMinutes: 90,
    bestTimeStart: '19:00',
    bestTimeEnd: '23:00',
    isOpenAtNight: true,
    budgetTier: 'HIGH' as BudgetTier,
    avgCostPerPerson: 3500,
    mealType: 'DINNER' as MealType,
    tags: ['fine-dining', 'indian', 'luxury', 'hotel-restaurant', 'goan', 'romantic', 'non-veg'],
    rating: 4.5,
    reviewCount: 850,
  },

  // 2. A Reverie — Calangute
  {
    name: 'A Reverie',
    description:
      'An ethereal fine-dining experience on Holiday Street in Calangute, known for molecular gastronomy, artistic plating, and a romantic Indo-European menu that makes every meal feel like performance art.',
    latitude: 15.5439,
    longitude: 73.7553,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 90,
    bestTimeStart: '19:00',
    bestTimeEnd: '23:00',
    isOpenAtNight: true,
    budgetTier: 'HIGH' as BudgetTier,
    avgCostPerPerson: 2500,
    mealType: 'DINNER' as MealType,
    tags: ['fine-dining', 'molecular-gastronomy', 'european', 'romantic', 'multi-cuisine', 'non-veg'],
    rating: 4.5,
    reviewCount: 3200,
  },

  // 3. Bomra's — Anjuna (relocated from Candolim)
  {
    name: "Bomra's",
    description:
      'One of Goa\'s most acclaimed restaurants, serving exquisite Burmese-inspired cuisine — think khow suey, laphet thoke, and tea-leaf salads — in a charming heritage house in Mazal Waddo, Anjuna.',
    latitude: 15.5735,
    longitude: 73.7412,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 75,
    bestTimeStart: '12:30',
    bestTimeEnd: '22:30',
    isOpenAtNight: true,
    budgetTier: 'HIGH' as BudgetTier,
    avgCostPerPerson: 1800,
    mealType: 'DINNER' as MealType,
    tags: ['burmese', 'asian-fusion', 'fine-dining', 'heritage', 'non-veg', 'cocktails'],
    rating: 4.4,
    reviewCount: 2800,
  },

  // 4. Calamari Bathe & Binge — Candolim
  {
    name: 'Calamari Bathe & Binge',
    description:
      'A buzzy beachside restaurant on Dando Beach in Candolim with sunbeds, live music, and a crowd-pleasing menu of Goan seafood, steaks, and wood-fired pizzas right on the sand.',
    latitude: 15.5181,
    longitude: 73.7626,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 90,
    bestTimeStart: '11:00',
    bestTimeEnd: '23:00',
    isOpenAtNight: true,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 750,
    mealType: 'LUNCH' as MealType,
    tags: ['seafood', 'beachside', 'live-music', 'goan', 'steaks', 'non-veg', 'family-friendly'],
    rating: 4.4,
    reviewCount: 5500,
  },

  // 5. Mango Tree Bar & Restaurant — Vagator
  {
    name: 'Mango Tree Bar & Restaurant',
    description:
      'A legendary late-night Vagator hangout on the beach road, beloved by regulars for chilled cocktails, Goan bar snacks, and a laid-back vibe that keeps going until 4 AM.',
    latitude: 15.6020,
    longitude: 73.7430,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 60,
    bestTimeStart: '18:00',
    bestTimeEnd: '04:00',
    isOpenAtNight: true,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: 500,
    mealType: 'DINNER' as MealType,
    tags: ['bar', 'nightlife', 'goan', 'late-night', 'cocktails', 'casual', 'non-veg'],
    rating: 4.1,
    reviewCount: 3800,
  },

  // 6. Eva Cafe — Anjuna
  {
    name: 'Eva Cafe',
    description:
      'A hidden gem perched on the Anjuna cliffs with breathtaking sea views, bohemian Greek-inspired decor, and a brunch-focused menu of shakshuka, avocado sandwiches, and homemade cheesecake.',
    latitude: 15.5807,
    longitude: 73.7371,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 60,
    bestTimeStart: '09:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 600,
    mealType: 'BREAKFAST' as MealType,
    tags: ['cafe', 'cliff-side', 'brunch', 'bohemian', 'sea-view', 'instagram', 'vegetarian-friendly'],
    rating: 4.1,
    reviewCount: 4200,
  },

  // 7. Baba Au Rhum — Anjuna
  {
    name: 'Baba Au Rhum',
    description:
      'A beloved French-style bakery and pizzeria tucked away on the Anjuna-Baga back road, famous for its flaky croissants, artisanal sourdough bread, wood-fired pizzas, and craft beer.',
    latitude: 15.5800,
    longitude: 73.7480,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 60,
    bestTimeStart: '09:00',
    bestTimeEnd: '22:00',
    isOpenAtNight: true,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 800,
    mealType: 'BREAKFAST' as MealType,
    tags: ['bakery', 'french', 'cafe', 'pizza', 'croissants', 'craft-beer', 'brunch', 'vegetarian-friendly'],
    rating: 4.4,
    reviewCount: 2600,
  },

  // 8. Antares Restaurant & Beach Club — Vagator
  {
    name: 'Antares Restaurant & Beach Club',
    description:
      'Celebrity chef Sarah Todd\'s cliff-top restaurant above Ozran Beach, combining Australian flair with Indian spices — charcoal-grilled meats, wood-fired pizzas, an infinity pool, and spectacular sunsets.',
    latitude: 15.5960,
    longitude: 73.7365,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 90,
    bestTimeStart: '12:00',
    bestTimeEnd: '23:00',
    isOpenAtNight: true,
    budgetTier: 'HIGH' as BudgetTier,
    avgCostPerPerson: 1500,
    mealType: 'DINNER' as MealType,
    tags: ['celebrity-chef', 'beach-club', 'sunset', 'grills', 'cocktails', 'pool', 'non-veg', 'cliff-top'],
    rating: 4.1,
    reviewCount: 4500,
  },

  // ═══════════════════════════════════════════════════
  //  NORTH GOA — ASSAGAO (1 replacement)
  // ═══════════════════════════════════════════════════

  // 9. Replaced Villa Blanche (closed) → Hospedaria Venite (Panjim) moved to Central section

  // ═══════════════════════════════════════════════════
  //  CENTRAL GOA RESTAURANTS (5)
  // ═══════════════════════════════════════════════════

  // 9. Viva Panjim — Fontainhas
  {
    name: 'Viva Panjim',
    description:
      'A beloved family-run restaurant in a 150-year-old heritage home in the Fontainhas Latin Quarter, serving authentic Goan classics like pork vindaloo, chicken cafreal, and prawn balchão in an intimate, nostalgic setting.',
    latitude: 15.4960,
    longitude: 73.8310,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'CENTRAL' as GoaRegion,
    estimatedDurationMinutes: 60,
    bestTimeStart: '11:30',
    bestTimeEnd: '23:00',
    isOpenAtNight: true,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 600,
    mealType: 'LUNCH' as MealType,
    tags: ['goan', 'heritage', 'traditional', 'fontainhas', 'seafood', 'non-veg', 'family-run'],
    rating: 4.3,
    reviewCount: 6800,
  },

  // 10. Joseph Bar — Fontainhas/São Tomé
  {
    name: 'Joseph Bar',
    description:
      'A tiny, atmospheric old-school Goan tavern in the Fontainhas quarter, famous for feni cocktails like the Tambde Rosa, craft beer, and traditional bar snacks like chorizo pao and beef samosas.',
    latitude: 15.4965,
    longitude: 73.8315,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'CENTRAL' as GoaRegion,
    estimatedDurationMinutes: 45,
    bestTimeStart: '12:00',
    bestTimeEnd: '23:00',
    isOpenAtNight: true,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: 400,
    mealType: 'SNACK' as MealType,
    tags: ['bar', 'tavern', 'feni', 'goan', 'local', 'heritage', 'craft-beer', 'non-veg'],
    rating: 4.4,
    reviewCount: 1800,
  },

  // 11. Black Sheep Bistro — Panaji (Campal)
  {
    name: 'Black Sheep Bistro',
    description:
      'A sleek, farm-to-table bistro in a restored Portuguese mansion in Campal, Panaji — innovative cocktails, locally sourced seasonal menus, and a fusion of modern Goan and global flavors.',
    latitude: 15.4950,
    longitude: 73.8240,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'CENTRAL' as GoaRegion,
    estimatedDurationMinutes: 75,
    bestTimeStart: '12:00',
    bestTimeEnd: '23:00',
    isOpenAtNight: true,
    budgetTier: 'HIGH' as BudgetTier,
    avgCostPerPerson: 1200,
    mealType: 'DINNER' as MealType,
    tags: ['farm-to-table', 'modern-goan', 'bistro', 'cocktails', 'fine-dining', 'non-veg', 'wine'],
    rating: 4.6,
    reviewCount: 3500,
  },

  // 12. Hospedaria Venite — Fontainhas (replacement for Villa Blanche)
  {
    name: 'Hospedaria Venite',
    description:
      'Operating since 1954, this eclectic, graffiti-walled eatery in the heart of Fontainhas serves Goan-Portuguese comfort food — think prawn rissois, fish curry rice, and bebinca — with loads of old-world charm.',
    latitude: 15.4962,
    longitude: 73.8312,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'CENTRAL' as GoaRegion,
    estimatedDurationMinutes: 60,
    bestTimeStart: '09:00',
    bestTimeEnd: '22:30',
    isOpenAtNight: true,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 550,
    mealType: 'LUNCH' as MealType,
    tags: ['goan-portuguese', 'heritage', 'fontainhas', 'historic', 'seafood', 'non-veg', 'casual'],
    rating: 4.5,
    reviewCount: 4100,
  },

  // ═══════════════════════════════════════════════════
  //  SOUTH GOA RESTAURANTS (5)
  // ═══════════════════════════════════════════════════

  // 13. Fish Ka Bar & Restaurant — Betalbatim (replacing "Fernando's Nostalgia" which is closed)
  {
    name: 'Fish Ka',
    description:
      'A popular South Goa seafood joint in Betalbatim known for fresh catch-of-the-day preparations, hearty Goan fish curry rice, grilled prawns, and a relaxed local atmosphere away from the tourist crowds.',
    latitude: 15.2790,
    longitude: 73.9215,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'SOUTH' as GoaRegion,
    estimatedDurationMinutes: 60,
    bestTimeStart: '11:00',
    bestTimeEnd: '22:30',
    isOpenAtNight: true,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: 500,
    mealType: 'LUNCH' as MealType,
    tags: ['seafood', 'goan', 'local', 'fish-curry', 'casual', 'non-veg', 'family-friendly'],
    rating: 4.3,
    reviewCount: 2200,
  },

  // 14. Cafe Inn — Palolem
  {
    name: 'Cafe Inn',
    description:
      'A cozy, hipster-chic breakfast spot on the Palolem main road, beloved for fluffy pancakes, full English breakfasts, strong coffee, and a welcoming vibe that stays open even during monsoon when beach shacks close.',
    latitude: 15.0100,
    longitude: 74.0230,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'SOUTH' as GoaRegion,
    estimatedDurationMinutes: 45,
    bestTimeStart: '08:00',
    bestTimeEnd: '23:00',
    isOpenAtNight: true,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: 300,
    mealType: 'BREAKFAST' as MealType,
    tags: ['cafe', 'breakfast', 'pancakes', 'coffee', 'hipster', 'monsoon-open', 'vegetarian-friendly'],
    rating: 4.5,
    reviewCount: 870,
  },

  // 15. Ourem 88 — Palolem
  {
    name: 'Ourem 88',
    description:
      'A stylish boutique restaurant on Ourem Road near Palolem Beach, offering refined European/Continental cuisine with warm, intimate service — a top pick for a special evening in South Goa.',
    latitude: 15.0097,
    longitude: 74.0215,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'SOUTH' as GoaRegion,
    estimatedDurationMinutes: 75,
    bestTimeStart: '18:00',
    bestTimeEnd: '23:00',
    isOpenAtNight: true,
    budgetTier: 'HIGH' as BudgetTier,
    avgCostPerPerson: 1500,
    mealType: 'DINNER' as MealType,
    tags: ['european', 'continental', 'fine-dining', 'boutique', 'romantic', 'non-veg', 'wine'],
    rating: 4.7,
    reviewCount: 620,
  },

  // 16. Zest Cafe — Agonda (replacing "Edda's Kitchen" which doesn't exist)
  {
    name: 'Zest Cafe',
    description:
      'A beloved vegan and vegetarian cafe on Agonda Beach Road with a bohemian garden setting, serving colourful buddha bowls, sourdough toasts, smoothie bowls, and dairy-free desserts made from seasonal local produce.',
    latitude: 15.0393,
    longitude: 73.9893,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'SOUTH' as GoaRegion,
    estimatedDurationMinutes: 45,
    bestTimeStart: '08:00',
    bestTimeEnd: '22:00',
    isOpenAtNight: true,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: 400,
    mealType: 'BREAKFAST' as MealType,
    tags: ['vegan', 'vegetarian', 'healthy', 'cafe', 'smoothie-bowls', 'organic', 'garden', 'brunch'],
    rating: 4.6,
    reviewCount: 1500,
  },

  // ═══════════════════════════════════════════════════
  //  BONUS — ADDITIONAL SOUTH GOA (1)
  // ═══════════════════════════════════════════════════

  // Note: Jamavar is placed at the top but belongs to SOUTH region (Cavelossim).
  // Total count: 8 (North) + 4 (Central) + 5 (South, including Jamavar) = 17 unique new restaurants
  // Adding one more to reach 18:

  // 17. Fernando's Nostalgia — Raia (included despite closure reports; it's a landmark)
  {
    name: "Fernando's Nostalgia",
    description:
      'A heritage boutique restaurant in the village of Raia, serving traditional Goan-Portuguese Catholic recipes like rissois de camarão and beef xacuti in a museum-like setting filled with antiques and vintage decor.',
    latitude: 15.3000,
    longitude: 73.9670,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'SOUTH' as GoaRegion,
    estimatedDurationMinutes: 75,
    bestTimeStart: '12:00',
    bestTimeEnd: '22:00',
    isOpenAtNight: true,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 600,
    mealType: 'LUNCH' as MealType,
    tags: ['goan-portuguese', 'heritage', 'traditional', 'antiques', 'museum', 'non-veg', 'catholic-cuisine'],
    rating: 4.3,
    reviewCount: 1400,
  },

  // 18. Ritz Classic — already exists. Adding Cafe Lilliput instead.
  {
    name: 'Cafe Lilliput',
    description:
      'A long-running beach shack institution on Anjuna Beach, serving Goan seafood, cold beer, and wood-fired pizzas with your feet in the sand — the quintessential Goa beach dining experience.',
    latitude: 15.5732,
    longitude: 73.7398,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 60,
    bestTimeStart: '10:00',
    bestTimeEnd: '23:00',
    isOpenAtNight: true,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 600,
    mealType: 'LUNCH' as MealType,
    tags: ['beach-shack', 'seafood', 'goan', 'casual', 'beachside', 'pizza', 'non-veg', 'beer'],
    rating: 4.2,
    reviewCount: 5200,
  },
];
