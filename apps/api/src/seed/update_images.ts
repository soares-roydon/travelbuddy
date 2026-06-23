import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import google from 'googlethis';

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString, max: 3 });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const FALLBACK_URLS = [
  'images.unsplash.com/photo-1512343879784',
  'images.unsplash.com/photo-1517248135467',
  'images.unsplash.com/photo-1448375240586',
  'images.unsplash.com/photo-1533050487297'
];

async function fetchImageForPlace(query: string, category: string): Promise<string | null> {
  try {
    const images = await google.image(query + ' Goa ' + category, { safe: false });
    if (images && images.length > 0) {
      for (const img of images) {
        if (img.url && !img.url.includes('fbsbx') && !img.url.includes('lookaside')) {
          return img.url;
        }
      }
      return images[0].url;
    }
  } catch (e) {
    // Silently ignore rate limit errors to keep output clean, we will retry later if needed
  }
  return null;
}

async function updateImages() {
  console.log('🖼️ Starting FAST image update process for places with fallback images...');
  
  const places = await prisma.place.findMany({
    where: {
      OR: FALLBACK_URLS.map(url => ({ imageUrl: { contains: url } }))
    },
    include: { category: true }
  });

  console.log(`Found ${places.length} places needing real images.`);

  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < places.length; i++) {
    const place = places[i];
    
    const imageUrl = await fetchImageForPlace(place.name, place.category.name);
    
    if (imageUrl) {
      let retries = 3;
      while (retries > 0) {
        try {
          await prisma.place.update({
            where: { id: place.id },
            data: { imageUrl }
          });
          successCount++;
          process.stdout.write(`✅ `);
          break; // success
        } catch (dbErr) {
          retries--;
          if (retries === 0) {
            failCount++;
            process.stdout.write(`❌(db) `);
          } else {
            // Reconnect logic or simple wait before retry
            await new Promise(res => setTimeout(res, 2000));
          }
        }
      }
    } else {
      failCount++;
      process.stdout.write(`❌ `);
    }
    
    if ((i + 1) % 50 === 0) {
      console.log(`\nProcessed ${i + 1}/${places.length} (Success: ${successCount})`);
    }

    // Delay to avoid Google rate limit and give DB connection a breath
    await new Promise(res => setTimeout(res, 1000));
  }

  console.log(`\n🎉 Image update complete! Success: ${successCount}, Failed: ${failCount}`);
  await prisma.$disconnect();
}

updateImages().catch(e => {
  console.error(e);
  process.exit(1);
});
