import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { decode } from '@googlemaps/polyline-codec';
import type { SchedulablePlace } from '@travelbuddy/shared';

// Fix for default Leaflet icon path issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon for Restaurants
const restaurantIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface RouteMapProps {
  places: SchedulablePlace[];
  routeGeometry?: string;
  stayLocation?: { latitude: number; longitude: number; name?: string };
}

// Component to dynamically fit bounds to markers
function MapBoundsUpdater({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [map, points]);
  return null;
}

// Component to handle dynamic resizing of the map container
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  return null;
}

export default function RouteMap({ places, routeGeometry, stayLocation }: RouteMapProps) {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

  useEffect(() => {
    if (routeGeometry) {
      try {
        const decoded = decode(routeGeometry, 5);
        setRouteCoordinates(decoded);
      } catch (err) {
        console.error('Failed to decode polyline:', err);
      }
    } else {
      setRouteCoordinates([]);
    }
  }, [routeGeometry]);

  // Check if stayLocation actually has valid coordinates
  const hasValidStay = stayLocation && typeof stayLocation.latitude === 'number' && typeof stayLocation.longitude === 'number' && !isNaN(stayLocation.latitude);

  // Collect all points to fit map bounds (filter out missing coords)
  const allPoints: [number, number][] = places
    .filter(p => typeof p.latitude === 'number' && typeof p.longitude === 'number' && !isNaN(p.latitude))
    .map(p => [p.latitude, p.longitude]);

  if (hasValidStay) {
    allPoints.push([stayLocation.latitude, stayLocation.longitude]);
  }
  
  // Add polyline points to bounds if they exist
  routeCoordinates.forEach(coord => allPoints.push(coord));

  // Default center (Goa)
  const center: [number, number] = hasValidStay 
    ? [stayLocation.latitude, stayLocation.longitude] 
    : [15.2993, 74.1240];

  return (
    <div className="absolute inset-0 bg-gray-100">
      <MapContainer 
        center={center} 
        zoom={10} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <MapResizer />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {hasValidStay && (
          <Marker 
            position={[stayLocation.latitude, stayLocation.longitude]}
            title="Stay Location"
          >
            <Popup>
              <strong>Hotel / Stay</strong><br/>
              {stayLocation.name || 'Your Base'}
            </Popup>
          </Marker>
        )}

        {places.map((place, idx) => {
          // Guard against invalid place coordinates
          if (typeof place.latitude !== 'number' || typeof place.longitude !== 'number' || isNaN(place.latitude)) return null;
          
          return (
            <Marker 
              key={place.id ? `${place.id}-${idx}` : `marker-${idx}`} 
              position={[place.latitude, place.longitude]}
              icon={place.type === 'RESTAURANT' ? restaurantIcon : new L.Icon.Default()}
            >
              <Popup>
                <strong>{idx + 1}. {place.name}</strong><br/>
                {place.estimatedDurationMinutes} mins
              </Popup>
            </Marker>
          );
        })}

        {routeCoordinates.length > 0 && (
          <Polyline 
            positions={routeCoordinates} 
            pathOptions={{ color: '#8b5cf6', weight: 4, opacity: 0.8 }} 
          />
        )}

        <MapBoundsUpdater points={allPoints} />
      </MapContainer>
    </div>
  );
}
