import React from 'react';
import { Clock, MapPin, Navigation } from 'lucide-react';
import type { SchedulablePlace } from '@travelbuddy/shared';

// Define a local type since ItinerarySlot Response has more fields than just SchedulablePlace
export interface SlotInfo {
  place: SchedulablePlace & { 
    imageUrl?: string | null; 
    description?: string | null;
    rating?: number | null; 
  };
  startTime: string;
  endTime: string;
  durationMinutes: number;
  isMealStop: boolean;
  mealType?: string | null;
  travelFromPrev?: { minutes: number; km: number } | null;
}

export function PlaceCard({ slot, onClick }: { slot: SlotInfo; onClick?: () => void }) {
  const { place, isMealStop } = slot;
  
  // High quality placeholder based on type
  const fallbackImage = place.type === 'BEACH' || place.type === 'ATTRACTION' 
    ? 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop'
    : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop';
    
  const imageUrl = place.imageUrl || fallbackImage;

  return (
    <div 
      onClick={onClick}
      className={`group/card relative flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 bg-white rounded-2xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${onClick ? 'cursor-pointer' : ''} ${
      isMealStop ? 'border-orange-200/60 bg-orange-50/10 hover:border-orange-300' : 'border-gray-200 hover:border-violet-300'
    }`}>
      
      {/* Travel Indicator (Floating badge) */}
      {slot.travelFromPrev && slot.travelFromPrev.minutes > 0 && (
        <div className="absolute -top-3 right-4 sm:right-6 z-20 shadow-sm text-[11px] font-semibold tracking-wide text-gray-600 flex items-center bg-white px-3 py-1 rounded-full border border-gray-200">
          <Navigation className="w-3 h-3 mr-1.5 text-violet-500" />
          {slot.travelFromPrev.minutes} min drive
        </div>
      )}

      {/* Image Section */}
      <div className="w-full sm:w-36 h-48 sm:h-36 shrink-0 relative rounded-xl overflow-hidden bg-gray-100">
        <img 
          src={imageUrl} 
          alt={place.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between pt-1">
        <div>
          {/* Header Row */}
          <div className="flex justify-between items-start mb-3 gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                  {place.name}
                </h3>
                {isMealStop && (
                  <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-md border border-orange-200/50">
                    {slot.mealType}
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center text-violet-700 font-medium bg-violet-50 px-2.5 py-1 rounded-md">
                  <Clock className="w-4 h-4 mr-1.5 opacity-70" />
                  {slot.startTime} - {slot.endTime}
                </div>
                {place.rating && place.rating > 0 && (
                  <div className="flex items-center text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded-md">
                    ★ {place.rating}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {place.description && (
            <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-2">
              {place.description}
            </p>
          )}
        </div>

        {/* Footer / Tags */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100">
          <span className="flex items-center text-xs font-medium text-gray-500">
            <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
            {place.region || 'Goa'}
          </span>
          <div className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></div>
          {place.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-md capitalize border border-gray-100">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
