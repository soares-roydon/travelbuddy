import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useItineraryStore } from '../store/itineraryStore';
import type { Preferences } from '@travelbuddy/shared';
import { supabase } from '../lib/supabase';
import { Button } from '../components/Button';
import { DateRangePicker } from '../components/DateRangePicker';
import {
  Plane,
  Sun,
  UtensilsCrossed,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Wallet,
  Heart,
  Coffee,
  Check,
} from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────────

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const TOTAL_STEPS = 7; // 0-6

const LOCATIONS = [
  {
    label: 'Baga / Calangute',
    lat: 15.55,
    lng: 73.75,
    description: 'The party capital — bustling beaches, shacks & vibrant nightlife',
    emoji: '🎉',
  },
  {
    label: 'Anjuna / Vagator',
    lat: 15.58,
    lng: 73.74,
    description: 'Bohemian vibes — flea markets, cliffs & sunset sessions',
    emoji: '🌅',
  },
  {
    label: 'Palolem',
    lat: 15.01,
    lng: 74.02,
    description: 'Serene crescent beach — kayaking, dolphins & laid-back charm',
    emoji: '🐬',
  },
  {
    label: 'Panjim',
    lat: 15.49,
    lng: 73.82,
    description: 'Colonial elegance — heritage walks, cafes & riverside sunsets',
    emoji: '🏛️',
  },
];

const BUDGET_OPTIONS = [
  {
    key: 'LOW' as const,
    label: 'Budget',
    symbol: '₹',
    description: 'Hostels, local eats & beach bumming',
    icon: Wallet,
  },
  {
    key: 'MEDIUM' as const,
    label: 'Comfort',
    symbol: '₹₹',
    description: 'Boutique stays, great restaurants & curated tours',
    icon: Sun,
  },
  {
    key: 'HIGH' as const,
    label: 'Premium',
    symbol: '₹₹₹',
    description: 'Luxury resorts, fine dining & private experiences',
    icon: Sparkles,
  },
];

const FALLBACK_INTERESTS = [
  { id: 'beach', label: 'Beach', icon: '🏖️' },
  { id: 'fort', label: 'Fort', icon: '🏰' },
  { id: 'waterfall', label: 'Waterfalls', icon: '💧' },
  { id: 'temple', label: 'Temple', icon: '🛕' },
  { id: 'church', label: 'Church', icon: '⛪' },
  { id: 'market', label: 'Market', icon: '🛍️' },
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'viewpoint', label: 'Viewpoint', icon: '👁️' },
  { id: 'water-sports', label: 'Water Sports', icon: '🏄' },
  { id: 'nightlife', label: 'Nightlife', icon: '🌙' },
  { id: 'heritage', label: 'Heritage', icon: '🏛️' },
  { id: 'wellness', label: 'Wellness', icon: '🧘' },
  { id: 'cafe', label: 'Cafe', icon: '☕' },
];

const FOOD_OPTIONS = [
  { key: 'non-veg' as const, label: 'Non-Veg', emoji: '🍗', desc: 'Everything goes' },
  { key: 'veg' as const, label: 'Vegetarian', emoji: '🥬', desc: 'Plant-powered' },
  { key: 'vegan' as const, label: 'Vegan', emoji: '🌱', desc: 'Fully plant-based' },
];

// ─── Keyframe Styles (injected once) ────────────────────────────────────────

const keyframeStyles = `
@keyframes landing-pulse-ring {
  0% { transform: scale(1); opacity: 0.4; }
  100% { transform: scale(1.5); opacity: 0; }
}
@keyframes landing-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}
@keyframes landing-shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes landing-plane-fly {
  0% { transform: translateX(-100%) translateY(0) rotate(-5deg); opacity: 0; }
  15% { opacity: 1; }
  50% { transform: translateX(50vw) translateY(-30px) rotate(0deg); opacity: 1; }
  85% { opacity: 1; }
  100% { transform: translateX(110vw) translateY(-10px) rotate(5deg); opacity: 0; }
}
@keyframes landing-dot-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}
@keyframes landing-spin-slow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes landing-gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes landing-scale-in {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes landing-chip-pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.12); }
  100% { transform: scale(1); }
}
`;

// ─── Component ──────────────────────────────────────────────────────────────

export default function LandingPage() {
  const navigate = useNavigate();
  const setItinerary = useItineraryStore((s) => s.setItinerary);

  // Step state
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [animating, setAnimating] = useState(false);

  // Preferences state
  const [numDays, setNumDays] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState<Preferences['budget']>('MEDIUM');
  const [locationIdx, setLocationIdx] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);
  const [foodPreference, setFoodPreference] = useState<Preferences['foodPreference']>('non-veg');
  const [includeBreakfast, setIncludeBreakfast] = useState(true);

  // Track which chips just got selected for pop animation
  const [poppedChip, setPoppedChip] = useState<string | null>(null);

  // Fetch meta options
  const { data: optionsData } = useQuery({
    queryKey: ['metaOptions'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/itinerary/meta/options`);
      if (!res.ok) throw new Error('Failed to fetch options');
      return res.json();
    },
  });

  const interestsList = useMemo(() => {
    if (optionsData?.interests?.length) return optionsData.interests;
    return FALLBACK_INTERESTS;
  }, [optionsData]);

  // Build preferences object
  const buildPreferences = useCallback((): Preferences => {
    const loc = LOCATIONS[locationIdx];
    return {
      numDays,
      budget,
      stayLocation: { name: loc.label, latitude: loc.lat, longitude: loc.lng },
      interests,
      foodPreference,
      includeBreakfast,
    };
  }, [numDays, budget, locationIdx, interests, foodPreference, includeBreakfast]);

  // Generate mutation
  const generateMutation = useMutation({
    mutationFn: async (prefs: Preferences) => {
      const { data: { session } } = await supabase.auth.getSession();
      const payload = { ...prefs, userId: session?.user?.id || undefined };
      const token = localStorage.getItem('jwt_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/itinerary/generate`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to generate itinerary');
      }
      return res.json();
    },
    onSuccess: (data) => {
      setItinerary(data);
      navigate(`/itinerary/${data.id}`);
    },
  });

  // Step navigation
  const goTo = useCallback(
    (target: number) => {
      if (animating || target < 0 || target >= TOTAL_STEPS) return;
      setDirection(target > step ? 'forward' : 'back');
      setAnimating(true);
      setStep(target);
      setTimeout(() => setAnimating(false), 400);
    },
    [step, animating],
  );

  const next = useCallback(() => goTo(step + 1), [goTo, step]);
  const back = useCallback(() => goTo(step - 1), [goTo, step]);

  // Auto-trigger generate on step 6
  useEffect(() => {
    if (step === 6 && !generateMutation.isPending && !generateMutation.isSuccess) {
      generateMutation.mutate(buildPreferences());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Interest toggle with pop animation
  const toggleInterest = useCallback((id: string) => {
    setPoppedChip(id);
    setTimeout(() => setPoppedChip(null), 300);
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

  // Calculate numDays when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      if (e >= s) {
        const diff = e.getTime() - s.getTime();
        setNumDays(Math.ceil(diff / (1000 * 3600 * 24)) + 1);
      } else {
        setNumDays(0);
      }
    } else {
      setNumDays(0);
    }
  }, [startDate, endDate]);

  // Validation per step
  const canProceed = useMemo(() => {
    switch (step) {
      case 0: return true;
      case 1: return numDays >= 1 && numDays <= 14;
      case 2: return !!budget;
      case 3: return locationIdx >= 0;
      case 4: return interests.length >= 1;
      case 5: return !!foodPreference;
      default: return false;
    }
  }, [step, numDays, budget, locationIdx, interests, foodPreference]);

  // Progress percentage
  const progress = step === 0 ? 0 : Math.round((step / (TOTAL_STEPS - 1)) * 100);

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <>
      {/* Inject keyframes */}
      <style>{keyframeStyles}</style>

      <div className="absolute inset-0 z-10 flex flex-col overflow-hidden bg-dark-950">
        {/* Clean background without glowing orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" />

        {/* Progress bar — hidden on step 0 */}
        {step > 0 && step < 6 && (
          <div className="relative z-10 px-4 pt-4 pb-2">
            <div className="mx-auto max-w-lg">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={back}
                  className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <span className="text-xs text-white/40 font-medium tracking-wider uppercase">
                  Step {step} of {TOTAL_STEPS - 2}
                </span>
              </div>
              <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Steps container */}
        <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="min-h-full flex flex-col items-center justify-center py-10 px-5">
            <div className="w-full max-w-lg mx-auto">
            {/* ── Step 0: Hero / Welcome ── */}
            <StepWrapper active={step === 0} direction={direction}>
              <div className="flex flex-col items-center text-center">
                {/* Floating plane icon */}
                <div
                  className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-500/10 backdrop-blur-sm border border-brand-500/20"
                  style={{ animation: 'landing-float 3s ease-in-out infinite' }}
                >
                  <Plane className="h-9 w-9 text-brand-500" />
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
                  Where's your next
                  <br />
                  <span className="text-brand-400">
                    adventure?
                  </span>
                </h1>

                <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-sm leading-relaxed">
                  Let AI craft your perfect Goa itinerary — beaches, forts, sunsets & everything in between.
                </p>

                {/* Feature pills */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {[
                    { icon: Clock, text: 'Smart scheduling' },
                    { icon: MapPin, text: 'Route-optimized' },
                    { icon: Heart, text: 'Personalized' },
                  ].map(({ icon: Icon, text }) => (
                    <span
                      key={text}
                      className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-zinc-300 backdrop-blur-sm"
                    >
                      <Icon className="h-3.5 w-3.5 text-brand-400" />
                      {text}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={next}
                  size="md"
                  className="mt-10"
                >
                  <span className="relative flex items-center gap-2">
                    Plan My Trip
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>

                {/* Subtle social proof */}
                <p className="mt-6 text-xs text-zinc-500">
                  ✨ 2,000+ trips planned across Goa
                </p>
              </div>
            </StepWrapper>

            {/* ── Step 1: Duration ── */}
            <StepWrapper active={step === 1} direction={direction}>
              <div className="flex flex-col items-center text-center">
                <StepHeader
                  icon={Clock}
                  title="When are you traveling?"
                  subtitle="Select your check-in and check-out dates"
                />
                <div className="mt-8 w-full max-w-sm">
                  <DateRangePicker 
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(s, e) => {
                      setStartDate(s);
                      setEndDate(e);
                    }}
                  />
                </div>

                {numDays > 0 && (
                  <div className="mt-6 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium animate-[landing-scale-in_0.3s_ease-out]">
                    {numDays} day{numDays > 1 ? 's' : ''} selected
                  </div>
                )}
                
                {numDays > 14 && (
                  <p className="mt-4 text-xs text-red-400 font-medium">Please select a maximum of 14 days.</p>
                )}

                <NextButton onClick={next} disabled={!canProceed} />
              </div>
            </StepWrapper>

            {/* ── Step 2: Budget ── */}
            <StepWrapper active={step === 2} direction={direction}>
              <div className="flex flex-col items-center text-center">
                <StepHeader
                  icon={Wallet}
                  title="What's your budget?"
                  subtitle="We'll match the best spots for your style"
                />
                <div className="mt-8 grid gap-3 w-full">
                  {BUDGET_OPTIONS.map((opt) => {
                    const isSelected = budget === opt.key;
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => setBudget(opt.key)}
                        className={`group relative flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200 active:scale-[0.98] ${
                          isSelected
                            ? 'border-brand-500 bg-brand-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                            isSelected ? 'bg-white/20' : 'bg-white/5'
                          }`}
                        >
                          <Icon
                            className={`h-6 w-6 ${
                              isSelected ? 'text-white' : 'text-zinc-400'
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold text-sm ${
                                isSelected ? 'text-white' : 'text-zinc-200'
                              }`}
                            >
                              {opt.label}
                            </span>
                            <span
                              className={`text-xs font-semibold ${
                                isSelected ? 'text-brand-500' : 'text-zinc-400'
                              }`}
                            >
                              {opt.symbol}
                            </span>
                          </div>
                          <p
                            className={`text-xs mt-0.5 ${
                              isSelected ? 'text-white/70' : 'text-zinc-500'
                            }`}
                          >
                            {opt.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <NextButton onClick={next} disabled={!canProceed} />
              </div>
            </StepWrapper>

            {/* ── Step 3: Location ── */}
            <StepWrapper active={step === 3} direction={direction}>
              <div className="flex flex-col items-center text-center">
                <StepHeader
                  icon={MapPin}
                  title="Where are you staying?"
                  subtitle="Pick your base — we'll plan around it"
                />
                <div className="mt-8 grid gap-3 w-full">
                  {LOCATIONS.map((loc, idx) => {
                    const isSelected = locationIdx === idx;
                    return (
                      <button
                        key={loc.label}
                        onClick={() => setLocationIdx(idx)}
                        className={`group relative flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200 active:scale-[0.98] ${
                          isSelected
                            ? 'border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${
                            isSelected ? 'bg-brand-500/20' : 'bg-white/5'
                          }`}
                        >
                          {loc.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span
                            className={`font-bold text-sm block ${
                              isSelected ? 'text-brand-300' : 'text-zinc-200'
                            }`}
                          >
                            {loc.label}
                          </span>
                          <p
                            className={`text-xs mt-0.5 ${
                              isSelected ? 'text-white/60' : 'text-zinc-500'
                            }`}
                          >
                            {loc.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500">
                            <Check className="h-3.5 w-3.5 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <NextButton onClick={next} disabled={!canProceed} />
              </div>
            </StepWrapper>

            {/* ── Step 4: Interests ── */}
            <StepWrapper active={step === 4} direction={direction}>
              <div className="flex flex-col items-center text-center">
                <StepHeader
                  icon={Heart}
                  title="What excites you?"
                  subtitle="Pick as many as you like — we'll weave them into your trip"
                />
                <div className="mt-8 flex flex-wrap justify-center gap-2.5">
                  {interestsList.map((interest: { id: string; label: string; icon: string }) => {
                    const isSelected = interests.includes(interest.id);
                    const isPopping = poppedChip === interest.id;
                    return (
                      <button
                        key={interest.id}
                        onClick={() => toggleInterest(interest.id)}
                        className={`flex items-center gap-1.5 rounded-md border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 active:scale-95 ${
                          isSelected
                            ? 'border-brand-500 bg-brand-500/15 text-brand-300 shadow-md shadow-brand-500/10'
                            : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/10 hover:text-zinc-300'
                        }`}
                        style={
                          isPopping
                            ? { animation: 'landing-chip-pop 0.3s ease-out' }
                            : undefined
                        }
                      >
                        <span className="text-base leading-none">{interest.icon}</span>
                        {interest.label}
                      </button>
                    );
                  })}
                </div>
                {interests.length > 0 && (
                  <p className="mt-4 text-xs text-zinc-500">
                    {interests.length} interest{interests.length !== 1 ? 's' : ''} selected
                  </p>
                )}
                <NextButton
                  onClick={next}
                  disabled={!canProceed}
                  label={interests.length === 0 ? 'Select at least 1' : undefined}
                />
              </div>
            </StepWrapper>

            {/* ── Step 5: Food & Extras ── */}
            <StepWrapper active={step === 5} direction={direction}>
              <div className="flex flex-col items-center text-center">
                <StepHeader
                  icon={UtensilsCrossed}
                  title="Food & extras"
                  subtitle="Final touches to personalize your trip"
                />

                {/* Food preference */}
                <div className="mt-8 w-full">
                  <p className="text-sm font-medium text-zinc-400 mb-3">Food preference</p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {FOOD_OPTIONS.map((opt) => {
                      const isSelected = foodPreference === opt.key;
                      return (
                        <button
                          key={opt.key}
                          onClick={() => setFoodPreference(opt.key)}
                          className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 transition-all duration-200 active:scale-95 ${
                            isSelected
                              ? 'border-brand-500 bg-white/5 shadow-md shadow-brand-500/5'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <span className="text-xl">{opt.emoji}</span>
                          <span
                            className={`text-sm font-semibold ${
                              isSelected ? 'text-white' : 'text-zinc-300'
                            }`}
                          >
                            {opt.label}
                          </span>
                          <span
                            className={`text-xs hidden sm:block ${
                              isSelected ? 'text-zinc-400' : 'text-zinc-500'
                            }`}
                          >
                            {opt.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Breakfast toggle */}
                <div className="mt-8 w-full">
                  <button
                    onClick={() => setIncludeBreakfast((v) => !v)}
                    className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:border-white/20"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/5 group-hover:bg-white/10 transition-colors">
                        <Coffee className="h-5 w-5 text-zinc-400" />
                      </div>
                      <div className="text-left min-w-0 pr-3">
                        <span className="block text-sm font-semibold text-zinc-200">
                          Include breakfast spots
                        </span>
                        <span className="text-xs text-zinc-500 hidden sm:block truncate">
                          We'll slot in great breakfast places each morning
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex h-7 w-12 items-center rounded-full p-1 transition-colors duration-200 ${
                        includeBreakfast ? 'bg-brand-500' : 'bg-white/10'
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                          includeBreakfast ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </button>
                </div>

                <Button
                  variant="brand"
                  size="md"
                  onClick={next}
                  disabled={!canProceed}
                  className="w-full mt-10 font-medium text-[14px] h-10"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate My Itinerary
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </StepWrapper>

            {/* ── Step 6: Loading / Generating ── */}
            <StepWrapper active={step === 6} direction={direction}>
              <div className="flex flex-col items-center text-center">
                {generateMutation.isError ? (
                  <>
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
                      <span className="text-3xl">😢</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Something went wrong
                    </h2>
                    <p className="text-sm text-zinc-400 max-w-xs mb-8">
                      {generateMutation.error?.message || 'Please try again.'}
                    </p>
                    <button
                      onClick={() => {
                        generateMutation.reset();
                        goTo(5);
                      }}
                      className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Go back & try again
                    </button>
                  </>
                ) : (
                  <>
                    {/* Animated plane */}
                    <div className="relative w-full h-16 mb-8 overflow-hidden">
                      <div
                        style={{ animation: 'landing-plane-fly 3s ease-in-out infinite' }}
                        className="absolute top-1/2 -tranzinc-y-1/2"
                      >
                        <Plane className="h-8 w-8 text-brand-400" />
                      </div>
                      {/* Dotted trail */}
                      <div className="absolute top-1/2 left-0 right-0 -tranzinc-y-1/2 border-t-2 border-dashed border-white/10" />
                    </div>

                    {/* Spinning ring */}
                    <div className="relative mb-8">
                      <div
                        className="h-20 w-20 rounded-full border-4 border-white/5"
                        style={{
                          borderTopColor: '#f59e0b',
                          animation: 'landing-spin-slow 1.2s linear infinite',
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="h-7 w-7 text-brand-400" />
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                      Crafting your itinerary
                    </h2>
                    <p className="text-sm text-zinc-400 max-w-xs mb-6">
                      Our AI is building the perfect {numDays}-day Goa adventure just for you…
                    </p>

                    {/* Animated dots */}
                    <div className="flex items-center justify-center gap-2">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-2.5 w-2.5 rounded-full bg-brand-400"
                          style={{
                            animation: 'landing-dot-bounce 1.4s ease-in-out infinite',
                            animationDelay: `${i * 0.16}s`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Fun facts while waiting */}
                    <div className="mt-10 rounded-xl border border-white/5 bg-white/[0.03] p-5 backdrop-blur-sm">
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                        Did you know?
                      </p>
                      <p className="text-sm text-zinc-300 leading-relaxed">
                        Goa has over 50 beaches along its 100km coastline, each with its own unique character — from party hotspots to hidden coves.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </StepWrapper>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

// ─── Sub-Components ─────────────────────────────────────────────────────────

function StepWrapper({
  active,
  direction,
  children,
}: {
  active: boolean;
  direction: 'forward' | 'back';
  children: React.ReactNode;
}) {
  if (!active) return null;

  return (
    <div
      className="w-full"
      style={{
        animation: 'landing-scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      {children}
    </div>
  );
}

function StepHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 border border-white/10 backdrop-blur-sm shadow-sm">
        <Icon className="h-6 w-6 text-brand-500" />
      </div>
      <h2 className="text-xl sm:text-2xl font-medium text-white tracking-tight">{title}</h2>
      <p className="mt-2 text-sm text-zinc-400 max-w-xs">{subtitle}</p>
    </div>
  );
}

function NextButton({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void;
  disabled: boolean;
  label?: string;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="mt-10"
    >
      {label || 'Continue'}
      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Button>
  );
}
