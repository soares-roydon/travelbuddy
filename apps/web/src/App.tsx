import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from './pages/LandingPage';
import ItineraryPage from './pages/ItineraryPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-primary-500 selection:text-white">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/itinerary/:id" element={<ItineraryPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
