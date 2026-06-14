import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { decode } from '@googlemaps/polyline-codec';
import type { SchedulablePlace } from '@travelbuddy/shared';
import { GeoJSON } from 'react-leaflet';
import goaData from '../data/goa.json';

const createMarkerIcon = (color: string, size: number, isSelected: boolean) => {
  const shadowClass = isSelected ? 'drop-shadow-lg' : 'drop-shadow-md';
  return L.divIcon({
    html: `
      <div class="flex items-center justify-center relative transition-transform duration-300 ${isSelected ? 'scale-125 origin-bottom' : ''}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width: ${size}px; height: ${size}px;" class="${shadowClass}">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
          <circle cx="12" cy="9" r="2.5" fill="white" stroke="none"></circle>
        </svg>
      </div>
    `,
    className: 'bg-transparent border-none',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
    tooltipAnchor: [0, -size]
  });
};

// All markers use the exact same base size so they remain consistent.
// The selected one uses CSS scale-125 to gently pop out without altering the base SVG dimensions.
const defaultIcon = createMarkerIcon('#8b5cf6', 40, false);
const restaurantIcon = createMarkerIcon('#f97316', 40, false);
const selectedIcon = createMarkerIcon('#ef4444', 40, true);
const baseIcon = createMarkerIcon('#3b82f6', 40, false);

interface RouteMapProps {
  places: SchedulablePlace[];
  routeGeometry?: string;
  stayLocation?: { latitude: number; longitude: number; name?: string };
  selectedPlaceId?: string | null;
  isVisible?: boolean;
}

// Component to render rich tooltip content with image skeleton
function MapTooltipContent({ place, idx }: { place: any, idx: number }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  
  return (
    <div className="flex flex-col w-48 overflow-hidden rounded-xl shadow-xl bg-white border border-gray-100">
      {place.imageUrl && (
        <div className="w-full h-28 relative bg-gray-100">
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gray-200" />
          )}
          <img 
            src={place.imageUrl} 
            alt={place.name} 
            className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
          />
        </div>
      )}
      <div className="p-2.5 text-center bg-white">
        <strong className="block text-[13px] text-gray-900 truncate leading-tight mb-0.5">{idx + 1}. {place.name}</strong>
        <span className="text-[11px] text-gray-500 font-medium">{place.estimatedDurationMinutes} mins • {place.type === 'RESTAURANT' ? 'Restaurant' : 'Activity'}</span>
      </div>
    </div>
  );
}

// Component to dynamically fit bounds to markers or fly to a selected place
function MapBoundsUpdater({ points, selectedPlace, isSelected, isVisible }: { points: [number, number][], selectedPlace?: [number, number], isSelected: boolean, isVisible?: boolean }) {
  const map = useMap();
  const pointsStr = JSON.stringify(points);
  
  useEffect(() => {
    // Prevent Leaflet crash (NaN, NaN) if container is display: none
    if (map.getSize().x === 0 || map.getSize().y === 0) return;

    if (isSelected && selectedPlace) {
      map.flyTo(selectedPlace, 15, { animate: true, duration: 1.5 });
    } else if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [map, pointsStr, selectedPlace, isSelected, isVisible]);
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

export default function RouteMap({ places, routeGeometry, stayLocation, selectedPlaceId, isVisible = true }: RouteMapProps) {
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

  // Find selected place coordinates
  const selectedPlaceData = selectedPlaceId ? places.find(p => p.id === selectedPlaceId) : null;
  const selectedPlaceCoords: [number, number] | undefined = selectedPlaceData && typeof selectedPlaceData.latitude === 'number'
    ? [selectedPlaceData.latitude, selectedPlaceData.longitude]
    : undefined;

  // Default center (Goa)
  const center: [number, number] = hasValidStay 
    ? [stayLocation.latitude, stayLocation.longitude] 
    : [15.2993, 74.1240];

  const tileUrl = "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";

  return (
    <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900 transition-colors">
      <MapContainer 
        center={center} 
        zoom={10} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <MapResizer />
        <TileLayer
          attribution='&copy; Google Maps'
          url={tileUrl}
        />
        
        {goaData && (
          <GeoJSON 
            data={goaData as any} 
            style={{
              color: '#8b5cf6',
              weight: 2,
              opacity: 0.5,
              fillColor: '#8b5cf6',
              fillOpacity: 0.05,
              dashArray: '5, 5'
            }}
          />
        )}
        
        {hasValidStay && (
          <Marker 
            position={[stayLocation.latitude, stayLocation.longitude]}
            title="Stay Location"
            icon={baseIcon}
          >
            <Tooltip direction="top" opacity={1}>
              <div className="text-center">
                <strong>Hotel / Stay</strong><br/>
                {stayLocation.name || 'Your Base'}
              </div>
            </Tooltip>
          </Marker>
        )}

        {places.map((place, idx) => {
          // Guard against invalid place coordinates
          if (typeof place.latitude !== 'number' || typeof place.longitude !== 'number' || isNaN(place.latitude)) return null;
          
          const isSelected = place.id === selectedPlaceId;
          const currentIcon = isSelected 
            ? selectedIcon 
            : (place.type === 'RESTAURANT' ? restaurantIcon : defaultIcon);

          return (
            <Marker 
              key={place.id ? `${place.id}-${idx}` : `marker-${idx}`} 
              position={[place.latitude, place.longitude]}
              icon={currentIcon}
              zIndexOffset={isSelected ? 1000 : 0}
            >
              <Tooltip direction="top" opacity={1} className="!p-0 !bg-transparent !border-none !shadow-none">
                <MapTooltipContent place={place} idx={idx} />
              </Tooltip>
            </Marker>
          );
        })}

        {routeCoordinates.length > 0 && (
          <Polyline 
            positions={routeCoordinates} 
            pathOptions={{ color: '#8b5cf6', weight: 4, opacity: 0.8 }} 
          />
        )}

        <MapBoundsUpdater 
          points={allPoints} 
          selectedPlace={selectedPlaceCoords}
          isSelected={!!selectedPlaceId}
          isVisible={isVisible}
        />
      </MapContainer>
    </div>
  );
}
