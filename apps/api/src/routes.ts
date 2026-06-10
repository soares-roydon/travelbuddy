import { Router } from 'express';
import { z } from 'zod';
import { PreferencesSchema } from '@travelbuddy/shared';
import { prisma } from './lib/prisma.js';
import { ItineraryEngine } from './services/engine.js';
import { PlaceFilter } from './services/placeFilter.js';
import { SEED_PLACES } from './seed/places.js'; // Fallback mock data

const router = Router();

router.post('/generate', async (req, res) => {
  try {
    // 1. Validate Input
    const preferences = PreferencesSchema.parse(req.body);

    let allPlaces = [];
    let allRestaurants = [];

    // 2. Fetch Places from Database
    try {
      // Attempt to query Supabase PostGIS/Prisma
      const dbPlaces = await prisma.place.findMany();
      if (dbPlaces.length > 0) {
        allPlaces = dbPlaces;
        allRestaurants = dbPlaces.filter(p => p.type === 'RESTAURANT');
      } else {
        throw new Error('Database empty, using fallback data.');
      }
    } catch (dbError) {
      console.warn('⚠️ Database connection failed or empty, using fallback seed data:', dbError);
      // Fallback to in-memory mock data if Supabase is unreachable
      allPlaces = SEED_PLACES;
      allRestaurants = SEED_PLACES.filter(p => p.type === 'RESTAURANT');
    }

    // 3. Filter Places based on preferences
    const filteredPlaces = PlaceFilter.filter(allPlaces as any, preferences);

    // 4. Generate Itinerary
    const itinerary = await ItineraryEngine.generate(preferences, filteredPlaces, allRestaurants as any);

    // 5. Optionally save to database (fire and forget)
    try {
      await prisma.itinerary.create({
        data: {
          id: itinerary.id,
          title: itinerary.title,
          numDays: itinerary.preferences.numDays,
          budget: itinerary.preferences.budget as any,
          stayLatitude: itinerary.preferences.stayLocation.latitude,
          stayLongitude: itinerary.preferences.stayLocation.longitude,
          interests: itinerary.preferences.interests,
          foodPreference: itinerary.preferences.foodPreference,
          // Skipping deep insertion of days/slots for now to avoid complexity in this demo
        }
      });
    } catch (saveError) {
      console.warn('⚠️ Failed to save itinerary to database:', saveError);
    }

    // 6. Return response
    res.json(itinerary);

  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
    } else {
      console.error('Error generating itinerary:', error);
      res.status(500).json({ error: 'Internal Server Error', message: (error as Error).message });
    }
  }
});

export default router;
