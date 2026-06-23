import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface CustomSelectProps {
  value: any;
  options: { label: string; value: any }[];
  onChange: (val: any) => void;
  className?: string;
  triggerClassName?: string;
}

export function CustomSelect({
  value,
  options,
  onChange,
  className = "",
  triggerClassName,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const defaultTrigger = "w-full text-left flex justify-between items-center glass rounded-md px-3.5 h-10 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all";

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={triggerClassName || defaultTrigger}
      >
        <span className="truncate">{options.find(o => o.value === value)?.label}</span>
        <ChevronDown className={`w-4 h-4 text-white/40 shrink-0 ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute z-50 w-full mt-1.5 glass-strong rounded-md overflow-hidden shadow-xl shadow-black/30"
          style={{ animation: 'scale-in 0.15s ease-out' }}
        >
          {options.map(o => (
            <button
              key={String(o.value)}
              type="button"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3.5 py-1.5 text-sm transition-colors ${
                o.value === value
                  ? 'bg-brand-500/10 text-brand-400 font-semibold'
                  : 'text-white/80 hover:bg-white/5'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
