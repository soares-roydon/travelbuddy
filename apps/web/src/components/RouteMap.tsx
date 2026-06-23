import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { decode } from '@googlemaps/polyline-codec';
import type { SchedulablePlace } from '@travelbuddy/shared';
import { GeoJSON } from 'react-leaflet';
import goaData from '../data/goa.json';

const createMarkerIcon = (color: string, size: number, isSelected: boolean) => {
  return L.divIcon({
    html: `
      <div style="transition: transform 0.3s ease; ${isSelected ? 'transform: scale(1.3); transform-origin: bottom;' : ''}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="rgba(0,0,0,0.3)" stroke-width="0.5" style="width: ${size}px; height: ${size}px; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));">
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

const defaultIcon = createMarkerIcon('#f59e0b', 38, false);
const restaurantIcon = createMarkerIcon('#f97316', 38, false);
const selectedIcon = createMarkerIcon('#ef4444', 38, true);
const baseIcon = createMarkerIcon('#8b5cf6', 38, false);

interface RouteMapProps {
  places: SchedulablePlace[];
  routeGeometry?: string;
  stayLocation?: { latitude: number; longitude: number; name?: string };
  selectedPlaceId?: string | null;
  isVisible?: boolean;
}

function MapTooltipContent({ place, idx }: { place: any, idx: number }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="flex flex-col w-44 overflow-hidden rounded-xl bg-dark-900 border border-white/10 shadow-xl shadow-black/50">
      {place.imageUrl && (
        <div className="w-full h-24 relative bg-dark-800">
          {!imgLoaded && (
            <div className="absolute inset-0 shimmer" />
          )}
          <img
            src={place.imageUrl}
            alt={place.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
          />
        </div>
      )}
      <div className="p-2.5 text-center">
        <strong className="block text-[12px] text-white truncate leading-tight mb-0.5">{idx + 1}. {place.name}</strong>
        <span className="text-[10px] text-white/50 font-medium">
          {place.estimatedDurationMinutes} mins • {place.type === 'RESTAURANT' ? '🍽️ Restaurant' : '📍 Activity'}
        </span>
      </div>
    </div>
  );
}

function MapBoundsUpdater({ points, selectedPlace, isSelected, isVisible }: { points: [number, number][], selectedPlace?: [number, number], isSelected: boolean, isVisible?: boolean }) {
  const map = useMap();
  const pointsStr = JSON.stringify(points);

  useEffect(() => {
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

  const hasValidStay = stayLocation && typeof stayLocation.latitude === 'number' && typeof stayLocation.longitude === 'number' && !isNaN(stayLocation.latitude);

  const allPoints: [number, number][] = places
    .filter(p => typeof p.latitude === 'number' && typeof p.longitude === 'number' && !isNaN(p.latitude))
    .map(p => [p.latitude, p.longitude]);

  if (hasValidStay) {
    allPoints.push([stayLocation.latitude, stayLocation.longitude]);
  }

  routeCoordinates.forEach(coord => allPoints.push(coord));

  const selectedPlaceData = selectedPlaceId ? places.find(p => p.id === selectedPlaceId) : null;
  const selectedPlaceCoords: [number, number] | undefined = selectedPlaceData && typeof selectedPlaceData.latitude === 'number'
    ? [selectedPlaceData.latitude, selectedPlaceData.longitude]
    : undefined;

  const center: [number, number] = hasValidStay
    ? [stayLocation.latitude, stayLocation.longitude]
    : [15.2993, 74.1240];

  // Standard Google Maps tiles (Light style)
  const tileUrl = "https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}";

  return (
    <div className="absolute inset-0 bg-dark-950">
      <MapContainer
        center={center}
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <MapResizer />
        <TileLayer
          key="standard-google-maps"
          attribution='&copy; Google Maps'
          url={tileUrl}
        />

        {goaData && (
          <GeoJSON
            data={goaData as any}
            style={{
              color: '#f59e0b',
              weight: 1.5,
              opacity: 0.3,
              fillColor: '#f59e0b',
              fillOpacity: 0.03,
              dashArray: '6, 4'
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
              <div className="text-center p-2 bg-dark-900 rounded-lg border border-white/10">
                <strong className="text-white text-xs">🏨 Your Stay</strong><br/>
                <span className="text-white/60 text-[10px]">{stayLocation.name || 'Base Location'}</span>
              </div>
            </Tooltip>
          </Marker>
        )}

        {places.map((place, idx) => {
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
            pathOptions={{ color: '#f59e0b', weight: 3, opacity: 0.7 }}
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
