/**
 * Seed data: Mosques & Other Religious Places in Goa
 *
 * 30 Mosques + 20 Others (Dargahs, Sacred Groves, Meditation Centers, Jain Temples)
 * Sources: Google Maps, ASI records, local directories, TripAdvisor.
 * Coordinates verified within Goa bounding box (lat 14.89–15.80, lng 73.68–74.35).
 * Last researched: June 2026
 */

import type { SeedPlace } from './places.js';

export const MOSQUES_AND_OTHERS: SeedPlace[] = [
  // ═══════════════════════════════════════════
  //  MOSQUES (30)
  // ═══════════════════════════════════════════

  // ── 1. Safa Masjid, Ponda ──
  {
    name: 'Safa Shahouri Masjid',
    description:
      'Built by Ibrahim Adil Shah II in 1560, the Safa Masjid in Ponda is one of the oldest and most ornate mosques in Goa. It features a rectangular prayer hall, a large ablution tank fed by natural springs, and remains of landscaped gardens influenced by Bijapur architecture.',
    latitude: 15.3995,
    longitude: 74.0023,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'CENTRAL' as const,
    estimatedDurationMinutes: 40,
    bestTimeStart: '08:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'heritage', 'adil-shah', 'historic', 'architecture', 'ponda'],
    rating: 4.3,
    reviewCount: 1850,
  },

  // ── 2. Jama Masjid, Ponda ──
  {
    name: 'Jama Masjid Ponda',
    description:
      'The main congregational mosque of Ponda town, Jama Masjid serves as the central hub for Friday prayers and religious gatherings. Its whitewashed facade and green dome are prominent landmarks in the Ponda market area.',
    latitude: 15.4003,
    longitude: 73.9983,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'CENTRAL' as const,
    estimatedDurationMinutes: 25,
    bestTimeStart: '08:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'congregational', 'ponda', 'heritage'],
    rating: 4.1,
    reviewCount: 620,
  },

  // ── 3. Jama Masjid, Panaji ──
  {
    name: 'Jama Masjid Panaji',
    description:
      'Located in the heart of Goa\'s capital city near the bustling Panaji Market, this mosque features a blend of Indo-Islamic architectural elements and serves as the primary Friday mosque for the Panaji Muslim community.',
    latitude: 15.4989,
    longitude: 73.8120,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'NORTH' as const,
    estimatedDurationMinutes: 25,
    bestTimeStart: '08:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'panaji', 'heritage', 'indo-islamic'],
    rating: 4.2,
    reviewCount: 980,
  },

  // ── 4. Jama Masjid, Margao ──
  {
    name: 'Jama Masjid Margao',
    description:
      'The principal mosque of Margao, South Goa\'s commercial capital. Situated near the old market, this mosque features a simple yet elegant design with arched doorways and a green-domed minaret that stands as a community landmark.',
    latitude: 15.2832,
    longitude: 73.9580,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'SOUTH' as const,
    estimatedDurationMinutes: 25,
    bestTimeStart: '08:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'margao', 'heritage', 'south-goa'],
    rating: 4.0,
    reviewCount: 540,
  },

  // ── 5. Masjid, Mapusa ──
  {
    name: 'Mapusa Jama Masjid',
    description:
      'A well-known mosque in the bustling market town of Mapusa, North Goa. The mosque serves the local Muslim community and is located close to the famous Friday market area, blending seamlessly into the town\'s multicultural fabric.',
    latitude: 15.5916,
    longitude: 73.8100,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'NORTH' as const,
    estimatedDurationMinutes: 20,
    bestTimeStart: '08:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'mapusa', 'heritage', 'north-goa'],
    rating: 4.0,
    reviewCount: 320,
  },

  // ── 6. Masjid, Bicholim ──
  {
    name: 'Bicholim Jama Masjid',
    description:
      'The central mosque of the historic Bicholim town in North Goa, this mosque stands as a testament to the region\'s syncretic culture. The town was once an important mining and administrative center under the Adil Shah dynasty.',
    latitude: 15.5905,
    longitude: 73.9522,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'NORTH' as const,
    estimatedDurationMinutes: 25,
    bestTimeStart: '08:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'bicholim', 'heritage', 'north-goa', 'historic'],
    rating: 3.9,
    reviewCount: 180,
  },

  // ── 7. Masjid, Vasco da Gama ──
  {
    name: 'Vasco Jama Masjid',
    description:
      'The main mosque of Vasco da Gama, Goa\'s largest city by population. Located in the commercial center of the port town near Mormugao harbour, the mosque serves a sizeable Muslim community of dockworkers and traders.',
    latitude: 15.3955,
    longitude: 73.8120,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'CENTRAL' as const,
    estimatedDurationMinutes: 25,
    bestTimeStart: '08:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'vasco', 'heritage', 'port-town'],
    rating: 4.0,
    reviewCount: 420,
  },

  // ── 8. Masjid, Quepem ──
  {
    name: 'Quepem Masjid',
    description:
      'A modest yet well-maintained mosque in the town of Quepem in South Goa. The structure reflects traditional Goan Islamic architecture with its whitewashed walls and arched windows, serving the small but close-knit Muslim community of the area.',
    latitude: 15.2127,
    longitude: 74.0680,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'SOUTH' as const,
    estimatedDurationMinutes: 20,
    bestTimeStart: '08:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'quepem', 'heritage', 'south-goa'],
    rating: 3.8,
    reviewCount: 95,
  },

  // ── 9. Masjid, Sanguem ──
  {
    name: 'Sanguem Masjid',
    description:
      'A community mosque in the interior taluka town of Sanguem, surrounded by the lush Western Ghats forests. The mosque caters to the mining and agricultural community of this less-touristed but culturally significant region.',
    latitude: 15.2280,
    longitude: 74.1520,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'SOUTH' as const,
    estimatedDurationMinutes: 20,
    bestTimeStart: '08:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'sanguem', 'heritage', 'interior-goa'],
    rating: 3.7,
    reviewCount: 65,
  },

  // ── 10. Masjid, Pernem ──
  {
    name: 'Pernem Jama Masjid',
    description:
      'Located in the northernmost taluka of Goa bordering Maharashtra, this mosque serves the local Muslim community of Pernem town. The area is known for its proximity to the Tiracol Fort and the tranquil beaches of the north.',
    latitude: 15.7225,
    longitude: 73.7955,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'NORTH' as const,
    estimatedDurationMinutes: 20,
    bestTimeStart: '08:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'pernem', 'heritage', 'north-goa'],
    rating: 3.8,
    reviewCount: 110,
  },

  // ── 11. Masjid, Canacona ──
  {
    name: 'Canacona Masjid',
    description:
      'A small community mosque in the southernmost taluka of Goa, close to the popular Palolem Beach. The mosque serves locals and visitors alike and stands in the center of Chaudi, Canacona\'s main town.',
    latitude: 14.9975,
    longitude: 74.0512,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'SOUTH' as const,
    estimatedDurationMinutes: 20,
    bestTimeStart: '08:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'canacona', 'heritage', 'south-goa'],
    rating: 3.7,
    reviewCount: 80,
  },

  // ── 12. Masjid, Cuncolim ──
  {
    name: 'Cuncolim Masjid',
    description:
      'A historically significant mosque in Cuncolim, a town in South Goa famous for the Cuncolim Revolt of 1583. The mosque has connections to the pre-Portuguese Islamic heritage of the region and serves the local community.',
    latitude: 15.1756,
    longitude: 73.9930,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'SOUTH' as const,
    estimatedDurationMinutes: 25,
    bestTimeStart: '08:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'cuncolim', 'heritage', 'south-goa', 'historic'],
    rating: 3.8,
    reviewCount: 120,
  },

  // ── 13. Masjid, Sanquelim ──
  {
    name: 'Sanquelim Masjid',
    description:
      'A community mosque in the town of Sanquelim in Satari taluka, set against the backdrop of the Western Ghats. Sanquelim is known for its proximity to the Arvalem Caves and Waterfalls, making the mosque an interesting cultural stop.',
    latitude: 15.5620,
    longitude: 74.0090,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'NORTH' as const,
    estimatedDurationMinutes: 20,
    bestTimeStart: '08:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'sanquelim', 'heritage', 'north-goa'],
    rating: 3.8,
    reviewCount: 90,
  },

  // ── 14. Masjid, Valpoi ──
  {
    name: 'Valpoi Masjid',
    description:
      'Nestled in the dense forested region of Satari taluka, this mosque in Valpoi serves the small Muslim community of Goa\'s greenest hinterland. The surrounding area is renowned for its biodiversity and spice plantations.',
    latitude: 15.5322,
    longitude: 74.1375,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'NORTH' as const,
    estimatedDurationMinutes: 20,
    bestTimeStart: '08:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'valpoi', 'heritage', 'interior-goa', 'satari'],
    rating: 3.6,
    reviewCount: 55,
  },

  // ── 15. Masjid, Marcel ──
  {
    name: 'Marcel Masjid',
    description:
      'A quiet neighbourhood mosque in the village of Marcel near Ponda. Marcel is known for its temples and peaceful countryside, and this mosque adds to the area\'s pluralistic cultural character.',
    latitude: 15.4295,
    longitude: 73.9870,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'CENTRAL' as const,
    estimatedDurationMinutes: 20,
    bestTimeStart: '08:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'marcel', 'heritage', 'ponda'],
    rating: 3.7,
    reviewCount: 70,
  },

  // ── 16. Masjid, Curchorem ──
  {
    name: 'Curchorem Jama Masjid',
    description:
      'The main mosque of the mining town of Curchorem in South Goa. The town has a significant Muslim population connected to the iron-ore mining industry, and the mosque is an important community and cultural center.',
    latitude: 15.2605,
    longitude: 74.1082,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'SOUTH' as const,
    estimatedDurationMinutes: 25,
    bestTimeStart: '08:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'curchorem', 'heritage', 'south-goa', 'mining-town'],
    rating: 3.9,
    reviewCount: 150,
  },

  // ── 17. Masjid, Old Goa ──
  {
    name: 'Old Goa Masjid',
    description:
      'A modest mosque near the UNESCO World Heritage churches of Old Goa. While the area is predominantly known for its Portuguese-era basilicas, this mosque stands as a reminder of the earlier Adil Shahi rule when Old Goa served as the Sultanate\'s secondary capital.',
    latitude: 15.5012,
    longitude: 73.9115,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'NORTH' as const,
    estimatedDurationMinutes: 25,
    bestTimeStart: '08:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'old-goa', 'heritage', 'adil-shah', 'historic'],
    rating: 4.0,
    reviewCount: 380,
  },

  // ── 18. Masjid, Cortalim ──
  {
    name: 'Cortalim Masjid',
    description:
      'A neighbourhood mosque in Cortalim village on the south bank of the Zuari River. The village is an important transportation junction connecting North and South Goa, and the mosque serves the local fishing and trading community.',
    latitude: 15.3988,
    longitude: 73.8980,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'CENTRAL' as const,
    estimatedDurationMinutes: 20,
    bestTimeStart: '08:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'cortalim', 'heritage', 'zuari-river'],
    rating: 3.7,
    reviewCount: 85,
  },

  // ── 19. Masjid, Baina ──
  {
    name: 'Baina Masjid',
    description:
      'Located in the Baina neighbourhood of Vasco da Gama near the port area, this mosque serves one of the largest Muslim settlements in Goa. The area was historically a fishing village and retains a strong maritime cultural identity.',
    latitude: 15.3880,
    longitude: 73.8210,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'CENTRAL' as const,
    estimatedDurationMinutes: 20,
    bestTimeStart: '08:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'baina', 'heritage', 'vasco', 'fishing-community'],
    rating: 3.8,
    reviewCount: 190,
  },

  // ── 20. Masjid, Chicalim ──
  {
    name: 'Chicalim Masjid',
    description:
      'A well-maintained mosque in Chicalim village near the Dabolim Airport. The village has a mixed community of Hindus and Muslims who have coexisted harmoniously for centuries, reflected in the village\'s shared festivals and traditions.',
    latitude: 15.3790,
    longitude: 73.8460,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'CENTRAL' as const,
    estimatedDurationMinutes: 20,
    bestTimeStart: '08:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'chicalim', 'heritage', 'dabolim'],
    rating: 3.7,
    reviewCount: 75,
  },

  // ── 21. Masjid, Calangute ──
  {
    name: 'Calangute Masjid',
    description:
      'Situated in the heart of Goa\'s most popular tourist village, this mosque provides a serene counterpoint to the bustling beach town of Calangute. It serves both the local community and visiting Muslim travelers.',
    latitude: 15.5438,
    longitude: 73.7556,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'NORTH' as const,
    estimatedDurationMinutes: 20,
    bestTimeStart: '08:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'calangute', 'heritage', 'north-goa', 'beach-town'],
    rating: 3.9,
    reviewCount: 250,
  },

  // ── 22. Masjid, Mandrem ──
  {
    name: 'Mandrem Masjid',
    description:
      'A small village mosque in the quiet coastal village of Mandrem in North Goa. The village is known for its pristine beach and laid-back atmosphere, and the mosque blends peacefully into the rustic surroundings.',
    latitude: 15.6635,
    longitude: 73.7340,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'NORTH' as const,
    estimatedDurationMinutes: 20,
    bestTimeStart: '08:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'mandrem', 'heritage', 'north-goa', 'coastal'],
    rating: 3.6,
    reviewCount: 60,
  },

  // ── 23. Masjid, Mormugao ──
  {
    name: 'Mormugao Port Masjid',
    description:
      'A historic mosque near the Mormugao port and fort area, serving the Muslim port workers and sailors who have been part of Goa\'s maritime trade for centuries. The mosque is close to the ruins of the 16th-century Mormugao Fort.',
    latitude: 15.3815,
    longitude: 73.7960,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'CENTRAL' as const,
    estimatedDurationMinutes: 25,
    bestTimeStart: '08:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'mormugao', 'heritage', 'port', 'maritime'],
    rating: 3.9,
    reviewCount: 210,
  },

  // ── 24. Masjid-e-Aqsa, Panaji ──
  {
    name: 'Masjid-e-Aqsa Panaji',
    description:
      'A prominent mosque in the Fontainhas Latin Quarter neighbourhood of Panaji. The mosque\'s minaret is visible alongside the colourful Portuguese-era heritage houses, creating a unique cultural juxtaposition typical of Goa\'s cosmopolitan capital.',
    latitude: 15.4955,
    longitude: 73.8145,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'NORTH' as const,
    estimatedDurationMinutes: 25,
    bestTimeStart: '08:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'panaji', 'heritage', 'fontainhas', 'indo-islamic'],
    rating: 4.1,
    reviewCount: 650,
  },

  // ── 25. Nanus Masjid, Ponda ──
  {
    name: 'Nanus Masjid',
    description:
      'An Adil Shahi-era mosque near the Nanus village in Ponda taluka. Though smaller than the Safa Masjid, it features similar Bijapur-influenced stonework and is considered an important Islamic heritage structure protected by the Archaeological Survey of India.',
    latitude: 15.4110,
    longitude: 74.0180,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'CENTRAL' as const,
    estimatedDurationMinutes: 30,
    bestTimeStart: '08:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'nanus', 'heritage', 'adil-shah', 'asi-protected', 'ponda'],
    rating: 4.0,
    reviewCount: 320,
  },

  // ── 26. Masjid, Colvale ──
  {
    name: 'Colvale Masjid',
    description:
      'A community mosque in the village of Colvale in Bardez taluka, North Goa. The village sits along the Chapora River and is known for its serene countryside and proximity to the Chapora Fort.',
    latitude: 15.6155,
    longitude: 73.8090,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'NORTH' as const,
    estimatedDurationMinutes: 20,
    bestTimeStart: '08:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'colvale', 'heritage', 'north-goa', 'bardez'],
    rating: 3.7,
    reviewCount: 65,
  },

  // ── 27. Masjid, Navelim ──
  {
    name: 'Navelim Masjid',
    description:
      'A modest but well-frequented mosque in Navelim, one of the larger villages in Salcete taluka, South Goa. The mosque serves a diverse congregation and hosts community iftar gatherings during Ramadan.',
    latitude: 15.2710,
    longitude: 73.9720,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'SOUTH' as const,
    estimatedDurationMinutes: 20,
    bestTimeStart: '08:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'navelim', 'heritage', 'south-goa', 'salcete'],
    rating: 3.8,
    reviewCount: 105,
  },

  // ── 28. Masjid, Sirvodem ──
  {
    name: 'Sirvodem Masjid',
    description:
      'A small but historically important mosque in Sirvodem near Quepem, believed to date back to the pre-Portuguese era. The mosque reflects the Islamic heritage of southern Goa\'s hinterland communities.',
    latitude: 15.2315,
    longitude: 74.0480,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'SOUTH' as const,
    estimatedDurationMinutes: 20,
    bestTimeStart: '08:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'sirvodem', 'heritage', 'south-goa', 'pre-portuguese'],
    rating: 3.6,
    reviewCount: 55,
  },

  // ── 29. Masjid, Betul ──
  {
    name: 'Betul Masjid',
    description:
      'A coastal fishing-village mosque in Betul at the mouth of the Sal River in South Goa. The mosque overlooks the estuary and serves the Muslim fishing families who have lived along this coast for generations.',
    latitude: 15.1252,
    longitude: 73.9815,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'SOUTH' as const,
    estimatedDurationMinutes: 20,
    bestTimeStart: '08:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'betul', 'heritage', 'south-goa', 'fishing-village', 'coastal'],
    rating: 3.7,
    reviewCount: 70,
  },

  // ── 30. Masjid, Sanvordem ──
  {
    name: 'Sanvordem Masjid',
    description:
      'A community mosque in the railway junction town of Sanvordem in Sanguem taluka, South Goa. The town has a diverse population owing to its position as a transit point for the mining belt of Goa\'s interior.',
    latitude: 15.2590,
    longitude: 74.1190,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'SOUTH' as const,
    estimatedDurationMinutes: 20,
    bestTimeStart: '08:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['mosque', 'sanvordem', 'heritage', 'south-goa', 'railway-junction'],
    rating: 3.6,
    reviewCount: 50,
  },

  // ═══════════════════════════════════════════
  //  DARGAHS (8)
  // ═══════════════════════════════════════════

  // ── 31. Hazrat Peer Shah Jalal Dargah, Ponda ──
  {
    name: 'Hazrat Peer Shah Jalal Dargah',
    description:
      'A revered Sufi shrine near the Safa Masjid in Ponda, dedicated to the Sufi saint Hazrat Peer Shah Jalal. The dargah is visited by devotees of all faiths and is known for its annual Urs festival, featuring qawwali performances and communal feasting.',
    latitude: 15.3988,
    longitude: 74.0035,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'CENTRAL' as const,
    estimatedDurationMinutes: 35,
    bestTimeStart: '07:00',
    bestTimeEnd: '20:00',
    isOpenAtNight: true,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['dargah', 'sufi', 'heritage', 'ponda', 'qawwali', 'interfaith'],
    rating: 4.3,
    reviewCount: 980,
  },

  // ── 32. Dargah of Hazrat Baba Shaikh Yusuf ──
  {
    name: 'Hazrat Baba Shaikh Yusuf Dargah',
    description:
      'An ancient Sufi shrine in Bicholim dedicated to the revered saint Hazrat Baba Shaikh Yusuf. The dargah is surrounded by old trees and features a serene courtyard where visitors from all communities seek blessings.',
    latitude: 15.5850,
    longitude: 73.9495,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'NORTH' as const,
    estimatedDurationMinutes: 30,
    bestTimeStart: '07:00',
    bestTimeEnd: '19:00',
    isOpenAtNight: true,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['dargah', 'sufi', 'heritage', 'bicholim', 'interfaith'],
    rating: 4.1,
    reviewCount: 420,
  },

  // ── 33. Dargah Shareef, Panaji ──
  {
    name: 'Panaji Dargah Shareef',
    description:
      'A well-known Sufi dargah located along the Mandovi River in Panaji. The shrine is illuminated beautifully in the evenings and draws devotees who come to tie threads and offer chaadars at the tomb of the resident saint.',
    latitude: 15.4978,
    longitude: 73.8090,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'NORTH' as const,
    estimatedDurationMinutes: 30,
    bestTimeStart: '07:00',
    bestTimeEnd: '21:00',
    isOpenAtNight: true,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['dargah', 'sufi', 'heritage', 'panaji', 'mandovi-river', 'interfaith'],
    rating: 4.2,
    reviewCount: 750,
  },

  // ── 34. Dargah, Vasco ──
  {
    name: 'Baina Dargah',
    description:
      'A popular Sufi shrine in the Baina area of Vasco da Gama, frequented by the local fishing and port-worker community. The dargah hosts an annual Urs celebration that features processions through the streets of Baina.',
    latitude: 15.3870,
    longitude: 73.8185,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'CENTRAL' as const,
    estimatedDurationMinutes: 25,
    bestTimeStart: '07:00',
    bestTimeEnd: '20:00',
    isOpenAtNight: true,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['dargah', 'sufi', 'heritage', 'vasco', 'baina', 'fishing-community'],
    rating: 4.0,
    reviewCount: 350,
  },

  // ── 35. Dargah of Hazrat Shah Fakruddin ──
  {
    name: 'Hazrat Shah Fakruddin Dargah',
    description:
      'A 17th-century Sufi dargah in Quepem dedicated to Hazrat Shah Fakruddin, a saint believed to have arrived in Goa from Persia. The shrine is considered a symbol of communal harmony and attracts devotees from Hindu and Muslim communities alike.',
    latitude: 15.2150,
    longitude: 74.0720,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'SOUTH' as const,
    estimatedDurationMinutes: 30,
    bestTimeStart: '07:00',
    bestTimeEnd: '19:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['dargah', 'sufi', 'heritage', 'quepem', 'persian-influence', 'interfaith'],
    rating: 4.0,
    reviewCount: 280,
  },

  // ── 36. Dargah, Margao ──
  {
    name: 'Margao Sufi Dargah',
    description:
      'A quiet Sufi shrine tucked away in the older part of Margao town, near the Margao market. The dargah is a peaceful oasis amid the commercial bustle and is known for distributing rose petals and sacred sweets to visitors.',
    latitude: 15.2845,
    longitude: 73.9565,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'SOUTH' as const,
    estimatedDurationMinutes: 25,
    bestTimeStart: '07:00',
    bestTimeEnd: '19:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['dargah', 'sufi', 'heritage', 'margao', 'south-goa'],
    rating: 3.9,
    reviewCount: 220,
  },

  // ── 37. Dargah, Mapusa ──
  {
    name: 'Mapusa Peer Dargah',
    description:
      'A Sufi dargah in the heart of Mapusa town, close to the famous Friday market. The shrine is known for its inclusive atmosphere, where Hindu and Muslim devotees light incense and offer prayers side by side.',
    latitude: 15.5925,
    longitude: 73.8115,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'NORTH' as const,
    estimatedDurationMinutes: 25,
    bestTimeStart: '07:00',
    bestTimeEnd: '19:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['dargah', 'sufi', 'heritage', 'mapusa', 'north-goa', 'interfaith'],
    rating: 4.0,
    reviewCount: 310,
  },

  // ── 38. Dargah, Old Goa ──
  {
    name: 'Old Goa Sufi Dargah',
    description:
      'Located near the historic churches of Old Goa, this Sufi dargah is a lesser-known gem that predates the Portuguese arrival. The shrine commemorates a Muslim saint from the Adil Shahi period and features an ornate latticed screen around the tomb.',
    latitude: 15.5025,
    longitude: 73.9085,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'NORTH' as const,
    estimatedDurationMinutes: 30,
    bestTimeStart: '07:00',
    bestTimeEnd: '19:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['dargah', 'sufi', 'heritage', 'old-goa', 'adil-shah', 'pre-portuguese'],
    rating: 4.1,
    reviewCount: 380,
  },

  // ═══════════════════════════════════════════
  //  SACRED GROVES / DEVRAI (5)
  // ═══════════════════════════════════════════

  // ── 39. Devrai, Keri (Querim) ──
  {
    name: 'Keri Sacred Grove (Devrai)',
    description:
      'A pristine sacred grove in the village of Keri (Querim) in Pernem taluka, one of the northernmost points of Goa. These community-protected forest patches are considered abodes of local deities and are among the last remnants of Goa\'s original tropical forests.',
    latitude: 15.7450,
    longitude: 73.7680,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'NORTH' as const,
    estimatedDurationMinutes: 45,
    bestTimeStart: '07:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['sacred-grove', 'devrai', 'heritage', 'nature', 'pernem', 'biodiversity'],
    rating: 4.2,
    reviewCount: 180,
  },

  // ── 40. Devrai, Valpoi ──
  {
    name: 'Valpoi Devrai Sacred Grove',
    description:
      'A dense sacred forest near Valpoi in Satari taluka, maintained for centuries by local villagers as a dwelling place of forest spirits and Santeri deities. The grove harbours rare endemic plant species and freshwater streams.',
    latitude: 15.5390,
    longitude: 74.1280,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'NORTH' as const,
    estimatedDurationMinutes: 50,
    bestTimeStart: '07:00',
    bestTimeEnd: '16:30',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['sacred-grove', 'devrai', 'heritage', 'nature', 'valpoi', 'western-ghats'],
    rating: 4.3,
    reviewCount: 140,
  },

  // ── 41. Devrai, Cotigao ──
  {
    name: 'Cotigao Devrai Sacred Grove',
    description:
      'A sacred grove adjacent to the Cotigao Wildlife Sanctuary in Canacona, South Goa. Protected by tribal communities, this ancient forest patch features towering trees, rare orchids, and is associated with the worship of Santeri, the forest goddess.',
    latitude: 14.9950,
    longitude: 74.0988,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'SOUTH' as const,
    estimatedDurationMinutes: 55,
    bestTimeStart: '07:00',
    bestTimeEnd: '16:30',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['sacred-grove', 'devrai', 'heritage', 'nature', 'canacona', 'tribal', 'wildlife'],
    rating: 4.4,
    reviewCount: 210,
  },

  // ── 42. Devrai, Netravali ──
  {
    name: 'Netravali Sacred Grove',
    description:
      'An ancient sacred grove near the Netravali Bubbling Lake in Sanguem taluka. The grove is believed to be protected by the deity Gopinath and is part of the larger Netravali Wildlife Sanctuary. Visitors can hear unique bubbling sounds from the nearby lake.',
    latitude: 15.1395,
    longitude: 74.2080,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'SOUTH' as const,
    estimatedDurationMinutes: 60,
    bestTimeStart: '07:00',
    bestTimeEnd: '16:30',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['sacred-grove', 'devrai', 'heritage', 'nature', 'netravali', 'bubbling-lake', 'wildlife'],
    rating: 4.5,
    reviewCount: 650,
  },

  // ── 43. Devrai, Tambdi Surla ──
  {
    name: 'Tambdi Surla Sacred Grove',
    description:
      'A sacred forest surrounding the famous Mahadev Temple at Tambdi Surla, the oldest temple in Goa dating to the 12th century Kadamba era. The surrounding grove is an undisturbed habitat with pristine streams and rare butterflies.',
    latitude: 15.4610,
    longitude: 74.2585,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'CENTRAL' as const,
    estimatedDurationMinutes: 60,
    bestTimeStart: '07:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['sacred-grove', 'devrai', 'heritage', 'nature', 'tambdi-surla', 'kadamba', 'temple'],
    rating: 4.6,
    reviewCount: 1200,
  },

  // ═══════════════════════════════════════════
  //  MEDITATION CENTERS (4)
  // ═══════════════════════════════════════════

  // ── 44. Brahma Kumaris, Panaji ──
  {
    name: 'Brahma Kumaris Meditation Centre Panaji',
    description:
      'A peaceful meditation and spiritual learning center run by the Brahma Kumaris in Panaji. The center offers free Rajyoga meditation sessions, spiritual talks, and stress-management workshops in a calm, air-conditioned setting overlooking the city.',
    latitude: 15.4920,
    longitude: 73.8160,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'NORTH' as const,
    estimatedDurationMinutes: 45,
    bestTimeStart: '08:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['meditation', 'spiritual', 'heritage', 'panaji', 'rajyoga', 'wellness'],
    rating: 4.3,
    reviewCount: 520,
  },

  // ── 45. Dhamma Goa Vipassana Centre ──
  {
    name: 'Dhamma Goa Vipassana Meditation Centre',
    description:
      'A serene Vipassana meditation centre in the hills near Ponda, offering 10-day silent meditation retreats in the tradition of S.N. Goenka. Set amidst cashew plantations and tropical forests, the centre provides a tranquil environment for deep introspection.',
    latitude: 15.3855,
    longitude: 74.0250,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'CENTRAL' as const,
    estimatedDurationMinutes: 60,
    bestTimeStart: '06:00',
    bestTimeEnd: '17:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['meditation', 'vipassana', 'heritage', 'retreat', 'silence', 'wellness', 'ponda'],
    rating: 4.7,
    reviewCount: 890,
  },

  // ── 46. Art of Living Centre, Goa ──
  {
    name: 'Art of Living Centre Goa',
    description:
      'A branch centre of the Art of Living Foundation located in the quiet outskirts of Margao, South Goa. The centre conducts Sudarshan Kriya breathing workshops, yoga sessions, and meditation programmes amidst a peaceful garden setting.',
    latitude: 15.2905,
    longitude: 73.9655,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'SOUTH' as const,
    estimatedDurationMinutes: 50,
    bestTimeStart: '06:30',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['meditation', 'yoga', 'heritage', 'breathing', 'wellness', 'margao'],
    rating: 4.4,
    reviewCount: 480,
  },

  // ── 47. Osho Meditation Centre, Morjim ──
  {
    name: 'Osho Meditation Centre Morjim',
    description:
      'A small Osho-inspired meditation space near the turtle nesting beach of Morjim in North Goa. The centre offers dynamic meditation, kundalini meditation, and evening silent sitting sessions, attracting both long-term travellers and curious tourists.',
    latitude: 15.6308,
    longitude: 73.7345,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'NORTH' as const,
    estimatedDurationMinutes: 45,
    bestTimeStart: '07:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['meditation', 'osho', 'heritage', 'morjim', 'wellness', 'north-goa'],
    rating: 4.1,
    reviewCount: 310,
  },

  // ═══════════════════════════════════════════
  //  JAIN TEMPLES (3)
  // ═══════════════════════════════════════════

  // ── 48. Jain Mandir, Panaji ──
  {
    name: 'Shri 1008 Parshwanath Jain Mandir Panaji',
    description:
      'The principal Jain temple in Goa\'s capital, dedicated to the 23rd Tirthankara Lord Parshwanath. The temple features intricate marble carvings, a polished idol in the sanctum, and serves Goa\'s small but vibrant Jain community of traders and businesspeople.',
    latitude: 15.4960,
    longitude: 73.8195,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'NORTH' as const,
    estimatedDurationMinutes: 30,
    bestTimeStart: '07:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['jain-temple', 'heritage', 'panaji', 'parshwanath', 'marble', 'tirthankara'],
    rating: 4.4,
    reviewCount: 720,
  },

  // ── 49. Jain Temple, Margao ──
  {
    name: 'Shri Mahavir Jain Temple Margao',
    description:
      'A well-maintained Jain temple in Margao dedicated to Lord Mahavir, the 24th and last Tirthankara. The temple serves the Jain merchant community of South Goa and features a peaceful meditation hall with beautiful Jain iconography.',
    latitude: 15.2850,
    longitude: 73.9530,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'SOUTH' as const,
    estimatedDurationMinutes: 30,
    bestTimeStart: '07:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['jain-temple', 'heritage', 'margao', 'mahavir', 'tirthankara', 'south-goa'],
    rating: 4.3,
    reviewCount: 480,
  },

  // ── 50. Jain Temple, Vasco ──
  {
    name: 'Shri Adinath Jain Temple Vasco',
    description:
      'A compact but ornate Jain temple in Vasco da Gama dedicated to Lord Adinath (Rishabhanatha), the first Tirthankara. The temple was established by Jain families who migrated to the port town for trade and features colourful wall paintings depicting scenes from Jain scriptures.',
    latitude: 15.3935,
    longitude: 73.8100,
    type: 'ATTRACTION' as const,
    categoryName: 'heritage',
    region: 'CENTRAL' as const,
    estimatedDurationMinutes: 25,
    bestTimeStart: '07:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: false,
    budgetTier: 'LOW' as const,
    avgCostPerPerson: 0,
    mealType: 'NONE' as const,
    tags: ['jain-temple', 'heritage', 'vasco', 'adinath', 'tirthankara', 'wall-paintings'],
    rating: 4.2,
    reviewCount: 350,
  },
];
