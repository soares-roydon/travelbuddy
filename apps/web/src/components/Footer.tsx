import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white text-gray-500 py-12 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-violet-500 p-1 rounded-md text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-semibold text-lg tracking-tight text-gray-900">
                Travel<span className="text-violet-500">Buddy</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm">
              Your intelligent travel companion. We use advanced algorithms and real-time data to craft the perfect itinerary tailored entirely to your preferences.
            </p>
          </div>
          
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-violet-600 transition-colors">Plan Trip</a></li>
              <li><a href="#" className="hover:text-violet-600 transition-colors">Destinations</a></li>
              <li><a href="#" className="hover:text-violet-600 transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-violet-600 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-violet-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-violet-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; {new Date().getFullYear()} TravelBuddy Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-900 transition-colors">Twitter</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
