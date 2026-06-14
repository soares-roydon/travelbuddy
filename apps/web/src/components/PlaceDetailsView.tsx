import { ArrowLeft, Clock, MapPin, Navigation, Star, Tag } from 'lucide-react';
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
      const res = await fetch(`http://localhost:3001/api/places/${slot.place.id}`);
      if (!res.ok) throw new Error('Failed to fetch place');
      return res.json();
    },
    enabled: !!slot.place.id,
  });

  // Merge the slot's basic place info with the fetched rich info
  const place = fetchedPlace || slot.place;
  
  const fallbackImage = place.type === 'BEACH' || place.type === 'ATTRACTION' 
    ? 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop'
    : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop';
    
  const imageUrl = place.imageUrl || fallbackImage;

  return (
    <div className="flex flex-col min-h-full bg-white relative">
      
      {/* Header / Nav */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center bg-gradient-to-b from-[#000000]/60 to-transparent">
        <button 
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Hero Image */}
      <div className="w-full h-64 sm:h-80 shrink-0 relative bg-gray-800">
        {isLoading ? (
          <div className="w-full h-full bg-gray-700 animate-pulse" />
        ) : (
          <img 
            src={imageUrl} 
            alt={place.name}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-[#000000]/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-3 mb-2">
            {isMealStop && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white bg-orange-500 px-2.5 py-1 rounded-md">
                {slot.mealType}
              </span>
            )}
            <span className="text-[11px] font-semibold text-white/90 uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md">
              {place.type}
            </span>
          </div>
          <h1 className="text-3xl font-semibold text-white leading-tight tracking-tight">
            {place.name}
          </h1>
        </div>
      </div>

      {/* Details Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center text-violet-600 mb-1">
              <Clock className="w-4 h-4 mr-1.5" />
              <span className="text-sm font-medium">Scheduled Time</span>
            </div>
            <p className="text-gray-900 font-medium">{slot.startTime} - {slot.endTime}</p>
            <p className="text-gray-500 text-xs mt-0.5">{slot.durationMinutes} minutes</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center text-amber-600 mb-1">
              <Star className="w-4 h-4 mr-1.5" />
              <span className="text-sm font-medium">Rating</span>
            </div>
            {isLoading ? (
              <div className="mt-2 h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
            ) : place.rating ? (
              <>
                <p className="text-gray-900 font-medium">{place.rating} / 5.0</p>
                <p className="text-gray-500 text-xs mt-0.5">Based on reviews</p>
              </>
            ) : (
              <p className="text-gray-900 font-medium mt-1">No ratings yet</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-3 tracking-tight">About this place</h2>
          {isLoading ? (
            <div className="space-y-2 mt-2">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
            </div>
          ) : (
            <p className="text-[14px] text-gray-600 leading-relaxed">
              {place.description || 'No description available for this place.'}
            </p>
          )}
        </div>

        {/* Location Info */}
        <div className="mb-8">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-3 tracking-tight">Location & Travel</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5 shrink-0" />
              <div>
                <p className="text-[14px] font-medium text-gray-900">Region</p>
                <p className="text-[14px] text-gray-600">{place.region || 'Goa'}</p>
              </div>
            </div>
            
            {slot.travelFromPrev && (
              <div className="flex items-start">
                <Navigation className="w-5 h-5 text-violet-500 mr-3 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[14px] font-medium text-gray-900">Travel from previous stop</p>
                  <p className="text-[14px] text-gray-600">{slot.travelFromPrev.minutes} minutes ({slot.travelFromPrev.km} km) driving</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {(place.tags && place.tags.length > 0) || isLoading ? (
          <div>
            <h2 className="text-[16px] font-semibold text-gray-900 mb-3 tracking-tight">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {isLoading ? (
                <>
                  <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
                </>
              ) : place.tags?.map((tag: string) => (
                <span key={tag} className="flex items-center px-3 py-1.5 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg capitalize border border-gray-100">
                  <Tag className="w-3 h-3 mr-1.5 text-gray-400" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        
      </div>
    </div>
  );
}
