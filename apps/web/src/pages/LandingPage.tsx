import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useItineraryStore } from '../store/itineraryStore';
import type { Preferences } from '@travelbuddy/shared';

const INTERESTS = [
  { id: 'beach', label: 'Beaches', icon: '🏖️' },
  { id: 'fort', label: 'Forts', icon: '🏰' },
  { id: 'waterfall', label: 'Waterfalls', icon: '🌊' },
  { id: 'temple', label: 'Temples', icon: '⛪' },
  { id: 'church', label: 'Churches', icon: '⛪' },
  { id: 'nature', label: 'Nature & Treks', icon: '🌿' },
  { id: 'viewpoint', label: 'Viewpoints', icon: '🏔️' },
  { id: 'water-sports', label: 'Water Sports', icon: '🏄' },
  { id: 'nightlife', label: 'Nightlife', icon: '🍹' },
  { id: 'market', label: 'Markets', icon: '🛍️' },
  { id: 'heritage', label: 'Heritage', icon: '🏛️' },
];

const LOCATIONS = [
  { label: 'Baga/Calangute', lat: 15.5500, lng: 73.7500 },
  { label: 'Anjuna/Vagator', lat: 15.5800, lng: 73.7400 },
  { label: 'Palolem', lat: 15.0100, lng: 74.0200 },
  { label: 'Panjim', lat: 15.4900, lng: 73.8200 },
];

function CustomSelect({ value, options, onChange }: { value: any, options: {label: string, value: any}[], onChange: (val: any) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button 
        type="button" 
        onClick={() => setOpen(!open)} 
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full text-left flex justify-between items-center border border-gray-200 rounded-md px-3 h-10 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
      >
        {options.find(o => o.value === value)?.label}
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
          {options.map(o => (
            <div 
              key={o.label} 
              onMouseDown={(e) => { 
                e.preventDefault(); 
                onChange(o.value); 
                setOpen(false); 
              }} 
              className="px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 cursor-pointer transition-colors"
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const setItinerary = useItineraryStore((state) => state.setItinerary);

  const [preferences, setPreferences] = useState<Preferences>({
    numDays: 3,
    budget: 'MEDIUM',
    stayLocation: { 
      name: LOCATIONS[0].label, 
      latitude: LOCATIONS[0].lat, 
      longitude: LOCATIONS[0].lng 
    },
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
    <div className="w-full min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg flex flex-col">
        {/* Form Section */}
        <div className="w-full bg-white border border-gray-200 rounded-xl p-8 sm:p-10 shadow-sm">
          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); generateMutation.mutate(preferences); }}>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Days Select */}
              <div className="space-y-3">
                <label className="block text-gray-700 font-medium text-sm">Days</label>
                <CustomSelect 
                  value={preferences.numDays}
                  options={[2, 3, 4, 5].map(d => ({ label: `${d} Days`, value: d }))}
                  onChange={(val) => setPreferences({ ...preferences, numDays: val })}
                />
              </div>

              {/* Budget Select */}
              <div className="space-y-3">
                <label className="block text-gray-700 font-medium text-sm">Budget</label>
                <CustomSelect 
                  value={preferences.budget}
                  options={[
                    { label: 'Low', value: 'LOW' },
                    { label: 'Medium', value: 'MEDIUM' },
                    { label: 'High', value: 'HIGH' }
                  ]}
                  onChange={(val) => setPreferences({ ...preferences, budget: val as Preferences['budget'] })}
                />
              </div>
            </div>

            {/* Location Select */}
            <div className="space-y-3">
              <label className="block text-gray-700 font-medium text-sm">Base Location</label>
              <CustomSelect 
                value={preferences.stayLocation.name}
                options={LOCATIONS.map(l => ({ label: l.label, value: l.label }))}
                onChange={(val) => {
                  const loc = LOCATIONS.find(l => l.label === val);
                  if (loc) setPreferences({ ...preferences, stayLocation: { name: loc.label, latitude: loc.lat, longitude: loc.lng } });
                }}
              />
            </div>

            {/* Interests */}
            <div className="space-y-3">
              <label className="block text-gray-700 font-medium text-sm">
                Vibe & Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(interest => {
                  const isSelected = preferences.interests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => toggleInterest(interest.id)}
                      className={`px-3 h-8 text-sm rounded-md border transition-colors flex items-center gap-1.5 ${
                        isSelected
                          ? 'border-violet-500 bg-violet-50 text-violet-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{interest.icon}</span>
                      {interest.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Food Toggle */}
            <div className="flex items-center justify-between pt-2">
              <label className="text-gray-700 font-medium text-sm">
                Include Breakfast Stops
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={preferences.includeBreakfast}
                  onChange={(e) => setPreferences({ ...preferences, includeBreakfast: e.target.checked })}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-500"></div>
              </label>
            </div>

            <button
              type="submit"
              disabled={generateMutation.isPending || preferences.interests.length === 0}
              className="w-full flex items-center justify-center h-10 text-sm font-medium text-white transition-colors bg-violet-500 rounded-md hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {generateMutation.isPending ? 'Generating...' : 'Generate Itinerary'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
