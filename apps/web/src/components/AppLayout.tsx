import React from 'react';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { Link, useLocation } from 'react-router-dom';
import { Compass, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isItineraryPage = location.pathname.startsWith('/itinerary/');
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const userInitial = user?.user_metadata?.name?.[0] || user?.email?.[0] || 'U';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row bg-dark-950 relative overflow-hidden">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Top App Bar */}
      {!isItineraryPage && (
        <div className="md:hidden shrink-0 flex items-center h-14 px-4 bg-dark-950/80 backdrop-blur-xl border-b border-white/[0.06] z-40">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="bg-brand-500 p-1.5 rounded-md text-white shadow-sm">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-semibold text-lg tracking-tight text-white">
                TravelBuddy
              </span>
            </div>
            
            <Link to="/auth" className="shrink-0 transition-transform active:scale-95">
              {user ? (
                <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-[13px] font-bold text-white shadow-inner border border-white/10">
                  {userInitial.toUpperCase()}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-white/60" />
                </div>
              )}
            </Link>
          </div>
        </div>
      )}

      <main className={`flex-1 flex flex-col relative min-w-0 ${isItineraryPage ? 'h-full min-h-0' : 'overflow-y-auto'}`}>
        {children}
      </main>

      {/* BottomNav for Mobile */}
      {!isItineraryPage && (
        <div className="md:hidden">
          <BottomNav />
        </div>
      )}
    </div>
  );
}
