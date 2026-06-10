import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import itineraryRoutes from './routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──
app.use(cors());
app.use(express.json());

// ── API Routes ──
app.use('/api/itinerary', itineraryRoutes);

// ── Health Check ──
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'travelbuddy-api',
    timestamp: new Date().toISOString(),
  });
});

// ── Placeholder Routes ──
app.get('/api/places', async (_req, res) => {
  // Will be implemented in Phase 4
  res.json({ message: 'Places endpoint - coming in Phase 4', places: [] });
});

app.get('/api/categories', async (_req, res) => {
  // Will be implemented in Phase 4
  res.json({ message: 'Categories endpoint - coming in Phase 4', categories: [] });
});

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`\n🚀 TravelBuddy API running at http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
