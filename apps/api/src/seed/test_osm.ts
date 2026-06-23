import fs from 'fs';

async function run() {
  const query = `
    [out:json][timeout:90];
    area["ISO3166-2"="IN-GA"][admin_level=4]->.searchArea;
    (
      node["amenity"~"restaurant|cafe|bar|pub|fast_food"](area.searchArea);
      node["tourism"~"attraction|museum|viewpoint|gallery"](area.searchArea);
      node["historic"](area.searchArea);
      node["natural"~"beach|waterfall|peak|spring"](area.searchArea);
      node["amenity"="place_of_worship"](area.searchArea);
      node["leisure"~"nature_reserve|park|garden"](area.searchArea);
    );
    out count;
  `;
  try {
    console.log("Fetching from Overpass API...");
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
    const text = await response.text();
    console.log(text);
  } catch (err) {
    console.error(err);
  }
}

run();
