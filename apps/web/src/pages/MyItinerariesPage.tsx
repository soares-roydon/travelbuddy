import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Calendar, Compass, MapPin } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { Button } from '../components/Button';

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
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/itinerary/user/${user?.id}`, { headers });
      if (!res.ok) throw new Error('Failed to fetch itineraries');
      return res.json();
    },
    enabled: !!user?.id,
  });

  /* ─── Auth Loading ─── */
  if (loadingAuth) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-dark-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-sm text-white/40">Loading...</p>
        </div>
      </div>
    );
  }

  /* ─── Logged Out CTA ─── */
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-56px)] w-full flex items-center justify-center p-4 bg-dark-950 relative overflow-hidden">
        {/* Background accents */}
        <div className="pointer-events-none absolute top-[-30%] left-[-15%] w-[60%] h-[60%] rounded-full bg-brand-500/[0.04] blur-[120px]" />
        <div className="pointer-events-none absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-500/[0.03] blur-[100px]" />

        <div className="relative z-10 w-full max-w-[420px] bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-xl p-10 text-center shadow-2xl shadow-black/20">
          {/* Illustrated icon */}
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
            <div className="relative w-16 h-16 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm">
              <Compass className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-xl font-bold text-white tracking-tight mb-2">
            Save Your Adventures
          </h1>
          <p className="text-sm text-white/50 mb-8 leading-relaxed max-w-[280px] mx-auto">
            Log in to view your saved itineraries and easily access your past and upcoming trips anytime, anywhere.
          </p>

          <Button
            variant="brand"
            onClick={() => navigate('/auth')}
            className="w-full h-11"
          >
            Log in to continue
          </Button>

          <p className="text-xs text-white/25 mt-5">
            Your trips are saved securely in the cloud.
          </p>
        </div>
      </div>
    );
  }

  /* ─── Main Page ─── */
  return (
    <div className="w-full min-h-[calc(100vh-56px)] bg-dark-950 relative">
      {/* Background accents */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-brand-500/[0.03] to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            My Itineraries
          </h1>
          <p className="text-sm text-white/40 mt-2">
            Manage and revisit your AI-generated travel plans.
          </p>
        </div>

        {/* ─── Loading Skeletons ─── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="relative bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-xl p-6 h-[220px] flex flex-col overflow-hidden"
              >
                {/* Shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-[shimmer_2s_infinite] pointer-events-none" />

                <div className="h-5 bg-white/[0.06] rounded-lg w-3/4 mb-4" />
                <div className="h-4 bg-white/[0.04] rounded-lg w-1/2 mb-3" />
                <div className="h-4 bg-white/[0.04] rounded-lg w-2/3 mb-auto" />
                <div className="pt-4 border-t border-white/[0.04] flex gap-2">
                  <div className="h-6 bg-white/[0.06] rounded-lg w-16" />
                  <div className="h-6 bg-white/[0.04] rounded-lg w-20" />
                  <div className="h-6 bg-white/[0.04] rounded-lg w-14" />
                </div>
              </div>
            ))}
          </div>

        /* ─── Empty State ─── */
        ) : !data?.itineraries || data.itineraries.length === 0 ? (
          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] rounded-xl p-10 sm:p-14 text-center flex flex-col items-center max-w-lg mx-auto">
            <div className="relative inline-flex items-center justify-center w-16 h-16 mb-5">
              <div className="absolute inset-0 rounded-xl bg-white/[0.05] blur-lg" />
              <div className="relative w-14 h-14 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white/40" />
              </div>
            </div>

            <h2 className="text-lg font-bold text-white mb-2">No itineraries yet</h2>
            <p className="text-sm text-white/40 mb-8 max-w-[280px] leading-relaxed">
              You haven't generated any trips. Start planning your next adventure!
            </p>

            <Link
              to="/"
              className="inline-flex items-center justify-center h-11 px-6 bg-gradient-to-r from-brand-500 to-brand-500 hover:from-brand-400 hover:to-brand-400 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-brand-500/20 active:scale-[0.98]"
            >
              Plan a new trip
            </Link>
          </div>

        /* ─── Itinerary Cards Grid ─── */
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {data.itineraries.map((itinerary: any) => (
              <Link
                key={itinerary.id}
                to={`/itinerary/${itinerary.id}`}
                className="group relative bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-xl p-6 flex flex-col transition-all duration-300 hover:-tranzinc-y-1 hover:bg-white/[0.06] hover:border-brand-500/20 hover:shadow-xl hover:shadow-brand-500/[0.05]"
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-brand-500/[0.04] to-brand-500/[0.02]" />

                <div className="relative flex-1">
                  {/* Title */}
                  <h3 className="text-base font-semibold text-white tracking-tight mb-3 group-hover:text-brand-300 transition-colors duration-300 line-clamp-1">
                    {itinerary.title}
                  </h3>

                  {/* Days info */}
                  <div className="flex items-center text-white/40 text-xs mb-3">
                    <Calendar className="w-3.5 h-3.5 mr-2 text-brand-500/60" />
                    <span>{itinerary.numDays} Days Trip</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-xs text-white/30 mb-6">
                    <MapPin className="w-3.5 h-3.5 mr-2 text-white/20 shrink-0" />
                    <span className="truncate">
                      Near ({itinerary.stayLatitude.toFixed(2)}, {itinerary.stayLongitude.toFixed(2)})
                    </span>
                  </div>
                </div>

                {/* Tags footer */}
                <div className="relative pt-4 border-t border-white/[0.05] flex flex-wrap gap-1.5">
                  {/* Budget badge */}
                  <span className="px-2.5 py-1 bg-brand-500/10 text-brand-400 text-[11px] font-semibold uppercase tracking-wider rounded-lg border border-brand-500/10">
                    {itinerary.budget}
                  </span>

                  {/* Interest tags */}
                  {itinerary.interests?.slice(0, 2).map((interest: string) => (
                    <span
                      key={interest}
                      className="px-2.5 py-1 bg-white/[0.04] text-white/50 text-[11px] font-medium capitalize rounded-lg border border-white/[0.05]"
                    >
                      {interest}
                    </span>
                  ))}

                  {itinerary.interests?.length > 2 && (
                    <span className="px-2 py-1 bg-white/[0.03] text-white/30 text-[11px] font-medium rounded-lg border border-white/[0.04]">
                      +{itinerary.interests.length - 2}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Inline keyframes for shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
