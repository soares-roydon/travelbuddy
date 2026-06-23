import fs from 'fs';

async function run() {
  const query = `
    [out:json][timeout:180];
    area["ISO3166-2"="IN-GA"][admin_level=4]->.searchArea;
    (
      nwr["amenity"~"restaurant|cafe|bar|pub|fast_food"](area.searchArea);
      nwr["tourism"~"attraction|museum|viewpoint|gallery|theme_park|zoo"](area.searchArea);
      nwr["historic"](area.searchArea);
      nwr["natural"~"beach|waterfall|peak|spring|water"](area.searchArea);
      nwr["amenity"="place_of_worship"](area.searchArea);
      nwr["leisure"~"nature_reserve|park|garden"](area.searchArea);
      nwr["shop"~"supermarket|mall|clothes|books|boutique|gift|jewelry|market|spices"](area.searchArea);
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
