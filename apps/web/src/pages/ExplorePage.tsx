import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Search, Star, Loader2, Filter } from 'lucide-react';
import type { SchedulablePlace } from '@travelbuddy/shared';

const TYPE_IMAGES: Record<string, string> = {
  BEACH: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop',
  ATTRACTION: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600&auto=format&fit=crop',
  RESTAURANT: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop',
  ACTIVITY: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600&auto=format&fit=crop',
};

function PlaceCard({ place }: { place: SchedulablePlace }) {
  const imageUrl = place.imageUrl || TYPE_IMAGES[place.type] || TYPE_IMAGES.ATTRACTION;

  return (
    <div className="group relative bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.15] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/20 flex flex-col h-full cursor-pointer">
      <div className="aspect-[4/3] w-full overflow-hidden relative">
        <img 
          src={imageUrl} 
          alt={place.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-dark-950/20 to-transparent opacity-80" />
        
        {place.rating && (
          <div className="absolute top-3 right-3 bg-dark-900/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-white">{place.rating}</span>
          </div>
        )}
        
        <div className="absolute top-3 left-3 bg-brand-500/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">{place.type}</span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-white leading-tight mb-2 group-hover:text-brand-300 transition-colors line-clamp-1">{place.name}</h3>
        <div className="flex items-start gap-1.5 text-sm text-zinc-400 mb-4">
          <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-brand-400" />
          <span className="line-clamp-2">{(place as any).address || place.region || 'Unknown Location'}</span>
        </div>
        
        {place.description && (
          <p className="text-xs text-zinc-500 line-clamp-3 mt-auto">
            {place.description}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const { data: places, isLoading, error } = useQuery<SchedulablePlace[]>({
    queryKey: ['places'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/places`);
      if (!res.ok) throw new Error('Failed to fetch places');
      return res.json();
    }
  });

  const types = Array.isArray(places) ? Array.from(new Set(places.map(p => p.type))) : [];

  const filteredPlaces = Array.isArray(places) ? places.filter(place => {
    const matchesSearch = (place.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                          (place.region?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesType = selectedType ? place.type === selectedType : true;
    return matchesSearch && matchesType;
  }) : [];

  const isFiltering = searchQuery.length > 0 || selectedType !== null;

  const popularPlaces = React.useMemo(() => {
    if (!Array.isArray(places)) return [];
    return [...places]
      .filter(p => p.rating && p.rating >= 4.5)
      .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
      .slice(0, 4);
  }, [places]);

  const recommendedPlaces = React.useMemo(() => {
    if (!Array.isArray(places)) return [];
    return [...places]
      .filter(p => p.type === 'RESTAURANT' || p.type === 'ATTRACTION')
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4);
  }, [places]);

  return (
    <div className="flex-1 w-full flex flex-col relative bg-dark-950">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-brand-500/5 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">Explore Destinations</h1>
          <p className="text-zinc-400 max-w-2xl text-sm sm:text-base">
            Discover beautiful places, restaurants, and attractions. Get inspired for your next adventure with our curated database of travel spots.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder="Search places or regions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar shrink-0">
            <button
              onClick={() => setSelectedType(null)}
              className={`shrink-0 px-4 h-12 rounded-xl text-sm font-medium transition-all ${
                selectedType === null 
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                  : 'bg-white/[0.03] border border-white/10 text-zinc-400 hover:bg-white/[0.08]'
              }`}
            >
              All Places
            </button>
            {types.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`shrink-0 px-4 h-12 rounded-xl text-sm font-medium transition-all ${
                  selectedType === type 
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                    : 'bg-white/[0.03] border border-white/10 text-zinc-400 hover:bg-white/[0.08]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">😢</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Failed to load places</h3>
            <p className="text-zinc-500 text-sm">Please try again later.</p>
          </div>
        ) : filteredPlaces?.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
            <div className="w-16 h-16 bg-white/[0.05] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-zinc-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No places found</h3>
            <p className="text-zinc-500 text-sm">Try adjusting your search query or filters.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {!isFiltering && popularPlaces.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  Popular Right Now
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {popularPlaces.map(place => (
                    <PlaceCard key={`pop-${place.id}`} place={place} />
                  ))}
                </div>
              </section>
            )}

            {!isFiltering && recommendedPlaces.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-400" />
                  Recommended For You
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recommendedPlaces.map(place => (
                    <PlaceCard key={`rec-${place.id}`} place={place} />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-xl font-bold text-white mb-6">
                {isFiltering ? 'Search Results' : 'All Destinations'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlaces?.map(place => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
