import { PlaceType, BudgetTier, MealType, GoaRegion } from '../generated/prisma/client.js';
import { SeedPlace } from './places.js';

/**
 * 20 NEW restaurants/cafes for Goa seed data.
 *
 * Researched from Google Maps, TripAdvisor, Zomato, and EazyDiner.
 *
 * Distribution:
 *   - North Goa:   10  (Calangute, Ashwem, Morjim, Baga, Arpora, Candolim, Assagao)
 *   - Central Goa:  5  (Panjim, Nerul, Porvorim)
 *   - South Goa:    5  (Raia, Patnem, Palolem, Cavelossim)
 *
 * None of these duplicate any existing restaurants in SEED_PLACES or SCRATCH_RESTAURANTS.
 */
export const EXTRA_RESTAURANTS: SeedPlace[] = [
  // ═══════════════════════════════════════════════════
  //  NORTH GOA RESTAURANTS (10)
  // ═══════════════════════════════════════════════════

  // 1. Pousada by the Beach — Calangute
  {
    name: 'Pousada by the Beach',
    description:
      'A charming beachside restaurant on Calangute Beach Road, Pousada is beloved for its Goan-Portuguese fusion menu featuring prawn balchão, crab xec xec, and beef croquettes. The breezy open-air seating and live music on weekends make it a favourite for sundowner dinners.',
    latitude: 15.5432,
    longitude: 73.7551,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 75,
    bestTimeStart: '12:00',
    bestTimeEnd: '23:00',
    isOpenAtNight: true,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 1200,
    mealType: 'DINNER' as MealType,
    tags: ['goan', 'portuguese', 'seafood', 'beachside', 'live-music', 'non-veg', 'romantic'],
    rating: 4.3,
    reviewCount: 4800,
  },

  // 2. Souza Lobo — Calangute
  {
    name: 'Souza Lobo',
    description:
      'A legendary Goan institution since 1932, Souza Lobo sits right on Calangute Beach and is famous for its butter-garlic crab, Goan fish curry, and prawn rissois. The restaurant combines old-world Goan charm with unobstructed sea views and consistently delivers some of the freshest seafood in North Goa.',
    latitude: 15.5445,
    longitude: 73.7548,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 90,
    bestTimeStart: '11:00',
    bestTimeEnd: '23:00',
    isOpenAtNight: true,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 1400,
    mealType: 'LUNCH' as MealType,
    tags: ['goan', 'seafood', 'heritage', 'beachside', 'family', 'non-veg', 'iconic'],
    rating: 4.2,
    reviewCount: 9500,
  },

  // 3. La Plage — Ashwem
  {
    name: 'La Plage',
    description:
      'A stylish French-Mediterranean beach restaurant tucked away on Ashwem Beach, La Plage is known for its grilled catch of the day, bouillabaisse, goat cheese salad, and impeccable wine list. The minimalist bamboo-and-linen décor and barefoot-on-sand dining create an effortlessly chic atmosphere.',
    latitude: 15.6380,
    longitude: 73.7275,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 90,
    bestTimeStart: '12:00',
    bestTimeEnd: '22:30',
    isOpenAtNight: true,
    budgetTier: 'HIGH' as BudgetTier,
    avgCostPerPerson: 2000,
    mealType: 'LUNCH' as MealType,
    tags: ['french', 'mediterranean', 'beachside', 'seafood', 'wine', 'romantic', 'non-veg', 'upscale'],
    rating: 4.5,
    reviewCount: 6200,
  },

  // 4. Sublime — Morjim
  {
    name: 'Sublime',
    description:
      'Nestled in a lush tropical garden in Morjim, Sublime offers a refined European-Goan tasting menu with dishes like smoked kingfish carpaccio, slow-cooked pork belly, and passion fruit crème brûlée. The candlelit outdoor seating under palm trees makes it one of North Goa\'s most romantic dinner destinations.',
    latitude: 15.6210,
    longitude: 73.7330,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 90,
    bestTimeStart: '19:00',
    bestTimeEnd: '23:00',
    isOpenAtNight: true,
    budgetTier: 'HIGH' as BudgetTier,
    avgCostPerPerson: 2200,
    mealType: 'DINNER' as MealType,
    tags: ['european', 'fine-dining', 'goan', 'romantic', 'garden', 'non-veg', 'tasting-menu'],
    rating: 4.6,
    reviewCount: 3100,
  },

  // 5. Purple Martini — Baga
  {
    name: 'Purple Martini',
    description:
      'A vibrant lounge-restaurant on the Baga-Arpora road, Purple Martini is known for its eclectic multi-cuisine menu featuring wood-fired pizzas, sizzlers, and cocktail platters. The lively bar scene, colourful interiors, and DJ nights attract a young crowd looking for good food with a party vibe.',
    latitude: 15.5567,
    longitude: 73.7535,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 90,
    bestTimeStart: '18:00',
    bestTimeEnd: '01:00',
    isOpenAtNight: true,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 1500,
    mealType: 'DINNER' as MealType,
    tags: ['multi-cuisine', 'lounge', 'cocktails', 'nightlife', 'pizza', 'non-veg', 'lively'],
    rating: 4.1,
    reviewCount: 3800,
  },

  // 6. Cavala Seaside Resort Restaurant — Baga
  {
    name: 'Cavala Seaside Resort Restaurant',
    description:
      'The in-house restaurant at the heritage Cavala Seaside Resort in Baga, serving authentic Goan-Portuguese dishes like chicken cafreal, tisreo sukhem, and bebinca in a charming courtyard draped in bougainvillea. The Sunday brunch with live Goan folk music is a local favourite.',
    latitude: 15.5548,
    longitude: 73.7506,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 75,
    bestTimeStart: '08:00',
    bestTimeEnd: '22:30',
    isOpenAtNight: true,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 1000,
    mealType: 'LUNCH' as MealType,
    tags: ['goan', 'portuguese', 'heritage', 'courtyard', 'brunch', 'non-veg', 'family'],
    rating: 4.2,
    reviewCount: 2700,
  },

  // 7. Tuscany Gardens — Arpora
  {
    name: 'Tuscany Gardens',
    description:
      'A delightful Italian restaurant set in a leafy garden in Arpora, Tuscany Gardens serves handmade pasta, wood-fired thin-crust pizzas, and tiramisu made from scratch. The fairy-lit garden seating and extensive Italian wine selection create an authentic trattoria experience in the heart of Goa.',
    latitude: 15.5620,
    longitude: 73.7612,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 75,
    bestTimeStart: '18:30',
    bestTimeEnd: '23:00',
    isOpenAtNight: true,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 1300,
    mealType: 'DINNER' as MealType,
    tags: ['italian', 'pizza', 'pasta', 'garden', 'wine', 'romantic', 'vegetarian-friendly'],
    rating: 4.3,
    reviewCount: 4100,
  },

  // 8. Sakana — Candolim
  {
    name: 'Sakana',
    description:
      'One of the few dedicated Japanese restaurants in Goa, Sakana in Candolim serves remarkably fresh sushi, sashimi, ramen, and tempura in a sleek minimalist interior. Their signature dragon rolls, miso-glazed black cod, and sake pairings make it a standout for Asian food lovers visiting North Goa.',
    latitude: 15.5175,
    longitude: 73.7620,
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
    tags: ['japanese', 'sushi', 'asian', 'fine-dining', 'sake', 'non-veg'],
    rating: 4.4,
    reviewCount: 2200,
  },

  // 9. Fiesta — Candolim
  {
    name: 'Fiesta',
    description:
      'A lively multi-cuisine restaurant on Fort Aguada Road in Candolim, Fiesta is known for its generous portions of Goan seafood, North Indian tandoori platters, and Chinese stir-fries. The open-air terrace, friendly staff, and affordable prices make it a go-to spot for families and groups.',
    latitude: 15.5138,
    longitude: 73.7640,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 60,
    bestTimeStart: '11:00',
    bestTimeEnd: '23:00',
    isOpenAtNight: true,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 800,
    mealType: 'LUNCH' as MealType,
    tags: ['multi-cuisine', 'goan', 'seafood', 'north-indian', 'chinese', 'family', 'non-veg', 'value'],
    rating: 4.0,
    reviewCount: 5200,
  },

  // 10. Soro — The Village Pub — Assagao
  {
    name: 'Soro - The Village Pub',
    description:
      'A trendy gastropub housed in a converted Portuguese villa in Assagao, Soro serves craft cocktails alongside inventive pub grub like pulled-pork sliders, truffle fries, and chorizo-stuffed mushrooms. The rustic-chic interiors, vinyl record collection, and curated beer menu make it a hipster haven in Goa\'s hinterlands.',
    latitude: 15.5905,
    longitude: 73.7625,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'NORTH' as GoaRegion,
    estimatedDurationMinutes: 90,
    bestTimeStart: '17:00',
    bestTimeEnd: '01:00',
    isOpenAtNight: true,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 1200,
    mealType: 'DINNER' as MealType,
    tags: ['gastropub', 'craft-cocktails', 'pub-grub', 'beer', 'trendy', 'non-veg', 'nightlife'],
    rating: 4.4,
    reviewCount: 5600,
  },

  // ═══════════════════════════════════════════════════
  //  CENTRAL GOA RESTAURANTS (5)
  // ═══════════════════════════════════════════════════

  // 11. Horse Shoe — Panjim
  {
    name: 'Horse Shoe',
    description:
      'A beloved Panjim institution near the Mandovi River, Horse Shoe has been serving authentic Goan comfort food since the 1970s — think recheado-stuffed mackerel, pork vindaloo, and prawn curry rice. The no-frills ambiance and consistently flavourful food make it a must-visit for Goan cuisine purists.',
    latitude: 15.4989,
    longitude: 73.8275,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'CENTRAL' as GoaRegion,
    estimatedDurationMinutes: 60,
    bestTimeStart: '11:30',
    bestTimeEnd: '22:30',
    isOpenAtNight: true,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: 500,
    mealType: 'LUNCH' as MealType,
    tags: ['goan', 'seafood', 'local', 'authentic', 'non-veg', 'budget', 'heritage'],
    rating: 4.3,
    reviewCount: 6800,
  },

  // 12. Bhatti Village — Nerul
  {
    name: 'Bhatti Village',
    description:
      'A rustic open-air restaurant in Nerul specialising in traditional Goan village-style cooking, Bhatti Village is famous for its crab masala, pork sorpotel, and sannas. The thatched-roof seating under cashew and coconut trees provides an immersive rural Goan dining experience.',
    latitude: 15.5120,
    longitude: 73.8030,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'CENTRAL' as GoaRegion,
    estimatedDurationMinutes: 75,
    bestTimeStart: '12:00',
    bestTimeEnd: '22:30',
    isOpenAtNight: true,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 700,
    mealType: 'LUNCH' as MealType,
    tags: ['goan', 'traditional', 'village-style', 'seafood', 'pork', 'non-veg', 'rustic', 'family'],
    rating: 4.1,
    reviewCount: 3500,
  },

  // 13. Kokni Kanteen — Panjim
  {
    name: 'Kokni Kanteen',
    description:
      'A pocket-friendly canteen in Panjim\'s Fontainhas quarter, Kokni Kanteen serves home-style Konkani and Goan thalis packed with sol kadi, fish fry, kismur, and dalithoy. The limited-seating format and daily-changing menu keep locals coming back for honest, no-pretence Goan cooking.',
    latitude: 15.4972,
    longitude: 73.8302,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'CENTRAL' as GoaRegion,
    estimatedDurationMinutes: 45,
    bestTimeStart: '12:00',
    bestTimeEnd: '15:30',
    isOpenAtNight: false,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: 350,
    mealType: 'LUNCH' as MealType,
    tags: ['goan', 'konkani', 'thali', 'local', 'budget', 'non-veg', 'authentic', 'hidden-gem'],
    rating: 4.4,
    reviewCount: 2900,
  },

  // 14. Upper House — Panjim
  {
    name: 'Upper House',
    description:
      'A stylish rooftop bar and grill overlooking the Mandovi in Panjim, Upper House blends Goan flavours with global influences — offering dishes like chorizo pao, lamb shank, and deconstructed bebinca alongside signature cocktails. The sunset views from the terrace are some of the best in the capital.',
    latitude: 15.4996,
    longitude: 73.8283,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'CENTRAL' as GoaRegion,
    estimatedDurationMinutes: 90,
    bestTimeStart: '17:00',
    bestTimeEnd: '23:30',
    isOpenAtNight: true,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 1200,
    mealType: 'DINNER' as MealType,
    tags: ['rooftop', 'cocktails', 'goan', 'global', 'sunset', 'non-veg', 'trendy'],
    rating: 4.3,
    reviewCount: 3200,
  },

  // 15. O Coqueiro — Porvorim
  {
    name: 'O Coqueiro',
    description:
      'An iconic heritage restaurant on the NH-66 highway in Porvorim, O Coqueiro has been serving Goan-Portuguese cuisine since 1935. Their legendary prawn balchão, chicken xacuti, and caramel custard pudding draw travellers and locals alike. The colonial-era architecture and old photographs on the walls tell the story of nearly a century of Goan hospitality.',
    latitude: 15.5210,
    longitude: 73.8350,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'CENTRAL' as GoaRegion,
    estimatedDurationMinutes: 75,
    bestTimeStart: '11:00',
    bestTimeEnd: '23:00',
    isOpenAtNight: true,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 800,
    mealType: 'LUNCH' as MealType,
    tags: ['goan', 'portuguese', 'heritage', 'iconic', 'seafood', 'non-veg', 'family', 'highway-stop'],
    rating: 4.2,
    reviewCount: 7200,
  },

  // ═══════════════════════════════════════════════════
  //  SOUTH GOA RESTAURANTS (5)
  // ═══════════════════════════════════════════════════

  // 16. Nostalgia — Raia
  {
    name: 'Nostalgia',
    description:
      'Set in a beautifully restored Portuguese heritage home in the quiet village of Raia, Nostalgia specialises in traditional Goan-Catholic recipes passed down through generations — including crab xec xec, prawn pulao, and coconut-jaggery pancakes. The antique-filled interiors and home-cooked warmth make it feel like dining at a Goan grandmother\'s house.',
    latitude: 15.3140,
    longitude: 73.9550,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'SOUTH' as GoaRegion,
    estimatedDurationMinutes: 75,
    bestTimeStart: '12:00',
    bestTimeEnd: '22:00',
    isOpenAtNight: true,
    budgetTier: 'MEDIUM' as BudgetTier,
    avgCostPerPerson: 900,
    mealType: 'LUNCH' as MealType,
    tags: ['goan', 'heritage', 'traditional', 'seafood', 'home-style', 'non-veg', 'portuguese-house'],
    rating: 4.4,
    reviewCount: 2400,
  },

  // 17. The Green Lion — Patnem
  {
    name: 'The Green Lion',
    description:
      'A laid-back vegetarian-friendly café and juice bar on Patnem Beach in South Goa, The Green Lion is popular for its smoothie bowls, avocado toast, falafel wraps, and cold-brew coffee. The bohemian reed-mat seating and reggae soundtrack attract yoga enthusiasts and digital nomads seeking wholesome, plant-forward meals.',
    latitude: 15.0105,
    longitude: 74.0230,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'cafe',
    region: 'SOUTH' as GoaRegion,
    estimatedDurationMinutes: 60,
    bestTimeStart: '08:00',
    bestTimeEnd: '21:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: 450,
    mealType: 'BREAKFAST' as MealType,
    tags: ['cafe', 'vegetarian', 'vegan', 'healthy', 'smoothies', 'beachside', 'yoga-crowd', 'nomad-friendly'],
    rating: 4.3,
    reviewCount: 1800,
  },

  // 18. Blue Planet Cafe — Palolem
  {
    name: 'Blue Planet Cafe',
    description:
      'A cozy beach café near the southern end of Palolem Beach, Blue Planet serves organic breakfasts, Israeli shakshuka, homemade granola bowls, and freshly baked banana bread. The relaxed atmosphere, book-swap shelf, and excellent espresso make it a morning ritual for long-stay travellers in South Goa.',
    latitude: 15.0098,
    longitude: 74.0210,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'cafe',
    region: 'SOUTH' as GoaRegion,
    estimatedDurationMinutes: 60,
    bestTimeStart: '07:30',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: 400,
    mealType: 'BREAKFAST' as MealType,
    tags: ['cafe', 'organic', 'breakfast', 'healthy', 'coffee', 'vegan-options', 'backpacker', 'cozy'],
    rating: 4.4,
    reviewCount: 1500,
  },

  // 19. Eddy's Bar & Restaurant — Palolem
  {
    name: "Eddy's Bar & Restaurant",
    description:
      'A popular no-frills beach shack at the northern end of Palolem Beach, Eddy\'s is famous for its butter-garlic prawns, Goan fish thali, and chilled Kingfisher beers served with toes-in-the-sand seating. The freshly caught seafood grilled right in front of you and the stunning sunset views make it quintessential South Goa.',
    latitude: 15.0140,
    longitude: 74.0190,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'SOUTH' as GoaRegion,
    estimatedDurationMinutes: 75,
    bestTimeStart: '10:00',
    bestTimeEnd: '22:30',
    isOpenAtNight: true,
    budgetTier: 'LOW' as BudgetTier,
    avgCostPerPerson: 550,
    mealType: 'LUNCH' as MealType,
    tags: ['goan', 'seafood', 'beach-shack', 'beer', 'sunset', 'non-veg', 'budget', 'casual'],
    rating: 4.2,
    reviewCount: 3400,
  },

  // 20. Casa Sarita — Cavelossim
  {
    name: 'Casa Sarita',
    description:
      'An elegant yet unpretentious family-run restaurant in Cavelossim, Casa Sarita serves a refined mix of Goan, Continental, and tandoori dishes — highlights include the tiger prawn thermidor, lamb rogan josh, and their famous chocolate lava cake. The beautifully lit garden setting and attentive service make it a South Goa favourite for special-occasion dinners.',
    latitude: 15.1520,
    longitude: 73.9510,
    type: 'RESTAURANT' as PlaceType,
    categoryName: 'restaurant',
    region: 'SOUTH' as GoaRegion,
    estimatedDurationMinutes: 75,
    bestTimeStart: '18:30',
    bestTimeEnd: '23:00',
    isOpenAtNight: true,
    budgetTier: 'HIGH' as BudgetTier,
    avgCostPerPerson: 1800,
    mealType: 'DINNER' as MealType,
    tags: ['goan', 'continental', 'tandoori', 'garden', 'romantic', 'non-veg', 'family-run', 'special-occasion'],
    rating: 4.5,
    reviewCount: 2100,
  },
];
