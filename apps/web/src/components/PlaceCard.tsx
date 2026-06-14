
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
      className={`group/card relative flex items-center gap-4 p-3 bg-white rounded-2xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${onClick ? 'cursor-pointer' : ''} ${
      isMealStop ? 'border-orange-200/60 bg-orange-50/10 hover:border-orange-300' : 'border-gray-200 hover:border-violet-300'
    }`}>
      
      {/* Travel Indicator (Floating badge) */}
      {slot.travelFromPrev && slot.travelFromPrev.minutes > 0 && (
        <div className="absolute -top-3 right-4 z-20 shadow-sm text-[10px] font-bold uppercase tracking-wide text-gray-600 flex items-center bg-white px-2.5 py-0.5 rounded-full border border-gray-200">
          <Navigation className="w-3 h-3 mr-1 text-violet-500" />
          {slot.travelFromPrev.minutes} min drive
        </div>
      )}

      {/* Image Section */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 relative rounded-xl overflow-hidden bg-gray-100">
        <img 
          src={imageUrl} 
          alt={place.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex justify-between items-start mb-1.5 gap-2">
          <h3 className="text-[16px] font-semibold text-gray-900 leading-tight tracking-tight line-clamp-2">
            {place.name}
          </h3>
          {isMealStop && (
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 rounded border border-orange-200/50 dark:border-orange-800/50 mt-0.5">
              {slot.mealType}
            </span>
          )}
        </div>
        
        <div className="flex flex-col gap-1.5 mt-2">
          <div className="flex items-center text-[13px] text-violet-700 font-medium">
            <Clock className="w-3.5 h-3.5 mr-1.5 opacity-70" />
            {slot.startTime} - {slot.endTime}
            <span className="text-gray-400 font-normal ml-1.5">({slot.durationMinutes}m)</span>
          </div>
          
          <div className="flex items-center gap-3 text-[13px]">
            {place.rating && place.rating > 0 && (
              <div className="flex items-center text-amber-600 font-medium">
                ★ {place.rating}
              </div>
            )}
            <span className="flex items-center text-gray-500 font-medium truncate">
              <MapPin className="w-3.5 h-3.5 mr-1 opacity-70" />
              {place.region || 'Goa'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
