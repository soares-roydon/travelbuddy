import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-white/[0.08]">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="bg-brand-500 p-1 rounded-md text-white">
            <Compass className="w-5 h-5" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-white">
            TravelBuddy
          </span>
        </Link>
      </div>
    </nav>
  );
}
