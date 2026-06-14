import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { CATEGORIES } from './categories.js';
import { SEED_PLACES } from './places.js';
import google from 'googlethis';

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const FALLBACK_IMAGES: Record<string, string> = {
  'beach': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop',
  'restaurant': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop',
  'nature': 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600&auto=format&fit=crop',
  'fort': 'https://images.unsplash.com/photo-1533050487297-09b450131914?q=80&w=600&auto=format&fit=crop',
  'default': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop'
};

async function fetchImageForPlace(query: string, category: string): Promise<string> {
  try {
    const images = await google.image(query + ' Goa ' + category, { safe: false });
    if (images && images.length > 0) {
      for (const img of images) {
        if (img.url && !img.url.includes('fbsbx')) {
          return img.url;
        }
      }
      return images[0].url;
    }
  } catch (e) {
    // ignore
  }
  return FALLBACK_IMAGES[category] || FALLBACK_IMAGES['default'];
}

async function seed() {
  console.log('🌱 Starting seed...\n');

  // ── 1. Upsert Categories ──
  console.log('📂 Seeding categories...');
  const categoryMap = new Map<string, string>();

  for (const cat of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: { icon: cat.icon },
      create: { name: cat.name, icon: cat.icon },
    });
    categoryMap.set(cat.name, created.id);
    console.log(`   ✅ ${cat.icon} ${cat.name} (${created.id})`);
  }

  // ── 2. Clear existing places and re-seed ──
  console.log('\n🗑️  Clearing existing places...');
  await prisma.place.deleteMany({});

  // ── Disconnect to prevent idle timeout during image fetching ──
  console.log('\n🔌 Disconnecting DB during image fetch...');
  await prisma.$disconnect();

  console.log('\n🖼️  Fetching real images for places... This might take a minute.');
  const placesWithImages = [];
  for (let i = 0; i < SEED_PLACES.length; i++) {
    const place = SEED_PLACES[i];
    const categoryId = categoryMap.get(place.categoryName);
    if (!categoryId) {
      console.warn(`   ⚠️  Skipping "${place.name}" — category "${place.categoryName}" not found`);
      continue;
    }
    const imageUrl = await fetchImageForPlace(place.name, place.categoryName);
    placesWithImages.push({ ...place, categoryId, imageUrl });
    process.stdout.write(`\r   Fetched ${i+1}/${SEED_PLACES.length}`);
  }
  console.log('\n');

  // ── Reconnect and Seed ──
  console.log('🔌 Reconnecting to DB...');
  await prisma.$connect();

  console.log('\n🗑️  Clearing existing places...');
  await prisma.place.deleteMany({});

  console.log('📍 Seeding places to database...');
  let count = 0;

  for (const place of placesWithImages) {
    await prisma.place.create({
      data: {
        name: place.name,
        description: place.description,
        imageUrl: place.imageUrl,
        latitude: place.latitude,
        longitude: place.longitude,
        type: place.type,
        categoryId: place.categoryId,
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
      },
    });

    count++;
    console.log(`   ✅ [${place.region}] ${place.name}`);
  }

  console.log(`\n🎉 Seeded ${CATEGORIES.length} categories and ${count} places!\n`);
}

seed()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
