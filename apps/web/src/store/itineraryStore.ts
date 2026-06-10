import { create } from 'zustand';
import type { ItineraryResponse } from '@travelbuddy/shared';

interface ItineraryState {
  currentItinerary: ItineraryResponse | null;
  setItinerary: (itinerary: ItineraryResponse) => void;
  clearItinerary: () => void;
}

export const useItineraryStore = create<ItineraryState>((set) => ({
  currentItinerary: null,
  setItinerary: (itinerary) => set({ currentItinerary: itinerary }),
  clearItinerary: () => set({ currentItinerary: null }),
}));
