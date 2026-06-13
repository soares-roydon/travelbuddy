import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Calendar, Compass, MapPin } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

export default function MyItinerariesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['itineraries', user?.id],
    queryFn: async () => {
      const token = localStorage.getItem('jwt_token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`http://localhost:3001/api/itinerary/user/${user?.id}`, { headers });
      if (!res.ok) throw new Error('Failed to fetch itineraries');
      return res.json();
    },
    enabled: !!user?.id,
  });

  if (loadingAuth) {
    return <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-gray-50 text-gray-500">Loading...</div>;
  }

  // Logged out state
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-56px)] w-full flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-[400px] bg-white border border-gray-200 rounded-2xl shadow-sm p-10 text-center">
          <div className="w-16 h-16 bg-violet-100 text-violet-500 rounded-full flex items-center justify-center mx-auto mb-5">
            <Compass className="w-8 h-8" />
          </div>
          <h1 className="text-[20px] font-semibold text-gray-900 tracking-tight mb-2">Save Your Adventures</h1>
          <p className="text-[14px] text-gray-500 mb-8 leading-relaxed">
            Log in to view your saved itineraries and easily access your past and upcoming trips anytime, anywhere.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="w-full flex items-center justify-center h-10 bg-violet-600 hover:bg-violet-700 text-white text-[14px] font-medium rounded-lg transition-colors focus:ring-2 focus:ring-violet-500/50"
          >
            Log in to continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-56px)] bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">My Itineraries</h1>
          <p className="text-[14px] text-gray-500 mt-1">Manage and revisit your AI-generated travel plans.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 h-[220px] flex flex-col animate-pulse">
                <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-6"></div>
                <div className="h-4 bg-gray-200 rounded-md w-2/3 mb-auto"></div>
                <div className="pt-4 border-t border-gray-100 flex gap-2">
                  <div className="h-6 bg-gray-200 rounded-md w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-md w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : !data?.itineraries || data.itineraries.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <Calendar className="w-7 h-7" />
            </div>
            <h2 className="text-[18px] font-semibold text-gray-900 mb-1">No itineraries yet</h2>
            <p className="text-[14px] text-gray-500 mb-6">You haven't generated any trips. Start planning your next adventure!</p>
            <Link to="/" className="inline-flex items-center justify-center h-10 px-5 bg-violet-600 hover:bg-violet-700 text-white text-[14px] font-medium rounded-lg transition-colors">
              Plan a new trip
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.itineraries.map((itinerary: any) => (
              <Link 
                key={itinerary.id} 
                to={`/itinerary/${itinerary.id}`}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-violet-200 transition-all group flex flex-col"
              >
                <div className="flex-1">
                  <h3 className="text-[18px] font-semibold text-gray-900 tracking-tight mb-2 group-hover:text-violet-600 transition-colors line-clamp-1">
                    {itinerary.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-500 text-[13px] mb-4">
                    <Calendar className="w-4 h-4 mr-2 text-violet-500" />
                    <span>{itinerary.numDays} Days Trip</span>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-[13px] text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                      <span className="truncate">Near coordinates ({itinerary.stayLatitude.toFixed(2)}, {itinerary.stayLongitude.toFixed(2)})</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                   <span className="px-2.5 py-1 bg-violet-50 text-violet-700 text-[11px] font-semibold uppercase tracking-wider rounded-md">
                     {itinerary.budget}
                   </span>
                   {itinerary.interests?.slice(0, 2).map((interest: string) => (
                     <span key={interest} className="px-2.5 py-1 bg-gray-50 text-gray-600 text-[11px] font-medium capitalize rounded-md border border-gray-100">
                       {interest}
                     </span>
                   ))}
                   {itinerary.interests?.length > 2 && (
                     <span className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[11px] font-medium rounded-md border border-gray-100">
                       +{itinerary.interests.length - 2}
                     </span>
                   )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
