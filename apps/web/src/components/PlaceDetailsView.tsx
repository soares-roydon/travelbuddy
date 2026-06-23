import { ArrowLeft, Clock, MapPin, Navigation, Star, Tag, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { SlotInfo } from './PlaceCard';

interface PlaceDetailsViewProps {
  slot: SlotInfo;
  onBack: () => void;
}

export function PlaceDetailsView({ slot, onBack }: PlaceDetailsViewProps) {
  const { isMealStop } = slot;

  // Fetch detailed place info from backend
  const { data: fetchedPlace, isLoading } = useQuery({
    queryKey: ['place', slot.place.id],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/places/${slot.place.id}`);
      if (!res.ok) throw new Error('Failed to fetch place');
      return res.json();
    },
    enabled: !!slot.place.id,
  });

  // Merge the slot's basic place info with the fetched rich info
  const place = fetchedPlace || slot.place;

  const TYPE_IMAGES: Record<string, string> = {
    BEACH: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop',
    ATTRACTION: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop',
    RESTAURANT: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
    ACTIVITY: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
  };

  const imageUrl = place.imageUrl || TYPE_IMAGES[place.type] || TYPE_IMAGES.ATTRACTION;

  // Google Maps directions URL
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;

  return (
    <div className="flex flex-col min-h-full bg-dark-950 relative" style={{ animation: 'slide-up 0.35s ease-out' }}>

      {/* Header / Nav */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 glass rounded-full text-white transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 glass rounded-full text-white text-xs font-medium transition-all active:scale-95"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Directions
        </a>
      </div>

      {/* Hero Image */}
      <div className="w-full h-60 sm:h-72 shrink-0 relative bg-dark-800">
        {isLoading ? (
          <div className="w-full h-full shimmer" />
        ) : (
          <img
            src={imageUrl}
            alt={place.name}
            className="w-full h-full object-cover"
            style={{ animation: 'fade-in 0.5s ease-out' }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {isMealStop && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-brand-500 px-2 py-0.5 rounded-md">
                {slot.mealType}
              </span>
            )}
            <span className="text-[10px] font-semibold text-white/80 uppercase tracking-wider glass px-2 py-0.5 rounded-md">
              {place.type}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight">
            {place.name}
          </h1>
        </div>
      </div>

      {/* Details Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-4">
            <div className="flex items-center gap-1.5 text-brand-400 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-semibold">Schedule</span>
            </div>
            <p className="text-white font-semibold text-sm">{slot.startTime} – {slot.endTime}</p>
            <p className="text-white/40 text-xs mt-0.5">{slot.durationMinutes} minutes</p>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-1.5 text-brand-400 mb-2">
              <Star className="w-4 h-4" />
              <span className="text-xs font-semibold">Rating</span>
            </div>
            {isLoading ? (
              <div className="mt-1 h-5 w-16 shimmer rounded" />
            ) : place.rating ? (
              <>
                <p className="text-white font-semibold text-sm">{place.rating} / 5.0</p>
                <p className="text-white/40 text-xs mt-0.5">Based on reviews</p>
              </>
            ) : (
              <p className="text-white/50 text-sm mt-1">No ratings yet</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-base font-bold text-white mb-2.5 tracking-tight">About this place</h2>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-3.5 shimmer rounded w-full" />
              <div className="h-3.5 shimmer rounded w-5/6" />
              <div className="h-3.5 shimmer rounded w-4/6" />
            </div>
          ) : (
            <p className="text-sm text-white/60 leading-relaxed">
              {place.description || 'No description available for this place. Explore it on your trip!'}
            </p>
          )}
        </div>

        {/* Location & Travel */}
        <div>
          <h2 className="text-base font-bold text-white mb-2.5 tracking-tight">Location & Travel</h2>
          <div className="glass-card p-4 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">Region</p>
                <p className="text-sm text-white/50">{place.region || 'Goa'}</p>
              </div>
            </div>

            {slot.travelFromPrev && (
              <div className="flex items-start gap-3">
                <Navigation className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">From previous stop</p>
                  <p className="text-sm text-white/50">
                    {slot.travelFromPrev.minutes} min ({slot.travelFromPrev.km} km) drive
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {(place.tags && place.tags.length > 0) || isLoading ? (
          <div>
            <h2 className="text-base font-bold text-white mb-2.5 tracking-tight">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {isLoading ? (
                <>
                  <div className="h-7 w-20 shimmer rounded-lg" />
                  <div className="h-7 w-24 shimmer rounded-lg" />
                  <div className="h-7 w-16 shimmer rounded-lg" />
                </>
              ) : place.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 px-3 py-1.5 glass text-white/70 text-xs font-medium rounded-lg capitalize"
                >
                  <Tag className="w-3 h-3 text-white/30" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {/* Directions Button */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full h-11 rounded-md bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/50 active:scale-[0.98] shadow-sm"
        >
          <Navigation className="w-4 h-4" />
          Open in Google Maps
        </a>

        {/* Bottom spacing */}
        <div className="h-4" />
      </div>
    </div>
  );
}
