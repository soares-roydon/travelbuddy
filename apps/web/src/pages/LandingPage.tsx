import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { MapPin, Calendar, Wallet, Compass, Utensils, ArrowRight, Loader2 } from 'lucide-react';
import { useItineraryStore } from '../store/itineraryStore';
import type { Preferences } from '@travelbuddy/shared';

const INTERESTS = [
  { id: 'beach', label: 'Beaches', icon: '🏖️' },
  { id: 'fort', label: 'Forts & History', icon: '🏰' },
  { id: 'waterfall', label: 'Waterfalls', icon: '🌊' },
  { id: 'temple', label: 'Temples & Churches', icon: '⛪' },
  { id: 'nightlife', label: 'Nightlife', icon: '🍹' },
  { id: 'market', label: 'Flea Markets', icon: '🛍️' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const setItinerary = useItineraryStore((state) => state.setItinerary);

  const [preferences, setPreferences] = useState<Preferences>({
    numDays: 3,
    budget: 'MEDIUM',
    stayLocation: { latitude: 15.5500, longitude: 73.7500, name: 'Baga/Calangute Area' },
    interests: ['beach', 'nightlife'],
    foodPreference: 'non-veg',
    includeBreakfast: true,
  });

  const generateMutation = useMutation({
    mutationFn: async (prefs: Preferences) => {
      const res = await fetch('http://localhost:3001/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      });
      if (!res.ok) throw new Error('Failed to generate itinerary');
      return res.json();
    },
    onSuccess: (data) => {
      setItinerary(data);
      navigate(`/itinerary/${data.id}`);
    },
  });

  const toggleInterest = (id: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id]
    }));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 flex flex-col items-center justify-center p-6">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="z-10 w-full max-w-4xl text-center mb-10">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-4 drop-shadow-sm">
          Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Goa</span> Like Never Before.
        </h1>
        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-light">
          Stop wasting hours planning. Tell us what you love, where you're staying, and our AI will craft the perfect day-by-day itinerary with exact travel times.
        </p>
      </div>

      <div className="z-10 w-full max-w-2xl bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); generateMutation.mutate(preferences); }}>
          
          {/* Days & Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="flex items-center text-slate-200 font-medium text-sm">
                <Calendar className="w-4 h-4 mr-2 text-primary-400" />
                How many days?
              </label>
              <div className="flex bg-slate-900/50 rounded-xl p-1 border border-slate-700/50">
                {[2, 3, 4, 5].map(days => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, numDays: days })}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                      preferences.numDays === days ? 'bg-primary-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center text-slate-200 font-medium text-sm">
                <Wallet className="w-4 h-4 mr-2 text-primary-400" />
                Budget Tier
              </label>
              <div className="flex bg-slate-900/50 rounded-xl p-1 border border-slate-700/50">
                {['LOW', 'MEDIUM', 'HIGH'].map(budget => (
                  <button
                    key={budget}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, budget: budget as any })}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
                      preferences.budget === budget ? 'bg-primary-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {budget.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stay Location */}
          <div className="space-y-3">
            <label className="flex items-center text-slate-200 font-medium text-sm">
              <MapPin className="w-4 h-4 mr-2 text-primary-400" />
              Where are you staying?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Baga/Calangute', lat: 15.5500, lng: 73.7500 },
                { label: 'Anjuna/Vagator', lat: 15.5800, lng: 73.7400 },
                { label: 'Palolem (South)', lat: 15.0100, lng: 74.0200 },
                { label: 'Panjim (City)', lat: 15.4900, lng: 73.8200 },
              ].map(loc => (
                <button
                  key={loc.label}
                  type="button"
                  onClick={() => setPreferences({ ...preferences, stayLocation: { name: loc.label, latitude: loc.lat, longitude: loc.lng } })}
                  className={`py-3 px-4 text-sm font-medium rounded-xl border transition-all text-left ${
                    preferences.stayLocation.name === loc.label
                      ? 'border-primary-500 bg-primary-500/10 text-primary-300'
                      : 'border-slate-700/50 bg-slate-900/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <label className="flex items-center text-slate-200 font-medium text-sm">
              <Compass className="w-4 h-4 mr-2 text-primary-400" />
              What are you interested in?
            </label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(interest => (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => toggleInterest(interest.id)}
                  className={`py-2 px-4 text-sm font-medium rounded-full border transition-all flex items-center gap-2 ${
                    preferences.interests.includes(interest.id)
                      ? 'border-accent-500 bg-accent-500/20 text-accent-300'
                      : 'border-slate-700/50 bg-slate-900/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span>{interest.icon}</span>
                  {interest.label}
                </button>
              ))}
            </div>
          </div>

          {/* Food */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="space-y-1">
              <label className="flex items-center text-slate-200 font-medium text-sm">
                <Utensils className="w-4 h-4 mr-2 text-primary-400" />
                Include Meals in Plan?
              </label>
              <p className="text-xs text-slate-400 pl-6">We'll automatically route you to top-rated nearby restaurants.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={preferences.includeBreakfast}
                onChange={(e) => setPreferences({ ...preferences, includeBreakfast: e.target.checked })}
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>

          <button
            type="submit"
            disabled={generateMutation.isPending || preferences.interests.length === 0}
            className="w-full mt-6 group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-gradient-to-r from-primary-600 to-accent-500 border border-transparent rounded-xl overflow-hidden hover:from-primary-500 hover:to-accent-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Crafting your perfect trip...
              </>
            ) : (
              <>
                Generate Itinerary
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
