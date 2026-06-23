import fs from 'fs';
import path from 'path';

async function fetchOSM() {
  const query = `
    [out:json][timeout:180];
    area["ISO3166-2"="IN-GA"][admin_level=4]->.searchArea;
    (
      nwr["amenity"](area.searchArea);
      nwr["tourism"](area.searchArea);
      nwr["historic"](area.searchArea);
      nwr["natural"~"beach|waterfall|peak|spring|water"](area.searchArea);
      nwr["leisure"](area.searchArea);
      nwr["shop"](area.searchArea);
    );
    out center;
  `;
  
  console.log("Fetching data from Overpass API...");
  const url = 'https://overpass-api.de/api/interpreter';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'User-Agent': 'TravelBuddy Seed Script (travelbuddy@example.com)'
    },
    body: 'data=' + encodeURIComponent(query)
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch OSM data: ' + response.status + ' ' + response.statusText);
  }
  
  const data: any = await response.json();
  return data.elements;
}

function mapToSeedPlace(element: any) {
  if (!element.tags || !element.tags.name) return null;

  const name = element.tags.name;
  const kind = element.tags.amenity || element.tags.tourism || element.tags.shop || element.tags.leisure || element.tags.historic || element.tags.natural || 'place';
  const description = element.tags.description || element.tags.wikipedia || 'A ' + kind + ' in Goa.';
  
  const lat = element.lat || element.center?.lat;
  const lon = element.lon || element.center?.lon;
  
  if (!lat || !lon) return null;

  let region = 'SOUTH';
  if (lat > 15.40) region = 'NORTH';
  else if (lat > 15.30) region = 'CENTRAL';

  let type = 'ATTRACTION';
  let categoryName = 'viewpoint';
  let mealType = 'NONE';
  let tags: string[] = [];

  const t = element.tags;
  
  if (t.amenity === 'restaurant' || t.amenity === 'fast_food' || t.amenity === 'food_court') {
    type = 'RESTAURANT';
    categoryName = 'restaurant';
    mealType = 'LUNCH';
    tags.push('food');
    if (t.cuisine) tags.push(...t.cuisine.split(';'));
  } else if (t.amenity === 'cafe') {
    type = 'RESTAURANT';
    categoryName = 'cafe';
    mealType = 'BREAKFAST';
    tags.push('cafe', 'coffee');
  } else if (t.amenity === 'bar' || t.amenity === 'pub' || t.amenity === 'nightclub') {
    type = 'ACTIVITY';
    categoryName = 'nightlife';
    tags.push('nightlife', 'drinks');
  } else if (t.amenity === 'place_of_worship') {
    type = 'ATTRACTION';
    categoryName = t.religion === 'christian' ? 'church' : (t.religion === 'hindu' ? 'temple' : 'heritage');
    tags.push('religious', 'peaceful');
  } else if (t.tourism === 'museum' || t.historic) {
    type = 'ATTRACTION';
    categoryName = 'heritage';
    tags.push('historic', 'cultural');
  } else if (t.natural === 'beach') {
    type = 'ATTRACTION';
    categoryName = 'beach';
    tags.push('scenic', 'nature');
  } else if (t.natural === 'waterfall') {
    type = 'ATTRACTION';
    categoryName = 'waterfall';
    tags.push('nature', 'scenic');
  } else if (t.shop) {
    type = 'ATTRACTION';
    categoryName = 'market';
    tags.push('shopping');
  } else if (t.leisure === 'park' || t.leisure === 'garden' || t.leisure === 'nature_reserve') {
    type = 'ATTRACTION';
    categoryName = 'nature';
    tags.push('nature', 'park');
  }

  return {
    name: name,
    description: String(description).substring(0, 200),
    latitude: lat,
    longitude: lon,
    type: type,
    categoryName: categoryName,
    region: region,
    estimatedDurationMinutes: type === 'RESTAURANT' ? 60 : 90,
    bestTimeStart: '09:00',
    bestTimeEnd: '18:00',
    isOpenAtNight: categoryName === 'nightlife' || type === 'RESTAURANT',
    budgetTier: 'LOW',
    avgCostPerPerson: type === 'RESTAURANT' ? 300 : 0,
    mealType: mealType,
    tags: tags,
    rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
    reviewCount: Math.floor(Math.random() * 500) + 10
  };
}

async function run() {
  try {
    const elements = await fetchOSM();
    console.log('Fetched ' + elements.length + ' elements from OSM.');
    
    const places = [];
    const seenNames = new Set();
    
    for (const el of elements) {
      const placeObj = mapToSeedPlace(el);
      if (placeObj && el.tags.name && !seenNames.has(el.tags.name)) {
        seenNames.add(el.tags.name);
        places.push(placeObj);
      }
    }
    
    console.log('Mapped ' + places.length + ' unique named places.');
    
    const outputPath = path.join(process.cwd(), 'batch_osm.json');
    fs.writeFileSync(outputPath, JSON.stringify(places, null, 2), 'utf-8');
    console.log('Successfully wrote ' + places.length + ' places to batch_osm.json');
    
  } catch (err) {
    console.error(err);
  }
}

run();
