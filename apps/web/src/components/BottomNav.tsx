import { Link, useLocation } from 'react-router-dom';
import { Compass, CalendarDays, Map, Sparkles } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    {
      label: 'Plan',
      path: '/',
      icon: Compass,
    },
    {
      label: 'Explore',
      path: '/explore',
      icon: Map,
    },
    {
      label: 'AI Magic',
      path: '/ai',
      icon: Sparkles,
    },
    {
      label: 'My Trips',
      path: '/itineraries',
      icon: CalendarDays,
    },
  ];

  return (
    <nav className="shrink-0 bg-dark-950/80 backdrop-blur-xl border-t border-white/[0.06] z-50 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative flex items-center justify-center p-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'text-brand-400'
                  : 'text-white/40 hover:text-white/60 active:text-white/60'
              }`}
            >
              <div className={`relative p-1 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                <Icon className="w-7 h-7" strokeWidth={isActive ? 2.5 : 1.75} />
              </div>
              
              {/* Tooltip on hover */}
              <div className="absolute -top-10 px-2.5 py-1 bg-zinc-800 text-white text-[10px] font-medium rounded-md shadow-lg shadow-black/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0 duration-200 border border-white/10">
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
