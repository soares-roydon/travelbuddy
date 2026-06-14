async function searchDDG(query) {
  const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`);
  const html = await res.text();
  const match = html.match(/src="([^"]+)"/g);
  console.log(match ? match.slice(0, 5) : 'none');
}
searchDDG('Thalassa Goa restaurant');
