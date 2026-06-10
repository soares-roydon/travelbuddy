import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div 
      className="min-h-screen flex flex-col bg-gray-50 selection:bg-violet-500 selection:text-white relative"
      style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '24px 24px' }}
    >
      <Navbar />
      <main className="flex-1 flex flex-col min-h-0 relative">
        {children}
      </main>
      <Footer />
    </div>
  );
}
