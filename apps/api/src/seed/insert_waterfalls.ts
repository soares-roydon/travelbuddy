import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { EXTRA_WATERFALLS } from './extra_waterfalls.js';
import { CATEGORIES } from './categories.js';

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString, max: 3 });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const FALLBACK_URLS: Record<string, string> = {
  'beach': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop',
  'restaurant': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop',
  'nature': 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600&auto=format&fit=crop',
  'fort': 'https://images.unsplash.com/photo-1533050487297-09b450131914?q=80&w=600&auto=format&fit=crop',
  'default': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop'
};

async function insertWaterfalls() {
  const dbCategories = await prisma.category.findMany();
  const categoryMap = new Map(dbCategories.map(c => [c.name, c.id]));

  let count = 0;
  for (const place of EXTRA_WATERFALLS) {
    const existing = await prisma.place.findFirst({ where: { name: place.name } });
    if (existing) continue;

    const categoryId = categoryMap.get(place.categoryName);
    if (!categoryId) {
      console.warn(`Category ${place.categoryName} not found`);
      continue;
    }

    await prisma.place.create({
      data: {
        name: place.name,
        description: place.description,
        imageUrl: FALLBACK_URLS[place.categoryName] || FALLBACK_URLS['default'],
        latitude: place.latitude,
        longitude: place.longitude,
        type: place.type,
        categoryId: categoryId,
        region: place.region,
        estimatedDurationMinutes: place.estimatedDurationMinutes,
        bestTimeStart: place.bestTimeStart,
        bestTimeEnd: place.bestTimeEnd,
        isOpenAtNight: place.isOpenAtNight,
        budgetTier: place.budgetTier,
        avgCostPerPerson: place.avgCostPerPerson,
        mealType: place.mealType,
        tags: place.tags,
        rating: place.rating,
        reviewCount: place.reviewCount,
      }
    });
    count++;
  }
  console.log(`Inserted ${count} extra waterfalls.`);
  await prisma.$disconnect();
}

insertWaterfalls().catch(console.error);
