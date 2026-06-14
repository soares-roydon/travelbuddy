import React from 'react';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useLocation } from 'react-router-dom';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isItineraryPage = location.pathname.startsWith('/itinerary/');

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-50 selection:bg-violet-500 selection:text-white relative overflow-hidden">
      <Sidebar />
      <div className={`flex-1 flex flex-col min-w-0 h-full ${isItineraryPage ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        <main className={`flex-1 flex flex-col relative ${isItineraryPage ? 'h-full min-h-0' : ''}`}>
          {children}
        </main>
        {!isItineraryPage && <Footer />}
      </div>
    </div>
  );
}
