import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItineraryStore } from '../store/itineraryStore';
import { ArrowLeft, List, Map as MapIcon, Navigation, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useMutation } from '@tanstack/react-query';
import RouteMap from '../components/RouteMap';
import { PlaceCard } from '../components/PlaceCard';
import type { SlotInfo } from '../components/PlaceCard';
import { PlaceDetailsView } from '../components/PlaceDetailsView';
import { CustomSelect } from '../components/CustomSelect';


export default function ItineraryPage() {
  const navigate = useNavigate();
  const itinerary = useItineraryStore((state) => state.currentItinerary);
  const [activeDay, setActiveDay] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [leftRatio, setLeftRatio] = useState(0.35);
  const isDragging = useRef(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newRatio = (e.clientX - rect.left) / rect.width;
      setLeftRatio(Math.max(0.3, Math.min(newRatio, 0.7))); // constraint between 30% and 70%
    };
    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Reset scroll position when switching days or opening details
  useEffect(() => {
    const container = document.getElementById('timeline-scroll-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeDay, selectedSlot?.place.id]);

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <p className="text-white text-xl">No itinerary found.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-primary-400 hover:text-primary-300">
          Go back to planner
        </button>
      </div>
    );
  }

  const currentDayData = itinerary.days.find(d => d.dayNumber === activeDay);
  const placesForMap = currentDayData?.slots.map(s => s.place) || [];
  const routeGeometry = currentDayData?.slots[0]?.travelFromPrev?.routeGeometry;

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Must be logged in to save');
      
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/itinerary/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(itinerary)
      });
      if (!res.ok) throw new Error('Failed to save itinerary');
      return res.json();
    },
    onSuccess: () => alert('Itinerary saved successfully!'),
    onError: () => alert('Failed to save itinerary. Please ensure you are logged in.')
  });

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden">
      {/* Resizable Split Pane */}
      <div 
        ref={containerRef}
        className="w-full flex-1 flex flex-col md:flex-row relative shrink-0 min-h-0" 
      >

        {/* Left Panel (Timeline) */}
        <div 
          className={`flex flex-col bg-white z-10 shrink-0 relative self-stretch min-h-0 ${!isDesktop && mobileTab !== 'list' ? 'hidden' : 'flex-1 md:flex-none'}`}
          style={isDesktop ? { width: `${leftRatio * 100}%` } : { width: '100%' }}
        >
          <div id="timeline-scroll-container" className="flex-1 min-h-0 overflow-y-auto relative z-10 bg-white">
            {selectedSlot ? (
              <PlaceDetailsView 
                slot={selectedSlot} 
                onBack={() => setSelectedSlot(null)} 
              />
            ) : currentDayData && (
              <div className="flex flex-col min-h-full">
                
                {/* Timeline Header */}
                <div className="flex items-center justify-between pb-3 pt-4 px-5 sm:px-8 border-b border-gray-100 bg-white/95 backdrop-blur-md sticky top-0 z-30">
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex items-center justify-between">
                      <button onClick={() => navigate('/')} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
                      </button>
                      <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="flex items-center text-sm font-medium text-violet-600 dark:text-violet-300 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50">
                        <Save className="w-4 h-4 mr-1.5" /> {saveMutation.isPending ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="w-36">
                        <CustomSelect 
                          value={activeDay}
                          onChange={(val) => setActiveDay(Number(val))}
                          options={itinerary.days.map(d => ({ label: `Day ${d.dayNumber}`, value: d.dayNumber }))}
                          triggerClassName="w-full text-left flex justify-between items-center border border-gray-200 rounded-lg px-3 h-10 font-semibold text-[16px] text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        />
                      </div>
                      
                      <div className="flex gap-4 text-xs font-semibold text-gray-500">
                        <span className="flex items-center"><Navigation className="w-3.5 h-3.5 mr-1 text-violet-500" /> {currentDayData.summary.totalTravelKm} km</span>
                        <span className="hidden sm:flex items-center"><MapIcon className="w-3.5 h-3.5 mr-1 text-violet-500" /> {currentDayData.summary.region}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative px-5 sm:px-8 pt-6 pb-12 flex-1">
                  <div className="absolute left-[39px] sm:left-[51px] top-8 bottom-12 w-px bg-gray-100"></div>
                  <div className="space-y-8">
                    {currentDayData.slots.map((slot, idx) => (
                      <div key={idx} className="relative flex gap-4 group">
                        <div className="flex flex-col items-center z-10 shrink-0">
                          <div className="w-10 h-10 rounded-full bg-white border-2 border-violet-100 flex items-center justify-center shadow-sm">
                            <div className="w-2.5 h-2.5 rounded-full bg-violet-500"></div>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 pt-0.5">
                          <PlaceCard 
                            slot={slot as any} 
                            onClick={() => setSelectedSlot(slot as any)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resizer Handle */}
        {isDesktop && (
          <div 
            className="w-1.5 hover:w-2 bg-gray-50 border-x border-gray-200 hover:bg-violet-500 hover:border-violet-500 cursor-col-resize z-20 transition-all flex items-center justify-center shrink-0 group relative self-stretch"
            onMouseDown={() => {
              isDragging.current = true;
              document.body.style.cursor = 'col-resize';
              document.body.style.userSelect = 'none';
            }}
          >
            <div className="absolute inset-y-0 -left-2 -right-2 z-30" />
            <div className="w-0.5 h-8 bg-gray-300 group-hover:bg-white rounded-full"></div>
          </div>
        )}

        {/* Right Panel (Map) */}
        <div 
          className={`relative z-0 bg-gray-100 shrink-0 self-stretch md:min-h-0 ${!isDesktop && mobileTab !== 'map' ? 'hidden' : 'flex-1 md:flex-none'}`}
          style={isDesktop ? { width: `${(1 - leftRatio) * 100}%` } : { width: '100%' }}
        >
          <RouteMap 
            places={placesForMap} 
            routeGeometry={routeGeometry} 
            stayLocation={itinerary.preferences.stayLocation as any}
            selectedPlaceId={selectedSlot?.place.id} 
            isVisible={isDesktop || mobileTab === 'map'}
          />
        </div>

      </div>

      {/* Mobile Bottom Navigation */}
      {!isDesktop && (
        <div className="h-14 sm:h-16 shrink-0 bg-white border-t border-gray-200 flex items-center justify-around px-2 z-40 pb-safe">
          <button 
            onClick={() => setMobileTab('list')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${mobileTab === 'list' ? 'text-violet-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[10px] sm:text-xs font-semibold">Timeline</span>
          </button>
          <button 
            onClick={() => setMobileTab('map')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${mobileTab === 'map' ? 'text-violet-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <MapIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[10px] sm:text-xs font-semibold">Map</span>
          </button>
        </div>
      )}
    </div>
  );
}
