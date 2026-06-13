import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Menu, X, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

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
    setShowDropdown(false);
    navigate('/');
  };

  const getInitial = () => {
    if (!user) return '';
    const name = user.user_metadata?.full_name || user.user_metadata?.name;
    if (name) return name.charAt(0).toUpperCase();
    return user.email ? user.email.charAt(0).toUpperCase() : '?';
  };

  return (
    <nav className="bg-white text-neutral-900 border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-violet-500 p-1 rounded-md text-white">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-black">
              Travel<span className="text-violet-500">Buddy</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">Plan a Trip</Link>
            <Link to="/itineraries" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">My Itineraries</Link>
            
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    className="flex items-center justify-center w-8 h-8 bg-violet-100 text-violet-700 font-bold rounded-full hover:bg-violet-200 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                  >
                    {getInitial()}
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.user_metadata?.full_name || user.user_metadata?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button 
                        onMouseDown={(e) => { e.preventDefault(); handleSignOut(); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/auth" className="flex items-center justify-center text-sm font-medium text-gray-600 hover:text-black border border-gray-200 rounded-lg px-3 h-8 transition-colors">
                    Log in
                  </Link>
                  <Link to="/auth" state={{ isSignUp: true }} className="flex items-center justify-center bg-violet-500 hover:bg-violet-600 text-white px-3 h-8 rounded-lg text-sm font-medium transition-colors">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-black p-2 focus:outline-none"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 absolute w-full shadow-lg z-50">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-black">Plan a Trip</Link>
            <Link to="/itineraries" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-black">My Itineraries</Link>
            
            <div className="pt-4 mt-2 border-t border-gray-200 flex flex-col gap-2 px-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-violet-100 text-violet-700 font-bold rounded-full">
                      {getInitial()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">{user.user_metadata?.full_name || user.user_metadata?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button onClick={handleSignOut} className="flex items-center justify-center w-full border border-red-200 text-red-600 px-4 h-8 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors mt-2">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setIsOpen(false)} className="flex items-center justify-center w-full border border-gray-200 text-black px-4 h-8 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    Log in
                  </Link>
                  <Link to="/auth" state={{ isSignUp: true }} onClick={() => setIsOpen(false)} className="flex items-center justify-center w-full bg-violet-500 text-white px-4 h-8 rounded-lg text-sm font-medium hover:bg-violet-600 transition-colors">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
