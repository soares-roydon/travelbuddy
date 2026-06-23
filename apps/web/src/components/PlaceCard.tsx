import { Clock, MapPin, Navigation, ChevronRight } from 'lucide-react';
import type { SchedulablePlace } from '@travelbuddy/shared';

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

const TYPE_IMAGES: Record<string, string> = {
  BEACH: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop',
  ATTRACTION: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600&auto=format&fit=crop',
  RESTAURANT: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop',
  ACTIVITY: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600&auto=format&fit=crop',
};

function formatAmPm(time: string) {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hours = parseInt(h, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${m} ${ampm}`;
}

export function PlaceCard({ slot, onClick }: { slot: SlotInfo; onClick?: () => void }) {
  const { place, isMealStop } = slot;
  const imageUrl = place.imageUrl || TYPE_IMAGES[place.type] || TYPE_IMAGES.ATTRACTION;

  return (
    <div className="relative">
      {/* Travel Indicator */}
      {slot.travelFromPrev && slot.travelFromPrev.minutes > 0 && (
        <div className="flex items-center gap-2 mb-3 ml-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
            <Navigation className="w-3.5 h-3.5 text-zinc-500" />
            <span>{slot.travelFromPrev.minutes} min</span>
            <span className="text-zinc-600">•</span>
            <span>{slot.travelFromPrev.km} km drive</span>
          </div>
        </div>
      )}

      {/* Card (Fixed Height for consistency) */}
      <button
        onClick={onClick}
        className="w-full text-left group relative flex items-stretch gap-4 p-3 h-32 glass hover:bg-white/[0.05] transition-all duration-200 active:scale-[0.98] rounded-xl border border-white/10"
      >
        {/* Image */}
        <div className="w-24 shrink-0 rounded-lg overflow-hidden bg-white/5 relative">
          <img
            src={imageUrl}
            alt={place.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {isMealStop && (
            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-brand-600 rounded text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
              {slot.mealType}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center min-w-0 py-1">
          <h3 className="text-sm font-semibold text-white leading-tight tracking-tight line-clamp-2 mb-1.5 pr-4">
            {place.name}
          </h3>

          <div className="flex items-center gap-1.5 text-[11px] text-brand-500 font-medium mb-1.5">
            <Clock className="w-3 h-3 opacity-80" />
            <span>{formatAmPm(slot.startTime)} – {formatAmPm(slot.endTime)}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] mt-auto">
            {place.rating && place.rating > 0 && (
              <div className="flex items-center gap-1 text-zinc-300 font-medium">
                <span className="text-brand-500">★</span>
                <span>{place.rating}</span>
              </div>
            )}
            <span className="flex items-center gap-1 text-zinc-400 font-medium truncate">
              <MapPin className="w-3 h-3 shrink-0" />
              {place.region || 'Goa'}
            </span>
          </div>
        </div>

        {/* Chevron */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
        </div>
      </button>
    </div>
  );
}
