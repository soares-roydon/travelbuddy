import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { CATEGORIES } from './categories.js';
import { SEED_PLACES } from './places.js';

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

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

  console.log('📍 Seeding places...');
  let count = 0;

  for (const place of SEED_PLACES) {
    const categoryId = categoryMap.get(place.categoryName);
    if (!categoryId) {
      console.warn(`   ⚠️  Skipping "${place.name}" — category "${place.categoryName}" not found`);
      continue;
    }

    await prisma.place.create({
      data: {
        name: place.name,
        description: place.description,
        latitude: place.latitude,
        longitude: place.longitude,
        type: place.type,
        categoryId,
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
