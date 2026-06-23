import { Link, useLocation } from 'react-router-dom';
import { Compass, CalendarDays, User as UserIcon, LogOut, Menu, Globe, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function Sidebar() {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navItems = [
    { label: 'Plan a Trip', path: '/', icon: Compass },
    { label: 'My Trips', path: '/itineraries', icon: CalendarDays },
    { label: 'Explore', path: '/explore', icon: Globe },
    { label: 'AI Agent', path: '/ai', icon: Sparkles, comingSoon: true },
  ];

  return (
    <nav className={`h-full bg-dark-900 border-r border-white/[0.08] flex flex-col pt-6 pb-4 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-[68px]'}`}>
      <div className={`px-3 mb-8 flex ${!isExpanded && 'justify-center'}`}>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-3 overflow-hidden rounded-lg hover:opacity-80 transition-opacity active:scale-[0.98] ${!isExpanded ? 'p-1' : ''}`}
          aria-label="Toggle Sidebar"
        >
          <div className="bg-brand-500 p-1.5 rounded-md text-white shrink-0 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          {isExpanded && (
            <span className="font-semibold text-lg tracking-tight text-white whitespace-nowrap">
              TravelBuddy
            </span>
          )}
        </button>
      </div>

      <div className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          const content = (
            <>
              <Icon className="w-5 h-5 shrink-0" />
              {isExpanded && <span className="truncate">{item.label}</span>}
              {isExpanded && item.comingSoon && (
                <span className="ml-auto text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded-md shrink-0">
                  Soon
                </span>
              )}
            </>
          );

          if (item.comingSoon) {
            return (
              <button
                key={item.label}
                onClick={(e) => {
                  e.preventDefault();
                  alert(`${item.label} is coming soon!`);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02] cursor-not-allowed ${!isExpanded && 'justify-center'}`}
                title={!isExpanded ? `${item.label} (Coming Soon)` : undefined}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              } ${!isExpanded && 'justify-center'}`}
              title={!isExpanded ? item.label : undefined}
            >
              {content}
            </Link>
          );
        })}
      </div>

      <div className="px-3 mt-auto">
        {user ? (
          <div className="space-y-1">
            <Link
              to="/auth"
              className={`group flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/[0.05] transition-colors ${!isExpanded ? 'justify-center' : ''}`}
              title={!isExpanded ? 'Profile' : undefined}
            >
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-[13px] font-bold text-white shrink-0 ring-2 ring-transparent group-hover:ring-white/10 transition-all shadow-inner">
                {(user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
              </div>
              {isExpanded && (
                <div className="flex flex-col min-w-0 text-left">
                  <span className="truncate text-[14px] font-medium text-zinc-200">
                    {user.user_metadata?.full_name || 'Traveler'}
                  </span>
                  <span className="truncate text-[12px] text-zinc-500">
                    {user.email}
                  </span>
                </div>
              )}
            </Link>
          </div>
        ) : (
          <Link
            to="/auth"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors ${!isExpanded && 'justify-center'}`}
            title={!isExpanded ? 'Sign in' : undefined}
          >
            <UserIcon className="w-5 h-5 shrink-0" />
            {isExpanded && <span>Sign in</span>}
          </Link>
        )}
      </div>
    </nav>
  );
}
