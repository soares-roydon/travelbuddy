import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItineraryStore } from '../store/itineraryStore';
import { ArrowLeft, Clock, Map as MapIcon, Navigation, Calendar, Menu, X, ChevronRight } from 'lucide-react';
import RouteMap from '../components/RouteMap';
import { PlaceCard } from '../components/PlaceCard';
import type { SlotInfo } from '../components/PlaceCard';
import { PlaceDetailsView } from '../components/PlaceDetailsView';

export default function ItineraryPage() {
  const navigate = useNavigate();
  const itinerary = useItineraryStore((state) => state.currentItinerary);
  const [activeDay, setActiveDay] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [leftRatio, setLeftRatio] = useState(0.5);
  const isDragging = useRef(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  return (
    <div className="w-full bg-gray-50 flex flex-col items-center px-4 md:px-6 lg:px-8">
      
      {/* Top Margin */}
      <div className="h-4 shrink-0 w-full" />

      {/* Resizable Split Pane inside Constrained Margins */}
      <div 
        ref={containerRef}
        className="w-full max-w-[1440px] flex flex-col md:flex-row bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden relative shrink-0 min-h-[600px]" 
        style={{ height: 'calc(100vh - 56px - 32px)' }} // 56px Navbar + 32px (two h-4 margins)
      >

        {/* --- Collapsible Sidebar Drawer --- */}
        <div className={`absolute inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'}`}>
          <div className="p-6 h-full flex flex-col">
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => navigate('/')}
              className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-8 mt-2 text-sm font-medium w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Planner
            </button>
            
            <h1 className="text-xl font-bold tracking-tight text-gray-900 mb-1 leading-snug">
              {itinerary.title}
            </h1>
            <p className="text-gray-500 text-sm mb-8">
              Near <span className="font-medium text-gray-800">{itinerary.preferences.stayLocation.name}</span>
            </p>

            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Itinerary Days</h3>
            <div className="flex flex-col gap-1 flex-1 min-h-0 overflow-y-auto -mx-2 px-2 pb-6">
              {itinerary.days.map((day) => (
                <button
                  key={day.dayNumber}
                  onClick={() => {
                    setActiveDay(day.dayNumber);
                    if (!isDesktop) setIsSidebarOpen(false);
                  }}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left flex items-center justify-between group ${
                    activeDay === day.dayNumber 
                      ? 'bg-violet-50 text-violet-700' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <Calendar className={`w-4 h-4 mr-3 ${activeDay === day.dayNumber ? 'text-violet-500' : 'text-gray-400 group-hover:text-gray-600 transition-colors'}`} />
                    Day {day.dayNumber}
                  </div>
                  {activeDay === day.dayNumber && <ChevronRight className="w-4 h-4 text-violet-500" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- Overlay --- */}
        {isSidebarOpen && (
          <div 
            className="absolute inset-0 bg-gray-900/20 z-40 backdrop-blur-[1px]"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Left Panel (Timeline) */}
        <div 
          className="flex flex-col bg-white z-10 shrink-0 relative self-stretch min-h-0"
          style={isDesktop ? { width: `${leftRatio * 100}%` } : { width: '100%', height: '50vh' }}
        >
          <div className="flex-1 min-h-0 overflow-y-auto relative z-10 bg-white">
            {selectedSlot ? (
              <PlaceDetailsView 
                slot={selectedSlot} 
                onBack={() => setSelectedSlot(null)} 
              />
            ) : currentDayData && (
              <div className="flex flex-col min-h-full">
                
                {/* Timeline Header with Hamburger */}
                <div className="flex items-center justify-between pb-3 pt-4 px-5 sm:px-8 border-b border-gray-100 bg-white/95 backdrop-blur-md sticky top-0 z-30">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsSidebarOpen(true)} 
                      className="p-1.5 -ml-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
                      title="Open Trip Menu"
                    >
                      <Menu className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">Day {currentDayData.dayNumber} Plan</h2>
                  </div>

                  <div className="flex gap-4 text-xs font-semibold text-gray-500">
                    <span className="flex items-center"><Navigation className="w-3.5 h-3.5 mr-1 text-violet-500" /> {currentDayData.summary.totalTravelKm} km</span>
                    <span className="hidden sm:flex items-center"><MapIcon className="w-3.5 h-3.5 mr-1 text-violet-500" /> {currentDayData.summary.region}</span>
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
          className="relative z-0 bg-gray-100 shrink-0 self-stretch min-h-[400px] md:min-h-0"
          style={isDesktop ? { width: `${(1 - leftRatio) * 100}%` } : { width: '100%' }}
        >
          <RouteMap 
            places={placesForMap} 
            routeGeometry={routeGeometry} 
            stayLocation={itinerary.preferences.stayLocation as any}
            selectedPlaceId={selectedSlot?.place.id} 
          />
        </div>

      </div>

      {/* Bottom Margin */}
      <div className="h-4 shrink-0 w-full" />
      
    </div>
  );
}
