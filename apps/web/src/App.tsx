import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from './pages/LandingPage';
import ItineraryPage from './pages/ItineraryPage';
import AuthPage from './pages/AuthPage';
import MyItinerariesPage from './pages/MyItinerariesPage';
import ExplorePage from './pages/ExplorePage';
import { AppLayout } from './components/AppLayout';
import { supabase } from './lib/supabase';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email,
            avatarUrl: session.user.user_metadata?.avatar_url,
          }),
        })
        .then(res => res.json())
        .then(data => {
          if (data.token) {
            localStorage.setItem('jwt_token', data.token);
          }
        })
        .catch(err => console.error('Error syncing user:', err));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/itineraries" element={<MyItinerariesPage />} />
            <Route path="/itinerary/:id" element={<ItineraryPage />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
