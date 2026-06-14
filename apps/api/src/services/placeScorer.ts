import type { Preferences, SchedulablePlace, ScoredPlace } from '@travelbuddy/shared';
import { getHaversineDistanceMeters } from './geo.js';

export class PlaceScorer {
  /**
   * Scores and filters an array of places based on user preferences.
   */
  static scoreAndFilter(places: SchedulablePlace[], preferences: Preferences): ScoredPlace[] {
    const scoredPlaces: ScoredPlace[] = [];

    for (const place of places) {
      if (place.type === 'RESTAURANT') {
        continue; // Restaurants are handled separately by MealPlanner
      }

      // 1. InterestMatch (30%)
      let interestMatchScore = 0;
      if (preferences.interests && preferences.interests.length > 0) {
        if (preferences.interests.some(i => place.categoryName?.toLowerCase() === i.toLowerCase() || place.type.toLowerCase() === i.toLowerCase())) {
          interestMatchScore = 1.0;
        } else if (preferences.interests.some(i => place.tags?.map(t => t.toLowerCase()).includes(i.toLowerCase()))) {
          interestMatchScore = 0.7;
        }
      } else {
        interestMatchScore = 0.5; // Neutral if no interests provided
      }

      // 2. RatingScore (20%)
      const rating = place.rating ?? 4.0;
      let ratingScore = (rating - 3.0) / 2.0;
      ratingScore = Math.max(0, Math.min(1, ratingScore));

      // 3. BudgetFit (15%)
      let budgetFitScore = 0.8;
      if (preferences.budget === 'LOW' && place.budgetTier === 'HIGH') {
        budgetFitScore = 0.0;
      } else if (preferences.budget === 'HIGH') {
        budgetFitScore = 1.0;
      }

      // 4. ProximityScore (15%)
      let proximityScore = 0.5;
      if (preferences.stayLocation) {
        const safeStayLocation = {
          latitude: preferences.stayLocation.latitude ?? 15.2993,
          longitude: preferences.stayLocation.longitude ?? 74.1240,
        };
        const distKm = getHaversineDistanceMeters(safeStayLocation, place) / 1000;
        if (distKm < 15) {
          proximityScore = 1.0;
        } else if (distKm <= 30) {
          proximityScore = 0.5;
        } else {
          proximityScore = 0.2;
        }
      }

      // 5. PopularityScore (10%)
      const reviewCount = place.reviewCount ?? 100;
      const popularityScore = Math.min(reviewCount / 5000, 1.0);

      // 6. DiversityBonus (10%)
      const diversityBonus = 0.5; // Simplified for now

      // Total Score
      const totalScore = 
        (interestMatchScore * 0.30) +
        (ratingScore * 0.20) +
        (budgetFitScore * 0.15) +
        (proximityScore * 0.15) +
        (popularityScore * 0.10) +
        (diversityBonus * 0.10);

      scoredPlaces.push({
        ...place,
        score: totalScore,
        scoreBreakdown: {
          interestMatch: interestMatchScore,
          ratingScore,
          budgetFit: budgetFitScore,
          proximityScore,
          popularityScore,
          diversityBonus
        }
      });
    }

    // Sort descending by score
    scoredPlaces.sort((a, b) => b.score - a.score);

    // Limit to numDays * 5
    const maxPlaces = preferences.numDays * 5;
    return scoredPlaces.slice(0, maxPlaces);
  }
}
