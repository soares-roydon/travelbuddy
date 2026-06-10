import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
            <Link to="/" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">Destinations</Link>
            <Link to="/" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">My Itineraries</Link>
            
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <button className="text-sm font-medium text-gray-600 hover:text-black border border-gray-200 rounded-md px-3 h-8 transition-colors">
                Log in
              </button>
              <button className="bg-violet-500 hover:bg-violet-600 text-white px-3 h-8 rounded-md text-sm font-medium transition-colors">
                Sign up
              </button>
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
        <div className="md:hidden bg-white border-b border-gray-200 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-black">Destinations</Link>
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-black">My Itineraries</Link>
            <div className="pt-4 mt-2 border-t border-gray-200 flex flex-col gap-2 px-3">
              <button className="w-full border border-gray-200 text-black px-4 h-8 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                Log in
              </button>
              <button className="w-full bg-violet-500 text-white px-4 h-8 rounded-md text-sm font-medium hover:bg-violet-600 transition-colors">
                Sign up
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
