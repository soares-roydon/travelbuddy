import { useState } from 'react';

interface CustomSelectProps {
  value: any;
  options: { label: string; value: any }[];
  onChange: (val: any) => void;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
}

export function CustomSelect({ 
  value, 
  options, 
  onChange, 
  className = "",
  triggerClassName = "w-full text-left flex justify-between items-center border border-gray-200 rounded-lg px-3 h-10 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all",
  dropdownClassName = "absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`relative ${className}`}>
      <button 
        type="button" 
        onClick={() => setOpen(!open)} 
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className={triggerClassName}
      >
        {options.find(o => o.value === value)?.label}
        <svg className="w-4 h-4 text-gray-400 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {open && (
        <div className={dropdownClassName}>
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
