import type { SchedulablePlace, Preferences } from '@travelbuddy/shared';

export class PlaceFilter {
  /**
   * Filters an array of places based on user preferences.
   * In a real implementation, this would be a Prisma database query.
   */
  static filter(allPlaces: SchedulablePlace[], preferences: Preferences): SchedulablePlace[] {
    let filtered = allPlaces.filter(p => p.type !== 'RESTAURANT'); // Restaurants are handled separately

    // Filter by Interests (Tags/Category)
    if (preferences.interests && preferences.interests.length > 0) {
      filtered = filtered.filter(p => {
        const categoryName = ((p as any).categoryName || '').toLowerCase();
        const interests = preferences.interests!.map(i => i.toLowerCase());
        
        // Strict match: if a place's category is one of the main interests,
        // it must be explicitly selected by the user.
        return interests.includes(categoryName);
      });
    }

    // Filter by Budget (Skip if medium/high since they might want cheap places too)
    if (preferences.budget === 'LOW') {
      // Don't include HIGH budget places for LOW budget trip
      // Need a budget property on SchedulablePlace, assuming it exists or we mock it
    }

    // Limit to top N places based on number of days (e.g., max 6 places per day)
    const maxPlaces = preferences.numDays * 5;
    
    // Sort by some criteria, e.g., highest rated or simply random for variety
    // Here we just shuffle for now to give varied results
    filtered = filtered.sort(() => 0.5 - Math.random());

    return filtered.slice(0, maxPlaces);
  }
}
