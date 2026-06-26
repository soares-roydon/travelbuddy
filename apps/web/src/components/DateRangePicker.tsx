import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Track currently viewed month/year in the calendar
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const containerRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside (not needed if we use modal backdrop, but kept for safety if needed)
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Format YYYY-MM-DD
  const formatDateString = (y: number, m: number, d: number) => {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  const parseDate = (ds: string) => {
    if (!ds) return null;
    const [y, m, d] = ds.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const handleDateClick = (day: number) => {
    const clickedDateStr = formatDateString(currentYear, currentMonth, day);
    const clickedDate = new Date(currentYear, currentMonth, day);
    clickedDate.setHours(0, 0, 0, 0);
    
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    if (clickedDate < todayDate) return; // Prevent selecting past dates

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!start || (start && end)) {
      // Start fresh
      onChange(clickedDateStr, '');
    } else if (start && !end) {
      if (clickedDate < start) {
        // Selected date is before start date, restart selection
        onChange(clickedDateStr, '');
      } else {
        // Valid end date
        onChange(startDate, clickedDateStr);
        setIsOpen(false); // Auto close after full selection
      }
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const prevMonth = () => {
    const todayDate = new Date();
    if (currentYear === todayDate.getFullYear() && currentMonth === todayDate.getMonth()) {
      return; // Can't go back past current month
    }
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  // Generate calendar grid
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Formatting for display input
  const displayStart = startDate ? new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Start Date';
  const displayEnd = endDate ? new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'End Date';

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Input Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between h-14 px-5 rounded-md bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-brand-500" />
          <span className={`font-medium ${startDate ? 'text-white' : 'text-zinc-400'}`}>
            {startDate ? `${displayStart} — ${displayEnd}` : 'Select your travel dates'}
          </span>
        </div>
      </button>

      {/* Calendar Modal */}
      {isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-[340px] max-w-full bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-5 animate-[landing-scale-in_0.2s_ease-out]">
            {/* Context Helper */}
            <div className="mb-4 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 font-medium text-xs uppercase tracking-widest">
                {!startDate && !endDate ? 'Step 1: Start Date' : ''}
                {startDate && !endDate ? 'Step 2: End Date' : ''}
                {startDate && endDate ? 'Dates Selected' : ''}
              </span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="font-bold text-white text-base tracking-tight">
                {MONTHS[currentMonth]} {currentYear}
              </div>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(day => (
                <div key={day} className="text-center text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-y-1">
              {blanks.map(b => (
                <div key={`blank-${b}`} className="h-10 w-full" />
              ))}
              {days.map(day => {
                const currentStr = formatDateString(currentYear, currentMonth, day);
                const currentDate = new Date(currentYear, currentMonth, day);
                currentDate.setHours(0, 0, 0, 0);
                
                const todayDate = new Date();
                todayDate.setHours(0, 0, 0, 0);
                const isPast = currentDate < todayDate;

                const isStart = currentStr === startDate;
                const isEnd = currentStr === endDate;
                const isBetween = startDate && endDate && currentStr > startDate && currentStr < endDate;

                // Styles based on state
                let bgStyle = 'hover:bg-white/10 text-white';
                let roundStyle = 'rounded-lg';

                if (isPast) {
                  bgStyle = 'text-zinc-600 cursor-not-allowed';
                } else if (isStart && isEnd) {
                  bgStyle = 'bg-brand-600 text-white font-bold';
                  roundStyle = 'rounded-lg shadow-md';
                } else if (isStart) {
                  bgStyle = 'bg-brand-600 text-white font-bold';
                  roundStyle = endDate ? 'rounded-l-lg shadow-md' : 'rounded-lg shadow-md';
                } else if (isEnd) {
                  bgStyle = 'bg-brand-600 text-white font-bold';
                  roundStyle = 'rounded-r-lg shadow-md';
                } else if (isBetween) {
                  bgStyle = 'bg-brand-600/20 text-white font-medium';
                  roundStyle = 'rounded-none';
                }

                return (
                  <button
                    key={day}
                    disabled={isPast}
                    onClick={() => handleDateClick(day)}
                    className={`h-10 w-full flex items-center justify-center text-sm transition-colors ${bgStyle} ${roundStyle}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full mt-4 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-md transition-colors"
            >
              Done
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
