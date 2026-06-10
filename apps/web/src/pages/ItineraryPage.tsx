import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useItineraryStore } from '../store/itineraryStore';
import { ArrowLeft, Clock, Map as MapIcon, Navigation, Info, Utensils } from 'lucide-react';

export default function ItineraryPage() {
  const navigate = useNavigate();
  const itinerary = useItineraryStore((state) => state.currentItinerary);

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

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Area */}
      <div className="bg-slate-950 text-white pt-12 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[50%] w-[80%] h-[150%] bg-primary-600/20 rounded-full blur-[100px] pointer-events-none -translate-x-1/2" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-slate-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Start Over
          </button>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {itinerary.title}
          </h1>
          <p className="text-slate-300 text-lg">
            {itinerary.preferences.numDays} Days • {itinerary.preferences.budget} Budget • Staying near {itinerary.preferences.stayLocation.name}
          </p>
        </div>
      </div>

      {/* Main Content - Days */}
      <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-20 space-y-8">
        {itinerary.days.map((day) => (
          <div key={day.dayNumber} className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
            {/* Day Header */}
            <div className="bg-gradient-to-r from-primary-50 to-white px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Day {day.dayNumber}</h2>
              <div className="flex gap-4 text-sm font-medium text-slate-500">
                <span className="flex items-center"><Navigation className="w-4 h-4 mr-1 text-primary-500" /> {day.summary.totalTravelKm} km driving</span>
                <span className="flex items-center"><MapIcon className="w-4 h-4 mr-1 text-primary-500" /> {day.summary.region}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-6 relative">
              <div className="absolute left-[39px] top-6 bottom-6 w-0.5 bg-slate-100"></div>

              <div className="space-y-8">
                {day.slots.map((slot, idx) => (
                  <div key={idx} className="relative flex gap-6 group">
                    {/* Time & Dot */}
                    <div className="flex flex-col items-center z-10">
                      <div className="w-10 h-10 rounded-full bg-white border-4 border-primary-100 flex items-center justify-center shadow-sm">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className="flex-1">
                      {/* Travel indicator from previous */}
                      {slot.travelFromPrev && slot.travelFromPrev.minutes > 0 && (
                        <div className="absolute -top-6 left-12 text-xs font-semibold text-slate-400 flex items-center bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                          <Navigation className="w-3 h-3 mr-1" />
                          {slot.travelFromPrev.minutes} min drive ({slot.travelFromPrev.km} km)
                        </div>
                      )}

                      <div className={`p-5 rounded-2xl border transition-all ${
                        slot.isMealStop 
                          ? 'bg-accent-50/50 border-accent-100 hover:border-accent-300' 
                          : 'bg-white border-slate-200 hover:border-primary-300 hover:shadow-md'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-slate-900">{slot.place.name}</h3>
                              {slot.isMealStop && (
                                <span className="text-[10px] uppercase tracking-wider font-bold bg-accent-100 text-accent-700 px-2 py-0.5 rounded-sm">
                                  {slot.mealType}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 flex items-center">
                              <Clock className="w-3.5 h-3.5 mr-1" />
                              {slot.startTime} - {slot.endTime} ({slot.durationMinutes} mins)
                            </p>
                          </div>
                          
                          {/* Rating Pill */}
                          {slot.place.rating && slot.place.rating > 0 && (
                            <div className="flex items-center bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-sm font-bold">
                              ★ {slot.place.rating}
                            </div>
                          )}
                        </div>

                        {slot.place.description && (
                          <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                            {slot.place.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 mt-4">
                          {slot.place.tags?.map(tag => (
                            <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-md capitalize font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
