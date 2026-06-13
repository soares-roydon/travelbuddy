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

import { SEED_PLACES } from './seed/places.js';
import { prisma } from './lib/prisma.js';

app.get('/api/places/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // If it's a mock seed ID from our fallback
    if (id.startsWith('seed-')) {
      const index = parseInt(id.replace('seed-', ''), 10);
      if (!isNaN(index) && SEED_PLACES[index]) {
        res.json({ ...SEED_PLACES[index], id });
        return;
      }
    }

    // Try DB
    const place = await prisma.place.findUnique({ where: { id } });
    if (place) {
      res.json(place);
      return;
    }

    res.status(404).json({ error: 'Place not found' });
  } catch (err) {
    console.warn('⚠️ Database query failed, checking seed data by name...', err);
    // Maybe try finding by name if id somehow matches name? (Unlikely)
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/places', async (_req, res) => {
  res.json({ message: 'Places endpoint', places: SEED_PLACES.map((p, i) => ({ ...p, id: `seed-${i}` })) });
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
