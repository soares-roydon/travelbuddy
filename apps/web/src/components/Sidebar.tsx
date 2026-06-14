import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Menu, LogOut, Map as MapIcon, CalendarDays, User as UserIcon, Sun, Moon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('jwt_token');
    navigate('/');
  };

  const getInitial = () => {
    if (!user) return '';
    const name = user.user_metadata?.full_name || user.user_metadata?.name;
    if (name) return name.charAt(0).toUpperCase();
    return user.email ? user.email.charAt(0).toUpperCase() : '?';
  };

  const navItems = [
    { name: 'Plan a Trip', path: '/', icon: <MapIcon className="w-5 h-5" /> },
    { name: 'My Itineraries', path: '/itineraries', icon: <CalendarDays className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Spacer to push content over */}
      <div className={`hidden md:block transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'} shrink-0 bg-white`} />

      {/* Actual Fixed Sidebar */}
      <nav 
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-50 transition-all duration-300 flex flex-col ${isExpanded ? 'w-64' : 'w-16'} hidden md:flex`}
      >
        {/* Header (Logo & Toggle) */}
        <div className="flex items-center h-14 mt-2 px-3">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 whitespace-nowrap ml-2 flex items-center gap-2 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
            <div className="bg-violet-500 p-1 rounded-md text-white shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-black">
              Travel<span className="text-violet-500">Buddy</span>
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex flex-col gap-2 px-3 mt-8 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center h-10 rounded-lg transition-colors overflow-hidden ${isActive ? 'bg-violet-50 text-violet-700' : 'text-gray-600 hover:bg-gray-100'}`}
                title={!isExpanded ? item.name : undefined}
              >
                <div className="flex items-center justify-center w-10 shrink-0">
                  {item.icon}
                </div>
                <span className={`whitespace-nowrap font-medium text-sm transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Theme Toggle */}
        <div className="px-3 pb-2 border-t border-gray-100 pt-3">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors overflow-hidden w-full"
            title={!isExpanded ? "Toggle dark mode" : undefined}
          >
            <div className="flex items-center justify-center w-10 shrink-0">
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </div>
            <span className={`whitespace-nowrap font-medium text-sm transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </div>

        {/* Footer (User / Auth) */}
        <div className="p-3 border-t border-gray-100 pb-6">
          {user ? (
            <div className="flex flex-col gap-2">
              <div 
                className={`flex items-center h-10 rounded-lg overflow-hidden`}
              >
                <div className="flex items-center justify-center w-10 shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 bg-violet-100 text-violet-700 font-bold rounded-full">
                    {getInitial()}
                  </div>
                </div>
                <div className={`flex flex-col justify-center whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto ml-1' : 'opacity-0 w-0'}`}>
                  <span className="text-sm font-medium text-gray-900 truncate max-w-[140px]">
                    {user.user_metadata?.full_name || user.user_metadata?.name || 'User'}
                  </span>
                </div>
              </div>
              {isExpanded && (
                <button 
                  onClick={handleSignOut}
                  className="flex items-center h-10 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full px-2 mt-1"
                >
                  <div className="flex items-center justify-center w-8 shrink-0">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Sign out</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link 
                to="/auth" 
                className="flex items-center h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors overflow-hidden"
                title={!isExpanded ? "Log in" : undefined}
              >
                <div className="flex items-center justify-center w-10 shrink-0">
                  <UserIcon className="w-5 h-5" />
                </div>
                <span className={`whitespace-nowrap font-medium text-sm transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                  Log in / Sign up
                </span>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Nav (Bottom Bar or Top Bar? Top bar for mobile) */}
      <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex justify-between items-center h-14 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-violet-500 p-1 rounded-md text-white">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-black">
              Travel<span className="text-violet-500">Buddy</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
             <Link to="/itineraries" className="text-gray-600">
               <CalendarDays className="w-5 h-5" />
             </Link>
             {user ? (
               <button onClick={handleSignOut} className="text-red-600"><LogOut className="w-5 h-5" /></button>
             ) : (
               <Link to="/auth" className="text-gray-600"><UserIcon className="w-5 h-5" /></Link>
             )}
             <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-gray-600 ml-1">
               {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>
          </div>
        </div>
      </div>
    </>
  );
}
