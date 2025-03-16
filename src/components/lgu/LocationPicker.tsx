import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { debounce } from 'lodash';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationResult {
  x: number;
  y: number; 
  label: string;
}

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialPosition?: [number, number];
}

const SearchControl = ({ onLocationSelect }: { onLocationSelect: (result: LocationResult) => void }) => {
  const map = useMap();
  const [provider] = useState(new OpenStreetMapProvider());

  useEffect(() => {
    const searchControl = new (GeoSearchControl as any)({
      provider,
      style: 'bar',
      showMarker: false,
      autoClose: true,
    });

    map.addControl(searchControl);
    
    map.on('geosearch/showlocation', (result: any) => {
      onLocationSelect({
        label: result.location.label,
        x: result.location.x,
        y: result.location.y,
      });
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, provider, onLocationSelect]);

  return null;
};

export const LocationPicker = ({ onLocationSelect, initialPosition }: LocationPickerProps) => {
  const [position, setPosition] = useState<[number, number]>(initialPosition || [14.5995, 120.9842]); // Default to Manila

  return (
    <div className="h-64 rounded-lg overflow-hidden border border-gray-700 relative">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full bg-gray-800"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SearchControl 
          onLocationSelect={(result) => {
            const newPos: [number, number] = [result.y, result.x];
            setPosition(newPos);
            onLocationSelect({
              lat: result.y,
              lng: result.x,
              address: result.label
            });
          }}
        />
        <Marker position={position} />
      </MapContainer>
    </div>
  );
};