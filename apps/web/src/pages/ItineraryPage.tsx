import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItineraryStore } from '../store/itineraryStore';
import {
  ArrowLeft,
  List,
  Map as MapIcon,
  Navigation,
  Save,
  Clock,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useMutation } from '@tanstack/react-query';
import RouteMap from '../components/RouteMap';
import { PlaceCard } from '../components/PlaceCard';
import type { SlotInfo } from '../components/PlaceCard';
import { PlaceDetailsView } from '../components/PlaceDetailsView';
import { Button } from '../components/Button';

// ─── Day Pill ───────────────────────────────────────────────────
interface DayPillProps {
  dayNumber: number;
  isActive: boolean;
  totalKm: number;
  region: string;
  onClick: () => void;
}

function DayPill({ dayNumber, isActive, totalKm, region, onClick }: DayPillProps) {
  return (
    <button
      onClick={onClick}
      className={`
        shrink-0 snap-start flex flex-col items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl
        transition-all duration-200 select-none border min-w-[56px] sm:min-w-[76px]
        ${
          isActive
            ? 'bg-brand-500/15 border-brand-500 shadow-md shadow-brand-500/10 scale-[1.02]'
            : 'bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.08] hover:border-white/10'
        }
      `}
    >
      <span
        className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${
          isActive ? 'text-brand-300' : 'text-white/40'
        }`}
      >
        Day
      </span>
      <span
        className={`text-lg sm:text-xl font-black leading-none mt-0.5 ${
          isActive ? 'text-white' : 'text-white/60'
        }`}
      >
        {dayNumber}
      </span>
      <span
        className={`hidden sm:block text-[8px] sm:text-[9px] mt-1 font-medium truncate max-w-[60px] sm:max-w-[76px] ${
          isActive ? 'text-brand-300/80' : 'text-white/30'
        }`}
      >
        {Math.round(totalKm)} km · {region}
      </span>
    </button>
  );
}

// ─── Timeline Stop Card (Dark Theme Wrapper) ───────────────────
interface TimelineStopProps {
  slot: SlotInfo;
  index: number;
  totalStops: number;
  onSelect: () => void;
}

function formatAmPm(timeStr: string) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  if (!h || !m) return timeStr;
  let hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
}

function TimelineStop({ slot, index, totalStops, onSelect }: TimelineStopProps) {
  const { place, isMealStop } = slot;

  const fallbackImage =
    place.type === 'BEACH' || place.type === 'ATTRACTION'
      ? 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop'
      : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop';

  const imageUrl = place.imageUrl || fallbackImage;
  const isLast = index === totalStops - 1;

  return (
    <div className="relative pb-4">
      {/* Travel indicator from previous stop */}
      {slot.travelFromPrev && slot.travelFromPrev.minutes > 0 && (
        <div className="flex items-center gap-1.5 mb-2.5 ml-2">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400/50" />
          <div className="h-px w-6 bg-white/10" />
          <span className="inline-flex items-center text-[10px] sm:text-[11px] font-semibold text-white/40 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full">
            <Navigation className="w-3 h-3 mr-1 text-violet-400" />
            🚗 {slot.travelFromPrev.minutes} min · {slot.travelFromPrev.km} km
          </span>
        </div>
      )}

      {/* Card Wrapper for Absolute Positioning */}
      <div className="relative">
        {/* Floating Meal Badge */}
        {isMealStop && slot.mealType && (
          <div className="absolute top-0 right-3 sm:right-4 z-20 -translate-y-1/2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-dark-950/90 backdrop-blur-xl border border-brand-500/50 text-brand-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-md shadow-brand-500/10">
              🍴 {slot.mealType}
            </span>
          </div>
        )}

        {/* Stop card */}
        <button
          onClick={onSelect}
          className={`
            group/card w-full text-left relative overflow-hidden
            backdrop-blur-xl transition-all duration-300
            hover:shadow-2xl hover:shadow-black/40
            active:scale-[0.98]
            p-2 sm:p-2.5 flex items-stretch gap-3 sm:gap-4
            rounded-2xl
            ${isMealStop 
              ? 'bg-brand-500/[0.04] hover:bg-brand-500/[0.08] border border-brand-500/30 hover:border-brand-500/50' 
              : 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12]'
            }
          `}
        >
        {/* Image Container with spacing and border radius */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 relative overflow-hidden rounded-xl border border-white/[0.05]">
          <img
            src={imageUrl}
            alt={place.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          
          {/* Number Badge Overlay */}
          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-[10px] font-bold text-white shadow-md">
            {index + 1}
          </div>
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1 pr-2">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-white/90 leading-snug line-clamp-2 tracking-tight group-hover/card:text-white transition-colors">
                {place.name}
              </h3>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover/card:text-white/50 shrink-0 mt-0.5 transition-colors" />
            </div>

            {/* Context Row: Rating & Region */}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {place.rating && place.rating > 0 && (
                <span className="inline-flex items-center text-[11px] font-semibold text-brand-400/90">
                  {'★'.repeat(Math.round(place.rating))}
                  <span className="ml-1 text-white/40 font-normal">{place.rating}</span>
                </span>
              )}
              {place.rating && place.rating > 0 && <span className="text-white/20 text-[10px]">•</span>}
              <span className="inline-flex items-center text-[11px] text-white/40 font-medium truncate">
                <MapPin className="w-3 h-3 mr-0.5 opacity-50" />
                {place.region || 'Goa'}
              </span>
            </div>
          </div>

          {/* Action/Time Row: Chips */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="inline-flex items-center text-[11px] sm:text-xs font-medium text-violet-300/90 bg-violet-500/10 px-2 py-0.5 rounded-md border border-violet-500/20">
              <Clock className="w-3 h-3 mr-1 opacity-70" />
              {formatAmPm(slot.startTime)} – {formatAmPm(slot.endTime)}
            </span>
            
            <span className="text-[10px] sm:text-[11px] font-medium text-white/50 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.05]">
              {slot.durationMinutes}m
            </span>
          </div>
        </div>
      </button>
      </div>
    </div>
  );
}

// ─── Save Toast ─────────────────────────────────────────────────
function SaveToast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div
      className={`
        fixed top-6 left-1/2 -translate-x-1/2 z-[9999]
        w-[calc(100%-32px)] max-w-[400px]
        px-4 py-3.5 rounded-xl backdrop-blur-xl border
        text-sm font-medium shadow-2xl flex items-center gap-3
        animate-[slideDown_0.4s_ease-out]
        ${
          type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }
      `}
    >
      <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
        {type === 'success' ? (
          <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        ) : (
          <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        )}
      </div>
      <p className="leading-snug">{message}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ─── Main Page Component ──────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export default function ItineraryPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const itinerary = useItineraryStore((state) => state.currentItinerary);
  const setItinerary = useItineraryStore((state) => state.setItinerary);

  // ── Fetch from Backend if not in store ──
  const { isLoading: isFetching } = useQuery({
    queryKey: ['itinerary', id],
    queryFn: async () => {
      if (!id) throw new Error('No ID');
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/itinerary/${id}`, { headers });
      if (!res.ok) throw new Error('Failed to fetch itinerary');
      const data = await res.json();
      setItinerary(data);
      return data;
    },
    enabled: !!id && (!itinerary || itinerary.id !== id),
  });

  // ── State ──
  const [activeDay, setActiveDay] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // ── Desktop split pane ──
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftRatio, setLeftRatio] = useState(0.32);
  const isDragging = useRef(false);

  // ── Day selector scroll ──
  const dayScrollRef = useRef<HTMLDivElement>(null);

  // ── Responsive listener ──
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Resizable split pane mouse events ──
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newRatio = (e.clientX - rect.left) / rect.width;
      setLeftRatio(Math.max(0.25, Math.min(newRatio, 0.65)));
    };
    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // ── Reset scroll on day change ──
  useEffect(() => {
    const el = document.getElementById('itinerary-timeline-scroll');
    if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeDay]);

  // ── Toast auto-dismiss ──
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // ── Scroll active day pill into view ──
  const scrollDayIntoView = useCallback((dayNumber: number) => {
    const container = dayScrollRef.current;
    if (!container) return;
    const pill = container.querySelector(`[data-day="${dayNumber}"]`) as HTMLElement | null;
    if (pill) {
      pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, []);

  const handleDayChange = useCallback(
    (dayNumber: number) => {
      setActiveDay(dayNumber);
      setSelectedSlot(null);
      scrollDayIntoView(dayNumber);
    },
    [scrollDayIntoView],
  );

  // ── Save mutation ──
  const saveMutation = useMutation({
    mutationFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error('Must be logged in to save');

      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/itinerary/save`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(itinerary),
        },
      );
      if (!res.ok) throw new Error('Failed to save itinerary');
      return res.json();
    },
    onSuccess: () => setToast({ message: '✓ Itinerary saved successfully!', type: 'success' }),
    onError: () =>
      setToast({ message: 'Failed to save. Please log in and try again.', type: 'error' }),
  });

  // ═════════════════════════════════════════════════════════════
  // ─── Empty State ────────────────────────────────────────────
  // ═════════════════════════════════════════════════════════════

  if (isFetching) {
    const headerSkeleton = (
      <div className="shrink-0 border-b border-white/[0.06] pt-4 pb-3 px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 shimmer" />
          <div className="flex-1 mx-4">
            <div className="h-5 w-32 bg-white/5 shimmer rounded-md mx-auto mb-2" />
            <div className="h-3 w-24 bg-white/5 shimmer rounded-md mx-auto" />
          </div>
          <div className="w-20 h-10 rounded-xl bg-white/5 shimmer" />
        </div>
        <div className="flex gap-4 overflow-hidden pt-3 pb-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="min-w-[68px] h-[88px] shrink-0 rounded-xl bg-white/5 shimmer" />
          ))}
        </div>
      </div>
    );

    const timelineSkeleton = (
      <div className="flex-1 px-4 sm:px-6 md:px-8 py-6 space-y-6 overflow-hidden">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-4">
            <div className="w-4 flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-white/10 shimmer mt-[22px]" />
              <div className="w-[1px] flex-1 bg-white/5 mt-2" />
            </div>
            <div className="flex-1 h-36 rounded-xl bg-white/5 border border-white/[0.08] shimmer" />
          </div>
        ))}
      </div>
    );

    return (
      <div className="h-[100dvh] bg-dark-950 flex flex-col md:flex-row w-full pb-safe">
        {isDesktop ? (
          <div className="flex-1 flex flex-row min-h-0 relative">
            <div className="h-full overflow-hidden flex flex-col shrink-0 border-r border-white/[0.06]" style={{ width: `${leftRatio * 100}%` }}>
              {headerSkeleton}
              {timelineSkeleton}
            </div>
            <div className="flex-1 h-full relative min-w-0 bg-white/5 shimmer" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full min-h-0">
            {headerSkeleton}
            <div className="flex-1 min-h-0 relative overflow-hidden flex flex-col">
              {timelineSkeleton}
            </div>
            {/* Mobile Bottom Tab Bar Skeleton */}
            <div className="shrink-0 h-16 bg-dark-950/95 border-t border-white/[0.06] flex items-center justify-around z-40 pb-safe">
              <div className="w-12 h-10 bg-white/5 shimmer rounded-md" />
              <div className="w-12 h-10 bg-white/5 shimmer rounded-md" />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-6">
          <MapPin className="w-8 h-8 text-white/30" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">No itinerary found</h2>
        <p className="text-white/50 text-sm text-center max-w-xs mb-8">
          It looks like you haven't generated an itinerary yet, or it doesn't exist.
        </p>
        <Button
          variant="brand"
          size="lg"
          onClick={() => navigate('/')}
          className="mt-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Planner
        </Button>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════
  // ─── Derived Data ───────────────────────────────────────────
  // ═════════════════════════════════════════════════════════════

  const currentDayData = itinerary.days.find((d) => d.dayNumber === activeDay);
  const placesForMap = currentDayData?.slots.map((s) => s.place) || [];
  const routeGeometry = currentDayData?.slots[0]?.travelFromPrev?.routeGeometry;
  const totalStops = currentDayData?.slots.length ?? 0;

  // ═════════════════════════════════════════════════════════════
  // ─── Timeline Content ───────────────────────────────────────
  // ═════════════════════════════════════════════════════════════

  const timelineContent = (
    <div className="flex flex-col h-full bg-dark-950">
      {/* ── Sticky Header ── */}
      <div className="shrink-0 sticky top-0 z-30 bg-dark-950/90 backdrop-blur-2xl border-b border-white/[0.06]">
        {/* Top bar: back, title, save */}
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 pt-4 pb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="w-10 h-10 p-0"
          >
            <ArrowLeft className="w-4 h-4 text-white/70" />
          </Button>

          <div className="flex-1 min-w-0 mx-3 text-center">
            <h1 className="text-sm sm:text-base font-bold text-white truncate tracking-tight">
              {itinerary.title}
            </h1>
            {currentDayData && (
              <div className="flex items-center justify-center gap-3 mt-0.5">
                <span className="text-[10px] sm:text-[11px] font-medium text-white/40 flex items-center">
                  <Navigation className="w-3 h-3 mr-1 text-violet-400" />
                  {currentDayData.summary.totalTravelKm} km
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-white/40 flex items-center">
                  <MapPin className="w-3 h-3 mr-1 text-brand-400" />
                  {totalStops} stops
                </span>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => saveMutation.mutate()}
            isLoading={saveMutation.isPending}
            className="px-4 !border-emerald-500/50 !bg-emerald-500/15 !text-emerald-400 hover:!bg-emerald-500/25 hover:!text-emerald-300 shadow-md shadow-emerald-500/10"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save</span>
          </Button>
        </div>

        {/* ── Day Selector Pills ── */}
        {!selectedSlot && (
          <div
            ref={dayScrollRef}
            className="flex gap-3 sm:gap-4 pl-8 pr-6 sm:px-6 md:px-8 pt-3 pb-5 overflow-x-auto scrollbar-none snap-x snap-mandatory"
          >
            {itinerary.days.map((day) => (
              <div key={day.dayNumber} data-day={day.dayNumber}>
                <DayPill
                  dayNumber={day.dayNumber}
                  isActive={activeDay === day.dayNumber}
                  totalKm={day.summary.totalTravelKm}
                  region={day.summary.region}
                  onClick={() => handleDayChange(day.dayNumber)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Scrollable Timeline ── */}
      <div id="itinerary-timeline-scroll" className="flex-1 overflow-y-auto min-h-0">
        {selectedSlot ? (
          <PlaceDetailsView slot={selectedSlot} onBack={() => setSelectedSlot(null)} />
        ) : currentDayData ? (
          <div className="px-4 sm:px-6 md:px-8 pt-6 pb-32 md:pb-12">
            {/* Day narrative / title */}
            {currentDayData.narrative && (
              <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <h2 className="text-sm font-semibold text-brand-400 mb-1.5">
                  {currentDayData.narrative.title}
                </h2>
                <p className="text-xs text-white/50 leading-relaxed">
                  {currentDayData.narrative.narrative}
                </p>
                {currentDayData.narrative.tips.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {currentDayData.narrative.tips.map((tip, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium text-violet-300 bg-violet-500/10 border border-violet-500/15 px-2 py-1 rounded-lg"
                      >
                        💡 {tip}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Timeline stops */}
            <div className="space-y-0">
              {currentDayData.slots.map((slot, idx) => (
                <TimelineStop
                  key={`${activeDay}-${idx}`}
                  slot={slot as unknown as SlotInfo}
                  index={idx}
                  totalStops={totalStops}
                  onSelect={() => setSelectedSlot(slot as unknown as SlotInfo)}
                />
              ))}
            </div>

            {/* Day summary footer */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 text-[11px] font-medium text-white/25 bg-white/[0.03] border border-white/[0.05] px-4 py-2 rounded-full">
                <Clock className="w-3 h-3" />
                Total activity: {currentDayData.summary.totalActivityMinutes} min ·{' '}
                {currentDayData.summary.totalTravelKm} km travel
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/30 text-sm">No data for this day.</p>
          </div>
        )}
      </div>
    </div>
  );

  // ═════════════════════════════════════════════════════════════
  // ─── Map Content ────────────────────────────────────────────
  // ═════════════════════════════════════════════════════════════

  const mapContent = (
    <div className="relative w-full h-full">
      <RouteMap
        places={placesForMap}
        routeGeometry={routeGeometry}
        stayLocation={itinerary.preferences.stayLocation as any}
        selectedPlaceId={selectedSlot?.place.id}
        isVisible={isDesktop || mobileTab === 'map'}
      />

      {/* Floating day info on map */}
      {currentDayData && (
        <div className="absolute top-4 left-4 z-[500] pointer-events-none">
          <div className="bg-dark-900/80 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2.5 shadow-2xl pointer-events-auto">
            <span className="text-xs font-bold text-white">Day {activeDay}</span>
            <span className="text-[10px] text-white/50 ml-2">
              {totalStops} stops · {currentDayData.summary.region}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  // ═════════════════════════════════════════════════════════════
  // ─── Render ─────────────────────────────────────────────────
  // ═════════════════════════════════════════════════════════════

  return (
    <div className="w-full h-full flex flex-col bg-dark-950 overflow-hidden relative">
      {/* Toast notification */}
      {toast && <SaveToast message={toast.message} type={toast.type} />}

      {/* ── Desktop: Split Pane ── */}
      {isDesktop ? (
        <div ref={containerRef} className="flex-1 flex flex-row min-h-0 relative">
          {/* Left Panel: Timeline */}
          <div
            className="h-full overflow-hidden flex flex-col shrink-0"
            style={{ width: `${leftRatio * 100}%` }}
          >
            {timelineContent}
          </div>

          {/* Resizer handle */}
          <div
            className="
              w-1 hover:w-1.5 shrink-0 relative z-20 cursor-col-resize
              bg-white/[0.04] hover:bg-violet-500/60
              transition-all duration-200 group
            "
            onMouseDown={() => {
              isDragging.current = true;
              document.body.style.cursor = 'col-resize';
              document.body.style.userSelect = 'none';
            }}
          >
            {/* Wider invisible hit area */}
            <div className="absolute inset-y-0 -left-2 -right-2 z-30" />
            {/* Visual grip */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0.5 h-8 rounded-full bg-white/20 group-hover:bg-white/80 transition-colors" />
            </div>
          </div>

          {/* Right Panel: Map */}
          <div className="flex-1 h-full relative min-w-0">{mapContent}</div>
        </div>
      ) : (
        /* ── Mobile: Tab-Switched ── */
        <div className="flex-1 min-h-0 relative">
          {/* Timeline */}
          <div
            className={`absolute inset-0 transition-opacity duration-200 ${
              mobileTab === 'list' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {timelineContent}
          </div>

          {/* Map */}
          <div
            className={`absolute inset-0 transition-opacity duration-200 ${
              mobileTab === 'map' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {mapContent}
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Tab Bar ── */}
      {!isDesktop && (
        <div
          className="
            shrink-0 h-16 bg-dark-950/95 backdrop-blur-2xl
            border-t border-white/[0.06]
            flex items-center justify-around
            z-40 pb-safe
          "
        >
          <button
            onClick={() => setMobileTab('list')}
            className={`
              flex flex-col items-center justify-center w-full h-full gap-1
              transition-all duration-200
              ${
                mobileTab === 'list'
                  ? 'text-brand-400'
                  : 'text-white/30 hover:text-white/50 active:text-white/40'
              }
            `}
          >
            <div className="relative">
              <List className="w-5 h-5" />
              {mobileTab === 'list' && (
                <div className="absolute -bottom-1 left-1/2 -tranzinc-x-1/2 w-1 h-1 rounded-full bg-brand-400" />
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Timeline</span>
          </button>

          <button
            onClick={() => setMobileTab('map')}
            className={`
              flex flex-col items-center justify-center w-full h-full gap-1
              transition-all duration-200
              ${
                mobileTab === 'map'
                  ? 'text-brand-400'
                  : 'text-white/30 hover:text-white/50 active:text-white/40'
              }
            `}
          >
            <div className="relative">
              <MapIcon className="w-5 h-5" />
              {mobileTab === 'map' && (
                <div className="absolute -bottom-1 left-1/2 -tranzinc-x-1/2 w-1 h-1 rounded-full bg-brand-400" />
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Map</span>
          </button>
        </div>
      )}

      {/* ── Slide-down animation keyframe (injected once) ── */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
